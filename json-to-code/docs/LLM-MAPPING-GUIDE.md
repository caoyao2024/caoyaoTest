# LLM 组件映射文件生成指南

## 规约

> 本文档指导 LLM 如何为 A2UI → eview-react 的管线（`api/` 目录）生成组件映射文件。
>
> **核心思想**：映射文件将 A2UI 节点的 `props` 和 `children` 转换为管线消费的标准 IR 节点，**只做数据格式转换，不涉及 JSX 序列化**。
>
> **适用范围**：`api/config/mappings/` 目录下的映射文件。

---

## 一、工作流程（LLM 必须遵守）

### 1.1 生成映射文件前的必读材料

在写任何代码之前，LLM **必须**按以下顺序阅读参考文档：

| 序号 | 阅读内容 | 路径示例 | 目的 |
|------|---------|---------|------|
| 1 | **A2UI 组件 JSON Schema** | `md/a2ui/api/Navigation/Menu.json` | 了解 A2UI 组件的 props、绑定类型、约束 |
| 2 | **A2UI 组件 Example** | `md/a2ui/example/Navigation/Menu.md` | 了解 A2UI 组件的典型用法和数据形态 |
| 3 | **eview-react 组件文档** | `md/eview-react/Accordion.md` | 了解目标组件的 props、数据类型、事件、注意事项 |

> **⚠️ 必须按顺序阅读。** 不看 A2UI Schema 不知道输入是什么，不看 eview-react 文档不知道输出要什么。

### 1.2 附加必读（工程上下文）

```text
docs/ARCHITECTURE.md    → 整体设计，特别是：
                                        §3  值类体系（PropValue 各类型）
                                        §4  MappingDef + TransformContext
                                        §10 双向绑定规则（UseStateMarker）
                                        §11 State 消费（ComputedValue 求值时机）
                                        §12 命名规则
api/src/core/value-types.ts      →  值类接口定义（BindingValue / ComputedValue / LiteralValue / 等）
api/src/core/component-mapping.ts → TransformContext / TransformResult / MappingDef 接口
api/src/core/value.ts           →  Value.* 工厂函数
api/src/core/node.ts            →  Node.* 工厂函数
```

### 1.3 方案先行，确认后实施

1. LLM 读完所有材料后，**先出具映射方案**
2. 方案必须包含：
   - A2UI 输入 props 与 eview-react 输出 props 的逐项对照表
   - 每条 props 的处理方式（透传 / 改名 / 值映射 / transform 复杂处理）
   - children 的处理方案
   - 是否使用 ComputedValue 及其理由
   - 是否使用 `LiteralValue.useState` 等双绑机制
3. **等人确认方案后再写代码**
4. 方案可能需要多轮迭代

> **禁止**：不看文档直接写代码、不看 eview-react 文档猜测目标组件 API。

---

## 二、映射文件结构

### 2.1 文件位置

```
api/config/mappings/{targetLib}/
├── index.ts          ← 入口，集中导出所有组件映射
├── Menu.ts           ← 每个组件一个文件
└── ...
```

> 映射文件按组件名 PascalCase（`Menu.ts` / `Button.ts`），是 kebab 文件命名约定的**例外**（`api/src` 下其余 `.ts` 一律 kebab，见 [AGENTS §10](../../AGENTS.md)）。

### 2.2 导出结构 + 文件头注释规范

```ts
/**
 * {A2UI组件名} → {目标组件名} 映射
 *
 * A2UI {A2UI组件名} → eview-react {目标组件名} 组件。
 *
 * ## Props 对照
 *
 * | A2UI prop | eview-react prop | 处理方式 |
 * |-----------|-----------------|---------|
 * | value（字面量） | text | 改名透传 |
 * | value（DataBinding） | text | 保持 BindingValue 原样 |
 * | color: default/primary/danger（枚举） | status: default/primary/risk | 值映射（普通 Button 分支；schema 已收敛为枚举，无色板/HEX） |
 * | icon（字面量） | leftIcon | ctx.resolveIcon() → BuildNode 直出 |
 * | icon（DataBinding） | leftIcon | **ComputedValue** + containsJSX:true，编译期 resolveIcon |
 * | iconPlacement: end | → rightIcon | 位置分流 |
 * | className | className | 透传（普通 Button 分支） |
 * | types: link | status: text | 值映射（link 按钮→文本样式，覆盖 color 的 status） |
 * | — | onClick | 注入占位 (e) => {} |
 *
 * ## 特殊逻辑
 *
 * - 纯图标按钮：有 icon 无 value → 切换为 IconButton
 * - **IconButton 分支**：color / className / iconSize（来自 size）透传给 resolveIcon（产出 IconPlus），
 *   不再转 status/style；size→iconSize（large20/medium18/small14）；Button.shape（≠ Icon.shape）丢弃
 *   （IconButton 自管）。普通 Button 分支仍走 color→status / shape:circle→style.borderRadius。
 * - ...
 */

// 每个文件导出工厂函数 createXxxMapping(pkg)，用 pkg 拼接 import 路径
export function createAccordionMapping(pkg: string): MappingDef {
  return {
    tag: 'Accordion',                          // 必填：目标组件名
    import: `${pkg}/Accordion`,                 // 必填：导入路径（由 pkg 拼接，eview-react→@nce/eview-react，eview-ui→@cloudsop/eview-ui）
    defaults: { /* ... */ },                   // 可选：缺省 prop 值
    transform(node, ctx) { /* ... */ },        // 可选：复杂转换逻辑
    classNameProp: 'inputClassName',           // 可选：className 输出 key 别名（默认 'className'），见 §3.4b
  }
}
```

> **工厂形式是 eview-ui 特例，非通用**：eview-react 映射之所以做成工厂（接收 `pkg`），是为了让 eview-ui（与 eview-react 基本同一套库、仅包名不同）能复用同一份映射、只换 `pkg`。**未来别的组件库不复用此模式**——各自独立映射目录、独立 `MappingDef`。详见 [AGENTS.md §7](../AGENTS.md)。

> ⚠️ 文件头部 JSDoc 的 **Props 对照表** 必须与代码实现精确一致。增/删/改任何一个 prop 的处理方式，同步更新表格。

在 `index.ts` 中注册（调工厂装配）：

```ts
import { createMenuMapping } from './Menu'
const pkg = '@nce/eview-react'           // 本地常量，传给各工厂
export default { Menu: createMenuMapping(pkg), /* ... */ }
```

---

## 三、Props 处理分类

### ⚠️ 前置必知：A2UI props 的双形态

A2UI 的每个 prop 都可能有两种形态 —— 这是映射文件中**最容易遗漏**的关键点。

**形态一：字面量**
```json
{ "items": [ { "title": "首页", "key": "home" } ] }
```
→ 管线中保持为原始 JS 值（string / number / boolean / array / object）

**形态二：DataBinding（路径绑定）**
```json
{ "items": { "path": "/menuItems" } }
```
→ 管线中转换为 `BindingValue`（`__node` brand 由 `Value.binding()` 工厂注入，映射文件构造时勿手搓）：
```ts
{ __node: true, type: 'binding', path: '/menuItems', pathType: 'absolute', accessPath: 'menuItems' }
```

**判断依据**：在 A2UI JSON Schema（`md/a2ui/api/*.json`）中，props 通过 `oneOf` 标记哪些字段支持 DataBinding：

```json
"items": {
  "oneOf": [
    { "type": "array", "items": { ... } },    ← 字面量形态
    { "$ref": "#/$defs/DataBinding" }          ← 路径绑定形态
  ]
}
```

**映射文件必须覆盖两种形态**。transform 中通过 `props.X?.type === 'binding'` 判断：

```ts
const itemsIsBinding = props.items?.type === 'binding'

if (itemsIsBinding) {
  // 路径绑定分支
} else {
  // 字面量分支
}
```

> **为什么这很重要？** 同一个组件在页面中可能用字面量硬编码数据（静态菜单），也可能用路径绑定从后端获取数据（动态菜单）。映射文件必须同时支持这两种用法，缺一不可。

---

### ⚠️ DataBinding 处理铁律（必须遵守）

这是映射文件中**最容易犯错**的规则。A2UI 的 DataBinding prop 只有 **两种合法处理方式**，二选一：

> DataBinding 的 path 有两种形态，处理规则完全一致（`pathType` 由原始 binding 透传）：
> - **绝对路径** `/menuItems` → 从 state 根对象取值
> - **相对路径** `itemName` → 沿 LoopScope 链向上解析，在循环模板内使用

| 条件 | 处理方式 | 代码示例 |
|------|---------|---------|
| 只需**改名**，不改值 | 保持 BindingValue 原样赋值给新 prop key | `outputProps.text = val`（val 就是原始 BindingValue 对象） |
| 需要**编译期改值**（类型转换 / icon 解析 / enrichment / 格式化） | **必须**用 `Value.computed()` 包装 | `outputProps.icon = Value.computed({ ... containsJSX: true, transform: ... })` |

> ### ⚠️ 集合/数组 DataBinding：即便"只需改名"也必须用 `Value.computed()`，不能 raw 透传
>
> 上表"只需改名 → 保持 BindingValue 原样"**仅适用于标量值**（如 `Button.value`→`text`、`placeholder`、`CategoryInput.category` 选中值）。当 DataBinding 的值是**数组/集合**（`options` / `popItems` / `categoryOptions` / `items` 等）时，即便 item 形状与目标组件一致、无需 per-item 转换，也**必须**用 `Value.computed({ containsJSX: false, transform })`，**不能** raw 透传 BindingValue：
>
> ```ts
> // ✅ SearchInput.popItems / CategoryInput.categoryOptions（数组 DataBinding）
> if (opts?.type === 'binding') {
>   outputProps.popItems = Value.computed({
>     path: opts.path, pathType: opts.pathType ?? 'absolute', accessPath: opts.accessPath,
>     containsJSX: false,
>     transform: (rawItems) => (Array.isArray(rawItems) ? rawItems : []),  // 防御性兜空数组
>   })
> } else if (Array.isArray(opts)) {
>   outputProps.popItems = opts  // 字面量数组原样直传
> }
> ```
>
> **为什么不能用 raw 透传？**（根因见 [state-builder.ts `consumeValue`](../../api/src/codegen/state-builder.ts) 的 `binding` vs `computed` 分支）
> 1. **防御性兜底**：raw `binding` 分支只把 raw state 值写进 stateEntries + `bindingRefs` emit `const { accessPath } = initialState`——路径缺失/值非数组时产 `popItems={undefined}`（组件收到 undefined）；`computed`(containsJSX:false) 分支走 `transform(raw)` 物化，兜成 `[]`，与字面量空数组行为一致。
> 2. **per-item 转换的唯一通道**：集合数据常需 per-item 处理（icon→BuildNode、`label`→`text` 重命名、循环 relative binding enrichment），只有 `ComputedValue.transform` 能 per-item 求值；raw 透传做不了。即便当前无需转换，也用 ComputedValue 占位，未来加 per-item 转换不必改结构。
> 3. **与既有映射一致**：`Select.options`、`SearchInput.popItems`、`CategoryInput`/`CategorySearch`.`categoryOptions` 均按此（`containsJSX:false` + `Array.isArray ? : []`）；需 per-item icon 解析的（`Menu.items`、`Dropdown.menu`、`Tree.options`）用 `containsJSX:true`。
>
> **标量值 DataBinding（仅改名）仍可 raw 透传**——`placeholder`、`Button.value`→`text`、`CategoryInput.category`（选中值）等标量无需 per-item 处理，raw BindingValue 走 `bindingRefs` 直接 emit `prop={stateRef}` 即可。

**❌ 禁止的做法：** 在 transform 中先 `ctx.resolveAbsoluteStateValue()` 从 state 取值，处理后再赋值给 outputProps。

```ts
// ❌ 错误 — 跳过 ComputedValue 管线（pathType 是 absolute 还是 relative 都一样错）
const iconName = ctx.resolveAbsoluteStateValue(props.icon.path)
outputProps.leftIcon = ctx.resolveIcon(iconName)

// ✅ 正确 — 委托 ComputedValue 在 state-builder 阶段处理
//    pathType 随原始 binding 透传（absolute/relative 均可）
outputProps.leftIcon = Value.computed({
  path: iconProp.path,
  pathType: iconProp.pathType ?? 'absolute',
  accessPath: iconProp.accessPath ?? 'leftIcon',
  containsJSX: true,
  transform: (rawValue, cvCtx) => {
    const rIcon = cvCtx?.resolveIcon ?? ctx.resolveIcon
    return typeof rawValue === 'string' ? rIcon(rawValue) : null
  },
})
```

> **为什么不能直接取值？**
>
> 管线分两个阶段：NodeMapper（transform）只做形状变换，state-builder（ComputedValue.transform）才做数据转换。
> 如果在 transform 中直接用 `ctx.resolveAbsoluteStateValue` 取值处理 DataBinding，会跳过 state-builder 阶段，导致：
> - `containsJSX` 分流失效（含 BuildNode 的结果不知道去哪个文件单元）
> - 嵌套循环中的相对路径无法 per-item 解析（`ctx.resolveAbsoluteStateValue` 仅支持绝对路径）
> - 循环 enrichment 无法正确执行

---

### TransformContext API 使用边界

transform 中可用的三个核心 API 各有明确的用途和禁区：

| API | ✅ 允许用途 | ❌ 禁止用途 |
|-----|-----------|-----------|
| `ctx.resolveNode(node)` | 容器组件（Table/Tabs）transform 中展开子树 | 不用于数据取值或类型转换 |
| `ctx.resolveIcon(name)` | **字面量 icon** 的名称 → BuildNode 转换 | ❌ 不单独用于 DataBinding icon（须配合 ComputedValue） |
| `ctx.resolveAbsoluteStateValue(path)` | **仅绝对路径**：transform 内部辅助决策（如 Menu 取 openKeys 算闭包）、读取 state 配置值控制 transform 分支 | ❌ 不支持相对路径；❌ 不用于替代 ComputedValue.transform 做数据值的转换 |

> ⚠️ **`ctx.resolveAbsoluteStateValue` 仅适合绝对路径**。组件 transform 每个节点只跑一次，
> 无法 per-item 解析相对路径（那是 `ComputedValue.transform` 内 `cvCtx.resolveValueFromPath` 的职责）。
> 若需处理相对路径的 DataBinding 值，必须用 `Value.computed()`。

**判定口诀**：
- 只改 prop 名不改值 → 直接赋 BindingValue
- 改值且值是字面量 → transform 中直接操作
- **改值且值是 DataBinding → 必须用 Value.computed()**

### 从简到繁的处理分类

### 3.1 简单透传（显式赋值，禁止兜底循环）

同名同类型，直接赋值。**必须逐项显式赋值**，每个 A2UI prop 一行 `if (...) outputProps[key] = props[key]`：

```ts
// ✅ 正确：逐项显式透传
if (props.maxLength !== undefined) outputProps.maxLength = props.maxLength
if (props.disabled !== undefined) outputProps.disabled = props.disabled
if (props.className) outputProps.className = props.className
```

**❌ 禁止用 `Object.entries(props)` 兜底透传**（即"非 SKIP_KEYS 即透传"的循环）：

```ts
// ❌ 错误 — 兜底透传会把目标库不支持的 prop 漏出去、覆盖已处理的 prop
const SKIP_KEYS = new Set(['value', 'placeholder', ...])
for (const [key, value] of Object.entries(props)) {
  if (!SKIP_KEYS.has(key)) outputProps[key] = value as PropValue
}
```

> **为什么禁止？** 实测此模式造成两类 bug：
> 1. **漏传目标库不支持的 prop**——如 Input 的 `prefix` 被透传给 eview-react TextField（TextField 仅支持 `suffix`）；Tag 的 `variant` 被透传给 eview-react Tag（Tag 用 `fill`，eview-ui bespoke 已映射为 className `filled`）。
> 2. **覆盖已处理的 prop**——兜底循环用原始 `props.className` 覆盖 `splitWidthToStyle` 拆出的 `remainCn`（宽度类回写外层 className）、用原始 `props.format` 覆盖 `convertFormat` 转换结果。
>
> A2UI 每个组件的 props 都是**封闭集合**（见对应 `md/a2ui/api/<分类>/<Component>.json` 的 `properties.props.properties`）。transform 应对照该集合逐项处理：透传 / 改名 / 值映射 / 丢弃（丢弃项配 `// xxx 丢弃（原因）` 注释），**不依赖兜底循环**。若某 prop 既未显式处理也未显式丢弃，它就不该出现在产物里——兜底循环只会把这种"漏网"prop 静默送进目标组件。

### 3.2 改名

A2UI 的 prop 名与 eview-react 不同。在 transform 中用新 key 赋值。

```ts
// A2UI: count → eview-react: content
if ('count' in props) {
  outputProps.content = props.count
}
```

### 3.3 值映射

A2UI 的枚举值与 eview-react 不同。

```ts
// A2UI: color: "processing" | "error" → eview-react: status: "default" | "danger"
const STATUS_MAP: Record<string, string> = {
  processing: 'default',
  error: 'danger',
}
if (props.color) {
  outputProps.status = STATUS_MAP[props.color] ?? props.color
}
```

### 3.4 默认值

组件始终需要的 prop，用 `defaults` 声明：

```ts
defaults: {
  hideTitleBar: true,
  enableMultiOpen: true,
}
```

`defaults` 在 transform **执行前** 填充到 `node.props`，transform **返回后** 也会再次兜底注入缺失字段。

### 3.4b className 输出别名（classNameProp）

目标组件库的某些组件接收的样式 prop 名不是 `className` 而是别名（如 `inputClassName`）。在 `MappingDef` 顶层声明 `classNameProp` 即可让 emit 时输出 `<别名={styles.id}>` 而非 `className={styles.id}`：

```ts
return {
  tag: 'TextField',
  import: `${pkg}/TextField`,
  classNameProp: 'inputClassName',   // ← emit 输出 inputClassName={styles.id}
  transform(node, ctx) {
    // className 照常显式赋值到 outputProps.className（不要改名！）
    const outputProps: Record<string, PropValue> = {}
    if (node.props.className) outputProps.className = node.props.className
    // …其余 A2UI prop 逐项显式处理（见 §3.1，禁止 Object.entries 兜底透传）
    return { props: outputProps }
  },
}
```

**⚠️ 为什么不能在 transform 里直接把 className 改名到 `outputProps.inputClassName`？**

style-converter 收集样式时固定读 `props.className`（挂 `.id` 选择器）。若改名，style-converter 读不到 → 样式规则丢；jsx-emitter 也不认别名 → 不挂 `styles.id` → 样式不生效。

`classNameProp` 的设计：**props 内部 key 仍是 `className`**（style-converter 照常收集），`classNameProp` 只作 emit 输出时的 key 别名。这样样式照常按 `.id` 收集，只改末端 emit 的输出 key。

- 仅影响该组件的 className 输出 key，不影响其他 prop、不影响样式收集
- `transform` 里 className 仍走显式赋值（`outputProps.className = props.className`），不需特殊处理
- 默认 `'className'`（不声明时行为不变）

### 3.5 icon 处理

A2UI 中的 icon 值（字符串）需要通过 `ctx.resolveIcon(iconName, iconProps?)` 解析为图标 `BuildNode`。

```ts
if (item.icon) {
  const iconNode = ctx.resolveIcon(item.icon)
  if (iconNode) {
    dataItem.icon = iconNode  // BuildNode 对象，jsx-emitter 会序列化为 <Icon.../>
  }
}
```

**`iconProps` 透传**（`resolveIcon` 第二参数，产出 IconPlus 的 props）：

| iconProps 字段 | IconPlus prop | 来源 / 说明 |
|----------------|---------------|------------|
| `color` | `iconColor=[color]`（数组） | A2UI Icon.color 枚举（default/info/error/...）**或**其他组件（如 Button）透传自己的 color；值范围以调用方为准，resolveIcon 不校验 |
| `className` | `className` | 图标 className |
| `shape` | `type`（outline→lined / fill→filled / square→square-bg / circle→round-bg） | **仅 A2UI Icon.shape**（outline/fill/square/circle）。⚠️ Button.shape（default/circle/round，按钮圆角）≠ Icon.shape，不能传给 resolveIcon |
| `iconSize` | `iconSize`（数字） | 图标像素尺寸；如 Button.size 枚举（large/medium/small）→ 数字（20/18/14）由调用方转换后传入 |

```ts
// Button icon-only → IconButton：把 icon 组件支持的 props 透传给 resolveIcon
const iconProps: Record<string, any> = {}
if (typeof props.color === 'string') iconProps.color = props.color   // 不转 status，直接给 icon
if (props.className) iconProps.className = props.className
if (node.id) iconProps.id = node.id  // CSS Modules 选择器键（icon className 编译，见 AGENTS §9.15）
const iconSize = sizeToIconSize(props.size)  // large→20 / medium→18 / small→14
if (iconSize !== undefined) iconProps.iconSize = iconSize
const iconProp = buildIconProp(props.icon, ctx, iconProps)  // 字面量 + DataBinding 都透传 iconProps
```

**普通 Button（icon + value）的 icon color 特化**（传给 resolveIcon，不转 status）：
- `types=link` → icon color=`brand`（resolveIcon 内部映射成品牌色 hex）
- `color` 为 `primary`/`danger`（实色背景）→ icon color=`#fff`（白图标）
- 其它 → 不传 color

> **注意**：`ctx.resolveIcon` 只有在 `TransformContext`（transform 阶段）上可用。在 `ComputedValue.transform` 内部需要使用 `ComputedTransformCtx.resolveIcon`（见 §5.3）。后续若要对 color 值做收敛/校验，需全局排查所有调用 `resolveIcon` / `ctx.resolveIcon` 的地方统一处理（来源不止 A2UI Icon schema）。

#### 3.5.1 eview-ui 的 icon-URL 边界（与 eview-react 不同）

上面 `resolveIcon → BuildNode` 的写法是 **eview-react** 的做法（图标是 React DOM，进 JSX）。**eview-ui 不适用**：`@cloudsop/eview-ui` 包组件的 icon 相关属性**只接 URL 字符串、不接 React DOM**。故映射到 `@cloudsop/eview-ui/...`（pkg）的组件，icon 一律产 URL 字符串，**不调 `resolveIcon`**。

当前阶段所有此类 icon 写死成统一占位 URL（常量 `PLACEHOLDER_ICON_URL = '/icons/placeholder.svg'`，见 [icon-placeholder.ts](../../api/config/mappings/eview-ui/icon-placeholder.ts)），不管输入是字面量图标名、DataBinding、还是 iconType 值——transform 产出的图标都是这个写死的字符串。涉及的 8 个 eview-ui 映射：

| 映射 | icon 字段 | 写法 |
|------|-----------|------|
| Input（本地副本） | `suffix` | `outputProps.suffix = PLACEHOLDER_ICON_URL`（有 icon 时） |
| Menu（本地副本） | Accordion `dataItem.icon` | `dataItem.icon = PLACEHOLDER_ICON_URL`（Tab 分支随 TabItem） |
| TabItem（本地副本） | `icon` | `outputProps.icon = PLACEHOLDER_ICON_URL`（有 icon 时） |
| Timeline（本地副本） | `item.icon`（自定义图标） | `item.icon = PLACEHOLDER_ICON_URL`；`iconType` 枚举（success/error/default）**保留**、不占位 |
| Tree（本地副本） | 节点 `icon` | `result.icon = PLACEHOLDER_ICON_URL`（递归 `normalizeTreeNode`；**字段名 `icon`，非 eview-react 的 `treeNodePrefix`**） |
| Button（bespoke） | `leftIcon`/`rightIcon` | `buildIconProp` 直接返回 `PLACEHOLDER_ICON_URL` |
| Dropdown（bespoke） | `Menu.Item` `icon` | 字面量 + LoopNode 模板两分支都 `icon = PLACEHOLDER_ICON_URL` |
| Steps（bespoke） | `iconUrl` | `dataItem.iconUrl = PLACEHOLDER_ICON_URL` |

**关键后果——`containsJSX` 翻 `false`**：eview-react 里 icon 的 DataBinding 走 `Value.computed({ ..., containsJSX: true, transform: resolveIcon })`（因为 transform 产 BuildNode/JSX）；eview-ui 改造后 transform 产字符串、无 JSX，故 `containsJSX` 必须置 `false`。这会改变循环 data 的分流（见 [scoped-enrichment](../../api/src/core/scoped-enrichment.ts) `enrichScopedData`）：`containsJSX:false` → data 走 **state.js 纯 JSON**（不再进文件单元 `enrichmentConsts` 内联 const）。改造时务必同步翻 `containsJSX`，否则 data 仍按 JSX 路径进 enrichmentConsts、但值是字符串 → 与预期不符。

**不在 icon-URL 改造范围**：`@/shared`（sharedPkg，Badge/Divider/Chart/Empty）的共享实现能接 React DOM icon，走 `resolveIcon` 不变；Tag 已从 shared 迁移为 bespoke（`@cloudsop/eview-ui/Tag`），icon 直接丢弃，不在 icon-URL 改造范围；Switch bespoke 已丢弃 checkedChildrenIcon/unCheckedChildrenIcon；DatePicker/Rate/Progress/TextArea bespoke 及所有复用工厂均不调 `resolveIcon`。Icon 组件本身按指示暂排除。

### 3.6 双向绑定（useState）

当 A2UI 的值需要转换为受控组件的 `useState` + 事件处理时，按值形态分叉：
- **字面量** → `Value.literal({ value, useState })`（初始值 hardcode，不进 state.js）
- **DataBinding** → `Value.computed({ path, useState, transform })`（path 直传，初始值从 state.js 取，无需 `ctx.resolveAbsoluteStateValue`）

以 DataBinding 形态为例（Menu 的 selectedKeys 是路径绑定数组，需取首项作单项受控值）：

```ts
// A2UI: selectedKeys: { path: "/menuSelectedKeys" }（数组）
// eview-react: selectedValue: string（单项，受控）
import { Value } from '../../../src/core/value'

// DataBinding → ComputedValue.useState（transform 取数组首项，path 直传，无需 resolveAbsoluteStateValue）
outputProps.selectedValue = Value.computed({
  path: sk.path,
  pathType: sk.pathType ?? 'absolute',
  accessPath: sk.accessPath,
  containsJSX: false,
  useState: {
    event: 'onClick',                                        // 事件 prop 名
    extractor: (setter) => `(node) => ${setter}(node.value)`, // 事件→setter 表达式
  },
  transform: (rawArray) => Array.isArray(rawArray) && rawArray.length > 0 ? rawArray[0] : '',
})
```

`propRoute` 声明该 prop 的路由位置：

```ts
return {
  props: outputProps,
  propRoute: { selectedValue: 'component-internal' },
  children: null,
}
```

> **`Value.literal()` 不参与 state.js 消费**——其值在编译期快照为初始值，运行时由 `useState` 维护。

> ⚠️ **事件名冲突陷阱：** `useState.event` 指定的 prop 名（如 `'onClick'`）会被管线自动注入为事件处理器。
>
> **不要再在 outputProps 里手动添加同名的事件 prop**，否则会**顶替** useState 生成的事件处理器，导致组件变成静态。
>
> ```ts
> // ❌ 错误：手动添加 onClick 占位，顶替了 useState 生成的事件
> outputProps.selectedIndex = Value.literal({
>   value: 0,
>   useState: { event: 'onClick', extractor: (s) => `(i) => ${s}(i)` },
> })
> outputProps.onClick = Value.rawExpr({ value: '(index) => {}' })  // ❌ 顶替！
>
> // ✅ 正确：useState 自动生成 onClick，不需要手动添加
> outputProps.selectedIndex = Value.literal({
>   value: 0,
>   useState: { event: 'onClick', extractor: (s) => `(i) => ${s}(i)` },
> })
> // 不再单独设置 outputProps.onClick
> ```
>
> **判定规则**：写出 `Value.literal({ useState: { event: 'XXX', ... } })` 后，**禁止**再写 `outputProps.XXX = ...`（任何形态，包括 rawExpr / literal / literal）。如果需要为同一个事件提供"无 useState 时的 fallback 占位"，应该放在 `if (!hasUseState)` 分支里。

### 3.6b ComputedValue.useState（DataBinding 受控组件）

当 DataBinding 的值需要编译期转换且同时触发 `useState` 时（典型场景：`Switch.value` 是路径绑定），使用 `Value.computed()` 并带上 `useState` 字段：

```ts
// A2UI: value: { path: "/switchVal" }（boolean）
// eview-react: toggled（boolean，受控）
import { Value } from '../../../src/core/value'

outputProps.toggled = Value.computed({
  path: val.path,
  pathType: val.pathType ?? 'absolute',
  accessPath: val.accessPath,
  containsJSX: false,
  useState: {
    event: 'onToggle',
    extractor: (setter) => `(checked) => ${setter}(checked)`,
  },
  transform: (rawValue) => !!rawValue,  // 保证 boolean 类型
})
```

生成的代码：

```jsx
// 绝对路径：值在 state.js 中
const { switchVal } = initialState;     // ← state-builder 写入 stateEntries
const [toggled, setToggled] = useState(switchVal);  // ← useState 初始值引用 state
<Switch toggled={toggled} onToggle={(checked) => setToggled(checked)} />

// 相对路径（循环模板内）：值在模板 data 解构中
const { ..., col5Value, ... } = data;
const [toggled, setToggled] = useState(col5Value);
<Switch toggled={toggled} onToggle={(checked) => setToggled(checked)} />
```

> **与 `LiteralValue.useState` 的差异：**
> - `LiteralValue.useState` — 初始值是编译期快照，硬编码在组件中
> - `ComputedValue.useState` — 初始值来自 `state.js`（绝对路径）或模板 `data` 解构（相对路径），初始值本身是一份引用

### 3.6c 事件 Action（setState）与共享响应式 state

A2UI 事件 prop（`onClick` / `onClose` 等）是 `Action = {action:'setState', args:{path,value}}`——事件触发时把 `value` 写入 state 的 `path`。管线采**方案 C 混合**：只有被 Action 改写的 path 走共享响应式 store，其余仍走 const 快照 / 局部 useState。

**映射侧只需两种处理模式：**

**模式一：事件触发组件（如 Button.onClick）——透传 ActionValue。** build-trees 已把 `{action,args}` 转成 `ActionValue`（type:'action'），mapping 直接透传：

```ts
// Button.ts：onClick 有 Action 则透传（emitValue 产 () => setSharedState(key,value)），无则占位
outputProps.onClick = ('onClick' in props ? props.onClick : null) ?? Value.rawExpr({ value: '(e) => {}' })
```

**模式二：受控开合组件（如 Drawer/Modal 的 open + onClose）——open 用 useState+extractor 自适应，onClose 不透传。** open 是 DataBinding，产生 `ComputedValue.useState`（event:onClose）：

```ts
// Drawer.ts：closeVal 取自 onClose Action.value（数据驱动），extractor 走 open 的 setter
const closeVal = (props.onClose as any)?.value ?? false
const extractor = (setter) => `() => ${setter}(${JSON.stringify(closeVal)})`
outputProps.visible = Value.computed({
  path: val.path, pathType: val.pathType ?? 'absolute', accessPath: val.accessPath,
  containsJSX: false,
  useState: { event: 'onClose', extractor },
  transform: (raw) => !!raw,
})
// onClose Action 丢弃：onClose 回调由 open 的 useState extractor 自动生成
```

**为何 onClose 不透传 ActionValue**：open.path 与 onClose.path 按协议一致（"typically same path"），extractor 走 open 的 setter 即写正确路径；且 `shared` 自适应——path 命中 eventMutatedPaths 时 setter 为 useSharedState setter（写共享 store，跨组件响应式），非共享时为局部 useState setter。ActionValue→setSharedState 只适用共享场景（非共享无 store），extractor 的 setter 自适应才覆盖两种。

**共享判定由管线自动完成**（不需 mapping 参与）：path 是某 Action 的 args.path → 共享。state-builder 给命中 eventMutatedPaths 的 binding/computed 打 `shared=true`；tree-finalizer 据 `shared` 自适应 emit（useSharedState vs 局部 useState / const 快照）。详见 AGENTS §23-27。

> ⚠️ **Action.value 暂只字面量**（true/false/字符串/数字）；不支持 toggle / 表达式 / DataBinding。**嵌套 path 共享不支持**——按协议共享 path 只在 state 顶层。

### 3.7 常规 JS 字面量 prop

直接赋值即可，管线会自动处理序列化：

```ts
outputProps.className = props.className  // string
outputProps.expanded = props.inlineCollapsed  // boolean
```

复杂嵌套对象也支持直接赋值：

```ts
outputProps.columns = [
  { key: 'name', title: '姓名', dataIndex: 'name' },
]
```

但注意：如果字面量值中包含 `BuildNode`（比如 icon 解析结果），则需要确保 `jsx-emitter` 能识别。`emitBuildNodeExpr` 会处理 `type === undefined && kind === 'component'` 的对象。

---

## 四、children 处理

### 4.1 吞噬 children

如果目标组件不使用 children（数据通过 props 传入），transform 返回 `children: null`：

```ts
return {
  props: outputProps,
  children: null,  // 吞噬原始 children
}
```

### 4.2 透传 children

如果需要保留原始 children：

```ts
return {
  props: outputProps,
  // 不返回 children → 管线使用原始 node.children
}
```

### 4.3 使用 ctx.resolveNode 展开子树

对于容器组件（如 Table），需要展开子树中的子组件：

```ts
transform(node, ctx) {
  const resolvedCells = cells.map(cell => ctx.resolveNode(cell))
  // resolvedCells 已被应用了子组件的 transform
}
```

`ctx.resolveNode` 是 NodeMapper 的 walkTree 一次调用——触发子树内所有组件的 transform 并返回已处理的节点。

### 4.4 Fragment + Node.text 包装（动态 JSX）

当组件的 tag 在编译期无法确定（如 Icon 的 name 是相对路径 DataBinding 时），需要用 `Fragment` 包裹一个 `TextNode`：

```ts
return {
  tag: 'Fragment',
  import: { source: 'react', named: true },   // ⚠️ 必须用 named
  children: [Node.text({ value: computedValue })],
  selfClosing: true,
}
```

- `computedValue` 必须是 `Value.computed({ containsJSX: true, ... })`——state-builder 编译期求值后分流到文件单元的 jsxLiteralConsts 或 enrichmentConsts
- `Fragment` 是 `react` 的**具名**导出（`import { Fragment } from 'react'`），不能写成字符串
- `TextNode.value` 当前支持 `string | BindingValue | ComputedValue` 三种类型
- 此模式适用于：动态图标（`<Icon name={relative binding}>`→`<Fragment>{<IconPlus... />}</Fragment>`）

---

## 五、ComputedValue 详解

这是映射文件中最复杂也最关键的部分。**ComputedValue 是在编译期执行的"数据转换函数"**，不产生运行时代码。

### 5.1 是否使用 ComputedValue — 强制判定

对映射文件中的**每一个 prop**，必须按以下判定树处理，**没有自由裁量空间**：

```
该 prop 是 DataBinding（type === 'binding'）吗？
  │
  ├─ 否 → 字面量分支
  │      transform 中直接处理：
  │      改名 / 值映射 / icon 解析（ctx.resolveIcon）/ default 填充
  │
  └─ 是 → DataBinding 分支
          ↓
          需要编译期改值吗？
          │
          ├─ 否（只需改名 / 改变结构）
          │    保持 BindingValue 原样，改 prop key 赋值
          │    例：outputProps.text = props.value
          │    ⚠️ 仅限**标量值**。若值是数组/集合（options/popItems/categoryOptions/items），
          │       即使无需 per-item 转换也走下方 ComputedValue 分支（见铁律 carve-out）
          │
          └─ 是（类型转换 / resolveIcon / enrichment / 计算 / 集合数组兜底）
                ↓
               必须使用 Value.computed()
               转换结果包含 BuildNode 吗？
                 ├─ 是 → containsJSX: true
                 │      （结果分流到文件单元 jsxLiteralConsts，
                 │       生成 const 变量 → JSX 表达式）
                 └─ 否 → containsJSX: false
                        （结果合并到 state.js；集合数组兜底 `Array.isArray ? : []` 走此）
```

**理解测试**（在继续之前必须能正确回答）：

| 场景 | DataBinding？ | pathType | 需编译期改值？ | 处理方式 |
|------|-------------|----------|--------------|---------|
| Button.value（`{ "path": "/username" }`）→ text | ✅ | absolute | ❌（只改名） | BindingValue 直接赋值 |
| Button.value（`{ "path": "userName" }`）→ text | ✅ | relative | ❌（只改名） | BindingValue 直接赋值 |
| Button.icon（字面量 `"search"`） | ❌ | — | — | `ctx.resolveIcon("search")` |
| Button.icon（`{ "path": "/pageIcon" }`） | ✅ | absolute | ✅（字符串→BuildNode） | `Value.computed({ containsJSX: true, transform: ... })` |
| Button.icon（`{ "path": "rowIcon" }`，循环内） | ✅ | relative | ✅（字符串→BuildNode） | `Value.computed({ containsJSX: true, pathType: 'relative', transform: ... })` |
| Accordion.items（`{ "path": "/menuData" }`） | ✅ | absolute | ✅（数组每项 icon→BuildNode） | `Value.computed({ containsJSX: true, transform: ... })` |
| SearchInput.popItems（`{ "path": "/suggestions" }`） | ✅ | absolute | ✅（数组兜底，即便无需 per-item 转换） | `Value.computed({ containsJSX: false, transform: Array.isArray ? : [] })` |

### 5.2 核心接口

```ts
interface ComputedValue {
  type: 'computed'
  path: string          // A2UI 原始路径
  pathType: 'absolute' | 'relative'
  accessPath: string    // 编译后路径，也是最终变量的名字
  containsJSX: boolean  // 转换结果中是否含有 BuildNode（JSX 元素）
  transform: (rawValue: any, ctx?: ComputedTransformCtx) => any
}
```

### 5.3 containsJSX: true 的完整含义

当翻 `containsJSX: true` 时：

1. **state-builder 阶段** 调用 `transform` 求值
2. 结果**不进入 `state.js`**，而是存入当前文件单元的 `jsxLiteralConsts`
3. 文件顶部生成 `const {accessPath} = ...` 声明（含转换后的 JSX 元素）
4. `accessPath` 就是最终代码中的变量名

**典型场景**：Menu 的 items 是路径绑定，内部 icon 需解析为 BuildNode：

```ts
outputProps.data = Value.computed({
  path: props.items.path,               // 原始路径，如 "/menuItems"
  pathType: props.items.pathType ?? 'absolute',
  accessPath: props.items.accessPath ?? 'menuData', // 变量名
  containsJSX: true,                     // ✅ 因为 icon 解析产 BuildNode
  transform: (rawItems, cvCtx) => {
    const itemsArray = Array.isArray(rawItems) ? rawItems : []
    // cvCtx.resolveIcon 是 ComputedTransformCtx 提供的图标解析
    const rIcon = cvCtx?.resolveIcon ?? ctx.resolveIcon
    return convertMenuItems(itemsArray, openKeySet, rIcon)
  },
})
```

生成的代码：

```jsx
// 文件顶部 const 区域
const menuItems = [
  { title: '仪表盘', value: 'dashboard', icon: <IconPlusIcIctLayoutDashboard /> },
  { title: '工作台', value: 'workspace', icon: <IconPlusIcIctBriefcase /> },
]

// 组件内
<Accordion data={menuItems} ... />
```

### 5.4 containsJSX: false 的路径

当转换结果不含 JSX 时，结果为纯数据，合并到 `state.js`：

```ts
Value.computed({
  path: '/config',
  accessPath: 'config',
  containsJSX: false,  // ✅ 纯数据
  transform: (raw) => ({ ...raw, processed: true }),
})
```

### 5.5 ComputedTransformCtx 可用 API

在 `ComputedValue.transform` 的回调中，第二个参数 `cvCtx` 提供：

| API | 说明 |
|-----|------|
| `cvCtx.rawState` | 页面原始 state |
| `cvCtx.resolveValueFromPath(path)` | 按路径取值（绝对/相对均支持，相对路径沿 loopScope 链解析） |
| `cvCtx.resolveIcon(name, props?)` | 图标名称 → BuildNode |

> ⚠️ **重要**：在 ComputedValue.transform 内部，`ctx`（外层的 TransformContext）**不可用**。必须使用 `cvCtx` 来调用 `resolveIcon` 和 `resolveValueFromPath`。
>
> 如果需要在两者之间 fallback：`const rIcon = cvCtx?.resolveIcon ?? ctx.resolveIcon`

### 5.6 字面量 vs ComputedValue 的分叉

有时 A2UI 的同一个 prop 可能是字面量也可能是路径绑定。映射文件需要做**分叉处理**：

```ts
const itemsIsBinding = props.items?.type === 'binding'

if (itemsIsBinding) {
  // 路径绑定 → ComputedValue（编译期转换 + 含 JSX 分流）
  outputProps.data = Value.computed({ /* ... */ })
} else {
  // 字面量 → 直接转换
  outputProps.data = convertMenuItems(
    Array.isArray(props.items) ? props.items : [],
    openKeySet,
    ctx.resolveIcon,
  ) as any
}
```

---

## 六、完整示例：Menu → Accordion / Tab

> 注：A2UI Menu 映射支持两个分支——`mode=horizontal` 时映射为 **Tab** 组件（items → TabItem children），其他情况映射为 **Accordion** 组件（items → data prop）。本示例以非 horizontal（Accordion）分支详解，完整代码见 `api/config/mappings/eview-react/Menu.ts`。
>
> **horizontal→Tab 分支的 DataBinding items**：items 是路径绑定时，TabItem 模板按样本数据条件绑定字段——`label` 必绑，`icon` 仅当样本 items 任一项含 `icon` 字段时才绑（`sampleItems.some(it => 'icon' in it)`），避免无 icon 数据时 emit 游离的 `icon={null}`。字面量 items 分支按 `item.icon !== undefined` 逐项判断。

### 6.1 输入分析

**A2UI Menu（来自 Schema + Example）：**

```json
{
  "component": "Menu",
  "props": {
    "mode": "vertical",
    "inlineCollapsed": false,
    "selectedKeys": { "path": "/selectedMenuKeys" },
    "openKeys": { "path": "/openMenuKeys" },
    "items": { "path": "/menuItems" },
    "className": "h-full w-64"
  }
}
```

- `items`：菜单数据数组（`[{ title, key, icon?, children? }]`），可能是字面量或路径绑定
- `selectedKeys`：选中项 key 数组，可能是字面量或路径绑定
- `openKeys`：展开项 key 数组，可能是字面量或路径绑定
- `inlineCollapsed`：折叠状态
- `mode`：布局模式

**eview-react Accordion（来自 eview-react 文档）：**

| Prop | 类型 | 说明 |
|------|------|------|
| `data` | `dataItem[]`（必填） | 菜单数据结构：`{ title, value, icon?, children?, isExpand? }` |
| `selectedValue` | `string` | 选中值（单项） |
| `expanded` | `boolean` | 折叠状态 |
| `hideTitleBar` | `boolean` | 隐藏标题栏 |
| `enableMultiOpen` | `boolean` | 多开 |
| `enableExpand` | `boolean` | 可折叠 |
| `hideIcons` | `boolean` | 隐藏图标 |
| `onClick` | 事件 | 点击回调 |

### 6.2 Props 对照表

| A2UI | eview-react | 处理方式 |
|------|-------------|---------|
| `items`（字面量） | `data` | 直接转换：`convertMenuItems` |
| `items`（路径绑定） | `data` | **ComputedValue**：编译期转换 + containsJSX:true |
| `selectedKeys`（字面量数组） | `selectedValue` | 数组首项 → `LiteralValue.useState` + `onClick` |
| `selectedKeys`（DataBinding） | `selectedValue` | `ComputedValue.useState`（transform 取首项，path 直传） |
| `openKeys` | `dataItem[i].isExpand` | items 是 DataBinding 时挪进 transform 用 `cvCtx.resolveValueFromPath`；items 字面量时 `ctx.resolveAbsoluteStateValue`（顶层绝对路径） |
| `inlineCollapsed` | `expanded` | 1:1 透传 |
| `mode` | — | horizontal 走 Tab 分支；其余走 Accordion |
| `className` | `className` | 透传 |
| — | `hideTitleBar` | transform 内加，默认 `true` |
| — | `enableMultiOpen` | transform 内加，默认 `true` |
| — | `enableExpand` | transform 内加，默认 `false` |
| — | `hideIcons` | transform 内加，默认 `true` |

### 6.3 Children

Accordion 数据通过 `data` prop 传入，不需要 children。transform 返回 `children: null`。

### 6.4 propRoute

`selectedValue` 是组件内部 `useState` 维护的状态，路由为 `'component-internal'`。

---

## 七、七步检查清单

生成映射文件后 LLM 自行验证：

- [ ] 是否已阅读 A2UI Schema、A2UI Example、eview-react 三份文档？
- [ ] 方案是否已经过确认？
- [ ] **A2UI Schema 中每个支持 DataBinding 的 prop 是否已做好双形态分叉（字面量 + 路径绑定）？**
- [ ] `tag` 是否与 eview-react 组件名一致？
- [ ] `import` 路径是否与 eview-react 文档一致？
- [ ] eview-react 必填 props 是否都已覆盖？
- [ ] 每个 A2UI prop 的处理方式是否有明确结论（透传/改名/值映射/丢弃/复杂转换）？
- [ ] **是否用了 `Object.entries(props)` 兜底透传循环？** 禁止——对照 A2UI schema 封闭集合逐项显式处理（见 §3.1），避免漏传目标库不支持的 prop 或覆盖已处理的 prop
- [ ] **每个 DataBinding prop 的处理方式是否遵循"铁律"？** 只改名→BindingValue 原样；需改值→Value.computed()
- [ ] **DataBinding 的值是数组/集合（options/popItems/categoryOptions/items）吗？** 即便只需改名也**必须**用 `Value.computed({ containsJSX: false, transform: (raw) => Array.isArray(raw) ? raw : [] })`，**不能 raw 透传**（见铁律 carve-out）；标量值（placeholder/选中值/text）才可 raw 透传
- [ ] 路径绑定的数据是否需要编译期转换？→ **必须**用 `Value.computed()`（禁止在 transform 中用 `ctx.resolveAbsoluteStateValue` 取值处理）
- [ ] ComputedValue 的转换结果是否含 JSX（BuildNode）？→ `containsJSX: true`
- [ ] 是否需要双向绑定（useState）？→ 用 `LiteralValue.useState`
- [ ] **是否手动添加了与 `useState.event` 同名的事件 prop？** 如果是，删除——会被自动生成的事件顶替
- [ ] icon 是否通过 `ctx.resolveIcon` 或 `cvCtx.resolveIcon` 处理？
- [ ] 丢弃的 A2UI prop 是否配了 `// xxx 丢弃（原因）` 注释（而非静默靠 SKIP 跳过）？
- [ ] `accessPath` 是否使用了原始绑定的 `props.X.accessPath`（而非硬编码）？
- [ ] 已在 `api/config/mappings/eview-react/index.ts` 中注册？
- [ ] **映射文件头部 JSDoc 的 Props 对照表是否与代码实现一致？** 逐行核对，增/删/改一个 prop 处理方式都必须同步更新表格
- [ ] **已经使用 `useState` 的 DataBinding 是否需要切换为 `Value.computed.useState` 而非 `Value.literal.useState`？** 只有字面量初始值用 literal，DataBinding 路径用 computed
- [ ] **使用了 `tag: 'Fragment'`？** `import` 必须是 `{ source: 'react', named: true }`（具名导出），不是 `'react'`
- [ ] 运行 `npx tsc --noEmit` 无类型错误？

---

## 八、常见错误与陷阱

### ❌ 不处理 props 双形态（字面量 + 路径绑定）

A2UI 的 props 可同时存在字面量和路径绑定两种形态。映射必须覆盖两种：

```ts
// ❌ 只处理了字面量
outputProps.data = convertMenuItems(props.items)

// ✅ 分叉处理
if (props.items?.type === 'binding') {
  outputProps.data = Value.computed({ /* ... */ })
} else {
  outputProps.data = convertMenuItems(props.items)
}
```

**判断哪些 prop 需要分叉**：看 A2UI JSON Schema 中哪些 prop 使用了 `"oneOf"` + `"$ref": "#/$defs/DataBinding"`。

### ❌ 用 `Object.entries(props)` 兜底透传

"非 SKIP_KEYS 即透传"的兜底循环会把目标库不支持的 prop 漏出去（如 Input `prefix`→TextField、Tag `variant`→Tag（eview-ui bespoke 已映射为 className `filled`）），也会用原始值覆盖已处理的 prop（如 `splitWidthToStyle` 拆出的 className、`convertFormat` 转换的 format）。详见 §3.1。对照 A2UI schema 封闭集合逐项显式处理，丢弃项配注释。

### ❌ 不看 eview-react 文档就写

后果：猜错目标组件 prop 名、类型、必填项，生成的映射文件不能用。

### ❌ 在 transform 中直接修改原始 node.props

```ts
// ❌ 错误：会污染原始节点
delete node.props.mode

// ✅ 正确：拷贝后操作
const props = node.props || {}
const outputProps: Record<string, PropValue> = {}
// ... 操作 outputProps
```

### ❌ ComputedValue 内使用外层 ctx

```ts
// ❌ 错误：transform 回调中 ctx 不可用
Value.computed({
  transform: (raw) => {
    ctx.resolveIcon(...)  // ctx is not in scope here!
  },
})

// ✅ 正确：使用 cvCtx 或闭包捕获
Value.computed({
  transform: (raw, cvCtx) => {
    const rIcon = cvCtx?.resolveIcon ?? ctx.resolveIcon
  },
})
```

### ❌ containsJSX 误判

```ts
// ❌ 错误：转换结果含 BuildNode 但写了 containsJSX: false
// 后果：BuildNode 被序列化到 state.js，导致 JSX 出现在纯数据文件中

// ✅ 只要转换结果里有 BuildNode（resolveIcon 产物），就写 true
containsJSX: true,
```

### ❌ accessPath 硬编码 / 自行构造

```ts
// ❌ 错误 1：硬编码固定值，多实例时变量名冲突
accessPath: 'menuData',

// ❌ 错误 2：自行拼接构造变量名，脱离原始绑定
accessPath: `${nodeId}Icon`,
accessPath: `${componentName}${propKey}`,

// ✅ 正确：使用原始绑定的 accessPath，只透传，不篡改
accessPath: props.items.accessPath,

// 只有原始 binding 的 accessPath 唯一确定变量名。
// 一个页面可能有多个 Button/Menu，accessPath 由 BuildTrees 保证唯一性。
// 任何在 transform 中自行构造 accessPath 的行为都会破坏命名一致性。
```

> 仅在路径绑定分支（`type === 'binding'`）有 `accessPath`。字面量分支不存在此问题。

### ❌ 不处理分叉情况

A2UI 的 props 可能同时存在字面量和路径绑定两种形态。映射必须覆盖两种：

```ts
if (props.items?.type === 'binding') {
  // 路径绑定 → ComputedValue
} else {
  // 字面量 → 直接转换
}
```

### ❌ 在 transform 中用 ctx.resolveAbsoluteStateValue 代替 ComputedValue

这是 **LLM 最容易犯的错误**——因为直观上"先取值再转换"看起来更简单。

```ts
// ❌ 错误：跳过了 ComputedValue 管线（绝对路径也一样错）
const iconName = ctx.resolveAbsoluteStateValue(props.icon.path)
outputProps.leftIcon = ctx.resolveIcon(iconName)

// 后果：containsJSX 分流失效、无法 per-item 处理（绝对路径只取一次值，相对路径不支持）
```

相对路径场景下 `ctx.resolveAbsoluteStateValue` 直接返回 undefined（**组件 transform 不支持相对路径**，相对路径必须走 ComputedValue）：

```ts
// ❌ 错误（相对路径版本）：ctx.resolveAbsoluteStateValue 不支持相对路径，返回 undefined
const iconName = ctx.resolveAbsoluteStateValue(props.icon.path) // path="itemIcon" 相对路径 → undefined
outputProps.rightIcon = ctx.resolveIcon(iconName) // iconName=undefined，失败
```

**何时可用 `ctx.resolveAbsoluteStateValue`**：仅用于 transform 的**绝对路径**辅助决策（如 Menu 顶层 openKeys），不作为 DataBinding 值的转换手段。

```ts
// ✅ 可以：用于绝对路径辅助决策（读取 state 算闭包）
const rawOpenKeys = ctx.resolveAbsoluteStateValue(props.openKeys.path) ?? []
const openKeySet = new Set(rawOpenKeys) // 算一个 Set 供 ComputedValue.transform 闭包使用

// ✅ 正确：DataBinding 的值转换本身还是走 ComputedValue
outputProps.data = Value.computed({
  path: props.items.path,
  pathType: props.items.pathType,       // 透传原始 pathType（可能是 absolute 或 relative）
  containsJSX: true,
  transform: (rawItems, cvCtx) => {
    const rIcon = cvCtx?.resolveIcon ?? ctx.resolveIcon
    return convertMenuItems(rawItems, openKeySet, rIcon)
  },
})
```

**判定规则**：`ctx.resolveAbsoluteStateValue` 的结果不直接进入 outputProps，它就一定是辅助用途，可以放心用（仅绝对路径）。反之，如果结果要赋值给 outputProps 的某个 prop，就**必须**用 ComputedValue。相对路径的辅助决策应挪进 `ComputedValue.transform` 用 `cvCtx.resolveValueFromPath`。

### ❌ 集合/数组 DataBinding raw 透传（漏 ComputedValue）

铁律"只需改名 → BindingValue 原样"**只对标量值**。数组/集合 DataBinding（`options`/`popItems`/`categoryOptions`/`items`）即便 item 形状与目标组件一致、无需 per-item 转换，也**必须**用 `Value.computed({ containsJSX: false, transform })`——否则路径缺失/非数组时 emit `prop={undefined}`（无兜底），且无法 per-item 转换（icon→BuildNode、`label`→`text`、循环 enrichment）。

```ts
// ❌ 错误：数组 DataBinding raw 透传（SearchInput.popItems / CategoryInput.categoryOptions 旧 bug）
if ('popItems' in props) {
  outputProps.popItems = props.popItems  // 路径缺失时 popItems={undefined}；无法 per-item 转换
}

// ✅ 正确：数组 DataBinding → ComputedValue(containsJSX:false) + 防御兜底
if ('popItems' in props) {
  const items = props.popItems
  if (items && typeof items === 'object' && items.type === 'binding') {
    outputProps.popItems = Value.computed({
      path: items.path, pathType: items.pathType ?? 'absolute', accessPath: items.accessPath,
      containsJSX: false,
      transform: (rawItems) => (Array.isArray(rawItems) ? rawItems : []),
    })
  } else if (Array.isArray(items)) {
    outputProps.popItems = items as any  // 字面量数组原样直传
  }
}
```

标量值 DataBinding（`placeholder`、`Button.value`→`text`、`CategoryInput.category` 选中值）仍可 raw 透传。详见铁律 carve-out + [Select.ts](../../api/config/mappings/eview-react/Select.ts) `options` / [SearchInput.ts](../../api/config/mappings/eview-react/SearchInput.ts) `popItems` / [CategoryInput.ts](../../api/config/mappings/eview-react/CategoryInput.ts) `categoryOptions`。

---

## 九、RenderFn 作用域与 Scoped Enrichment（2026-07-17 新增）

### 9.1 RenderFnParam（结构化形参）

`RenderFnValue.params` 已改为结构化类型 `RenderFnParam[]`，不再使用裸字符串：

```ts
interface RenderFnParam {
  name: string                        // 形参名
  dataSource?: BindingValue           // 可选：数据源参数
}
interface RenderFnValue {
  type: 'renderFn'
  params: RenderFnParam[]             // 形参声明（结构化）
  body: BuildNode | BuildNode[]
  route?: ExtractRoute
}
```

例：Table 列定义中的 `render`：

```ts
render: Value.renderFn({
  params: [
    { name: 'cellValue' },                          // 普通运行时参数
    { name: 'rowData' },                            // 普通运行时参数
    { name: 'options' },                            // 普通运行时参数
    { name: 'row', dataSource: dsBinding, dataField: 'rawData' },  // 数据源参数（row.rawData = 当前行数据）
  ],
  body: cell,
})
```

`dataSource` + `dataField` 声明了"数据在 param 的哪个嵌套字段"——state-builder 据此建立 `RenderFnScope`，jsx-emitter 据此生成 `const { x, y } = row.rawData`；body 内相对 binding 沿此作用域解析。不提供 `dataField` 时解构源 = param name（如 `rowData`）。

### 9.2 buildRenderFn 辅助函数

```ts
import { buildRenderFn } from '../../../src/core/scopedEnrichment'

buildRenderFn(body, [
  { name: 'cellValue' },
  { name: 'rowData' },
  { name: 'options' },
  { name: 'row', dataSource: binding, dataField: 'rawData' },
])
```

等价于 `Value.renderFn`，推荐映射文件中使用。

### 9.3 enrichScopedData（循环数据 enrichment）

对于"循环数据源 → data prop + render fn"映射模式（如 Table/TableRow），使用 `enrichScopedData` 收集 body 内 relative ComputedValue，对数据源做整体 enrichment：

```ts
import { enrichScopedData, buildRenderFn } from '../../../src/core/scopedEnrichment'

const dataset = enrichScopedData(dataBinding, resolvedCells)
//                        ↑ BindingValue    ↑ nodes with relative CVs

const columns = resolvedCells.map(cell => ({
  render: buildRenderFn(cell, [
    { name: 'cellValue' },
    { name: 'rowData' },
    { name: 'options' },
    { name: 'row', dataSource: dataBinding, dataField: 'rawData' },
  ]),
}))
```

`enrichScopedData` 返回的 `ComputedValue` 具有 `containsJSX: true`（若 body 中有含 JSX 的 CV），state-builder 自动将其归入文件单元的 `jsxLiteralConsts`，在文件顶部生成 `const dataset = [...enrichedData];`。

> **嵌套循环（循环套循环）已支持**：`enrichScopedData` 用 `collectRelativeCVsDeep` 深入 cells 内嵌套 LoopNode 的 template body 收集 CV（带 `loopChain`），transform 沿链逐层 map 应用到 `row.innerArr[i]`（如 `row.actions[i].icon = resolveIcon(...)` → BuildNode）。故 Table 列 render fn body 内的 DataBinding-children 循环（如 actions 列）会被正确纳入 dataset enrichment——dataset `containsJSX` 为真、进文件单元、render fn 内循环 emit 为 inline（`{(actions||[]).map((item)=>{const{icon}=item;return <IconButton iconName={icon} .../>})}`），`item.icon` 即编译期解析的 BuildNode。映射侧无需特殊处理，正常 `enrichScopedData + buildRenderFn` 即可。

---

## 十、参考索引

| 想看什么 | 看哪个文件 |
|---------|-----------|
| 映射文件完整示例（不含 Table） | `api/config/mappings/eview-react/Menu.ts` |
| Table 映射示例（含 enrichScopedData + buildRenderFn） | `api/config/mappings/eview-react/Table.ts` |
| **bespoke 映射**（目标库 API 差异、独立 `MappingDef` 非工厂） | `api/config/mappings/eview-ui/*.ts`（DatePicker/Rate/Switch/TextArea/Button/Steps/Progress/Dropdown/Tag/Popover） |
| **构造组件子树作 prop 值**（如 `<DropDown overlay={<Menu><Menu.Item/>...</Menu>}>`） | `api/config/mappings/eview-ui/Dropdown.ts`（emitBuildNodeExpr 已支持 children，见 AGENTS §9.10） |
| **对象属性值位置上的 BuildNode**（`col.filter.component = Node.component(...)`，非顶层 prop；import-collector 递归 `Object.entries` 收集 import） | `api/config/mappings/eview-react/Table.ts`（§6.11 filters→filter） |
| 类型接口定义（含 RenderFnParam） | `api/src/core/value-types.ts` |
| TransformContext / TransformResult | `api/src/core/component-mapping.ts` |
| Value.* 工厂 | `api/src/core/value-factory.ts` |
| Node.* 工厂 | `api/src/core/node-factory.ts` |
| Scoped Enrichment 工具（enrichScopedData / buildRenderFn） | `api/src/core/scoped-enrichment.ts` |
| 架构设计 | `docs/ARCHITECTURE.md`（§3-§4-§10-§11-§12） |
| A2UI JSON 结构 | `md/a2ui/json-structure.md` |
