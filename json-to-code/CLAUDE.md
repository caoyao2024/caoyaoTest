# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**jsonToCode** is a TypeScript library that converts A2UI design-spec JSON into React frontend code via a multi-step pipeline. It is a **pure library** — no IO — that can be embedded into an Electron app (API mode) or run standalone for debugging (CLI mode). It supports multiple target component libraries (`eview-react` default, `eview-ui`) switched via `targetLib`.

The repo's own deep references are the source of truth — read them before non-trivial work:
- [AGENTS.md](./AGENTS.md) — structured agent guide (pipeline steps, conventions, the protected `templateDir` contract, key behavior gotchas)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — full architecture (node/value type systems, state-builder consumption, naming rules)
- [docs/LLM-MAPPING-GUIDE.md](./docs/LLM-MAPPING-GUIDE.md) — how to write a component mapping file
- [docs/LLM-MAPPING-GUIDE.md](./docs/LLM-MAPPING-GUIDE.md) — how to write a component mapping file

## Commands

```bash
npm install          # install deps (tsx, tailwindcss, vitest)

npm run dev          # CLI mode: read pages-source/*.json (flat), write ./output/ (clears output/ first)
# equivalent: npx tsx cli.ts
# optional arg sets targetLib:  npx tsx cli.ts eview-ui   (default eview-react)

npm run typecheck    # tsc --noEmit — **每次改动 .ts 文件后都跑**（不只是非 trivial 改动）

npm test             # vitest run — all unit + e2e (566 tests, 63 files)
npm run test:unit    # vitest run test/unit — pure-function + node-tree unit tests (incl. state-builder internals) + per-component mapping tests (eview-react + eview-ui bespoke) (fast)
npm run test:e2e     # vitest run test/e2e — both libs (eview-react + eview-ui)
npm run test:e2e:react  # only eview-react e2e snapshots (daily default when touching react mappings)
npm run test:e2e:ui     # only eview-ui e2e snapshots (when touching eview-ui bespoke or shared core)
# update snapshots on intended change:  npx vitest run -u [test/e2e/react]
# ⚠️ 必须带 `run`：`npx vitest -u`（漏 run）会进 watch 模式永不退出（挂死）。一律用 `npx vitest run -u ...`。
```

Tests are implemented (Vitest). `test/unit/` covers pure functions + small hand-built node trees (access-path / state-path / js-serializer / scoped-enrichment / jsx-emitter / **state-builder** / **mapping**) and `test/unit/mapping/` holds one **per-component** `{Component}.test.ts` for every eview-react mapping, plus `test/unit/mapping/ui/` holds one per eview-ui **bespoke** mapping (10→11 个：Button/DatePicker/Switch→Toggle/TextArea/Steps/Progress/Dropdown/Rate/Tag/TimePicker/Popover—— bespoke 是 default-export MappingDef 非 factory，import 硬编码 `@cloudsop/eview-ui`，断言聚焦与 eview-react 的差异点) **and** one per eview-ui **本地工厂副本** (6→9 个：Input/Menu/TabItem/Timeline/Tree/Tabs/Drawer/Table/Collapse—— factory `createXxxMapping(UI_PKG)`，eview-react 工厂的本地副本；icon 类已就地做 icon-URL 改造（Tabs 为 onClick extractor 差异），Drawer/Table 为 API 不兼容（Drawer: height默认/mask→maskSetting/footer→prop；Table: row._org/expandedRowKeys→expandedRow），Collapse 为 import 形式差异（eview-ui Panel 是 named 导出、eview-react 是 default，副本改 named import）。icon 类断言 icon→`PLACEHOLDER_ICON_URL` + `containsJSX:false` + 不调 `resolveIcon`（Tabs 断言 Number(index) extractor + types/tabPlacement DataBinding）；Drawer/Table 断言与 eview-react 的 API 差异点；Collapse 断言 import 为 named（非 eview-react 的 default 字符串））)； `test/e2e/{react,ui}/index.test.ts` snapshot the full `downloadHuiCode` output per page × lib. `test/*.json` are fixture page input (not test code).

**Test conventions (non-obvious):**
- **e2e split by lib** — react and ui e2e live in separate files (= separate vitest workers = separate module instances), so the module-level `config` / `iconPkg` state never crosses. Daily eview-react work runs `test:e2e:react` only; run `test:e2e:ui` when touching eview-ui bespoke mappings or shared core (access-path / state-builder / etc).
- **fetch is stubbed in `test/setup.ts`** — `icon-collection.ts` `resolveAll` does a real fetch to a Huawei-internal icon API, but on failure its try/catch maps every icon to the placeholder `PLACEHOLDER_ICON`. The setup stubs `globalThis.fetch` to always reject, so icons are deterministic placeholders regardless of whether the test machine can reach the Huawei intranet. Tailwind conversion uses only `readFileSync` (local), so it's unaffected.
- **config.id snapshot convention** — 提交默认 `config.id = false`（Electron/API 模式，省略 `id`），但 **e2e 快照基线（react **和** ui 两库统一）是 `config.id = true` 生成的**（CLI 约定 → JSX 标签带 `id` 属性）。所以跑 e2e 前**必须手动把 [api/index.ts](api/index.ts) 的 `config.id` 翻为 `true`**，与下方 tailwind-converter CLI 块同属一组手动开关纪律；不翻则 JSX 丢 `id` → 快照全量 mismatch（不是真回归，别 `-u` 盖）。⚠️ **两库基线必须一致**：曾经出现过 ui 快照被误以 `id=false` 提交、而 react 是 `id=true` 的基线漂移——`-u` 前务必确认 `config.id=true`，否则会把漂移盖进快照。若有意切回 `false` 基线，先翻 `false` 再 `npx vitest run -u test/e2e` 刷新全套快照（两库一起）。`config` 是内部模块状态（不在 `options`）；测试不 set 它，快照的是当前（手动翻好后的）状态。
- **tailwind-converter must be in CLI block** when running tests (same as CLI mode) — the Electron-default import resolves to a module that doesn't exist in this repo. 与上一条 `config.id=true` 一并是跑 e2e 的两个前置手动开关。
- **e2e 快照 CRLF/LF 已结构性消除（serializeFiles 归一 LF）** — [test/e2e/helpers.ts](test/e2e/helpers.ts) 的 `serializeFiles` 把每个产物 `content` 的 `\r\n` 归一为 `\n`，故 e2e 快照恒为 LF，与 `.gitattributes`（`* text=auto eol=lf`）在 git 操作（commit/checkout/stash/pop）后保持的 LF 一致——**stash/pop 不再制造整文件假 mismatch**（曾经：产物含 CRLF（模板 Windows 行尾）、快照经 git 规范成 LF → 逐字节不匹配 → vitest 报整文件 `N+N-`）。`toMatchFileSnapshot` 仍失败时，vitest 打印的 diff 偶把整文件显示成 `N+N-`，但往往是**行尾符显示假象**、不是真改动。辨别真身：跑 unix `diff <(tr -d '\r' <.snap) <(当前 serializeFiles 输出)` 逐字节比较（不被行尾符干扰），只看真实 content delta；典型情况 vitest 报几千行 diff、unix diff 只有 4-5 行。不靠 vitest 输出定位差异的方法：写小脚本直接调 `downloadHuiCode([loadPage(name)], {targetLib})` → `serializeFiles(files)` → 写文件再和 `.snap` 做 `diff`（`test/e2e/helpers.ts` 的 `serializeFiles`/`loadPage`/`PAGES` 都是 exported，可直接复用）。⚠️ 若曾 `git stash`/`checkout` 触碰过 `.snap` 后 e2e 整片 mismatch，先重跑 `npx vitest run -u <path>` resync 一次再判断，别当真回归。疑似 flake（tailwind 设计系统首载慢 / 单页偶发）先重跑该库，别 `-u`。
- **matrixTest page** referenced elsewhere ("run matrixTest after touching accessPath") is not in the repo yet; add it to the `PAGES` array in the e2e files once it lands.
- **mapping unit tests (`test/unit/mapping/{Component}.test.ts` — one per eview-react mapping, + `test/unit/mapping/ui/{Component}.test.ts` for eview-ui bespoke)** — call the mapping's `transform(node, fakeCtx())` directly and assert the `TransformResult` (tag / props / import / propRoute), bypassing the pipeline entirely. eview-react mappings are factories `createXxxMapping(pkg)` (pass `PKG`); eview-ui bespoke are `export default MappingDef` objects (import default, `import` 已硬编码 `@cloudsop/eview-ui`，断言用 `UI_PKG`). A shared `fake-ctx.ts` stubs `resolveIcon` (vi.fn spy returning a sentinel node — assert call args via `toHaveBeenCalledWith`, value via `toStrictEqual` since the sentinel is rebuilt each call), `resolveNode` (identity — works because test cells are pre-built resolved nodes), and empty `state`; also exports `comp` / `absBinding` / `relBinding` / `PKG` / `UI_PKG` / `ICON_SENTINEL` helpers. **All 41 eview-react components + 11 eview-ui bespoke + 9 eview-ui 本地副本 have dedicated mapping unit tests** — react 侧覆盖 props 映射全貌（renames / value transforms / useState events+extractors / dropped props / className passthrough / children→data吞噬 for Table·Steps·Timeline / icon literal→resolveIcon & binding→ComputedValue / SlotNode→renderFn+propRoute）；ui bespoke 侧聚焦**与 eview-react 的差异点**（Button types:link→TextButton & 无 IconButton 分支 / DatePicker format 不转换 / Switch→Toggle 丢弃 taggledChildren / TextArea 丢弃 autoSize / Steps 丢弃 orientation / Progress 丢弃 status / Rate 透传 allowClear / Dropdown menu→overlay 烘焙 Menu 节点（字面量 slotNode 内联 / binding baked-CV））；ui 本地副本侧聚焦 **icon-URL 改造差异**（icon→`PLACEHOLDER_ICON_URL` 写死、不调 `resolveIcon`、`containsJSX:true→false`；Timeline 保留 iconType 枚举、Tree 节点字段名 `treeNodePrefix→icon`）；Collapse 本地副本侧聚焦 **import 形式差异**（eview-ui Panel named 导出 vs eview-react default，副本改 named import，非 icon-URL 改造）。Each test is independently runnable: `npx vitest run test/unit/mapping/Button.test.ts`（react）或 `test/unit/mapping/ui/Button.test.ts`（ui bespoke）。**Mappings using `splitWidthToStyle`/`extractIconSizeFromClassName` (Icon, Slider, TextArea, TimePicker, …) deliberately use classNames without `w-xx` tokens** — these helpers return early when there are no width tokens, so the tailwind design system never loads and the suite stays pure/fast (≤20ms per file). The `w-xx → iconSize/stickStyle/inputStyle/timeStyle` path is covered by e2e instead.
- **state-builder unit tests (`test/unit/state-builder.test.ts`)** — `state-builder.ts` exports four internals (`consumeValue` / `processLoop` / `getValueFromState` / `sharedKeyOfPath`) + the `StateBuilderContext` interface purely for testing (marked in-source as 「test-exported internals」— 运行期仍只被本模块内部调用，导出仅用于隔离单测，**不改任何运行行为**；don't add runtime consumers of these). 测试用最小 `StateBuilderContext` + 手搓 `LoopNode` fixture 直接调 `consumeValue`/`processLoop`，绕过整条管线，给最复杂那块（value 分发 + shared 打标 + enrichment/去重/inline 分流）上「快」反馈网。covers: `getValueFromState`（平面/嵌套/缺失）、`sharedKeyOfPath`、`consumeValue` 12 形态（absolute/shared/relative binding、containsJSX true/false computed、shared computed、action 初值、literal/varRef/rawExpr skip、slotNode/plain-object/array 递归、null/原始值 skip）、`processLoop`（relative 嵌套跳过、absolute 无-CV/空数据/+CV containsJSX true/false、撞键去重 diverted-to-`_1`=null）、`buildState` 入口烟雾测。e2e 仍兜全管线连带（loop+enrichment 页、shared-state `.ts` 生成）。

### Writing / maintaining a mapping unit test

**新增一个映射的单测** — 在 `test/unit/mapping/{Component}.test.ts` 写，套用其余 39 个的统一骨架：

```ts
import { describe, it, expect } from 'vitest'
import { createXxxMapping } from '../../../api/config/mappings/eview-react/Xxx'
import { fakeCtx, absBinding, comp, PKG, ICON_SENTINEL } from './fake-ctx'

describe('Xxx mapping', () => {
  const mapping = createXxxMapping(PKG)
  // 字面量场景：transform({ props }) 直接传 props
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)
  // 吞噬 children 场景（Table/Steps/Timeline/Menu…）：transform 接 whole node
  //   const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag/import', () => {
    expect(mapping.tag).toBe('Xxx')
    expect(mapping.import).toBe(`${PKG}/Xxx`)
  })
  // …按 mapping 文件 props 对照表逐项覆盖：
  //   - 改名（orientation→direction）、丢弃（size/variant absent）、透传（disabled/className）
  //   - 字面量 → LiteralValue.useState(event, extractor)；DataBinding → ComputedValue.useState + path
  //   - value transform：直接调 v.transform(raw) 断言转换结果（注意 Number(raw)??0 这类 ?? 不兜 NaN）
  //   - icon 字面量 → ctx.resolveIcon 用 toHaveBeenCalledWith(name) 断言入参、toStrictEqual(ICON_SENTINEL(name)) 断言产物
  //   - icon DataBinding → ComputedValue + containsJSX:true
  //   - SlotNode content → renderFn + propRoute.xxx='module-top'
})
```

要点：① 复用 `./fake-ctx` 的 `fakeCtx`/`comp`/`absBinding`/`PKG`/`ICON_SENTINEL`，不要在测试里手搓 ctx；② 用 `toBe`/`toEqual`/`toStrictEqual`（非快照），改行为时直接改期望值，无 `-u`；③ 涉及 `splitWidthToStyle`/`extractIconSizeFromClassName` 的映射，className 故意不带 `w-xx`（见上条 bullet），否则会触发 tailwind 设计系统加载、单测不再纯/快；④ ICON_SENTINEL 每次 `vi.fn` 调用都重建实例，断言产物值必须用 `toStrictEqual` 不能 `toBe`。写完先单跑确认：`npx vitest run test/unit/mapping/Xxx.test.ts`。

**eview-ui bespoke 映射的单测**略有不同（放 `test/unit/mapping/ui/{Component}.test.ts`，比 react 多一层目录 → import 路径多一层 `../`）：bespoke 是 `export default MappingDef` 对象（**非 factory**），故 `import XxxMapping from '../../../../api/config/mappings/eview-ui/Xxx'`，断言用 `UI_PKG`（`@cloudsop/eview-ui`）而非 `PKG`；`transform` 直接 `XxxMapping.transform!(node, ctx)`。bespoke 单测聚焦**与 eview-react 的差异点**（前述 bullet 列了每个 bespoke 的差异），不必重复覆盖与 react 一致的逻辑（那些 react 单测已覆盖、eview-ui 复用时靠 e2e 兜）。

**eview-ui 本地工厂副本的单测**（同样放 `test/unit/mapping/ui/{Component}.test.ts`，9 个：Input/Menu/TabItem/Timeline/Tree/Tabs/Drawer/Table/Collapse）：副本是 **factory** `createXxxMapping(pkg)`（与 bespoke 的 default-export 相对），故 `import { createXxxMapping } from '...'` + `const mapping = createXxxMapping(UI_PKG)`，`transform` 用 `mapping.transform!(node, ctx)`。
   - **icon-改造副本**（Input/Menu/TabItem/Timeline/Tree）断言 icon-URL 改造差异：icon 字面量 / DataBinding → `PLACEHOLDER_ICON_URL`（写死）、`ctx.resolveIcon` **不被调用**（`toHaveBeenCalledWith` 反向断言）、循环 data 的 ComputedValue `containsJSX:false`；Timeline 额外断 `iconType` 枚举保留、非枚举→占位；Tree 额外断 `treeNodePrefix→icon` 字段名 + 递归 `normalizeTreeNode`（title→text / key→id / icon→占位）。
   - **API-不兼容副本**断言与 eview-react 的 API 差异点：Tabs（`Number(index)` extractor + types/tabPlacement DataBinding 双形态）；Drawer（`mask`→`maskSetting:{show}` 嵌套对象、`footer` 直接赋 prop（SlotNode 包裹）、默认 `height='100%'`）；Table（render/onRowExpend 末参 `dataField='_org'`、`expandable.expandedRowKeys`→`expandedRow` prop + propRoute）。

**修改了一个 mapping 文件后，必须同步改测试再跑测试。** 映射是纯函数 `transform(node, ctx) → TransformResult`，单测正是断言这个返回值，所以改映射行为 = 期望值变，**不改测试就一定挂**。流程：

1. **先改单测期望值** — 打开对应的 `test/unit/mapping/{Component}.test.ts`，把受影响断言的期望值改成新行为（`toBe`/`toEqual`/`toStrictEqual`，无 `-u`）。
2. **跑该组件单测** — `npx vitest run test/unit/mapping/{Component}.test.ts`，秒级反馈，确认 `transform` 输出符合预期。这一步抓「改错了 / 改多了 / 漏改了」。
3. **再跑 e2e** — 映射行为变了，e2e 快照**会** diff。`git diff` 快照确认每个 delta 都是预期的，再 `npx vitest run -u test/e2e/react`（或 `ui`）。**绝不盲 `-u`** — 一个意外 delta 正是你想拦的回归。
4. **复用工厂的库** — 多数 eview-react 映射被 eview-ui 复用（AGENTS.md §7），改动会同时影响两个库，commit 前跑 `test:e2e`（react+ui）。

一句话：**改 mapping → 改对应单测期望值 → 跑该单测 → 跑 e2e（review 后 `-u`）**。单测是 transform 层的「快」反馈，e2e 是 JSX/state/LESS 层的「准」回归，两层都要过才算改完。

### LLM test-usage protocol

一次改动里测试该怎么用——给 LLM 的操作闭环，照做即可，不用跨节拼凑。

**0. 改前判断改动类型**（决定走哪条测试路径）：

| 改动类型 | 测试路径 |
|---|---|
| 改一个 `eview-react` 映射（任何 `{Component}.ts`） | 该组件单测 → `test:e2e:react`（+ commit 前 `test:e2e`，因多数工厂被 eview-ui 复用） |
| 改纯函数（access-path / state-path / js-serializer / scoped-enrichment / jsx-emitter） | 对应单测 → `test:e2e`（高波及，两个库都跑） |
| 改共享核心 codegen/core/pipeline（非纯函数） | `test:unit` + `test:e2e`（无对应单测，全靠 e2e） |
| 改 eview-ui bespoke 映射（Button/DatePicker/Switch/TextArea/Steps/Progress/Dropdown/Rate/Tag/TimePicker/Popover） | 该 bespoke 单测 `test/unit/mapping/ui/{Component}.test.ts` → `test:e2e:ui` |
| 改 eview-ui 本地工厂副本（icon-改造 Input/Menu/TabItem/Timeline/Tree；API-不兼容 Tabs/Drawer/Table；import-形式 Collapse） | 该副本单测 `test/unit/mapping/ui/{Component}.test.ts` → `test:e2e:ui`（Drawer 有 e2e 页面兜底 mask/footer；Table 的 expandedRowKeys 无 e2e 页面、仅单测兜底；Collapse 无 e2e 页面、仅单测兜底 named-import 差异） |
| 改 `config.id`/`templateDir`/tailwind-converter 开关 | `test:e2e`（影响全量 JSX/LESS） |
| 新增映射文件 | 先写 `test/unit/mapping/{Component}.test.ts`（见上节骨架），单跑 → 再 `test:e2e:react` |
| 改 docs / CLAUDE.md / AGENTS.md | 不跑测试 |

> 上表是快速路由。每条改动的「为什么跑这个、连带跑什么」详见下方 [How to test](#how-to-test--dont-run-everything-every-time) 决策矩阵。

**1. 改完立即跑对应单测**（秒级，先抓 transform 层）——例如改 `Button.ts`：

```bash
npx vitest run test/unit/mapping/Button.test.ts
```

**2. 单测挂了——先判断是「有意改行为」还是「写错了」，不要无脑改测试迁就：**

- `git diff api/config/mappings/eview-react/Button.ts` 看你改的那几行，确认 transform 输出**该不该**变。
  - **该变（intended，这次就是要改这个行为）** → 改 `Button.test.ts` 里受影响断言的期望值（`toBe`/`toEqual`/`toStrictEqual`，无 `-u`）→ 重跑单测到绿。
  - **不该变（unintended，你只想改 A 却连 B 也变了）** → 这是 bug，**回去修 mapping**，别改测试掩盖。测试挂正是在替你拦回归。
- 拿不准时**默认按 unintended 处理**：先查 mapping，确认 mapping 没问题再动测试。乱改测试期望值 = 自废武功，让测试失去意义。

**3. 单测绿了，再跑 e2e**——映射行为变了，e2e 快照**会** diff，这是预期：

```bash
npx vitest run test/e2e/react   # 或 test/e2e:ui / test:e2e
```

**4. e2e 挂了——逐 delta 判断（关键，绝不盲 `-u`）：**

```bash
git diff test/e2e/react/__snapshots__/*.snap
```

- **每个 delta 都对应这次想改的** → intended。review 确认无误后 `npx vitest run -u test/e2e/react`。
- **有 delta 不是这次想改的** → regression。先定位源头：是这次改的映射、还是共享核心（access-path / state-builder / jsx-emitter / scoped-enrichment）的连带影响。修源头，不要 `-u` 把回归盖掉。
- **疑似 flake**（tailwind 设计系统首载慢 / 单页偶发）→ 重跑该库 `npx vitest run test/e2e/react`，别 `-u`。再挂才是真问题。

**5. 收尾标准（全过才算改完）：**

- `npm run typecheck` 绿（**每次改 .ts 文件后都跑**，不只是收尾时；tsc 早期抓类型错，比单测更全）
- 改动涉及的单测绿（intended 改动已同步更新期望值）
- e2e 绿（intended 改动已 `-u`、无残留 regression delta）
- 复用工厂的库两个都过（多数 react 映射 → commit 前 `test:e2e`）
- 提交前再跑一次 `npm test` 兜底跨库影响（共享核心改动尤其必须）

一句话闭环：**判断类型 → 改 .ts 后跑 `typecheck` → 跑单测 → 单测挂先查 mapping（unintended）/ 改测试（intended）→ 跑 e2e → e2e 挂逐 delta 判（intended `-u` / regression 修源头）→ 全绿收尾**。

### How to test — don't run everything every time

You don't need `npm test` after every edit. Pick the subset that covers what you touched:

| What you changed | Run | Why |
|---|---|---|
| `api/config/mappings/eview-react/*.ts` (any react mapping factory) | `test:unit` (run the matching `test/unit/mapping/{Component}.test.ts`) then `test:e2e:react` | every eview-react mapping now has a dedicated per-component unit test asserting transform output (tag/props/propRoute) — run the fast unit first for transform-level feedback; e2e catches JSX/state/LESS ripple. Most react mappings are factories eview-ui reuses (AGENTS.md §7), so run `test:e2e` (both) before commit if unsure |
| `api/config/mappings/eview-ui/**` bespoke (DatePicker / Switch→Toggle / TextArea / Button / Steps / Progress / Dropdown / Rate / Tag / TimePicker / Popover) | `test:unit` (run the matching `test/unit/mapping/ui/{Component}.test.ts`) then `test:e2e:ui` | bespoke 是 default-export MappingDef（非 factory）；单测聚焦与 eview-react 的差异点（见 mapping unit tests bullet）；e2e:ui 兜 bespoke-only 的 JSX/state 连带 |
| `api/config/mappings/eview-ui/**` 本地工厂副本 (icon-改造 Input/Menu/TabItem/Timeline/Tree；API-不兼容 Tabs/Drawer/Table；import-形式 Collapse) | `test:unit` (run the matching `test/unit/mapping/ui/{Component}.test.ts`) then `test:e2e:ui` | 副本是 factory `createXxxMapping(UI_PKG)`（非 default-export）；icon 类单测聚焦 icon-URL 改造差异（icon→`PLACEHOLDER_ICON_URL`、不调 `resolveIcon`、`containsJSX:false`；Timeline `iconType` 枚举保留、Tree `treeNodePrefix→icon`）；Drawer/Table 单测聚焦与 eview-react 的 API 差异（Drawer mask→maskSetting/footer→prop/height默认；Table row._org/expandedRowKeys→expandedRow）；Collapse 单测聚焦 import 形式差异（eview-ui Panel named 导出 vs eview-react default，断言 import 为 named 非 default 字符串）。Drawer 有 e2e 页面兜底、Table expandedRowKeys 无 e2e 页面仅单测、Collapse 无 e2e 页面仅单测；改 `icon-placeholder.ts` 常量本身则全 icon 副本+bespoke 单测都跑 |
| `api/config/mappings/eview-ui/index.ts` (factory-reuse wiring / pkg swap) | `test:e2e:ui` | only affects which factories ui calls, not the react side |
| `api/src/core/access-path.ts` / `state-path.ts` | `test:unit` then `test:e2e` | dedicated unit tests + nested-path regression across both libs (high-blast, most-walked utils) |
| `api/src/core/scoped-enrichment.ts` | `test:unit` + `test:e2e:react` | unit covers CV/field/enrichment; e2e covers loop+enrichment pages |
| `api/src/codegen/jsx-emitter.ts` / `js-serializer.ts` | `test:unit` + `test:e2e` | unit covers emit rules; e2e covers full JSX/state output, both libs |
| `api/src/codegen/state-builder.ts` | `test:unit` (run `test/unit/state-builder.test.ts`) then `test:e2e` | unit covers test-exported internals（`consumeValue` 分发 + shared 打标 + `processLoop` enrichment/去重/inline 分流 + `getValueFromState`/`sharedKeyOfPath`），绕过整条管线用最小 ctx/LoopNode fixture 隔离测；e2e 兜全管线连带（loop+enrichment 页、shared-state 生成），both libs |
| `api/src/codegen/**` other (tree-finalizer / file-assembler / style-converter / import-collector / route-generator / report-generator) | `test:e2e` | no dedicated unit; covered end-to-end, both libs |
| `api/src/core/**` other (node-types / value-types / value-factory / component-mapping / component-registry / icon-collection / icon-props) | `test:e2e` | no dedicated unit; both libs consume it |
| `api/src/pipeline/**` (engine / context / steps) | `test:e2e` | exercises the full 7-step chain |
| `lib/convertTailwindToCSS.ts` | `test:e2e` | style/LESS output, both libs use it |
| `api/templates/eview-react/**` | `test:e2e:react` | template files appear in generated output |
| `api/templates/eview-ui/**` | `test:e2e:ui` | same, ui side |
| `api/index.ts` config (`id` / `css` / `templateDir`) | `test:e2e` | config.id/css affect all JSX/LESS across both libs |
| `api/src/codegen/tailwind-converter.ts` (the switch) | — (ensure CLI block enabled) then `test:e2e` | it's the re-export switch; just keep it on CLI block when testing |
| `cli.ts` / `jsonTest/**` | none (manual `npm run dev` eyeball) | CLI entry isn't covered by the test infra |
| docs / comments / `CLAUDE.md` / `AGENTS.md` | none | not executed |
| `pages-source/**` / `test/*.json` (fixture data) | none (unless **new page**: add its name to `PAGES` in both `test/e2e/{react,ui}/index.test.ts`, then run to generate the snapshot) |
| test infra itself (`test/**`, `vitest.config.ts`, `setup.ts`) | `npm test` |

**Workflow:**
- **During iteration** — run only the subset from the table above. Unit ≈1s; e2e ≈2s per lib (tailwind design system caches within a worker). Cheaper than the full suite.
- **Before commit/PR** — run full `npm test` once to catch unexpected cross-impact (shared-core changes ripple to both libs).
- **Intended output change** (new mapping behavior / classNameProp / Table row-expand / event handler) — for a mapping change, first edit the expected values in the matching `test/unit/mapping/{Component}.test.ts` (these use `toBe`/`toEqual`/`toStrictEqual`, not snapshots — no `-u`), then the e2e snapshot **will** also diff; that's expected. `git diff` the snapshot, confirm every delta is intended, then `npx vitest run -u test/e2e/react` (or `ui`, or `test/e2e`). **Never `-u` blind** — always review the snapshot diff first; a stray delta is exactly the regression you're guarding against.
- **Intended pure-function behavior change** (access-path / state-path / js-serializer / scoped-enrichment / jsx-emitter) — unit tests use `toBe`/`toEqual`, not snapshots. Edit the expected value in the unit test; there's no `-u` for unit. The matching e2e snapshot will also diff — `-u` it after review.
- **Flaky/slow?** e2e first load of the tailwind design system is slow; subsequent runs in the same worker are cached. If a single e2e page flakes, rerun that lib: `npx vitest run test/e2e/react`.

### Changing test data (page fixtures)

e2e pages are driven by the `PAGES` array in [test/e2e/helpers.ts](test/e2e/helpers.ts) + a JSON file per page. An LLM can add/remove/swap fixture data without manual steps:

- **`loadPage(name)` resolution order** — `pages-source/{name}.json` first, then `test/{name}.json`. Either location works. Put full pages in `pages-source/` (matches CLI input); put small edge-case fixtures in `test/`.
- **Add a page** — drop the JSON at one of the two paths above, append `name` to `PAGES` in `test/e2e/helpers.ts`, run `npx vitest run test/e2e` to generate both react + ui snapshots. Commit the JSON + the two `.snap` files.
- **Remove a page** — delete the line from `PAGES`, delete `test/e2e/react/__snapshots__/{name}.snap` and `test/e2e/ui/__snapshots__/{name}.snap`. (The JSON file itself can stay.)
- **Swap/update page data** — overwrite the JSON, then `npx vitest run -u test/e2e`. **`git diff` the changed `.snap` files first** — confirm every delta is intended (data-driven output change), then accept. Never `-u` blind.
- **Prefer adding a new page over overwriting an existing fixture** — when iterating with new test data, drop it as a new `pages-source/{name}.json` + `PAGES` entry rather than overwriting an existing page. Each fixture's snapshot is pinned to its data; overwriting one page's data turns the *whole* snapshot stale, and that giant data-driven diff drowns out the signal of any code change you're verifying in the same pass. New page = new snapshot (no diff noise); existing pages stay green and keep attributing code-change deltas cleanly.
- **Separate data-swap commits from code-change commits** — never verify a codegen change against a fixture you just swapped in the same pass, or you can't tell which `.snap` delta is data vs code. Land the data swap as its own commit (review the data-only diff, `-u`, commit), then layer code changes on top against that clean baseline. The reverse (code first, then data) is symmetric.
- **Run one page only** — `npx vitest run test/e2e/react -t "页签"` filters by page name (the describe label). Handy while iterating on a single fixture.
- **New fixtures cover new scenarios** — when adding a page that exercises a previously-uncovered path (e.g. matrixTest nested-loop cells, a new bespoke component), prefer putting it under `pages-source/` so `cli.ts` can also eyeball it via `npm run dev`.

## Two run modes

| Mode | Entry | Input | Output |
|------|-------|-------|--------|
| **API** | `api/index.ts` → `downloadHuiCode()` | in-memory `Array<{ mergedA2UI, planner }>` | returns `{ files: { path, content }[] }` (caller writes disk) |
| **CLI** | `cli.ts` | `pages-source/{page}.json` (flat) | writes `./output/` |

`downloadHuiCode` **never writes to disk** — it returns `{ files }`. Only `cli.ts` writes.

## Pipeline architecture

Eight steps, chained by `DEFAULT_STEPS` in `api/index.ts`:

```
RegisterComponents → BuildTrees → NodeMapper
  → FileGenerator → GenerateRoutes → GenerateReport → GenerateThemeConfig → WriteOutput
```

- **RegisterComponents** — loads target lib's mappings into `ComponentRegistry` + injects that lib's icon package name.
- **BuildTrees** — single traversal: tree build + binding tagging + ExtractNode build + icon collection (no separate ResolveIcons step). Also a pre-scan (`#collectAnchorTargetIds`, mirrors `#collectEventMutatedPaths`) — **only when `config.id===false`** — collects anchor target ids from every `Anchor` element's `items[].href` (literal array, or DataBinding `{path}` resolved against page `state` for absolute paths; recurses `children`; relative/runtime paths skipped). The single scan also detects whether the page has any `Anchor` at all: **no Anchor → returns `null`** (not an empty Set), so `BuildContext.anchorTargetIds` is `Set<string> | null` and the per-node marking `ctx.anchorTargetIds?.has(el.id) || undefined` short-circuits without a Set lookup. Thus id preservation truly happens only when **(data has an `Anchor`) AND (`config.id===false`)**: stamps `keepId: true` on built nodes whose `el.id` is a target (ComponentNode + HtmlNode, incl. extracted-module inner nodes) so jsx-emitter keeps emitting their `id` even with `config.id=false` (anchor `href="#xxx"` must not become a dead link). `config.id=true` or no Anchor → `anchorTargetIds=null`, no pre-scan/marking cost, zero keepId, zero behavior change.
- **NodeMapper** — runs `registry.transform`: pure shape transformation, collects no data.
- **FileGenerator** — `state-builder` (consumes tree, gathers binding/computed/JSX-const/enrichment refs) → `tree-finalizer` (propRoute lift + useState lift) → **style extraction (after tree-finalizer, filters out mapping-digested/force-inlined loop templates to avoid orphan `.less`)** → `jsx-emitter` → `file-assembler`. No separate GenerateStyles step.
- **GenerateRoutes** — React Router routes. **GenerateReport** — `console.log` only, no `.md` file. **GenerateThemeConfig** — writes `src/theme/config.ts` (`DEFAULT_THEME` = `ctx.theme`) into `ctx.generatedFiles`; WriteOutput collects it. **WriteOutput** — collects file list into `ctx.outputFiles`, does not write disk.

All steps inherit `Step`, implement `async execute(ctx)`, read inputs from / write outputs to the shared `PipelineContext` (`api/src/pipeline/pipeline-context.ts`). See AGENTS.md §8 for the full ctx field map.

### Orthogonal type systems (core design)

- **Node `kind`** (5): ComponentNode / HtmlNode / TextNode / ExtractNode / LoopNode
- **Value `type`** (7): BindingValue / ComputedValue / VarRefValue / RawExprValue / RenderFnValue / SlotNodeValue / LiteralValue
- **`__node: true` brand**: every pipeline object (PropValue + BuildNode) carries it; plain business data does not. Dispatch order in `emitValue`/consumers: check `type` (PropValue) → `kind` (BuildNode, must come before `!v.__node` because BuildNode has `__node`) → `!v.__node` (plain object). Mapping files obtain the brand indirectly via `Value.*()` / `Node.*()` factories — never add it manually.
- Everything is an object: no bare strings in `children`; TextNode is explicit.

### FileUnit model

FileGenerator is split into processing + serialization + assembly layers. Each product file (main page / `modules/*` / `components/*`) is an independent FileUnit with its own `bindingRefs` / `computedRefs` / `jsxLiteralConsts` / `enrichmentConsts`. binding/computed keep their original type; jsx-emitter emits `accessPath` directly. Three `ExtractRoute`s: `inline` / `module-top` / `component-internal`.

## Code layout

```
api/
├── index.ts                       ← downloadHuiCode entry + internal config (css/id/templateDir)
├── config/
│   ├── chartDefaults/             ← chart default config
│   └── mappings/{targetLib}/      ← component mappings, split by lib name
│       ├── eview-react/           ← reference impl: createXxxMapping(pkg) factories
│       └── eview-ui/              ← reuses eview-react factories + local bespoke
├── src/
│   ├── core/                      ← node/value types, mapping, registry, icon, access-path, state-path, scoped-enrichment
│   ├── pipeline/                  ← pipeline + pipeline-context
│   ├── steps/                     ← the 7 steps
│   └── codegen/                   ← state-builder / tree-finalizer / import-collector
│                                     jsx-emitter / file-assembler / style-converter / tailwind-converter
│                                     route-generator / report-generator / js-serializer
└── templates/{targetLib}/         ← Vite project templates, split by lib name
lib/convertTailwindToCSS.ts        ← CLI/Electron-shared tailwindcss v4 → CSS/LESS (config inlined)
pages-source/                      ← A2UI JSON sources (CLI input)
output/                            ← generated code (CLI output)
```

## Component mappings

Each A2UI component has a mapping file `api/config/mappings/{targetLib}/{Component}.ts` exporting a **factory** `createXxxMapping(pkg: string): MappingDef` that builds `import` as `` `${pkg}/...` ``. Add a new component → create the factory, wire it in that lib's `index.ts`.

> **eview-ui factory reuse is a special case, NOT a general multi-lib pattern.** eview-ui ≈ eview-react (same tags, different npm + icon package names), so its `index.ts` reuses eview-react's factories with swapped `pkg`/`iconPkg`. Future distinct libs get their own mapping dir and independent `MappingDef`s — do not reuse eview-react factories. eview-ui has four mapping classes: factory-reuse, factory-reuse + `@/shared` prefix (Badge/Divider/Chart/Empty, hand-implemented under `templates/eview-ui/src/shared/`), bespoke (DatePicker/Rate/Switch→Toggle/TextArea/Button/Steps/Progress/Dropdown/Tag/Popover), and **local factory copies** (Input/Menu/TabItem/Timeline/Tree/Tabs/Drawer/Table/Collapse — icon-related (Input/Menu/TabItem/Timeline/Tree) + API-incompatible (Tabs: onClick extractor; Drawer: height默认 + mask→maskSetting + footer→prop; Table: row._org 行字段名 + expandedRowKeys→expandedRow) + import-form (Collapse: eview-ui Panel named 导出 vs eview-react default 导出，副本改 named import) components that can't reuse eview-react; icon 类就地做 icon-URL 改造，icon 一律产 `PLACEHOLDER_ICON_URL` 字符串、不调 `resolveIcon`、`containsJSX:false`，见 [icon-placeholder.ts](api/config/mappings/eview-ui/icon-placeholder.ts) + [AGENTS.md §7](./AGENTS.md)).

> **eview-ui icon-URL 边界**：映射到 `@cloudsop/eview-ui/...`（pkg）的组件，其 icon 相关属性**只接 URL 字符串、不接 React DOM**（`resolveIcon` 返回的 BuildNode 用不得）。当前阶段所有此类 icon 一律写死成统一占位 URL `/icons/placeholder.svg`（常量 `PLACEHOLDER_ICON_URL`，[icon-placeholder.ts](api/config/mappings/eview-ui/icon-placeholder.ts)），不管输入 json 是字面量图标名、DataBinding、还是 iconType 值。涉及 8 个映射：本地副本 Input/Menu/TabItem/Timeline/Tree（Tree 节点字段名 `icon`，非 eview-react 的 `treeNodePrefix`）+ bespoke Button/Dropdown/Steps。`@/shared`（Badge/Divider/Chart/Empty）共享实现能接 React DOM icon，不在此列。Tag 已从 shared 迁移为 bespoke，icon 直接丢弃。改造后 icon 不产 JSX → 循环 data `containsJSX:false` → 走 state.js 纯 JSON（不再进文件单元 enrichmentConsts）。

> **`@/shared` 共享组件不只属于 eview-ui**：eview-react 现在也有 `templates/eview-react/src/shared/` 目录（首个成员 `TableFilter`——表格列筛选公共组件，由 Table 映射的 `filters` 特性引用）。eview-ui 同名版本在 `templates/eview-ui/src/shared/TableFilter.tsx`（`eui-` className 前缀 + `TextButton` + 相对路径引 `./Divider`）。二者都不对应某个 A2UI 输入组件、不是 mapping 类（不在四类映射之列），而是被映射产出的 JSX 引用的**共享文件**（`import ... from '@/shared/TableFilter'`，vite `@` alias → src），由 file-assembler 当作共享模板文件复制进产物。详见 [AGENTS.md §6.11](./AGENTS.md)（Table 列筛选映射）+ [AGENTS.md §7](./AGENTS.md)（共享组件机制）。

**DataBinding must use `Value.computed()`**, never `resolveAbsoluteStateValue`-then-assign in transform (skips state-builder → breaks containsJSX routing + relative-path per-item resolution). See LLM-MAPPING-GUIDE §DataBinding.

**Dotted tag（子组件静态属性）**：当父组件通过静态属性暴露子组件时（如 `DatePicker.RangePicker`），映射可在 `TransformResult` 中返回 dotted tag（`tag: 'DatePicker.RangePicker'`），`import` 保持父组件的 default import 路径。import-collector 自动取 dotted tag 的 `.` 左半部分作为 default import 名，JSX emitter 用完整 dotted 名渲染。产物效果：`import DatePicker from 'source'; <DatePicker.RangePicker />`——与 `const { RangePicker } = DatePicker; <RangePicker />` 功能等价。适用场景：eview-ui DatePicker `range:true` → `DatePicker.RangePicker`。

## Configuration

Config lives in the internal `config` object in `api/index.ts` (not in a config file, not via ESM import):

| Field | Default | Flipped to false |
|------|---------|------------------|
| `config.id` | `false` | （设为 `true` 时）产物 JSX 标签输出 `id="..."`（className 不受影响）；**CLI 模式需手动改为 `true`**，见下方说明 |
| `config.id` keepId 例外 | — | `config.id=false` 时，被 **Anchor** 组件 `items[].href="#xxx"` 引用的目标元素仍会输出 `id`：BuildTrees 预扫给命中节点打 `keepId`，jsx-emitter 的 id 条件为 `(emitId \|\| keepId) && node.id`（单一 node.id 通道、无重复、不碰 registry/emitProps）。**仅当「数据含 Anchor 且 `config.id===false`」时预扫返回非空集并打标**；无 Anchor 时预扫返回 `null`、标记侧可选链短路（不建 Set、不逐节点 `has()`）。`config.id=true` 时不预扫、零 keepId。仅覆盖字面量 items + 绝对 path 的 DataBinding items（相对 path/运行时数据跳过） |
| `config.css` | `true` | emit `*.less` (not `*.module.less`), JSX uses string className |
| `config.templateDir` | `'./templates'` | see protected contract below |

`downloadHuiCode(input, options)` `options` only carries `targetLib` (and `templateDir`); everything else is internal config.

> **CLI 模式约定**：跑 `cli.ts` 或 `jsonTest/run-batch.ts` 批量生成前，把 [api/index.ts](api/index.ts) 里的 `config.id` 改为 `true`（产物 JSX 标签带 `id` 属性，便于调试/对照）。API/Electron 模式默认 `false`（省略 `id`）。这与 tailwind 转换器切换一样是手动开关，不在 options 里传。

## Tailwind conversion — dual-mode import switch

`api/src/codegen/tailwind-converter.ts` is the **single** switch point between CLI and Electron tailwind converters by **commenting/uncommenting the import block in that file**:
- Electron (default): imports from `../../../main/tailwind-to-css` (single-file same-interface mirror, provided by the Electron host app)
- CLI: uncomment the block importing from `../../../lib/convertTailwindToCSS` (tailwindcss v4 `__unstable__loadDesignSystem`, `tailwindConfig` inlined, responsive variants via `convertTailwindToLessRule` / `parseCssToChunks` frame stack)

It re-exports `convertTailwindToLessRule` / `generateLessContent` / `convertTailwindToCSS` / `LessRule`; all consumers (e.g. `style-converter.ts`, and any future file that needs the converter) import from `./tailwind-converter` — never switch in the consumers themselves.

Both versions are kept in sync as single-file mirrors. **Default is Electron** (this lib is primarily embedded in the Electron app, where `main/tailwind-to-css` is provided by the host). `main/tailwind-to-css` does NOT exist in this standalone repo, so the Electron-default import shows an unresolved-module diagnostic (TS2307) here — that is expected, and disappears once switched to CLI. To run standalone (`cli.ts` / `jsonTest/run-batch.ts`), manually switch to the CLI block (uncomment CLI, comment Electron).

> **Tailwind version**: both projects align on `tailwindcss@4.3.3` (Electron via `packages/desktop`, CLI via `lib`). v4.3.1→4.3.3 changed `candidatesToCss` output (nested `&`-style → flat concrete selectors), so `parseCssToChunks` normalizes concrete selectors to `&`-style. **Converter behavioral gotchas (buildThemeCss namespace emission, parseCssToChunks variant detection, resolveValue useVar single-var) are documented in [AGENTS.md §7 `lib/convertTailwindToCSS.ts`](./AGENTS.md) — read before changing the converter; both files must change together.**

## Hard constraints (read before changing)

1. **`templateDir` resolution is a protected integration contract with the Electron app — DO NOT modify without explicit maintainer permission.** Resolution order: `options.templateDir` (absolute → use; relative → resolve against `api/` `__excodeDir`) → default `./templates` → append `/{targetLib}` subdirectory → fallback `../../src/excode/templates/{targetLib}` if missing → Electron IPC passes `process.resourcesPath/hui-templates` at package time. Any change (order, defaults, fallback, lib appending, field name, IPC wiring) requires asking the maintainer first. See AGENTS.md §10 and docs/ARCHITECTURE.md §1.7.1.

2. **File names are kebab-case** throughout `api/src` (e.g. `state-builder.ts`, `access-path.ts`); single-word files are lowercase (`node.ts`, `step.ts`). New files must follow this — no camelCase/PascalCase filenames. Mapping files are the exception (`{Component}.ts` PascalCase, because component names are). Import paths must match filename case exactly (Windows tolerates mismatch but CI typecheck fails with TS1261).

3. **All `.ts` files are ESM** (`import`/`export`, `"type": "module"` in package.json). ESM-only deps.

4. **Deliberate changes, don't delete comments.** Pipeline code is tightly coupled — examples: the `__node` brand is consumed by `emitValue`/stateBuilder/styleConverter; `collectRelativeCVsDeep` + `applyScopedCV` + `processLoop` + `collectRelativeFields` + `routeLoopNode` are five-way interlocked. Before changing anything, trace: who calls it, who depends on its output, which downstreams shift. Existing comments carry design intent ("why this way", "changing X also requires Y") that exists nowhere else — preserve them when rewriting (move to the new location if needed), and add comments for key branches, implicit contracts, and coupling notes.

5. **Nested paths are centralized** in `core/access-path.ts` (`pathToJsAccess` / `isFlatAccessPath` / `stateRef` / `jsxConstName` / `makeEnrichmentConstName`) and `core/state-path.ts` (`pathToSegments` / `resolveBySegments` / `setNested` / `parseAccessors`). Do not re-implement `includes('.')` / `initialState.` prefix-joining in consumers — call these. Object-shaped state is common; flat-only assumptions have caused repeated bugs. After touching accessPath logic, run the matrixTest page (covers all nested-loop cells; not yet in repo — add it to `PAGES` once it lands) to catch regressions.

6. **`const`-value traversal must skip `loopScope`.** `BuildNode.loopScope.loopNode` back-references its parent loop, whose `template.body` contains the node — a natural cycle. Three recursions over arbitrary object values skip the `loopScope` key: `fileAssembler.collectImportsFromConstValues`, `import-collector.walkValueForImports`, and `resource-path.rewriteResourcePathsInValue` (state materialization: stateEntries / enrichment consts). Any new `Object.entries(value)`/`Object.values(value)`-style walker that can reach a loopScope-bearing BuildNode must add `if (k === 'loopScope') continue`; omitting it causes `RangeError: Maximum call stack size exceeded`. Node-tree walkers that recurse via specific fields (`children`/`props`/`body`, not `Object.entries(node)`) are safe.

7. **`emitValue` always returns a bare JS expression.** Wrapping in `{}` is a JSX-layer concern handled by the caller. `LoopNode` cannot go **directly** in a prop value (stateBuilder `consumeValue` treats it as a plain object, relative bindings are ignored, `loopScope` cycle overflows) — put it in `children` or build the node tree at compile time via a containsJSX ComputedValue. **The one exception is `Value.slotNode({ node })`**: a subtree-as-prop-value can contain a LoopNode when wrapped in slotNode — `consumeValue` walks `slotNode.node` (so the inner LoopNode's binding/computed are collected and `loopScope` is respected), `emitValue` emits it via `emitNode`, and `tree-finalizer`'s `walkSlotNodeProps` routes inner LoopNodes. slotNode 作 prop 值现被 eview-ui Dropdown `overlay`（字面量 menu→slotNode 包静态 Menu 树）/ Popover `content`（SlotNode 子树）/ Drawer `footer` 使用——均为静态子树、无内嵌 LoopNode；slotNode 内嵌 LoopNode 的 inline 循环路径（§6.12）目前无消费方（eview-ui Dropdown 的 binding menu 已改 baked-CV：containsJSX:true CV 的 transform 在 state-builder materialization 期烘焙静态 Menu 树，不再用 inline LoopNode），作为 pipeline 能力保留。 A bare (un-slotted) LoopNode in a prop value still does not work — it must be inside a slotNode.
