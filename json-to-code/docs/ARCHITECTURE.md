# A2UI → React 代码生成管线 · 架构文档

> 基于 `d:\code\json-to-code` 项目，将 A2UI 设计规范 JSON 转换为 React 前端代码。支持多目标组件库（`eview-react`、`eview-ui`），默认 `eview-react`。

---

## 一、管线总览

### 1.1 八步管线

```
Step 1: RegisterComponents    加载组件映射（MappingDef）
Step 3: BuildTrees            建树 + Binding 打标 + ExtractNode 构建 + icon 收集（单次遍历）
Step 4: NodeMapper            调 registry.transform（纯形状变换，不收集数据）
Step 5: FileGenerator         state-builder 走树消费 + tree-finalizer + 样式提取（tree-finalizer 后）+ jsx-emitter + file-assembler
Step 6: GenerateRoutes        路由配置
Step 7: WriteOutput           写入目录结构
Step 7b: GenerateThemeConfig  生成 src/theme/config.ts（DEFAULT_THEME = ctx.theme；调用方保证目标库模板目录含 src/theme/useTheme.tsx）
Step 8: GenerateReport        报告
```

> 无 Step 2——`downloadHuiCode` 入口直接做 input → pagesData 转换，caller 自行读文件系统。
> 无独立 GenerateStyles——样式提取在 FileGenerator 内、tree-finalizer 之后跑（用 `finalResult.extractedFiles`，已过滤被 mapping 消化/force-inline 的循环模板，避免孤儿 .less）。

### 1.2 目录结构

```
src/pages/{pageName}/
  ├── index.jsx                     ← 主树页面
  ├── state.js                      ← 页面级数据源
  ├── modules/                      ← purpose: 'module' 的抽取
  │   └── {ComponentName}.jsx
  ├── components/                   ← purpose: 'component' 的抽取（循环模板/slot）
  │   └── {ComponentName}.jsx
  └── styles/                       ← 该页所有样式
      ├── {ComponentName}.less
      └── {pageName}.less
```

> **文件命名一律 kebab-case**：`api/src` 下所有 `.ts` 用 kebab（`state-builder.ts` / `access-path.ts` / `build-trees.ts`），单 word 小写（`node.ts`/`value.ts`/`step.ts`/`pipeline.ts`）。新增文件沿用 kebab；映射文件例外（`api/config/mappings/{lib}/{Component}.ts` 按组件名 PascalCase）。import 路径须与文件名大小写一致（不一致在 Windows 不报错，但 CI/excode typecheck 报 TS1261）。变量名仍用 camelCase（见 §11.3），与文件命名分开。

### 1.3 核心原则

| 原则 | 说明 |
|------|------|
| **两分法** | 节点体系（`kind`）和值类体系（`type`）两个正交维度 |
| **万物都是对象** | children 中无裸字符串，TextNode 显式化 |
| **渐进填充** | BuildTrees → NodeMapper → FileGenerator，同一节点不断补全 |
| **三路由** | inline / module-top / component-internal，统一 `ExtractRoute` 字段 |
| **无 A2UINode 中间层** | BuildTrees 产出的就是 typed nodes |

### 1.4 当前实现位置

- 架构目录：`api/`（`./index.ts` 暴露 `downloadHuiCode`）
- 调试入口：`cli.ts`（根目录，`npx tsx cli.ts`）
- 文档：`docs/ARCHITECTURE.md`（本文件）

### 1.5 实施进度

| Step | 状态 | 文件 |
|------|------|------|
| 1. RegisterComponents | ✅ | `api/src/steps/register-components.ts` |
| 3. BuildTrees | ✅ | `api/src/steps/build-trees.ts` |
| 4. NodeMapper | ✅ | `api/src/steps/node-mapper.ts`（纯 transform；`ctx.resolveNode` 展开子树；`ctx.resolveAbsoluteStateValue` 仅绝对路径） |
| 5. FileGenerator | ✅ | `api/src/steps/file-generator.ts` + `api/src/codegen/{state-builder,tree-finalizer,import-collector,jsx-emitter,file-assembler,style-converter}.ts`（样式提取在 tree-finalizer 后，见 §1.1） |
| 6. GenerateRoutes | ✅ | `api/src/steps/generate-routes.ts` + `api/src/codegen/route-generator.ts` |
| 7. WriteOutput | ✅ | `api/src/steps/write-output.ts` |
| 7b. GenerateThemeConfig | ✅ | `api/src/steps/generate-theme-config.ts`（生成 `src/theme/config.ts`，内容 `DEFAULT_THEME = ctx.theme`） |
| 8. GenerateReport | ✅ | `api/src/steps/generate-report.ts` + `api/src/codegen/report-generator.ts`（产物不生成 md 文件，仅 console.log） |

实际流水线 8 步（RegisterComponents / BuildTrees / NodeMapper / FileGenerator / GenerateRoutes / WriteOutput / GenerateThemeConfig / GenerateReport）。

辅助模块（全部完成）：
- `api/src/core/value-types.ts` — 值类接口（含 `UseStateMarker` / `LiteralValue`）
- `api/src/core/node-types.ts` — 节点接口（含 `LoopScope`）
- `api/src/core/component-mapping.ts` — 映射定义 + TransformContext（含 `resolveNode`、`resolveAbsoluteStateValue`）
- `api/src/core/value-factory.ts` — 值类工厂（含 `Value.binding()` / `Value.literal()` / `Value.computed()` / `Value.renderFn()` 等）
- `api/src/core/node-factory.ts` — 节点工厂（含 `Node.component()` / `Node.html()` / `Node.text()` / `Node.loop()` / `Node.extract()`）
- `api/src/core/component-registry.ts` — 组件注册中心
- `api/src/core/icon-props.ts` — 图标属性映射表
- `api/src/core/icon-collection.ts` — 图标收集 + API 解析 + resolveIcon；模块级 `iconPkg`（`setIconPackage`/`getIconPackage`）由 RegisterComponents 按目标库注入，决定图标 import 源（eview-react→`@nce/icon-plus`、eview-ui→`@hui/icon-plus`）
- `api/src/core/file-keys.ts` — 文件单元 key 工具（state-builder / tree-finalizer / file-assembler 三处共用）
- `api/src/core/access-path.ts` — accessPath 语义收拢（`isFlatAccessPath` / `stateRef` / `jsxConstName` / `computedJsxConstName` / `makeEnrichmentConstName`，详见 §3.9）；state-builder / tree-finalizer / jsx-emitter / file-assembler 共用，避免各消费者 flat-only 假设在嵌套路径上翻车
- `api/src/core/state-path.ts` — 数据路径段/访问器操作（`pathToSegments` / `resolveBySegments` / `parseAccessors` / `setNested`）；build-trees / state-builder / scoped-enrichment 共用，原各处 inline 重复（10 份）已合并
- `api/src/core/step.ts` — 步骤基类
- `api/src/pipeline/pipeline.ts` — 管线引擎
- `api/src/pipeline/pipeline-context.ts` — 上下文（`MappedPage`：pageName/state/rootTree/extracts/iconNameMap）
- `api/index.ts` — 入口

`api/templates/` — Vite 模板（index.html / package.json / vite.config.js / src/App.jsx / src/main.jsx / src/styles/global.less）。

state-builder 走树消费 binding/computed（详见 §10）。

### 1.6 端到端产物（npx tsx cli.ts）

```
output/                                                  ← 纯净项目代码，无 manifest 文件
  index.html / package.json / vite.config.js             ← templates
  src/
    main.jsx / App.jsx / styles/global.less             ← templates
    routes/index.jsx                                    ← Step 6
    pages/<rootId>/                                     ← Step 5 (来自 mergedA2UI.rootId)
      index.jsx                                         ← Step 5 (主)
      state.js                                          ← Step 5 (state-builder)
      modules/{PascalName}.jsx                          ← Step 5 (extracts, purpose='module')
      components/{PascalName}Template.jsx               ← Step 5 (extracts, purpose='component')
      styles/{PascalName,...}.module.less                ← Step 5（FileGenerator 内样式提取）
```

CLI 控制台额外打印 markdown 报告（不落盘）：
```
──────── 生成报告 ────────
# 生成报告
> 生成时间：...
## 概览 ...
## 详细结果 ...
──────── /生成报告 ────────
```

### 1.7 关键开关（统一在 `api/index.ts` 的 config 对象里手动切换）

| 文件 | config 字段 | 默认 | 翻 false 后效果 |
|------|------|------|---------------|
| [api/index.ts](api/index.ts) | `config.id` | true | 标签不带 `id="..."`，传导给 jsx-emitter `EmitOptions.emitId`，**className 不受影响**。**例外**：被 Anchor `items[].href="#xxx"` 引用的目标元素经 BuildTrees 预扫打 `keepId`，`config.id=false` 时仍输出 id（见 §7.5） |
| [api/index.ts](api/index.ts) | `config.css` | true | 改出 `*.less`（非 `.module.less`），JSX 用字符串 className 而非 `styles.X` |
| [api/index.ts](api/index.ts) | `config.templateDir` | `'./templates'` | 见下方 §1.7.1 专节（**重要约定，禁止随意更改**） |

---

#### 1.7.1 ⚠️ `templateDir` 模板目录解析（重要约定 —— 禁止随意更改）

> **🚫 本节涉及的 `templateDir` 解析逻辑、`resolveTemplateDir`、`HuiCodeOptions.templateDir`、回退路径 `../../src/excode/templates`、Electron 打包传 `process.resourcesPath/hui-templates` 的对接方式，是管线与 Electron 工程的集成契约，经过专门设计。**
>
> **任何 LLM/Agent 不得擅自修改本节描述的任何一项（解析顺序、默认值、回退路径、options 字段名、与 IPC 的对接）。如需更改，必须先向项目维护者询问并获得明确许可后才能动手。** 这是硬性约束，不是建议。

**当前实现**（[api/index.ts](api/index.ts) `resolveTemplateDir` + `HuiCodeOptions.templateDir`）：

- `options.templateDir` 提供 → 绝对路径直接用，相对路径相对 `__excodeDir`（`api/`）解析
- 未提供 → 默认 `'./templates'`（相对 `api/`）
- 末尾拼接 `targetLib` 子目录 → `templates/{targetLib}/`（templates 按目标库名拆分；默认 `eview-react`）
- 解析后（含 lib 子目录）不存在 → 回退到 monorepo 源路径 `'../../src/excode/templates'`，同样拼 `/{targetLib}`
- 解析在 `downloadHuiCode` 内**按调用**执行（非模块加载期），每次调用按 `options.templateDir` + `targetLib` 重新解析

> 注：`{targetLib}` 子目录拼接是 2026-07 经维护者许可新增的（templates 按库名拆分）。拼接逻辑本身现已并入本节受保护契约，不得再擅自调整。

**为什么这样设计**（不要改动的原因）：

| 约束 | 说明 |
|------|------|
| `options.templateDir` 优先 | Electron 打包时 IPC 传 `process.resourcesPath/hui-templates`（绝对路径，asar 外的 resources 目录），必须直接采用，不能用工程内 `./templates` |
| 默认 `./templates` | 开发态 / CLI 模式：`api/templates` 随源码在 |
| 拼 `/{targetLib}` | templates 按目标组件库名拆子目录（`templates/eview-react/`、`templates/eview-ui/`）；Electron 的 `hui-templates` 下也需含各 lib 子目录 |
| 回退 `../../src/excode/templates/{lib}` | electron-vite 构建后 `./templates` 不会自动复制到 `out/main/`；部署到 `packages/desktop/src/excode/` 后，`__excodeDir` 在该处，回退路径正好指向自己的 templates |
| 按调用解析（非模块加载期） | 不同调用方传不同 templateDir，必须每次解析，不能在模块加载期固定 |

**对接链路**（[UXAI/packages/desktop/src/main/ipc.ts](D:/code/ai/UXAI/packages/desktop/src/main/ipc.ts) `download-hui-code` handler）：

```ts
const options = app.isPackaged
  ? { templateDir: join(process.resourcesPath, "hui-templates") }  // 打包：绝对路径（其下需有 eview-react/、eview-ui/ 子目录）
  : {}                                                              // 开发：走默认 ./templates/{lib}
return downloadHuiCode(input, options)
```

> Electron 打包侧：`hui-templates` 资源目录现需按 lib 拆子目录（`hui-templates/eview-react/`、`hui-templates/eview-ui/`），不再是平铺。构建脚本需同步。

`HuiCodeOptions` 当前字段：`{ targetLib?, templateDir? }`。`templateDir` 之外的字段（`css`/`id`/`targetLib`）仍走 `api/index.ts` 内部 config，调用方不感知。

---

CLI / Electron 模式切换点（手动切换 tailwind 转换实现）：

```ts
// api/src/codegen/tailwind-converter.ts — CLI/Electron 双模式唯一切换点（默认 Electron）
// ─── Electron 模式（默认启用）────────────────────────────────
import {
  convertTailwindToLessRule,
  generateLessContent,
  convertTailwindToCSS,
  type LessRule,
} from '../../../main/tailwind-to-css'
// ─── CLI 模式（本仓库独立调试时手动切换：取消注释下方块、注释上方 Electron 块）──
// import {
//   convertTailwindToLessRule,
//   generateLessContent,
//   convertTailwindToCSS,
//   type LessRule,
// } from '../../../lib/convertTailwindToCSS'

export { convertTailwindToLessRule, generateLessContent, convertTailwindToCSS }
export type { LessRule }
```

把当前 import 注释掉、去掉下行注释即可切换。

---

## 二、节点体系

### 2.1 五类节点

```ts
type RegularNode = ComponentNode | HtmlNode | TextNode | ExtractNode
type BuildNode = RegularNode | LoopNode
```

> 数组位置（`children`、`body`）只用 `RegularNode[]`，**`LoopNode` 不会出现在数组中**——它直接挂在 children 槽位。

#### ComponentNode

```ts
interface ComponentNode {
  __node: true                        // brand（由 Node.component() 工厂注入）
  kind: 'component'
  id?: string                                    // A2UI element id
  keepId?: boolean                               // config.id=false 时也强制输出 id（被锚点 href 引用的目标元素，BuildTrees 预扫打标，见 §7.5）
  component: string                              // A2UI 原始组件名
  props: Record<string, PropValue>
  children?: RegularNode[] | LoopNode | null    // LoopNode 仅作 children 占位符，不进数组
  tag?: string                                   // NodeMapper 调 transform 后填
  import?: ImportSpec
  wrapper?: BuildNode
  selfClosing?: boolean
  propRoute?: Record<string, ExtractRoute>       // prop-key 级出口声明
  _resolved?: boolean                            // BuildTrees 阶段为 false，处理后被删除
  loopScope?: LoopScope                          // 节点直接所属的循环作用域（不在循环内则 undefined）
}
```

#### HtmlNode

```ts
interface HtmlNode {
  __node: true                        // brand（由 Node.html() 工厂注入）
  kind: 'html'
  id?: string
  keepId?: boolean                               // config.id=false 时也强制输出 id（被锚点 href 引用的目标元素，见 §7.5）
  tag: string
  props: Record<string, PropValue>
  children?: RegularNode[] | LoopNode | null
  _resolved?: boolean
  loopScope?: LoopScope
}
```

#### TextNode

```ts
interface TextNode {
  __node: true                        // brand（由 Node.text() 工厂注入）
  kind: 'text'
  value: string | BindingValue | ComputedValue
  _resolved?: boolean
  loopScope?: LoopScope
}
```

#### ExtractNode（跨文件抽取引用）

```ts
interface ExtractNode {
  __node: true                       // brand（由 Node.extract() 工厂注入，映射文件勿手搓/手加）
  kind: 'extract'
  componentName: string              // 文件名、tag、import 路径
  purpose: 'module' | 'component'   // → modules/ | components/
  body: RegularNode[]                // body 不含 LoopNode（与 children 一致）
  refProps?: Record<string, PropValue>  // 引用端传入 props（仅循环模板抽取时由 tree-finalizer 注入）
  fileName?: string                  // 覆盖默认文件名
  _resolved?: boolean                // 与其他三类节点一致
  loopScope?: LoopScope
}
```

> 映射文件构造 ExtractNode 必须经 `Node.extract()`（brand 由工厂注入）。手搓 `{ kind:'extract', ... }` 缺 `__node`，tsc 报错且下游误判为普通对象。

#### LoopNode（循环节点）

```ts
interface LoopNode {
  __node: true                        // brand（由 Node.loop() 工厂注入）
  kind: 'loop'

  /** 循环数据源（基础结构 BindingValue，可为绝对或相对路径） */
  data: BindingValue

  /** 模板节点 → 抽出为 components/ 中的 ExtractNode */
  template: ExtractNode

  /** 循环参数签名，默认 '(item, idx)' */
  params?: string

  /** 循环变量名，默认 'item' */
  loopVar?: string

  route?: ExtractRoute

  /** 嵌套时指向外层循环的作用域 */
  loopScope?: LoopScope
}
```

由 `Node.loop()` 工厂构造（与 `Value.*` 工厂平行，见 §3.8）。`LoopNode` **直接** 挂在 `ComponentNode` / `HtmlNode` 的 children 槽位，不进数组。

### 2.2 Scope（作用域链）

```ts
/** 作用域：LoopScope（循环） | RenderFnScope（render 函数） */
type Scope = LoopScope | RenderFnScope

interface LoopScope {
  /** 节点直接所属的 LoopNode */
  loopNode: LoopNode
  /** 外层作用域链（统一为 Scope，可指向 RenderFnScope） */
  parent?: Scope
}

interface RenderFnScope {
  /** 参数名 → 数据源 binding（来自 params[].dataSource） */
  paramBindings: Record<string, BindingValue>
  /** 外层作用域链 */
  parent?: Scope
}
```

**挂载范围**：所有五类节点都可选挂 `loopScope?: Scope`，不在循环/render fn 中的节点不挂。

**填充时机**：
- `LoopScope`：BuildTrees 阶段从内部 `ctx.loopStack` 构建
- `RenderFnScope`：state-builder 阶段 `consumeValue` 扫描 `RenderFnValue.params[].dataSource` 时构建

**消费侧**：
- state-builder：嵌套循环 enrichment 路径解析 + render fn body 内 scope 上下文
- jsx-emitter：相对路径 binding 在 render fn body 内的 emit 形态
- tree-finalizer：富集 const 路由

**Scope 显式 scopeType**（LoopScope/RenderFnScope 加 `scopeType: 'loopScope' | 'renderFnScope'` 判别字段，替代靠字段有无 `in` 判断）：processLoop 判断 `scopeType === 'renderFnScope'` 跳过 enrichment（render fn body 内循环由 dataset applyScopedCV 处理）。

**resolveValueFromPath(relative) 从 currentItem**（非沿 scope 链取 arr[0]）：ComputedTransformCtx 加 `currentItem` 字段，applyScopedCV 递归内更新为当前 obj（item → item.actions[j] → …），transform 内 resolveValueFromPath(relative) 从 currentItem 按段解析。原 `resolveRelativeByScope`（沿 scope 链找 absolute 祖先取首项）已删除（错误：transform 逐项，应从当前项而非首项）。

---

## 三、值类体系

### 3.1 PropValue 联合类型

```ts
type PropValue =
  | BindingValue
  | ComputedValue
  | VarRefValue
  | RawExprValue
  | RenderFnValue
  | SlotNodeValue
  | string | number | boolean | null
  | PropValue[]
  | { [key: string]: PropValue }
```

### 3.2 BindingValue（路径绑定）

```ts
interface BindingValue {
  __node: true                     // brand（由 Value.binding() 工厂注入，映射文件勿手搓/手加）
  type: 'binding'

  // ── A2UI 原始信息 ──
  path: string                               // A2UI 原始路径：'/aaa'（绝对）或 'name'（相对）
  pathType: 'absolute' | 'relative'
  accessPath: string                         // 编译后路径：'/b/1/c' → 'b[1].c'

  // ── 编译期快照（BuildTrees 阶段从 state 取一次） ──
  stateValue?: any

  // ── 来源标记（BuildTrees 阶段填） ──
  nodeId?: string
  componentName?: string
  propKey?: string

  // ── 路由 ──
  route?: ExtractRoute

  // ── useState 触发标记（详见 §3.6） ──
  useState?: UseStateMarker
}
```

### 3.3 ComputedValue（BindingValue 超集 + 数据转换）

```ts
export interface ComputedTransformCtx {
  /** 原始 state（绝对路径直接用） */
  rawState: Record<string, any>
  /**
   * 当前项（循环中的 item）：relative path 从此项按段解析。
   * enrichment（applyScopedCV）递归内更新为当前 obj；absolute computed 不设（transform 内 path 都 absolute）。
   */
  currentItem?: any
  /**
   * 通用路径解析：调用者不关心 path 是绝对还是相对。
   * /xxx → rawState 直取；xxx → 从 currentItem（当前项）按段解析
   */
  resolveValueFromPath: (path: string) => any
  /** 图标名称 → BuildNode（用于 containsJSX 的 transform 中 resolve 图标） */
  resolveIcon: (iconName: string, iconProps?: Record<string, any>) => BuildNode | null
}

export interface ComputedValue extends Omit<BindingValue, 'type'> {
  type: 'computed'
  /** 数据转换函数（编译期执行，不产运行时代码）
   * 第二个参数传入 ComputedTransformCtx，提供：
   *   rawState — 原始 state
   *   resolveValueFromPath — 路径解析（绝对/相对），调用者无需关心 path 来源
   *   resolveIcon — 图标 resolve
   */
  transform: (rawValue: any, ctx?: ComputedTransformCtx) => any
  containsJSX: boolean
  identResolver?: (ctx: IdentContext) => string
}
```

> 注：`transform` 可以是"预算闭包"（返回编译期已计算好的值，忽略 rawValue 参数），也可以是"实时计算"（利用 rawState 或 resolveValueFromPath 动态取值）。

BindingValue 仅携带路径与来源标记：
- 受控双绑由 `useState?: UseStateMarker`（§3.6）标记触发
- 字面量双绑走独立 `LiteralValue` 类型（§3.7）

### 3.4 RenderFnParam / VarRefValue / RawExprValue / RenderFnValue / SlotNodeValue

```ts
interface RenderFnParam {
  /** 形参名（用于 JS 函数签名 & emit 前缀） */
  name: string

  /**
   * 可选：此 param 是否为"数据源参数"。
   * 提供 binding 时：
   *   1. state-builder 建立 RenderFnScope，body 内相对 binding 沿此 binding 解析
   *   2. jsx-emitter 将 body 内相对 binding 以 destructure 后的裸名 `{X}` emit
   * 不提供时：仅作为普通运行时 param 透传
   */
  dataSource?: BindingValue
}

interface VarRefValue {
  type: 'varRef'
  name: string                               // 序列化为 {name}
}

interface RawExprValue {
  type: 'rawExpr'
  value: string                              // 原始 JS 表达式
}

interface RenderFnValue {
  type: 'renderFn'

  /** 形参声明（结构化，保留顺序） */
  params: RenderFnParam[]

  /** 渲染函数体 */
  body: BuildNode | BuildNode[]

  route?: ExtractRoute
}

interface SlotNodeValue {
  type: 'slotNode'
  node: BuildNode
  route?: ExtractRoute
}
```

> 备注：`SlotNodeValue` 与 `RenderFnValue` 都包含子 `BuildNode` 子树。state-builder 走树时须解套进入这些子树递归收集 binding/computed。
>
> `RenderFnValue.params` 为结构化 `RenderFnParam[]`，每项有 `name` + 可选 `dataSource`。`dataSource` 标记此参数为作用域数据源——body 内相对 binding 沿此 binding 解析。

### 3.5 ExtractRoute

```ts
type ExtractRoute = 'inline' | 'module-top' | 'component-internal'
```

### 3.6 UseStateMarker（useState 触发标记）

```ts
interface UseStateMarker {
  /**
   * 可选：目标事件 prop 名（如 'onChange'、'onInput'、'onCheckedChange'）。
   * 序列化时直接作为 prop key 使用，不再拼前缀。
   */
  event?: string

  /**
   * 可选：从事件对象提取新值的字符串模板函数（接收 setter 名）。
   * 例：s => `${s}(e.target.value)`
   */
  extractor?: (setter: string) => string
}
```

**用途**：标记某 value 需要在组件函数体中产 useState 包裹；存在即触发，event + extractor 同时给出时再补事件处理 prop。

**挂载位置**：`BindingValue.useState?`（path 双绑场景）、`LiteralValue.useState?`（字面量双绑场景）。

**消费**：`treeFinalizer#liftLiteralTwoWayBindings` 消费 `LiteralValue.useState` / `ComputedValue.useState` 形态。

### 3.7 LiteralValue（字面量值）

```ts
interface LiteralValue {
  type: 'literal'

  /** 字面量值 */
  value: any

  /** 可选：触发 useState 包裹（详见 §3.6） */
  useState?: UseStateMarker
}
```

**作用范围**：仅作为 prop value 时存在于 IR 上。**`LiteralValue` 不参与 state.js 消费**——其值是字面量，不走 `BindingValue` 的 path → accessPath 路径。

**创建方**：仅由组件映射文件的 transform 创建（典型场景：把字面量升级为 useState 双绑）；BuildTrees 不创建 `LiteralValue`。

### 3.8 ImportSpec

```ts
type ImportSpec = string | { source: string; named?: boolean }
// string                  → import Tag from 'source'
// { source, named: true } → import { Tag } from 'source'
```

**dotted tag 支持**：当组件映射返回 dotted tag（如 `DatePicker.RangePicker`）时，
import-collector 的 `addImport` 自动取 tag 的 `.` 左半部分作为 default import 名，
JSX emitter 则用完整 dotted 名渲染（`<DatePicker.RangePicker />`）。
产物效果：`import DatePicker from 'source'; <DatePicker.RangePicker />`——
与 `const { RangePicker } = DatePicker; <RangePicker />` 功能等价。
适用场景：父组件通过静态属性暴露子组件（如 `DatePicker.RangePicker`）。

### 3.9 accessPath 语义收拢（`core/access-path.ts`）

`accessPath` 由 BuildTrees `#computeAccessPath` 产出：字段用 `.` 分隔、数字段用 `[n]` 紧跟字段
（`/a/b/0/c` → `a.b[0].c`；相对路径原样保留 `/` 如 `field/0/0/label`，emit 时由 `pathToJsAccess` 转 `field[0][0].label`）。

平面（无 `.` `[` `]`）vs 嵌套的处理规则统一收拢于 `core/access-path.ts`，
**stateBuilder / treeFinalizer / jsxEmitter / fileAssembler 共用**，避免各消费者 flat-only 假设在嵌套路径上翻车（对象型 A2UI state 如 `brandInfo.logoIcon` / `pDetProduct.rating` / `modalData.relatedImages` 都是嵌套）。

| 函数 | 用途 | 规则 |
|------|------|------|
| `isFlatAccessPath(ap)` | fileAssembler 判 destructure | 无 `.`/`[`/`]` → 平面（进文件顶部 destructure） |
| `stateRef(ap)` | 绝对引用（binding + 非 JSX computed，值在 state.js） | 平面 → 裸 `ap`（已 destructure）；嵌套 → `initialState.ap` |
| `jsxConstName(ap)` | containsJSX computed 的 const 标识符（小驼峰） | 平面原样；嵌套/数组下标切段小驼峰拼接：`brandInfo.logoIcon` → `brandInfoLogoIcon`，`a[0].b` → `a0B` |
| `computedJsxConstName(cv)` | containsJSX computed 引用（const 名，裸） | identResolver ?? jsxConstName |
| `pathToJsAccess(path)` | JSON Pointer → JS 属性访问表达式（emit relPath / writeKey 用） | `field/0/0/label` → `field[0][0].label`；`/a/b/0/c` → `a.b[0].c`；数字段 `[n]`，字符串段 `.` |

**嵌套路径两类**：
- **绝对嵌套**（`/brandInfo/logoIcon` 等）：值在 state.js（`setNested` 写嵌套结构，数组感知 `[n]`）。引用走 `initialState.brandInfo.logoIcon`（不 destructure）。containsJSX computed 走文件顶部 const（名 `brandInfoLogoIcon`），引用 `{brandInfoLogoIcon}`。
- **相对嵌套**（循环项对象字段 `user/avatar` 等）：值在循环项。enrichment 用 `resolveBySegments` 按 path segments 读原始值、`setNested` 写嵌套位置（`out.user.avatar = icon`，非 flat key）、`structuredClone(item)` 防 rawState 污染。模板 destructure 顶级字段 `user`、emit `{user.avatar}` 属性访问。详见 §10.4。

> 之前 `ap.includes('.') → initialState.ap` 这条规则散在 jsxEmitter / useStateRefName / routeLoopNode 三处、`includes('.')` 判 destructure 散在 fileAssembler，各自 flat-only 假设逐个翻车（4 个已修 bug 同源）。现统一收拢。

---

## 四、MappingDef（组件映射定义）

### 4.1 接口

```ts
interface MappingDef {
  tag: string                                    // 唯一必填：目标组件名
  import?: ImportSpec
  defaults?: Record<string, any>                 // transform 前填充
  transform?: (node: any, context: TransformContext) => TransformResult | null
  classNameProp?: string                         // className 输出 key 别名（默认 'className'）；props 内部仍 className（style-converter 照常收集样式），仅 emit 输出 key 改名（如 inputClassName={styles.id}）
}

interface TransformContext {
  /** 页面原始 state（transform 内可读取，用于数据源 enrichment 等） */
  state: Record<string, any>

  /**
   * 递归解析子树：返回 transform 已应用的 BuildNode。
   * 等价于 NodeMapper 的 walkTree 一次调用——触发子树内组件 transform 并返回已处理节点。
   * 不收集任何 binding/computed（数据消费归 state-builder）。
   */
  resolveNode: (node: BuildNode) => BuildNode

  /** A2UI icon name → 已 resolve 的 icon BuildNode */
  resolveIcon: (iconName: string, iconProps?: Record<string, any>) => BuildNode | null

  /**
   * 按绝对路径从 state 取值（仅适合绝对路径）。
   *
   * - 绝对路径 `/xxx/yyy` → 从 state 直取 `state.xxx.yyy`
   *
   * ⚠️ 不支持相对路径。组件 transform 每个节点只跑一次，无法 per-item 解析相对路径
   * （那是 ComputedValue.transform 内 cvCtx.resolveValueFromPath 的职责）。
   * 若需处理相对路径的 DataBinding 值，请用 `Value.computed()`。
   */
  resolveAbsoluteStateValue: (path: string) => any
}

interface TransformResult {
  tag: string
  import?: ImportSpec
  props?: Record<string, PropValue>
  children?: BuildNode[] | LoopDescriptor | any[] | any | null
  wrapper?: BuildNode
  selfClosing?: boolean
  /** prop 出口声明（key=prop key, value=ExtractRoute）；声明后 tree-finalizer 自动把字面量 prop 提升到对应位置 */
  propRoute?: Record<string, ExtractRoute>
  /** className 输出 key 别名（默认 'className'）；transform 可动态覆盖 MappingDef.classNameProp */
  classNameProp?: string
}
```

### 4.2 移除的字段

| 移除字段 | 去向 | 理由 |
|---------|------|------|
| importMode | 合并入 ImportSpec | 两者共同决定 import 语句 |
| propsMap | 归入 transform | rename 是 transform 中一行 |
| valueMap | 归入 transform | 枚举值转换归 transform |
| binding | 归入 Value.binding() | transform 直接构造值类实例 |

### 4.3 Value.* / Node.* 工厂

**值类工厂**（`api/src/core/value.ts`）：

```ts
Value.binding({ path, pathType, accessPath, stateValue?, useState?, ... })
Value.computed({ path, transform, containsJSX, useState?, ... })
Value.varRef({ name })
Value.rawExpr({ value })
Value.renderFn({ params, body, route? })
Value.slotNode({ node, route? })
Value.literal({ value, useState? })      // 字面量值；transform 创建字面量双绑
```

**节点工厂**（`api/src/core/node.ts`，与 Value.* 平行）：

```ts
Node.component({ tag, props, id?, children?, import?, selfClosing?, propRoute? })  // 构造 ComponentNode（映射文件/transform 内构造组件节点）
Node.html({ tag, props, id?, children? })                                           // 构造 HtmlNode
Node.text({ value })                                                                // 构造 TextNode（value 可为 string 或 BindingValue）
Node.loop({ data, template, params?, loopVar?, route? })                            // 构造 LoopNode（template 必须是 ExtractNode）
Node.extract({ componentName, purpose, body, refProps?, fileName?, _resolved? })    // 构造 ExtractNode（跨文件抽取/循环模板）
```

> `Node.component()` 在 transform 中用于构造 JSX 表达式中的组件节点（如 resolveIcon 返回的 BuildNode 本身就是 component node）。`Node.text()` 在需要将字面量或 DataBinding 包装为 children 中的文本节点时使用。

> 循环节点构造走 `Node.loop()`，其 `template` 是 `ExtractNode`——必须经 `Node.extract()` 构造（带 `__node` brand）。**禁止手搓 `{ kind: 'extract', ... }`**：缺 brand 会被 `emitValue`/stateBuilder 误判为普通对象，且 tsc 报 `__node` 缺失。`BindingValue` 同理必须经 `Value.binding()` 构造。

### 4.4 transform 执行顺序

1. `defaults` 填充（运行时先 applyDefaults）
2. 执行 `transform(node, ctx)`，此时 props 已含默认值
3. 返回值 merge：`result.tag ?? def.tag`、`result.import ?? def.import`、`result.props`（完全替换）

---

## 五、图标属性映射表

### 5.1 ICON_PROPS_BY_COMPONENT（直接 prop）

| 组件 | props |
|------|-------|
| Icon | `name` |
| Button | `icon` |
| Input | `prefix`, `suffix` |
| Switch | `checkedChildrenIcon`, `unCheckedChildrenIcon` |
| TabItem | `icon` |
| StepItem | `icon` |
| Tag | `icon`, `closeIcon` |
| TimelineItem | `icon` |
| Collapse | `expandIcon` |

### 5.2 ICON_PROPS_NESTED_IN_ARRAYS（数组内嵌）

| 组件 | props | 字段 |
|------|-------|------|
| Menu | `items` | item.icon |
| Dropdown | `menu` | item.icon |
| Segmented | `options` | item.icon |
| Tree | `options` | item.icon |

### 5.3 收集时机（BuildTrees 中）

1. 节点 props 中的字面量图标 prop（`collectFromNodeProps`）
2. DataBinding 引用的图标 prop（按 path 去 state 取值）
3. 防御性：state 全量递归（兜底）
4. API 解析（`IconCollector.resolveAll`）

### 5.4 HTML value 下沉 TextNode

```ts
const HTML_TEXT_ELEMENTS: Set<string> = new Set([
  'span', 'div', 'p', 'label', 'h1'..'h6', 'header', 'footer', 'nav',
  'section', 'article', 'aside', 'main', 'strong', 'em', 'b', 'i', 'u',
  'small', 'mark', 'del', 'ins', 'sub', 'sup', 'td', 'th', 'caption',
  'figcaption', 'legend', 'a', 'cite', 'code', 'pre', 'blockquote',
  'q', 'abbr', 'address', 'time', 'dt', 'dd', 'summary',
])

const HTML_VALUE_ATTRIBUTE_ELEMENTS: Set<string> = new Set([
  'button', 'data', 'input', 'li', 'meter', 'option', 'progress', 'param',
])
```

**判定**：tag ∈ TEXT_ELEMENTS 且 tag ∉ VALUE_ATTR_ELEMENTS 且 props 有 `value` → 下沉为 TextNode。

---

## 六、PipelineContext 数据流

```ts
// ── Step 0: PipelineContext 创建 ──
registry, config, targetLib

// ── Step 1: RegisterComponents ──
// registry 加载 MappingDef（不变）

// ── Step 3: BuildTrees ──
builtPages: BuiltPage[]
iconNameMap: Record<string, string>

// BuiltPage = {
//   pageName, state, rootTree, extracts, iconNameSet, iconNameMap
// }

// ── Step 4: NodeMapper ──
mappedPages: MappedPage[]

// MappedPage = {
//   pageName, state, rootTree, extracts, iconNameMap
// }
// （NodeMapper 不收集 binding/computed，无 manifest 字段）

// ── Step 5: FileGenerator ──
generatedFiles: GeneratedFile[]

// GeneratedFile = { path, content }

// ── Step 6-8 ──
routeResult, outputFiles, generationReport
```

---

## 七、BuildTrees（单次遍历）

### 7.1 节点处理序列

```
对每个节点访问：
  1. 建立 parent-child 关系（ID 解析建树）
  2. props 中 {path: "/xxx"} → Value.binding({ path, pathType, accessPath, nodeId, componentName, propKey })
     —— 字面量保持字面（不构造 LiteralValue）
  3. props 中 {componentId} → 展开 inline slot（子树 resolve → Value.slotNode）
  4. children 为 {path, componentId} → LoopNode（template 抽为 ExtractNode，详见 §2.1）
  5. 命中 splitMeta → ExtractNode（切断子树，purpose: 'module'）
  6. Icon / props.icon → 收集 icon name 到 iconNameSet
  7. ★ 挂 loopScope：从 ctx.loopStack 构建（详见 §2.2）
```

### 7.2 循环模板命名规则

- 模板 body 根节点 id + "Template"（PascalCase）
- 例：body 根节点 id = `itemContent` → `componentName = ItemContentTemplate`

### 7.3 关键判定

#### 图标收集双条件

```ts
isIconComponent = isComponent AND component ∈ mapping 表
isIconProp = isIconComponent AND (key ∈ ICON_PROPS_BY_COMPONENT[component]
                                  OR key ∈ ICON_PROPS_NESTED_IN_ARRAYS[component])
```

collectFromBinding 仅在 isIconProp 为 true 时调用。

#### HTML value 下沉

- `HTML_TEXT_ELEMENTS.has(tag)` && !`HTML_VALUE_ATTRIBUTE_ELEMENTS.has(tag)` && props 有 value → 下沉
- 否则保留 value 在 props

#### 循环模板

```ts
// 预创建 ExtractNode + LoopNode（body 先空）。ExtractNode 必须经 Node.extract() 构造（带 __node brand）
extract = Node.extract({ componentName, purpose: 'component', body: [], _resolved: false })
loopNode = Node.loop({ data, template: extract })
loopNode.loopScope = buildLoopScope(ctx.loopStack)  // 嵌套时指向外层

// 推栈 → build body → pop
ctx.loopStack.push({ ..., loopNode })
try {
  templateNode = #buildTree(loopInfo.componentId, ctx, depth + 1)
  extract.body = [templateNode]
} finally {
  ctx.loopStack.pop()
}
```

#### 路径分类（pathType）兜底

```ts
hasLeadingSlash = path.startsWith('/')
inLoop = ctx.loopStack.length > 0
if (hasLeadingSlash) pathType = 'absolute'
else if (inLoop) pathType = 'relative'
else {
  // 无 `/` 且不在循环内 → 相对路径无 loop 可解析，本应是顶层 state 字段。
  // 按 absolute 从 ctx.state 取值：有数据 → absolute；无数据 → 丢弃（return null）
  pathType = resolveBySegments(ctx.state, pathToSegments(path)) !== undefined ? 'absolute' : null(丢弃)
}
```

accessPath 对有无 `/` 同结果（`#computeAccessPath` 无 `/` 原样返回），故兜底只改 pathType。丢弃返回 null：Switch mapping 转 literal(false)→`useState(false)`；通用组件经 emitProps 成 `prop={null}`。避免 emit 成游离裸标识符（如 `useState(undefField)`）。

### 7.4 输出

```ts
BuiltPage {
  pageName, state,
  rootTree: BuildNode,           // 含 ExtractNode / LoopDescriptor
  extracts: ExtractNode[],       // 索引视图，body 即树上节点
  iconNameSet: string[],
  iconNameMap: Record<string, string>  // API 解析后
}
```

### 7.5 锚点目标 id 保留（keepId，config.id=false 例外）

`config.id=false`（prod）移除产物 JSX 全部 `id` 属性，但锚点组件 `Anchor` 的 `items[].href="#xxx"` 滚动依赖目标元素的 DOM `id`，剥掉后 href 变死链。BuildTrees 在建树前预扫 + 建树时打 `keepId` 标记解决。id 保留只在「**数据含 Anchor 且 `config.id===false`**」时真正发生——其余情形 `anchorTargetIds=null`、不预扫/不打标、零改动。

```
预扫 #collectAnchorTargetIds(elements, state) → Set<string> | null   // 镜像 #collectEventMutatedPaths
  仅 config.id===false 时调用；单次遍历同时判定有无 Anchor：
    对每个 component === 'Anchor' 的元素，从 props.items 收集目标 id（去前导 '#'）：
      - 字面量数组 → 直接遍历
      - DataBinding {path} → 绝对 path（'/' 前缀）经 resolveBySegments(state, pathToSegments(path))
        解析到页面初始 state 拿真实 items 数组；相对 path（无 '/'）/ state 取不到（运行时拉取）跳过
      - 递归 item.children 收集多级嵌套 href（树形 items）
    未发现任何 Anchor → 返回 null（非空集），让标记侧可选链短路（不建 Set、不逐节点 has()）
  config.id===true → 不调用、anchorTargetIds 直接 null
打标：#buildTree / #buildAsExtractModule 建 ComponentNode/HtmlNode（4 处 id: el.id 旁）
  keepId: ctx.anchorTargetIds?.has(el.id) || undefined   // null 时可选链短路→undefined；命中才 true
emit：jsx-emitter emitComponent/emitHtml 的 id 条件
  opts.emitId && node.id            →  (opts.emitId || node.keepId) && node.id
```

- **单一 node.id 通道**：id 始终走原有 `node.id` 出口，无重复 id 属性；不碰 `ComponentRegistry` 核心、不改 `emitProps`、不动 Chart 等已有 id 转发（props 注入路线会与 closed-set transform / emitProps 撞重复 id，故不用）。
- **存活性**：keepId 是节点自身属性，经 NodeMapper `{...node}`（§8）与 tree-finalizer `{...node, props}`（§九）的 spread 一路拷贝存活到 emitter；唯一丢 keepId 的是抽取模块主树占位（tree-finalizer 新建、只显式拷 id），但锚点指向模板文件里的真实内容元素（inner 节点保留 keepId、模板 emit 时出 id），占位无需 id。
- **覆盖范围**：ComponentNode/HtmlNode 都有 `el.id`，故 HTML 目标（div/section…）与注册组件目标（Card…）统一覆盖。
- **门控**：`config.id=true` → 不预扫、`anchorTargetIds=null`、零 keepId、产物逐字不变（e2e 基线无 diff、无需 `-u`）；`config.id=false` 但无 Anchor → 预扫返回 `null`、标记短路、无 keepId。仅 `config.id=false` 且有 Anchor 才预扫返回非空集并打标。

---

## 八、NodeMapper（递归 transform）

### 8.1 核心机制

```
BuildTrees 产出（所有节点 _resolved: false）
       ↓
walkTree(node, ctx)
  _resolved !== false → 透传
  _resolved: false → switch:
    component → resolveComponent
    html     → resolveHtml
    text     → resolveText
    extract  → resolveExtract
       ↓
resolveComponent:
  - 调 registry.transform(node.component, node, ctx)
  - 合并字段（tag/import/props/wrapper/selfClosing/propRoute）
  - children 处理规则：
    transform 不返回 children 字段（undefined）→ 沿用 node.children
    transform 返回 children = null → 显式清空，不递归
    transform 返回 children = RegularNode[] / LoopNode → 替换原 children，递归
  - delete _resolved（标记已处理）
  - resolveChildren

resolveChildren:
  LoopNode → resolveLoopNode
  array:   child._resolved: false → walkTree; child._resolved: true → 透传

resolveLoopNode:
  - 用 loop.template.body.map(walkTree)
  - template.body 内部 relative binding 由 state-builder 走树时处理
```

**transform 内如何展开子树**：

```ts
interface TransformContext {
  state: Record<string, any>
  resolveIcon: (name, iconProps?) => BuildNode | null
  resolveNode: (node: BuildNode) => BuildNode        // ★ 等价于 walkTree 一次调用

  /** 绝对路径解析：绝对路径 /xxx 从 state 直取（仅绝对路径，相对路径归 cvCtx） */
  resolveAbsoluteStateValue: (path: string) => any
}
```

`resolveNode` 只做形状变换（apply transform + merge 字段），不收集任何数据。relative binding 由 state-builder 走树时统一处理。

### 8.2 resolveAbsoluteStateValue：transform 内部绝对路径取值

`TransformContext.resolveAbsoluteStateValue` 允许映射文件在 transform 中按**绝对路径**从 state 取值：

```ts
// 绝对路径 → 直接从 ctx.state 读取
const items = ctx.resolveAbsoluteStateValue('/menuData')
```

**设计边界**：

- **仅支持绝对路径**。相对路径返回 undefined。
- 组件 transform 每个节点只跑一次，无法 per-item 解析相对路径。相对路径的 DataBinding 值转换必须走 `Value.computed()`，在 `ComputedValue.transform` 内用 `cvCtx.resolveValueFromPath`（绝对/相对都正确，per-item 执行）。

**实现**：`#createTransformContext` 提供唯一版本，transform 直接用 `ctx`，无节点级包装：

```ts
// node-mapper.ts #createTransformContext
ctx.resolveAbsoluteStateValue = (path: string) => {
  if (!path || !path.startsWith('/')) return undefined  // 仅绝对路径
  return getValueFromState(state, path)
}
```

**何时可用**：仅用于 transform 的**绝对路径**辅助决策（如 Menu 顶层 openKeys 算闭包），结果不直接进 outputProps。
若结果要进 outputProps，必须用 `Value.computed()`。
相对路径的辅助决策应挪进 `ComputedValue.transform` 用 `cvCtx.resolveValueFromPath`。

此设计与 `ComputedTransformCtx.resolveValueFromPath`（§3.3）的职责正交：组件 transform 只做绝对路径辅助决策，per-item 数据转换归 cvCtx。cvCtx.currentItem 由 applyScopedCV 递归内更新为当前项（enrichment 逐项）。

### 8.3 输出

```ts
MappedPage {
  pageName, state, rootTree, extracts, iconNameMap
}
```

---

## 九、双向绑定（Two-way Binding）规则

> **统一语义**：本系统的"双向绑定"等价于 **"生成 useState 包裹"**——用 `UseStateMarker`（§3.6）标记触发；初始值来源是路径（state 引用）还是字面量，由值的类型决定（`BindingValue` / `LiteralValue`，§3.2 / §3.7）。

### 9.1 统一代码形态

```ts
// 模块顶部（B 路由）
const initialXxx = '123'                    // 字面量 → 直接
const xxx = initialState.xxx                // path 绑定 → 来自 state

// 组件函数体内（C 路由）
function Component() {
  const [xxx, setXxx] = useState(initialXxx)
  // ...
}
```

### 9.2 IR 形态对照

| A2UI | transform 产物 | 最终代码 |
|------|---------------|---------|
| `"hello"`（字面量） | `LiteralValue { type: 'literal', value: '123', useState: { event, extractor? } }` | `const [x, setX] = useState('123')` + 可选 onChange |
| `{path:"/aaa"}`（路径） | `ComputedValue { type: 'computed', path, useState: {...}, transform }` | `const aaa = initialState.aaa` + `useState(aaa)` + onChange |

---

## 十、State 消费与转换管线

state-builder 直接走树消费 binding/computed，不依赖任何中间 manifest。

### 10.1 核心思想

- **NodeMapper 阶段不感知数据**：仅做形状变换（transform + resolveNode 展开子树），不收集任何 binding/computed。
- **state-builder 走树消费**：从 `MappedPage.rootTree` 出发递归，碰到 binding/computed 直接消费。
- **文件单元（FileUnit）模型**：每个产物文件（主页面 / modules/* / components/*）是一个独立单元，有自己的 stateRefs/jsxLiteralConsts/enrichmentConsts。
- **binding/computed 保留原类型**：不再替换为 VarRefValue，jsx-emitter 直接 emit `accessPath`。

### 10.2 walk 主流程

```ts
walk(node, ctx) {
  switch (node.kind) {
    case 'component':
    case 'html':
      consumeProps(node.props, ctx)
      walkChildren(node.children, ctx, node.id ?? '')
      return
    case 'text':
      consumeTextValue(node.value, ctx)
      return
    case 'extract':
      // 文件边界：切到对应文件单元
      const unit = getOrCreateUnit(ctx, fileKeyOf.extract(node))
      withUnit(ctx, unit, () => {
        for (const c of node.body) walk(c, ctx)
      })
      return
  }
}

walkChildren(children, ctx, parentNodeId) {
  if (!children) return
  if (children.kind === 'loop') {
    processLoop(children, ctx, parentNodeId)
    return
  }
  for (const c of children) walk(c, ctx)
}
```

### 10.3 consumeValue 递归

碰到 prop 值时分四种情况处理：

```ts
consumeValue(v, ctx) {
  if (!v || typeof v !== 'object') return
  if (Array.isArray(v)) { for (const item of v) consumeValue(item, ctx); return }

  switch (v.type) {
    case 'binding':
      if (v.pathType === 'absolute') {
        ctx.currentUnit.bindingRefs.push(v)
        ctx.stateEntries[v.accessPath] = getValueFromState(ctx.rawState, v.path)
      }
      return
    case 'computed':
      if (v.pathType === 'absolute') {
        if (v.containsJSX) {
          // containsJSX:true → 算值后归文件单元 jsxLiteralConsts
          const result = v.transform(getValueFromState(ctx.rawState, v.path), undefined)
          ctx.currentUnit.jsxLiteralConsts.push({ name: v.accessPath, value: result })
        } else {
          // 普通 computed：求值后进 state.js + 收集引用
          ctx.currentUnit.computedRefs.push(v)
          ctx.stateEntries[v.accessPath] = v.transform(getValueFromState(ctx.rawState, v.path), undefined)
        }
      }
      return
    case 'slotNode':
      walk(v.node, ctx)   // 递归进入子树
      return
    case 'renderFn':
      // 扫描 params[].dataSource → 建立 RenderFnScope
      const dataSources = new Map<string, BindingValue>()
      for (const p of v.params ?? []) if (p.dataSource) dataSources.set(p.name, p.dataSource)

      if (dataSources.size > 0) {
        const newScope: RenderFnScope = { paramBindings: Object.fromEntries(dataSources), parent: ctx.currentScope }
        const prev = ctx.currentScope
        ctx.currentScope = newScope
        try { walkBody(v.body, ctx) } finally { ctx.currentScope = prev }
      } else {
        walkBody(v.body, ctx)   // 无数据源 → 普通 walk
      }
      return
    // varRef / rawExpr / literal → 跳过
  }

  // 无 type 的纯对象 → 递归属性，查找内嵌的 slotNode/renderFn
  if (v.type === undefined) {
    for (const item of Object.values(v)) consumeValue(item, ctx)
  }
}
```

**关键点**：
- 数组和纯对象**必须递归**——它们内部可能内嵌 slotNode / renderFn，进而含有 binding/computed
- 字面量（string/number/boolean/null）、varRef、rawExpr、LiteralValue 跳过
- relative binding 跳过（在所属循环的 destructure 中消费，不进 state.js）

### 10.4 processLoop 循环 enrichment

> **render fn body 内的循环跳过 processLoop**：processLoop 顶部 `if (ctx.currentScope && 'paramBindings' in ctx.currentScope) return`——当 `ctx.currentScope` 是 RenderFnScope（render fn body walk 时设、processLoop 不改它），直接把 template body 走进当前单元 inline 返回，不建模板单元、不做 enrichment。因为 render fn body 循环（如 Table 列 actions 循环 `row.rawData.actions`）是运行时逐行数据，enrichment 已由外层 dataset（`enrichScopedData`，见 §10.4b）接管；若不跳过，processLoop 会因 loopScope 链解析（首行 only）产出孤儿 `const actions` enrichmentConst + 孤儿模板单元。

```ts
processLoop(loop, ctx, parentNodeId) {
  // 1. 解析数据源
  const rawData = resolveLoopData(loop, ctx)

  // 2. 收集 template.body 内 relative ComputedValue
  const relativeCVs = collectRelativeComputeds(loop.template.body)
  const containsJSX = relativeCVs.some(cv => cv.containsJSX)

  // 3. enrichment
  if (relativeCVs.length === 0) {
    // 无 enrichment：原数据进 state.js
    ctx.stateEntries[(loop.data as BindingValue).accessPath] = rawData
  } else {
    // 相对嵌套支持：读用 resolveBySegments（按 cv.path segments，支持 user/avatar），
    // 写用 setNested（嵌套 accessPath 写嵌套位置 out.user.avatar，非 flat key），
    // structuredClone(item) 防 setNested 改 sub-object 污染 rawState。详见 §3.9。
    // 撞键 CV 的 accessPath 已在去重阶段改写（favoriteIcon → favoriteIcon_1 等）。
    const enrichedData = rawData.map(item => {
      const out = structuredClone(item)
      for (const cv of relativeCVs) {
        const rawValue = resolveBySegments(item, pathToSegments(cv.path))   // 原始值，支持嵌套
        const writeKey = pathToJsAccess(cv.accessPath ?? cv.path)           // → field[0][0].label（setNested 可解 [n]）
        setNested(out, writeKey, cv.transform(rawValue, ctxForCv))
      }
      return out
    })
    if (containsJSX) {
      // 含 JSX → 归模板文件 unit（components/{name}）
      const templateUnit = getOrCreateUnit(ctx, fileKeyOf.loopTemplate(loop.template.componentName))
      templateUnit.enrichmentConsts.push({ name: constName, value: enrichedData, containsJSX: true })
    } else {
      // 不含 JSX → 进 state.js
      ctx.stateEntries[constName] = enrichedData
    }
    // 记录 enrichment 映射（tree-finalizer routeLoopNode 用）
    ctx.loopEnrichmentMap.set(`${parentNodeId}:${loop.template.componentName}`, { constName })
  }

  // 4. 切到模板文件单元，继续走 template.body
  const templateUnit = getOrCreateUnit(ctx, fileKeyOf.loopTemplate(loop.template.componentName))
  withUnit(ctx, templateUnit, () => {
    for (const child of loop.template.body) walk(child, ctx)
  })
}
```

### 10.4b enrichScopedData（Table dataset 嵌套 enrichment）

mapping（如 Table）用 `enrichScopedData(dataSourceBinding, resolvedCells)` 构造 `dataset` ComputedValue，对外层数据源逐行 enrichment。区别于 processLoop（每循环独立、内层循环自己处理），`enrichScopedData` 须把 **body 内嵌套循环**（循环套循环）的 CV 也应用上。

```ts
// collectRelativeCVsDeep：深入嵌套 LoopNode template body 收集 CV，每个带 loopChain
//   （外层循环 data 路径链，如 actions 循环 → ['actions']）
scopedCVs = collectRelativeCVsDeep(cells)
containsJSX = scopedCVs.some(({cv}) => cv.containsJSX)

Value.computed({
  path, pathType, accessPath, containsJSX, stateValue,
  transform: (rawData, cvCtx) => rawData.map(row => {
    const out = structuredClone(row)
    for (const { cv, loopChain } of scopedCVs) applyScopedCV(out, loopChain, cv, cvCtx)
    return out
  })
})

// applyScopedCV：沿 loopChain 逐层 map 进嵌套数组，最里层应用 cv
//   loopChain=[]  → out[cv.accessPath] = cv.transform(out[cv.path])
//   loopChain=['actions', ...] → 对 out.actions 每项递归剥一层
//   （如 row.actions[i].icon = resolveIcon(row.actions[i].icon) → BuildNode）
```

- `containsJSX=true`（任一 CV 含 JSX，如 icon string → BuildNode）→ stateBuilder 把 enriched dataset 放进**文件单元 jsxLiteralConsts（不进 state.js）**，Table 的 `dataset={constName}` 引用之。运行时 `row.rawData.actions[i].icon` 即该 BuildNode。
- `collectRelativeCVs`（浅、跳过嵌套循环）仍供 stateBuilder processLoop 用（主树正常嵌套循环由内层自己 processLoop）；只有 `enrichScopedData` 用深度版。
- render fn body 内循环的 emit（强制 inline + dataVar 兜底）见 §9.x / [jsx-emitter.ts](api/src/codegen/jsx-emitter.ts) `emitLoop`。

### 10.5 resolveLoopData 数据源解析

```ts
function resolveLoopData(loop, ctx) {
  const data = loop.data as BindingValue  // state-builder 阶段还是 BindingValue
  if (data.pathType === 'absolute') {
    return getValueFromState(ctx.rawState, data.path) ?? []
  }
  // relative：沿 loop.loopScope 链向上找首个 absolute 起点
  let scope = loop.loopScope
  while (scope) {
    if (scope.loopNode.data.pathType === 'absolute') {
      const arr = getValueFromState(ctx.rawState, scope.loopNode.data.path)
      if (!Array.isArray(arr) || arr.length === 0) return []
      const firstItem = arr[0]
      return resolveBySegments(firstItem, pathToSegments(data.path)) ?? []
    }
    scope = scope.parent
  }
  return []
}
```

### 10.6 collectRelativeComputeds 收集

```ts
function collectRelativeComputeds(body) {
  const out = []
  const walk = (n) => {
    if (n.kind === 'loop') return   // 跳过嵌套循环（由内层自己处理）
    for (const v of Object.values(n.props ?? {})) {
      if (v?.type === 'computed' && v.pathType === 'relative') out.push(v)
    }
    if ((n.kind === 'component' || n.kind === 'html') && Array.isArray(n.children)) {
      for (const c of n.children) walk(c)
    }
  }
  for (const n of body) walk(n)
  return out
}
```

### 10.7 state.js 生成

```ts
const stateEntries: Record<string, any> = {}
// 1. binding → state.js
for (const binding of allFileUnits.bindingRefs) {
  stateEntries[binding.accessPath] = getValueFromState(rawState, binding.path)
}
// 2. computed (containsJSX:false) → 求值后进 state.js
for (const cv of allFileUnits.computedRefs) {
  stateEntries[cv.accessPath] = cv.transform(getValueFromState(rawState, cv.path), undefined)
}
// 3. loop 数据源 / 无 JSX enrichment → 已通过 processLoop 写入 ctx.stateEntries

// 序列化
return `export const initialState = ${JSON.stringify(stateEntries, null, 2)};`
```

### 10.8 循环 + containsJSX 分流

**默认形态（无 enrichment）**：
```jsx
// 父组件
function Page() {
  const items = initialState.items
  return <Menu>{(items || []).map((item, idx) => <ListItem data={item} key={idx} />)}</Menu>
}

// 模板
export const ListItem = ({ data }) => {
  const { name, count } = data
  return <Tag>{name}</Tag>
}
```

**含 JSX 的 enrichment（relative ComputedValue 含 containsJSX: true）**：
```jsx
// 父组件
function Page() {
  // 不需要 const enrichedItems = ...，直接用 state.js 的 items
  return <Menu>{(items || []).map((item, idx) => <ListItem data={item} key={idx} />)}</Menu>
}

// 模板（enrichedItems 自己声明）
import initialState from '../../state'
const items_mainListEnriched = [
  { name: 'a', jsxField: <Tag title="A" /> },
  ...
]

export const ListItem = ({ data }) => {
  // data 已经被父组件 enrich 过了
  const { name, jsxField } = data
  return <div>{jsxField}</div>
}
```

### 10.9 ComputedValue 升级

```
BuildTrees: 路径绑定产 BindingValue
Transform: 决定升级为 ComputedValue（写入 props）
State-builder: 编译期调 transform 算值，结果进 state.js / jsx-literal / enrichment
```

### 10.10 fileUnit 数据结构

```ts
interface FileUnit {
  fileKey: string                                    // 'main' | 'modules/Foo' | 'components/ItemTemplate'
  bindingRefs: BindingValue[]                        // 绝对 binding 对象引用
  computedRefs: ComputedValue[]                      // 绝对 computed（containsJSX:false）对象引用
  jsxLiteralConsts: Array<{ name: string; value: any }>
  enrichmentConsts: Array<{ name: string; value: any[]; containsJSX: boolean }>
}

interface StateBuilderResult {
  stateContent: string                               // state.js 完整内容
  newState: Record<string, any>
  fileUnits: Map<string, FileUnit>                   // 按文件 key 索引
  loopEnrichmentMap: Map<string, { constName: string }>   // tree-finalizer 用
}
```

### 10.11 文件顶部 const 生成规则

每个产物文件按顺序生成 const 区域：

| 来源 | 形态 | 示例 |
|------|------|------|
| `bindingRefs + computedRefs` 的 accessPath 并集 | 0 个：无 const<br>1 个：单行<br>≥2 个：destructure | `const {a, b, c} = initialState;` |
| `jsxLiteralConsts` | 每个一行 | `const headerJsx = <Header ... />;` |
| `enrichmentConsts` | 每个一行 | `const items_mainListEnriched = [...];` |
| `moduleTopConsts`（tree-finalizer B4） | 每个一行 | `const nav_dataset = ...;` |
| `componentInternalConsts`（tree-finalizer lift + useState） | 进函数体 | `const [val, setVal] = useState(...);` |

---

---

## 十一、循环模板

### 11.1 默认形态

```jsx
// 父组件
function Page() {
  const items = initialState.items
  return (
    <Menu>
      {items.map((item, idx) => <ListItem key={idx} data={item} />)}
    </Menu>
  )
}

// components/ListItemTemplate.jsx
// body 根节点只有 1 个 → 不要额外空标签
export const ListItemTemplate = ({ data }) => {
  const { name, count, user } = data
  return <Button label={name} />
}

// body 根节点 >= 2 个 → React.Fragment
export const ListItemGroup = ({ data }) => {
  const { name, count } = data
  return (<><Button label={name} /><Tag>{count}</Tag></>)
}
```

### 11.2 containsJSX: true 触发分支

- 条件：循环 body 内任一 ComputedValue 含 `containsJSX: true`
- 机制：父组件预 enrich（Route C）
- 关键：**产物代码中无转换函数痕迹**，纯净 JSX

### 11.3 命名规则（统一 camelCase，无下划线）

**propRoute const 命名**（`applyPropRoute` 提升的 moduleTopConsts / componentInternalConsts，`liftLiteralTwoWayBindings` 提升的 useState 声明）：

```
${lowerCamel(componentName)}${Capitalize(propKey)}${nodeId}
```

- 有 componentName + nodeId：`buttonIconHdrHelpBtn`（component=Button, propKey=icon, nodeId=hdrHelpBtn）
- 只有 componentName：`buttonIcon`
- 只有 nodeId：`hdrHelpBtnIcon`
- 都没有：兜底 `nodeIcon`（不该发生）

**Computed key 命名**：

```
${lowerCamel(componentName)}${Capitalize(propKey)}${nodeId}
```

- 同样格式，便于归位
- 实际由 `identResolver` 提供时优先

**enrichment const 命名**（含 enrichment 的循环）：

```
${pathTopKey}_${parentNodeId}Enriched
```

- 例：`items_mainListEnriched`（path=/listItems, parentId=mCnList）
- 仍保留下划线分隔以与 propRoute 区分

### 11.4 单层 destructure

仅解包一级字段，嵌套用 `user.email` 形式。

---

## 十二、待清理的遗留

> 已完成项不再列（见 §1.5 进度表）。仅记录代码中尚存的遗留：

| 遗留 | 位置 | 说明 |
|------|------|------|
| `LoopNode.route` 占位字段 | `core/node-types.ts` | 字段保留但无消费方，参考性占位，非必须 |
| `#resolveRelativeBindingValue` | `steps/build-trees.ts` | relative path 的 stateValue 快照求值，BuildTrees 阶段仍调用；语义上 relative 的 stateValue 无意义，待清理 |
| `BindingValue.stateValue` | `core/value-types.ts` | BuildTrees 写入，`scoped-enrichment.ts` 透传给 enrichScopedData；当前仍有消费方，保留 |

---

## 十三、调试运行

```bash
# 编译检查
npx tsc --noEmit

# 跑管线（读 pages-source/，写入 output/）
npx tsx cli.ts
```

---

## 十四、本方案关键要点

1. **节点和值类正交**：`kind` 决定节点类型（5 类），`type` 决定值类型（7 类）
2. **五类节点**：ComponentNode / HtmlNode / TextNode / ExtractNode / **LoopNode**（LoopDescriptor 升级版）
3. **万物都是对象**：TextNode 显式化，无裸字符串 children
4. **LoopScope 节点作用域链**：每个节点可挂 `loopScope?: LoopScope`，BuildTrees 阶段构建，下游所有阶段可见
5. **ExtractRoute 三路由**：`inline` / `module-top` / `component-internal`
6. **`UseStateMarker` 共享**：跨 BindingValue / LiteralValue 共用 useState 触发标记，`event` 字段直接传 prop 名（`onChange`/`onInput`/...）
7. **`LiteralValue` 独立**：字面量不再混入 BindingValue；仅 transform 创建，BuildTrees 不创建
8. **node / Value 两套工厂平行**：值类走 `Value.*`，节点走 `Node.*`（如 `Node.loop()`）
9. **编译期计算**：ComputedValue.transform 跑在 FileGenerator，不产运行时代码
11. **route 字段**：在节点/值类上的 route 占位保留，但实际消费主要在 PropRoute（ComponentNode.propRoute）；propRoute 控制模块顶部 vs 函数体内常量
12. **循环 + containsJSX 分流**：
    - 循环内无 containsJSX computed → enriched 数组进 state.js
    - 循环内有任一 containsJSX computed → enriched 数组进**循环模板自己的 moduleTopConsts**（不进 state.js）
13. **icon 收集三路**：字面量 prop / DataBinding 引用 state 取值 / API 解析（`IconCollector.resolveAll`）
14. **HTML value 下沉**：TEXT_ELEMENTS ∩ ¬VALUE_ATTR_ELEMENTS 且 props.value 存在
15. **根节点判定**：body.length === 1 直接；>= 2 用 Fragment
16. **Computed key 命名**：`{componentName}{propKey}{nodeId}` camelCase
17. **resolveIcon 直接构建**：不需要走 transform，build Icon 组件节点
18. **BindingValue.stateValue**：BuildTrees 阶段按 path 取一次的编译期快照（absolute 直接 / relative 借助 loopStack 遍历找首个 absolute），找不到写 null
19. **nodeId / componentName / propKey 来源标记**：保留字段但当前无消费方；后期可能用作调试/溯源
20. **state-builder**：直接走树消费 binding/computed（见 §10）
21. **prop-key 级出口声明**：ComponentNode 新增 `propRoute?: Record<string, ExtractRoute>` 字段，专供非 path 绑定的字面量 prop；未声明默认 inline；path 绑定走 `BindingValue.route` 不进入 propRoute
22. **propRoute const 命名（小驼峰）**：`${lowerCamel(componentName)}${Capitalize(propKey)}${nodeId}`——例：`buttonIconHdrHelpBtn`。`applyPropRoute` 和 `liftLiteralTwoWayBindings` 共用 `makePropRouteName` 工具。详见 §10一.3
23. **嵌套循环上下文**：`BuildContext.loopStack` 维护当前循环栈，relative path 求值时从栈顶向栈底找首个 `pathType === 'absolute'` 的循环 dataBinding 作为根起点，循环数据源必为数组，取 `[0]` 作为首项
24. **路径取值分上下文**：`TransformContext.resolveAbsoluteStateValue`（NodeMapper 阶段，transform 内用，**仅绝对路径**）与 `ComputedTransformCtx.resolveValueFromPath`（state-builder 阶段，ComputedValue.transform 内用，绝对/相对都支持 per-item）。组件 transform 不再创建节点级包装，相对路径的 per-item 解析归 cvCtx
25. **accessPath 语义收拢**（`core/access-path.ts`）：平面 vs 嵌套的引用/destructure/const 名规则一处定义（`isFlatAccessPath` / `stateRef` / `jsxConstName` / `computedJsxConstName`），stateBuilder / treeFinalizer / jsxEmitter / fileAssembler 共用。嵌套绝对→`initialState.ap`（不 destructure）；嵌套 containsJSX computed→const 名小驼峰（`brandInfo.logoIcon`→`brandInfoLogoIcon`）；相对嵌套富集→`setNested` 写嵌套位置 + `structuredClone` 防 rawState 污染。详见 §3.9 / §10.4。矩阵测试页 matrixTest（尚未加入仓库）覆盖 absolute/relative × flat/nested × binding/computed/containsJSX 全 cell

---

## 十五、FileGenerator 阶段拆分

按"处理层 + 序列化层 + 文件装配"三层切分为多个 codegen 模块。

### 15.1 codegen 模块流（FileGenerator.execute）

```
state-builder     → stateContent (state.js) + 文件单元 FileUnit（bindingRefs/computedRefs/jsxLiteralConsts/enrichmentConsts）
                   走树消费 binding/computed（详见 §10）
                     ↓
tree-finalizer    → mainFile (FileDraft) + extractedFiles (PendingExtractedFile[])
                   DFS：applyPropRoute（propRoute 提升 + useState event handler）→ liftLiteralTwoWayBindings（useState 声明）→ resolveChildren
                     ↓
style-converter   → StyleResult（lessFiles）+ 增量 styleImportMap
                   在 tree-finalizer 之后跑：convertPage(pageName, finalResult.mainFile.rootTree, finalResult.extractedFiles)
                   用 final extractedFiles（已过滤被 mapping 消化/force-inline 的循环模板）→ 不产孤儿 .less
                     ↓
import-collector  → 每文件 ImportMap（按文件维度，可叠加 state-builder 的结果）
                   walkForImports 遍历组件 children + props + wrapper + renderFn body，
                   递归扫描 prop 值中嵌入的 BuildNode 并收集其 import；
                   dotted tag（如 DatePicker.RangePicker）自动取左半部分作 default import 名
                     ↓
jsx-emitter       → BuildNode 树 / PropValue → JSX 字符串
                     ↓
file-assembler    → 把 FileDraft + stateContent + styleImportMap 拼成 GeneratedFile：
                     ├─ state.js（直接写）
                     ├─ index.jsx（主页面，PascalCase{Name}Page 函数 + import + 渲染）
                     ├─ modules/{Name}.jsx（default function + 模块内部 const）
                     └─ components/{Name}Template.jsx（named export + destructure）
                     ↓
const 值样式补全  → collectRulesFromValue 把 jsxLiteralConsts/enrichmentConsts/moduleTopConsts 的 className 规则
                   并入对应 lessFile（#augmentStyleFromConsts）
```

> 样式提取原先在独立 GenerateStyles 步骤（tree-finalizer 之前）跑，用 `mp.extracts`（含被 mapping 消化/force-inline 的循环模板）→ 产有 .less 无 .tsx 的孤儿。现已合并进 FileGenerator、挪到 tree-finalizer 之后用 `finalResult.extractedFiles`。

---

## 十六、设计决策

循环模板 / CSS Modules / 命名规范三个维度的设计决策。

### 16.1 循环模板 destructure 模式

模板 body 内相对 binding 序列化为裸名引用：模板顶部 `const { col1Bottom, col1Top, ..., col9Top } = data;`，body 内直接 `{col1Top}`。
父组件循环体简化为：
```jsx
{(secondaryTabs || []).map((item, idx) => <MCnSecondaryTabItemTemplate data={item} key={idx} />)}
```

实现：
- `jsx-emitter` 加 `EmitOptions.inTemplate: true`
- `emitValue` 在 inTemplate 模式下，相对 binding 渲染为 `{accessPath}`（去掉 `item.` 前缀）
- `file-assembler.assembleComponentTemplate` 调用 `collectRelativeFields(body)` 收集 destructure 字段，在函数体顶部插一行
- `collectRelativeFields` 走遍 body 提取相对 binding `accessPath` 的首段（如 `user.email` → `user`）

**循环嵌套循环 + 内层 absolute 数据源**：`collectRelativeFields` 走外层 body 遇到内层循环时，检查内层 `loop.data`——仅 **relative**（外层 item 字段）才进外层 destructure；**absolute**（顶层 state/const，如 Tabs children `{path:"/stlTabsItemTabs"}` 嵌在外层循环里）跳过。`routeLoopNode` 给 `loop.data` varRef 设 `pathType`（enrich/absolute→`'absolute'`，relative→`'relative'`）供区分——absolute flat varRef 不带 `initialState.` 前缀，光靠前缀分不清顶层 vs 外层字段。否则外层会错误 `const { stlTabsItemTabs } = item` 解构顶层字段。详见 AGENTS §9.18。

### 16.2 CSS Modules + 命名 PascalCase

**规则：**
- 所有 less 文件名 PascalCase：`OrderAdmin.module.less`、`HeaderNavigation.module.less`、`MCnListItemTemplate.module.less`
- 主页面组件函数命名 PascalCase：`export default function OrderAdminPage()`
- 路由引用 `import OrderAdminPage from '../pages/orderAdmin'`
- 文件名与组件名严格对齐（同名 = PascalCase，`orderAdmin` → `OrderAdmin`）
- less 选择器不带 `_style` 后缀：`.hdrSystemName { ... }`（不再 `.hdrSystemName_style`）
- JSX 引用 `className={styles.hdrSystemName}`

**实现细节：**

| 模块 | 职责 |
|------|------|
| `tree-finalizer.ts` | `mainDraft.componentName = toPageComponentName(pageName)` —— PascalCase + 'Page'；`PendingExtractedFile` 扩展 `purpose` 字段 |
| `style-converter.ts` | 主页面 / module / template 三类都产 less；less 文件名按 PascalCase；`buildStyleImportMap` 按文件目录位置算相对路径：主页面 `./styles/`、modules/components `../styles/`（已从 GenerateStyles 合并进 style-converter，由 FileGenerator 在 tree-finalizer 后调用） |
| `tree-finalizer.ts` | `buildRefImportPath` 改用 `path.relative` + `./` 前缀保底（不再硬编码 `../../`） |
| `file-assembler.ts` | `collectLoopTemplateRefs` 递归走嵌套 LoopDescriptor 收集模板组件名；在主页面 / 模块文件 emit 时给每个引用注入 `import Component from '../components/Component.jsx'` |
| `jsx-emitter.ts` | `emitClassName` 简化到 `className={styles.${selfId}}`（CSS Modules）/ `className="${原字符串}"`（普通） |

### 16.3 字符 / 路径细则（产物层）

- 主页面 index.jsx 函数名严格 PascalCase + `Page` 后缀（与路由 `import OrderAdminPage from '../pages/orderAdmin'` 对齐）
- 类名清理：jsx-emitter 不再产 `${id}_style`，less selector 也不产 — 选择器和 JSX 引用同名
- 相对路径：tree-finalizer `buildRefImportPath` 用 `path.relative` + `./` 保底，不再硬编码
- 循环模板 import 自动注入：file-assembler 在 assembleMainPage / assembleModuleFile 时通过 `collectLoopTemplateRefs` 收集并注入 `import Comp from '../components/Comp.jsx'`

### 16.4 binding/computed → 引用规则收拢到 `bindingRef`（模板/const 共用）

binding/computed → 裸引用名的计算**只在一处**：[jsx-emitter.ts](api/src/codegen/jsx-emitter.ts) 导出的 `bindingRef(v, opts?)`。两个序列化器都调它，避免各写一份改一边漏另一边：

```ts
export function bindingRef(v, opts?) {
  if (v.type === 'computed' && v.containsJSX) return computedJsxConstName(v)   // 文件顶部 const 名
  const relPath = pathToJsAccess(v.accessPath ?? v.path)
  if (v.pathType === 'relative') { /* opts.inTemplate/inRenderFnBody 裸字段；主树循环 loopVar.field */ }
  return stateRef(v.accessPath ?? v.path)                                       // absolute：平面裸名 / 嵌套 initialState.ap
}
```

- **`emitValue`（jsx-emitter，模板/主树）**：**永远返回裸 JS 表达式**（不包 `{}`）。`{}` 是 JSX 语法层的事——调用方（`emitProps` → `key={${emitValue(...)}}`、`emitText` → `{${emitValue(...)}}`、`emitClassName` → `className={${emitValue(...)}}`）按上下文包。嵌套在对象/数组里的值直接调 `emitValue(vv, opts)`（裸）。
- **`serializeForConstValue`（file-assembler，抽离 const）**：同样永远裸（两者一致）。

**`emitValue` 分发顺序**（重要）：`null` → 原语（string/number/bool）→ 数组 → PropValue `type` 分发（varRef/rawExpr/renderFn/slotNode/binding/computed）→ **BuildNode**（`kind==='component'`，须在 `!v.__node` 之前，因 BuildNode 有 `__node` brand）→ `!v.__node`（普通对象字面量）→ 兜底 `null`。

**典型场景**：
- Chart `option.data`（absolute binding 嵌在 `option={{}}` 内）→ propRoute 提取 option 到 module-top const → `data: audTrdChartData`（裸引用 state 数组）。
- `<span>{audTrdCardTitle}</span>`（文本子节点 binding）→ `emitText` 包 `{}` → `{audTrdCardTitle}`。
- 顶级 prop `dataset={twoWorkorderList}` → `emitProps` 包 `{}` → `dataset={twoWorkorderList}`。
- 含 `type` 字段的普通数据对象（如 `{type:'primary', size:'lg'}`）→ `__node` 无 → 普通对象 → `{ type: "primary", size: "lg" }`（不被误判为 PropValue）。

> const 不含模板时走纯 JS（string JSON 引号、binding 裸引用）；含模板（BuildNode/renderFn）时委托 emit 逻辑（renderFn body 走 `emitNode`、BuildNode 走 `emitBuildNodeExpr`）。

