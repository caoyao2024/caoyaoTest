# AGENTS.md — jsonToCode 管线 Agent 指南

> 本文档面向 LLM/Agent，提供 jsonToCode 工程的精简结构化概览。
> 整体架构深参考见 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)。
> 组件映射编写规范见 [docs/LLM-MAPPING-GUIDE.md](./docs/LLM-MAPPING-GUIDE.md)。

---

## 1. 项目本质

**jsonToCode** 是一个 TypeScript 管线，将 A2UI 设计规范 JSON 转换为 React 前端代码。支持多目标组件库（`eview-react`、`eview-ui`），通过 `targetLib` 切换；默认 `eview-react`。

- **位置**：独立工程，`api/` 文件夹可直接放入 Electron 项目
- **性质**：纯库（library），入口 `api/index.ts` 导出 `downloadHuiCode()`，不做任何 IO
- **写入由调用方决定**：
  - API 模式 → 返回 `{ files }` 数组，由 Electron 调用方自行处理（如 `desktopApi.exportZip`）
  - CLI 模式 → `cli.ts` 将 `files` 写入 `output/` 目录

---

## 2. 两种运行模式

| 模式 | 入口 | 数据源 | 输出 |
|------|------|--------|------|
| **API** | `api/index.ts` `downloadHuiCode()` | 内存 `Array<{ mergedA2UI, planner }>` | 返回 `{ files: OutputFile[] }` |
| **CLI** | `cli.ts` | `pages-source/{pageName}.json` 文件（平铺） | 写入 `output/` 目录 |

API 入参格式：

```ts
type HuiCodeInput = {
  mergedA2UI: { rootId, elements, state }   // A2UI 页面描述
  planner:    { rootId, elements, slots }    // 布局规划
}

await downloadHuiCode(Array<HuiCodeInput>, options?)
// → { files: [{ path, content }, ...] }
```

`options` 含 `targetLib`（默认 `'eview-react'`）与 `templateDir`（模板目录，见下）。其余配置（`css` / `id`）走 `api/index.ts` 内部 config 对象，调用方无需感知。

---

## 3. 管线步骤

```
RegisterComponents → BuildTrees → NodeMapper
  → FileGenerator → GenerateRoutes → GenerateReport → GenerateThemeConfig → WriteOutput
```

| 步骤 | 输入 | 输出 | 职责 |
|------|------|------|------|
| RegisterComponents | mappingRegistry 静态导入 | `ctx.registry` | 加载目标库映射到 ComponentRegistry + 注入该库配套图标包名（`setIconPackage`） |
| BuildTrees | `ctx.pagesData` | `ctx.builtPages` + `iconNameMap` | 建树 + 绑定打标 + ExtractNode + icon 收集（单次遍历）。另：**仅 `config.id===false` 时**预扫 `#collectAnchorTargetIds`（镜像 `#collectEventMutatedPaths`）收集 Anchor 的 `items[].href` 目标 id（字面量数组 / DataBinding `{path}` 绝对 path 解析到 state / 递归 children；相对 path 与运行时数据跳过）。**单次遍历同时判定有无 Anchor：无 Anchor 返回 `null`**（非空集），`BuildContext.anchorTargetIds: Set<string> \| null`，标记侧 `ctx.anchorTargetIds?.has(el.id) \|\| undefined` 可选链短路——id 保留只在「数据含 Anchor 且 `config.id===false`」时打 `keepId=true`（ComponentNode/HtmlNode 含抽取模块 inner 节点），使 jsx-emitter 在 `config.id=false` 时仍输出这些目标元素的 `id`（锚点 href 不致变死链）。`config.id=true` 或无 Anchor → `anchorTargetIds=null`、不预扫/不打标、零改动 |
| NodeMapper | `ctx.builtPages` | `ctx.mappedPages` | 纯形状 transform（不收集数据） |
| FileGenerator | `ctx.mappedPages` | `ctx.generatedFiles` + `ctx.styleResults` + `ctx.styleImportMap` | state-builder + tree-finalizer + **样式提取（tree-finalizer 之后）** + jsx-emitter + file-assembler |
| GenerateRoutes | `ctx.generatedFiles` | `ctx.routeResult` | 生成 React Router 路由 |
| GenerateThemeConfig | `ctx.theme` | `ctx.generatedFiles`（追加） | 生成 `src/theme/config.ts`（`DEFAULT_THEME = ctx.theme`）；库无关，调用方保证目标库模板目录含 `src/theme/useTheme.tsx` |
| WriteOutput | 各步骤产出 | `ctx.outputFiles` | 收集文件清单（不写磁盘） |
| GenerateReport | 各步骤统计 | console.log | 报告（不落盘 md） |

步骤链由 `api/index.ts` 的 `DEFAULT_STEPS` 控制（8 步）。**无独立 ReadPages**——`downloadHuiCode` 直接做 input → `pagesData` 注入。**无独立 ResolveIcons**——icon 收集合并在 BuildTrees 内。**无独立 GenerateStyles**——样式提取在 FileGenerator 内、tree-finalizer 之后跑（用 `finalResult.extractedFiles`，已过滤掉被 mapping 消化/force-inline 的循环模板，避免孤儿 .less）。

---

## 4. 文件结构

```
jsonToCode/                   ← 项目根
├── cli.ts                     ← CLI 调试入口
├── package.json               ← deps: tailwindcss, tsx
├── tsconfig.json
├── lib/                       ← CLI/Electron 共用 tailwind 转换
│   └── convertTailwindToCSS.ts   ← tailwindcss v4 本地实现（含响应式 variant，config 内联单文件）
├── api/                       ← 管线（可直接放入 Electron 项目）
│   ├── index.ts               ← API 入口（downloadHuiCode + 内部 config）
│   ├── config/
│   │   ├── chartDefaults/     ← 图表默认配置
│   │   └── mappings/             ← 组件映射（按库名拆子目录）
│   │       ├── eview-react/   ← 参考实现（工厂 createXxxMapping，eview-ui 特例复用）
│   │       └── eview-ui/      ← 复用 eview-react 22 工厂（cat1 18 + shared 4）+ 本地 bespoke/副本（待补）
│   ├── src/
│   │   ├── core/              ← node-types/value-types/component-mapping/icon-collection/access-path/...
│   │   ├── pipeline/          ← pipeline + pipeline-context
│   │   ├── steps/             ← 8 步实现
│   │   └── codegen/           ← state-builder/tree-finalizer/jsx-emitter/file-assembler/...
│   └── templates/{targetLib}/ ← Vite 项目模板（按库名拆子目录；eview-ui 先复用 eview-react 内容）
│       └── src/shared/       ← 公共组件（复制进产物，import `@/shared/<C>`）：eview-ui=Badge/Divider/Chart/Empty/TableFilter · eview-react=TableFilter
├── pages-source/              ← A2UI JSON 源（CLI 模式用）
├── output/                    ← 生成结果（CLI 模式用）
└── docs/                      ← ARCHITECTURE.md + LLM-MAPPING-GUIDE.md
```

---

## 5. API 入口

### `downloadHuiCode(input, options?)`

```ts
import { downloadHuiCode } from './api/index';

const { files } = await downloadHuiCode(
  [{ mergedA2UI: { rootId, elements, state }, planner: { rootId, elements, slots } }],
  { targetLib: 'eview-react' }
);
// files: [{ path: 'src/pages/orderAdmin/index.tsx', content: '...' }, ...]
```

**关键行为**：
- 校验 input 为非空数组
- 合并内部 config 与 `options`：`targetLib` + `templateDir`（其余 `css`/`id` 走内部 config）
- `templateDir` 按 `options.templateDir` 解析：绝对路径直接用、相对路径相对 `api/` 解析、未提供默认 `./templates`、末尾拼 `/{targetLib}` 子目录、不存在回退 `../../src/excode/templates/{targetLib}`（**此解析逻辑是重要集成约定，禁止随意更改，见 §10**）
- **绝不在此函数内写磁盘**
- 返回 `{ files: ctx.outputFiles }`

---

## 6. 关键设计

### 6.1 步骤模式（Step Pattern）

每个步骤继承 `Step` 基类，实现 `async execute(ctx)`，从 `ctx` 读输入、写输出。`Pipeline.run()` 按顺序调用各步骤。

### 6.2 节点 + 值类两分法（正交维度）

- **节点 `kind`**（5 类）：ComponentNode / HtmlNode / TextNode / ExtractNode / LoopNode
- **值类 `type`**（7 类）：BindingValue / ComputedValue / VarRefValue / RawExprValue / RenderFnValue / SlotNodeValue / LiteralValue
- **`__node: true` brand**：所有管线对象（PropValue + BuildNode）都带 `__node: true`，作为「是管线对象 vs 普通业务数据」的零碰撞标识。普通数据对象没有 `__node` → `!v.__node` 判为普通对象。映射文件通过 `Value.*()` / `Node.*()` 工厂间接获得 brand，不需手动加。`type`/`kind` 保留做内部分发（value 体系 vs node 体系）。

万物都是对象：children 中无裸字符串，TextNode 显式化。

### 6.3 TransformContext 契约

```ts
transform(node, ctx) → {
  tag?, import?, props?, children?, wrapper?, selfClosing?, propRoute?, classNameProp?
}

// ctx = { state, resolveNode, resolveIcon, resolveAbsoluteStateValue }
//   state                       — 页面原始 state
//   resolveNode(node)           — 等价 walkTree 一次，递归展开子树（不收集数据）
//   resolveIcon(name, props?)   — A2UI icon name → 已 resolve 的 BuildNode
//   resolveAbsoluteStateValue(p)— 仅绝对路径从 state 取值（transform 内辅助决策）
```

> **DataBinding 改值必须用 `Value.computed()`**，不能在 transform 内 `resolveAbsoluteStateValue` 取值后直接赋给 outputProps
> （会跳过 state-builder 阶段，导致 containsJSX 分流失效、相对路径无法 per-item 解析）。
> 详见 [docs/LLM-MAPPING-GUIDE.md](./docs/LLM-MAPPING-GUIDE.md) §DataBinding 铁律。

### 6.4 WriteOutput 收集模式

`WriteOutput` **不直接写磁盘**，将所有产出文件收集到 `ctx.outputFiles`：
- API 模式 → `downloadHuiCode` 直接返回 `{ files }`
- CLI 模式 → `cli.ts` 遍历写入 `output/`

### 6.5 文件单元（FileUnit）模型

state-builder 直接走树消费 binding/computed，不依赖中间 manifest。每个产物文件（主页面 / modules/* / components/*）是独立 FileUnit，有自己的 bindingRefs / computedRefs / jsxLiteralConsts / enrichmentConsts。binding/computed 保留原类型，jsx-emitter 直接 emit `accessPath`。

> **state-builder 单测**：`consumeValue`/`processLoop`/`getValueFromState`/`sharedKeyOfPath` + `StateBuilderContext` 接口已 test-exported（仅加 `export` 关键字，**不改运行行为**，运行期仍只被本模块内部调用）。`test/unit/state-builder.test.ts` 用最小 ctx/LoopNode fixture 直接调这些内部函数，绕过整条管线，覆盖 value 分发 + shared 打标 + processLoop enrichment/去重/inline 分流。改 state-builder 先跑该单测再 `test:e2e`。详见 [CLAUDE.md](./CLAUDE.md)「Test conventions」state-builder 条。

### 6.6 三路由 ExtractRoute

`ExtractRoute = 'inline' | 'module-top' | 'component-internal'`。`ComponentNode.propRoute` 声明 prop-key 级出口；未声明默认 inline。path 绑定走 `BindingValue.route` 不进 propRoute。

### 6.7 循环 + containsJSX 分流

- 循环内无 containsJSX computed → enriched 数组进 state.js
- 循环内有任一 containsJSX computed → enriched 数组进**当前文件单元** enrichmentConsts（不进 state.js）

### 6.8 嵌套循环 enrichment（循环套循环）

循环嵌套循环时，内层循环的数据源分两种：

| 内层 pathType | 数据来源 | 谁做 enrichment | collectRelativeCVsDeep | processLoop |
|---|---|---|---|---|
| **relative**（如 `indicators`） | 外层 item 的子字段 | **外层**（深收集 + `applyScopedCV` 沿 loopChain 逐层 map 进嵌套数组） | 深入（加 loopChain） | **跳过**独立 enrichment |
| **absolute**（如 `/globalAlerts`） | 顶层 state | **内层自己**（独立 resolveLoopData + enrich） | **不深入** | 正常做 enrichment |

- 外层 `processLoop` 用 `collectRelativeCVsDeep`（深）替代旧 `collectRelativeComputeds`（浅），递归收集内层 relative 循环的 CV（带 loopChain 如 `['indicators']`）。
- enrichment transform 用 `applyScopedCV(out, loopChain, cv, cvCtx)` 沿链逐层 map：`item.indicators[i].icon = resolveIcon(...)`。
- relative 嵌套循环跳过独立 enrichment（`pathType === 'relative' && loop.loopScope`），只 walk template body。
- 结果：`indicators` 进外层模板 destructure（`const { indicators } = data`），`data.indicators` 是 enriched 的（per-item 正确）；无内层 enrichment const → exclusion 不误删。

### 6.9 render fn body 内的循环

Table 列 render fn body 内的 DataBinding-children 循环（如 actions 列循环 `row.rawData.actions`）是**运行时逐行**数据。处理链路：

- **数据侧**（`enrichScopedData`）：Table mapping 构造 `dataset` ComputedValue，深收集 + applyScopedCV。
- **emit 侧**（`emitLoop`）：强制 inline（`loop.inline || opts.inRenderFnBody`），不引用模板文件。
- **stateBuilder 侧**（`processLoop`）：`ctx.currentScope` 是 RenderFnScope → 跳过，走当前单元 inline。

> 注：`collectRelativeCVs`（浅、跳过嵌套循环）已从 `processLoop` 移除，统一用 `collectRelativeCVsDeep`（深）。`collectRelativeCVs` 仍保留供 `enrichScopedData` 的浅收集场景。

### 6.10 Table 行展开映射

A2UI Table 行展开（`Table.props.expandable` + `TableRow.props.expandedRowRender` slot）→ eview-react Table：

- `expandable.expandedRowKeys` → `expandedRowKeys`：双形态 useState（同 `selectedRowKeys → checkedRows`），event=`onRowExpendClick`。但 `onRowExpendClick(row)` 签名只一参、无新值可取，extractor 占位 `(row) => {}`（不调 setter）。
- `TableRow.expandedRowRender`（`{ componentId }` → `SlotNodeValue.node`，build-trees 转换）→ `onRowExpend`：`buildRenderFn(子表, [{name:'row', dataSource, dataField:'rawData'}])`，与列 render 同构；`row.rawData` 上下文，子表 dataSource（相对路径如 `subList`）destructure。
- `expandable` 存在 → `enableRowExpand=true` + `enableMulitiExpand=true`。

propRoute（条件化：仅字面量/RenderFnValue 提升，ComputedValue 不）：
- `columns`（字面量数组，从 cells 构造）→ `module-top`
- `onRowExpend`（RenderFnValue，有 `expandedRowRender` 时）→ `module-top`
- `dataset`（ComputedValue，`enrichScopedData`，path 绑定）→ 不走 propRoute（inline stateRef）
- `expandedRowKeys` / `checkedRows`（useState）→ `component-internal`

### 6.11 Table 列筛选映射（filters → filter）

A2UI Table 列定义 `colDef.filters`（`Array<{ text, value }>`）→ eview-react/eview-ui Table 列 `filter`（在 `buildCol` 内构造，字面量 / DataBinding 两种 columns 形态共用）：

- `cd.filters` 存在时 → `col.filter = { component: Node.component({ tag:'TableFilter', import:'@/shared/TableFilter', props:{ data: cd.filters, onFilter: Value.rawExpr({ value:'(value) => {}' }) } }) }`。
- `data` 透传 `cd.filters`（字面量数组，原样下发）；`onFilter` 用 `Value.rawExpr` 占位空函数（当前阶段不接事件、不触发 useState，仅占位对齐 TableFilter 的必填/可选签名）。
- **`TableFilter` 是 `@/shared` 共享组件**（见 §7）：它是**对象属性值位置上的 BuildNode**——`col.filter.component`，不是 Table 的顶层 prop，而是嵌在列对象 `filter` 字段里的 ComponentNode。import-collector 的 `walkValueForImports` 递归 `Object.entries` 走进 `component` 字段收集其 import，故 `import TableFilter from '@/shared/TableFilter'` 会出现在产物文件顶部；file-assembler 把 `templates/{lib}/src/shared/TableFilter.tsx`（+ `.less`）当作共享模板文件复制进产物。
- **DataBinding columns 形态**：`columnsValue = Value.computed({ containsJSX:true, transform: rawCols => rawCols.map(buildCol) })`，`filter.component` 在 transform 内随 `buildCol` 逐项产出（BuildNode 出现在 ComputedValue transform 返回值里），columns 的 `containsJSX:true` 使整组列含 BuildNode、走文件单元 inline const，TableFilter BuildNode 随之 inline emit。

### 6.12 slotNode prop 子树内的 inline 循环

> **⚠️ 当前无消费方（保留作 pipeline 能力参考）**：本节原驱动用例是 eview-ui Dropdown 的 binding `menu`——它把含循环的 Menu 子树作 `overlay` prop 值。该用例已迁移到 **baked-CV**（`containsJSX:true` 的 `Value.computed`，transform 在 state-builder materialization 期烘焙静态 Menu 树，不再用 inline LoopNode，见 §7 bespoke Dropdown），故本节描述的「slotNode 内嵌 LoopNode + inline 循环」路径目前无 mapping 消费。机制本身（`walkSlotNodeProps` / `routeLoopNode` inline / `emitLoop` key-skip）仍在代码中保留。slotNode 作 prop 值仍被 Popover `content` / Drawer `footer` / Dropdown 字面量 `overlay` 使用，但它们是**静态子树、无内嵌 LoopNode**，只走 §6.12 第 1 层（slotNode→emitNode/walk），不触发第 2/3 层的 LoopNode 路由。

某些映射需要把**含循环的子树**作为一个组件 prop 值产出（原典型：eview-ui Dropdown 的 `overlay={<Menu>...<Menu.Item/>循环...</Menu>}`，现已改 baked-CV，见上方注记）。裸 LoopNode 不能直接放 prop 值（见 [CLAUDE.md](./CLAUDE.md) 硬约束 #7：stateBuilder `consumeValue` 把它当纯对象、相对绑定被忽略、`loopScope` 环爆栈）。解决链路用三层：

1. **包 SlotNode**：映射用 `Value.slotNode({ node: <Menu 子树节点> })` 把整棵子树包成 SlotNode 放进 prop。SlotNode 是 pipeline 既定的「子树作 prop 值」机制——`emitValue` 对 slotNode 走 `emitNode`（完整 emit 含 LoopNode children），`stateBuilder` `consumeValue` 对 slotNode 走 `walk(v.node)`（收集子树 binding/computed/LoopNode）。故 LoopNode 不再裸悬在 prop 值里、而是经 slotNode 进既定 walk/emit 通路。

2. **tree-finalizer 走 slotNode prop 子树**：tree-finalizer 的 DFS 默认只走 `children`，prop 值里的子树不会被 `routeLoopNode` 路由（→ `loop.data` 不替换成 varRef、模板不抽离注册 → emit 时兜底成 `'data'` 且引用未生成模板组件）。`walkSlotNodeProps`（`walkComponent`/`walkHtml` 调用）对每个 `type==='slotNode'` 的 prop 再走一次 `walkNode`，让子树内的 LoopNode 经 `walkChildren→routeLoopNode` 正常路由。**注**：现有 mapping 把 slotNode 留进 `outputProps` 的（Popover `content` / Drawer `footer` / Dropdown 字面量 `overlay`）都是**静态子树、无内嵌 LoopNode**，故此处的 LoopNode 路由仍是死路径；有 slotNode 内嵌 LoopNode 的新 mapping 落地时此路径才被触发。

3. **inline 循环 + key-skip**：子树内 LoopNode 用 `Node.loop({ ..., inline: true })` 声明 inline——`routeLoopNode` 对 `inline:true` 走当前 draft、不注册 `extractedFiles`（不抽离独立模板文件）；`emitLoop` `forceInline` 直接在 `.map` 回调里渲染 body。**key 冲突处理**：inline 分支默认给首元素注入 `key={idx}`（React list key 要求），但当 template body 首元素**自带 `key` prop**（如 eview-ui Dropdown 的 `Menu.Item` 模板 `key={key}` 相对绑定——既是 React list key 又是 Menu.Item 语义 value）时，`emitLoop` 检测到 `bodies[0].props.key` 存在则**跳过 `key={idx}` 注入**、map 签名改 `(item)`（无 `idx`），避免覆盖/冲突。产物形态：`{(dynamicMenu || []).map((item) => { const { key, label } = item; return (<Menu.Item key={key} icon="...">{label}</Menu.Item>); })}`。

> inline 而非抽离模板的关键动机：`Menu.Item` 是 `Menu` 的子组件（dotted access `<Menu.Item>`），依赖父 `Menu` 的 default import 在同一文件作用域内。抽离成独立模板文件会脱离父 Menu 作用域、Menu.Item 无法解析（即使 import-collector 对 dotted tag 取 base 段作 default import 名，独立文件仍需单独引入父组件，不如 inline 自然）。inline 下 `Menu.Item` 始终内联在 `overlay=<Menu>...</Menu>` 内、复用父 Menu import，template 的 `Menu.Item` 自身不声明 import。

### 6.13 锚点目标 id 保留（keepId，config.id=false 例外）

`config.id=false`（prod）会移除产物 JSX 全部 `id` 属性，但锚点组件 `Anchor` 的 `items[].href="#xxx"` 滚动依赖目标元素的 DOM `id`，剥掉后 href 变死链。解决用 **keepId 标记**（不走 props 通道、避免与 closed-set transform / emitProps 重复 id 冲突）：

- **预扫**（BuildTrees `#collectAnchorTargetIds`，镜像 `#collectEventMutatedPaths`，**仅 `config.id===false` 时跑**）：遍历所有 `component === 'Anchor'` 的元素，从 `props.items` 收集目标 id（去前导 `#`）。`items` 两形态：
  - 字面量数组 → 直接遍历；
  - DataBinding `{path}`（`#processValue` 识别为 BindingValue 的形态）→ 绝对 path（`/` 前缀）经 `resolveBySegments(state, pathToSegments(path))` 解析到页面初始 state 拿真实 items 数组；相对 path（无 `/`，循环内 per-item）与 state 取不到（运行时拉取）跳过。
  - 递归 `item.children` 收集多级嵌套 href（树形 items）。
  - **单次遍历同时判定有无 Anchor**：未发现任何 Anchor 元素时返回 **`null`**（而非空集），避免「`.some()` 守卫 + collect」双遍扫描（那在有 Anchor 时更慢）。`BuildContext.anchorTargetIds: Set<string> | null`。
- **打标**：`#buildTree` / `#buildAsExtractModule` 建 ComponentNode/HtmlNode 时（4 处 `id: el.id` 旁）`keepId: ctx.anchorTargetIds?.has(el.id) || undefined`——`anchorTargetIds` 为 `null`（`config.id=true` 或无 Anchor）时可选链短路、不调 `has()`、无逐节点开销；命中才落 true，否则 undefined。抽取模块的 inner 节点同样打标——模板文件 emit 时输出 id；主树占位无需 id（锚点指向模板内真实内容元素）。
- **emit**：`jsx-emitter` `emitComponent`/`emitHtml` 的 id 条件由 `opts.emitId && node.id` 放宽为 `(opts.emitId || node.keepId) && node.id`——id 始终在原有 `node.id` **单一通道**，无重复 id 属性，不碰 `ComponentRegistry` 核心、不改 `emitProps`、不动 Chart 等已有 id 转发行为。
- **存活性**：keepId 是节点自身属性，经 NodeMapper `{...node}` 与 tree-finalizer `{...node, props}` 的 spread 一路拷贝存活到 emitter；唯一丢 keepId 的是抽取模块主树占位（`tree-finalizer.ts:456` 新建、只显式拷 id），但占位不需要。
- **覆盖范围**：ComponentNode/HtmlNode 都有 `el.id`，故 HTML 目标（div/section…）与注册组件目标（Card…）统一覆盖（props 注入路线无法覆盖组件目标，因 closed-set transform 会丢 `props.id`）。
- **门控**：id 保留只在「**数据含 Anchor 且 `config.id===false`**」时真正发生。`config.id=true`（e2e/CLI 基线）→ 不预扫、`anchorTargetIds=null`、零 keepId、产物逐字不变（e2e 快照无 diff、无需 `-u`）；`config.id=false` 但无 Anchor → 预扫返回 `null`、标记可选链短路、无 keepId。仅 `config.id=false` 且有 Anchor 才预扫返回非空集并打标。

---

## 7. 共享工具

### `api/config/mappings/{targetLib}/` 组件映射

每个映射文件导出一个**工厂函数** `createXxxMapping(pkg: string): MappingDef`，接收目标组件库包名 `pkg`，内部用 `` `${pkg}/${export}` `` 构建 `import`，返回 `MappingDef`。`eview-react/index.ts` 声明本地 `const pkg = '@nce/eview-react'` + `export const iconPkg = '@nce/icon-plus'`，调工厂装配。

**⚠️ 工厂函数复用是 eview-ui 特例，不是通用多库模式**：eview-ui 与 eview-react 基本是同一套组件库（组件 tag 名一致），仅 npm 包名不同（`@cloudsop/eview-ui` vs `@nce/eview-react`）+ 配套图标库包名不同（`@hui/icon-plus` vs `@nce/icon-plus`），所以 eview-ui 的 `index.ts` **特例复用** eview-react 的工厂（换 `pkg`/`iconPkg`）。**未来别的组件库不能这么复用**——各自独立的映射目录、独立的 `MappingDef` 文件，不复用 eview-react 工厂。

eview-ui 的四类映射（见 [eview-ui/index.ts](api/config/mappings/eview-ui/index.ts) 头注释）：

1. **工厂复用（`pkg='@cloudsop/eview-ui'`）**：18 个组件，eview-ui 包自带，直接复用 eview-react 工厂换包名（Breadcrumb / Carousel / Checkbox / CheckboxGroup / CollapseItem / Icon / InputNumber / Modal / Pagination / RadioGroup / Segmented / Select / SearchInput / Slider / CategoryInput / CategorySearch / HexField / IPInput）。
2. **工厂复用 + `@/shared` 前缀（`sharedPkg='@/shared'`）**：Badge / Divider / Chart / Empty（+14 图表变体）。eview-ui 无这些组件，在 `templates/eview-ui/src/shared/` 下手动实现对齐 eview-react API 的公共版本（[Badge](api/templates/eview-ui/src/shared/Badge.tsx)/[Divider](api/templates/eview-ui/src/shared/Divider.tsx)/[Chart](api/templates/eview-ui/src/shared/Chart.tsx)/[Empty](api/templates/eview-ui/src/shared/Empty.tsx)），import 走 `@/shared/<组件>`（vite `@` alias → src）。Tag 原属此类，已迁移为 bespoke（第 3 类，使用 eview-ui 原生 Tag）。后续手动实现的公共组件也用 `sharedPkg`。
   - **`@/shared` 还承载「被映射产出的 JSX 引用、但不对应任何 A2UI 输入组件」的公共组件**：典型即 `TableFilter`（表格列筛选组件，由 Table 映射的 `filters` 特性产出的 `filter.component` 引用，见 §6.11）。eview-react 与 eview-ui 各有一份：[templates/eview-react/src/shared/TableFilter.tsx](api/templates/eview-react/src/shared/TableFilter.tsx)（`ev-` className + `@nce/eview-react` 的 Button/Checkbox/Divider）、[templates/eview-ui/src/shared/TableFilter.tsx](api/templates/eview-ui/src/shared/TableFilter.tsx)（`eui-` className + `@cloudsop/eview-ui` 的 TextButton/Checkbox + 相对路径 `./Divider`）。二者非 mapping（不在四类映射之列），是 file-assembler 复制进产物的共享模板文件。eview-react 的 `src/shared/` 因 TableFilter 而新增（此前仅 eview-ui 有 shared/）。
3. **bespoke（eview-ui 专属 `MappingDef`，非工厂）**：11 个，eview-ui 与 eview-react API 差异点——
   - DatePicker（`format` 透传，eview-ui 用 moment 风格与 A2UI 一致；eview-react 转 Java 风格）
   - Rate（`allowClear` 透传，eview-ui Rating 支持、eview-react 丢弃）
   - Switch→Toggle（丢弃 `checkedChildren`/`unCheckedChildren`/`*Icon`，eview-ui 无 `taggledChildren`/`unTaggledChildren`；映射到 Toggle 组件而非 Switch）
   - TextArea（丢弃 `autoSize`，eview-ui 无 `sizeAuto`）
   - Button（`types=link`→`TextButton`；去掉纯图标→`IconButton` 分支）
   - Steps（丢弃 `orientation`，eview-ui 无 `direction`）
   - Progress（丢弃 `status`，eview-ui 不支持；`strokeColor`→`barStyle.backgroundColor` 是 eview-react 工厂的共享修复）
   - Dropdown（`menu`→`overlay` 构造 `Menu`+`Menu.Item`/`SubMenu` 节点；**字面量 menu 与 DataBinding menu 均已落地**——字面量走 `Value.slotNode({ node: buildMenuOverlayFromLiteral(menu) })`，`emitValue` 经 slotNode→`emitNode` 内联 emit `<Dropdown overlay={<Menu>...<Menu.Item/>...</Menu>} />`；DataBinding 走 **baked-CV**（`containsJSX:true` 的 `Value.computed`，`transform` 在 state-builder materialization 期拿已解析 rawData 烘焙静态 Menu 树，产物进 `jsxLiteralConsts`、prop 位 `overlay={const}` 引用）。替掉旧 inline LoopNode + `resolveAbsoluteStateValue` workaround（那套只认绝对路径、相对 fallback flat；baked-CV 的 transform 在 materialization 期跑，绝对/相对路径均支持 per-item）。icon 写死占位 URL。**不使用 override**（eview-ui 始终 `Dropdown` + `overlay=Menu`，无组件切换；override 是 eview-react Dropdown 的事）。详见 §6.12（slotNode 内嵌 LoopNode 的 inline 循环路径现无消费方，作 pipeline 能力保留））
   - Tag（从 `@/shared` 迁移为 `@cloudsop/eview-ui/Tag`；`color` 直传 A2UI 枚举（info/error/alert 等，同 eview-react）；icon 丢弃；size `small`→`normal`；variant→className `filled`（filled/outlined 追加，solid/缺省不加，color=default 不受 variant 影响）；closable 丢弃）
   - Popover（A2UI Popover → `@cloudsop/eview-ui/Tooltip`，**非 react 的 TipBox**）：3 处差异——① `placement`→`placement` **同名透传**（react 改名 `direction`）；② `title` **丢弃**（Tooltip 无 title prop；react 透传 title，故 eview-ui 的 state 不收 title）；③ 其余同 react（content 三形态：字面量/DataBinding rule1 透传 / SlotNode→`ctx.resolveNode` 解析后重新包 slotNode 留作 content prop 值；trigger 过滤 `contextMenu` 单项→单值多项→数组；className/children 透传）。content 的 SlotNode 是静态子树、无内嵌循环。
   - TimePicker（`format` **直接透传**：eview-ui 原生用 `hh` 小写与 A2UI antd 规范一致，不做 eview-react 的 HH→hh 转换；`placeholder` 透传（eview-ui 支持、react 丢弃），数组/DataBinding 取首项；className 宽度类拆分目标为 `style`（eview-ui 有 style prop，react 用 `timeStyle`））

   **11 个 bespoke 均有专属单测** `test/unit/mapping/ui/{Component}.test.ts`（聚焦上述差异点，复用 `../fake-ctx` 的 `UI_PKG`/`ICON_SENTINEL`），改 bespoke 先跑该单测再 `test:e2e:ui`。详见 [CLAUDE.md](./CLAUDE.md)「Writing / maintaining a mapping unit test」。
4. **本地工厂副本（`pkg='@cloudsop/eview-ui'`，非复用）**：9 个——5 个涉及 icon 属性的组件（Input(`$pkg/TextField`) / Menu(`$pkg/Accordion`+`$pkg/Tab`) / TabItem(`$pkg/Tab` named) / Timeline(`$pkg/TimeLine`) / Tree(`$pkg/Tree`)）+ 3 个 API 不兼容组件 + 1 个 import 形式差异组件：
   - Tabs（`$pkg/Tab`，onClick extractor 差异 + types/tabPlacement DataBinding 支持）
   - Drawer（默认 `height='100%'`（仅 right/left/缺省 时加，eview-react 不加）；`mask`→`maskSetting.show` 嵌套对象（eview-react 为扁平 `showMask`）；`footer` 直接赋 `footer` prop（eview-ui Drawer 有 `footer: ReactNode|false`；eview-react 无独立 footer slot、其副本把 footer 并入 children））
   - Table（render / onRowExpend 的行数据字段名 `row._org`（eview-react 为 `row.rawData`）；`expandable.expandedRowKeys`→`expandedRow`（eview-react 为 `expandedRowKeys`））
   - Collapse（eview-ui 的 Panel 是 **named 导出**（`import { Panel, PanelItem } from '@cloudsop/eview-ui/Panel'`），eview-react 的 Panel 是 **default 导出**（`import Panel, { PanelItem } from '@nce/eview-react/Panel'`）。eview-react 工厂用字符串 import（= default）对 eview-ui 不成立，副本改 `import: { source, named: true }`。transform 逻辑与 eview-react 一致（Panel API 相同）；CollapseItem 复用 eview-react 工厂（其 import 本就是 named、同源，eview-ui 一致，无需副本））
   文件在