# 图标方案分析：为何产物中同时出现方案 C 与方案 A

## 背景

`antd-to-eview-react` skill 在图标迁移上明确写道：

> **默认走方案 C**：先用脚本自动化 `node scripts/match-icons.cjs <目标工程根>`——扫描 `src/` 下 `<Icon name="..." />` 调用点，按语义表 → L1 → L2 → L3 → L4 → 占位 离线匹配 `references/icons/icon-plus-names.json`，加 `--apply` 直接改写调用点 + 注入 `@nce/icon-plus` import（幂等）。命中即 `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import 替换调用点（**无网络依赖、彻底离线**）。
>
> **备选**：内网运行时 fetch 兜底用 A（scaffold `src/shared/icon.jsx`，调用点零改动只改 import 路径）。

但在实际产物中，却出现了 `import { Icon } from "../../shared/icon.jsx"`（方案 A 的 shim）。本文档分析其原因。

## 产物实际形态：混合方案

本工程（`复杂页面-eview`）经 `match-icons.cjs --apply` 处理后，图标呈现**混合形态**：

- **方案 C（静态 import）**：23/42 调用点命中，改写为 `import { IconPlusIcXxx } from '@nce/icon-plus'`，彻底离线。
- **方案 A（`<Icon>` shim）**：4 处调用点保留 `import { Icon } from "../../shared/icon.jsx"`，运行时 fetch，依赖内网 `octo.hdesign.huawei.com`。

保留 shim 的 4 处调用点全部位于 `header-bar`、`side-nav`、`strategy-modal` 三个文件。这三个文件**同时**也已有 `IconPlusIc*` 静态 import——即文件内静态图标走 C、动态图标走 A，两者并存。

## 根因：方案 C 的隐含前提是 name 为静态字面量

`match-icons.cjs` 是**纯静态扫描器**。它通过 regex/AST 抓取 `<Icon name="download" />` 这种 **name 为字符串字面量**的调用点，再去 catalog 按语义表 / L1-L4 算法匹配，命中后改写成静态 import。

一旦 name 是**变量、三元表达式、或从数据循环取值**（如 `name={cond ? "a" : "b"}`、`name={item.icon}`），编译期无法静态确定 name 的值，脚本根本扫描不到这些调用点。验证：查看 `.icon-match.json`，其中**完全没有** `sun` / `moon` / `panel-left-open` / `chevron-down` / `circle-check` 等条目——它们不是字面量调用点，脚本直接跳过。

对这类动态调用点，方案 C 天然失效，只能回退方案 A：保留 `<Icon>` shim 组件，运行时根据实际 name 去 icon-plus 在线服务 fetch SVG。

## 4 处动态调用点实证

grep 产物中残留的 `<Icon` 调用，name 全部是动态三元表达式：

| 文件:行 | 调用点 | name 形态 | 业务语义 |
|---------|--------|-----------|---------|
| `header-bar/index.jsx:28` | 折叠按钮 | `name={collapsed ? "panel-left-open" : "panel-left-close"}` | 侧边栏折叠状态切换 |
| `header-bar/index.jsx:74` | 暗色切换 | `name={isDark ? "sun" : "moon"}` | 亮/暗主题图标 |
| `side-nav/index.jsx:77` | 菜单展开箭头 | `name={isOpen ? "chevron-down" : "chevron-right"}` | 子菜单展开/收起 |
| `strategy-modal/index.jsx:82` | 状态切换 | `name={enableNow ? "circle-check" : "pencil-line"}` | 启用状态切换 |

这 4 处共同特征：name 不是字面量，而是根据运行时 state（`collapsed` / `isDark` / `isOpen` / `enableNow`）在两个候选名之间切换。

## 结论：非 skill 矛盾，而是分层兜底设计

skill 里"**备选**：内网运行时 fetch **兜底**用 A"——"兜底"二字即此意：A 是 C 处理不了时的退路，不是并列首选。

- **静态字面量 name** → 方案 C 静态 import（彻底离线，无网络依赖）
- **动态表达式 name** → 方案 A shim 运行时 fetch（需内网）

产物里 23/42 调用点走 C、4 处动态名走 A，正是这个分层在起作用。出现方案 A **不是 skill 自相矛盾**，而是 skill 设计的预期兜底路径被触发。

## 可优化点：手动收敛动态三元为条件渲染

这 4 处动态名其实都是**有限离散三元**（仅 2 个候选名），理论上可手动改写成条件渲染两个静态 import 组件，彻底摆脱内网依赖：

```jsx
// 改写前（方案 A，运行时 fetch）
<Icon name={isDark ? "sun" : "moon"} size={16} />

// 改写后（方案 C，彻底离线）
{isDark ? <IconPlusIcPublicSun iconSize={16} iconColor={['currentcolor']} />
        : <IconPlusIcPublicMoon iconSize={16} iconColor={['currentcolor']} />}
```

但 `match-icons.cjs` 只对字面量调用点做匹配，**不会主动把三元拆成两个候选分别匹配**——这是脚本的局限。skill 默认流程未做这步手动改写，故留下 shim。

**前提条件**：候选名（`sun` / `moon` / `panel-left-open` / `panel-left-close` / `chevron-down` / `chevron-right` / `circle-check` / `pencil-line`）需能在 `icon-plus-names.json` catalog 命中。其中 `pencil-line` 在字面量调用点场景已被判定为 `UNMATCHED`（见 `.icon-match.json`），改写后仍会落到占位组件 `IconPlusIcPublicTransverseRectangleTemplate`，需内网人工复核。

**建议**：内网环境下，让 LLM 按上述思路手动收敛这 4 处离散三元为条件渲染，可将方案 A 彻底清零，使整个工程的图标迁移完全离线化。

## 附：本次迁移图标匹配统计

来源 `.icon-match.json` 与 `.migration-result.json`：

| 指标 | 数值 |
|------|------|
| 唯一图标名总数 | 31 |
| 命中唯一名 | 18（58%） |
| 未命中唯一名 | 13（用占位 `IconPlusIcPublicTransverseRectangleTemplate`） |
| 调用点总数 | 42 |
| 命中调用点（方案 C） | 23（55%） |
| 动态名调用点（方案 A shim） | 4 |
| 其余未命中字面量调用点 | 15（占位组件） |

未命中的 13 个图标名：`sliders-horizontal`、`scroll-text`、`shield-check`、`circle-question-mark`、`list-checks`、`router`、`hard-drive`、`activity`、`pencil-line`、`external-link`、`undo-2`、`save`、`pencil`。这些在内网环境下需人工查 icon+ 目录替换占位组件。
