# 计划：className 支持 DataBinding（path 绑定）

> 状态：**暂不实施**。本文件是设计 + 改动清单，留待后续启动时直接据此执行。
> 最后分析日期：2026-09-04
> 相关深参考：[CLAUDE.md](./CLAUDE.md)、[AGENTS.md](./AGENTS.md)、[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 1. 背景与目标

### 现状
输入 JSON 中节点的 `className` 一律是**字符串字面量**（tailwind 工具类串，如 `"flex flex-col min-h-screen"`）。

### 目标
`className` 支持 **DataBinding 形式**——即 JSON 里 className 可以写成 `{ path: "/someState" }`（绝对）或 `{ path: "itemField" }`（循环内相对），管线把它当作"类串来源"，编译期从 state 取值并编译为 CSS，产物仍走 CSS Modules（`styles.xxx`）。

### 关键前提（用户澄清）
- **整个工程是管线工程，输入 JSON 数据是确定的**，只把 JSON 转译为代码。
- **不考虑运行时动态**：生成的 React 应用的运行时行为（数组 reorder、event 改写 state 等）不是管线的关切点。数据在编译期就是固定已知值。
- 因此"运行时 reorder 导致位置错位""运行时新冒出的类串无规则"等顾虑**不在范围内**。下文不再赘述。

---

## 2. 核心技术约束（决策依据）

### 2.1 `.{id}` 单选择器模型
[lib/convertTailwindToCSS.ts:822 `convertTailwindToLessRule`](lib/convertTailwindToCSS.ts#L822) 把一个节点的**所有** tailwind token 编译进**一条** `baseSelector`（style-converter 传 `.{nodeId}`）：

```less
.{nodeId} { display: flex; background: red; ... }   /* 全部 token 合进一个选择器 */
```

CSS Modules 把 `.selfId` 哈希成 `styles.selfId`，DOM 元素最终只挂一个哈希类名。**一个 `.{id}` 选择器是全有或全无**，无法让循环里不同 item 命中不同规则。

### 2.2 tailwind→CSS 是纯构建期操作
运行时无法重编译 tailwind。所以"DataBinding className 也要编译"的唯 coherent 解读：**编译期从确定 state 解析出类串，烘焙（bake）成静态 CSS**。

### 2.3 确定数据 → 可逐项解析
因为输入数据确定，循环数组在编译期可全量遍历（不是只取首项快照），每个 item 的 className 值都已知 → 可逐项产规则。这取消了"per-item 分化失败"的硬伤。

---

## 3. className 当前数据流（全管线追踪）

| 步骤 | className 形态 | 该步能拿到什么 | 备注 |
|---|---|---|---|
| **build-trees** | BindingValue（已带 `stateValue` 快照） | state + loopStack（可遍历循环数组所有项） | `#processValue` 对任意 prop（含 className）的 `{path}` 已产 BindingValue；`#collectRelativeIconFromLoop` 是"遍历所有项"的范式 |
| build-trees 预扫描 `#collectEventMutatedPaths` | — | elements + state | 当前为 action 共享 path 收集；是 className 收集的天然扩展点 |
| **node-mapper** | 经 transform，className 流经 props | binding 本身 | 纯形状变换 |
| **state-builder** | `consumeValue` 走 props 收集 binding ref → fileUnits | state + 循环数据 | per-item 机制已有（`processLoop`/`applyScopedCV`） |
| **tree-finalizer** | path binding 留 props（不走 propRoute） | 最终树 | 有 propRoute/useState lift 机制可复用 |
| **style-converter** | 走最终树读 `props.className` | 最终树 + `node.id`，**无 page state** | 只能靠 binding 自带 `stateValue` 快照；`readPropClassName` 对非 string 返回 null |
| **file-generator** | 调上面各步 | **有 `mappedPage.state`** | 是把 state 注入 style-converter 的位置 |
| **jsx-emitter** | `emitClassName` | emit 上下文 | CSS Modules 分支恒输出 `styles.{id}`，**忽略 value** |

### 映射文件对 className 的三类处理（transform 层）

- **A 类 纯透传**（`outputProps.className = props.className`）：~45 个映射。值层面对 BindingValue 直接拷贝引用，OK。本身无需改。
- **B 类 `splitWidthToStyle(props.className)`**（取 `remainCn`）：10 个文件
  - eview-react：Input / Select / TextArea / Slider / DatePicker / TimePicker / HexField / IpInput
  - eview-ui 副本：Input / TimePicker
  - 破坏方式：[split-width-style.ts:40](api/src/codegen/split-width-style.ts#L40) 对非 string 返回 `{ className: null, widthStyle: null }` → DataBinding className 静默丢弃。
- **C 类 字符串拼接**：仅 [eview-ui Tag](api/config/mappings/eview-ui/Tag.ts#L126)（`classNameParts.join(' ')`，line 137 已有 `typeof === 'string'` 守卫）。DataBinding 被丢，仅 `'filled'` 入串。

---

## 4. 收敛设计

### 4.1 绝对路径 className（不在循环）
编译期从 state 取该 path 的串 → 编译进 `.{nodeId}` 规则 → JSX `styles.{nodeId}`。

- emit 端**已是此行为**（[jsx-emitter.ts:298](api/src/codegen/jsx-emitter.ts#L298) CSS Modules 分支恒输出 `styles.{autoBase}`）。
- 唯一缺失：style-converter `readPropClassName` 对非 string 返回 null 不编译。
- **改动极小**：让 style-converter 对 BindingValue 读 `stateValue`（或注入 state 解析 path）编译即可。

### 4.2 循环内相对路径 className（确定数组，逐项已知）
1. 收集：沿循环数据源遍历**所有项**，取每项 className 值 → `string[]`（每项一条）。
2. 编译：每项产一条规则 `.item0 {} .item1 {} ...`（按节点命名空间避免多循环撞名）。
3. 文件顶部产常量数组：
   ```js
   const itemClasses = [styles.item0, styles.item1]   // 全静态 styles.xxx 访问
   ```
4. map 内：`className={itemClasses[idx]}`

### 4.3 为何用 const 数组而非 `styles[`item${idx}`]`
`styles[\`item${idx}\`]` 是 CSS Modules **计算式键访问**反模式：postcss-modules 无法静态分析用到了哪些类名 → 失去死代码剔除，部分实现会 warn。
const 数组形式把 `styles.item0/item1` 全部写成**静态成员访问**，运行时只在本地数组上下标取值，不碰 styles 对象。生成代码质量更稳。

> 备选（不采用）：值映射 `const classMap = {'flex': styles.x, ...}; className={classMap[item.cls]}`——按值查表、去重、reorder-safe。但本工程数据确定、无运行时顾虑，索引方案更简，采用索引。

---

## 5. 必须处理的管线点：className binding 的"消费"

className binding 在编译期被烘焙（进 less + const 数组），**运行时 JSX 不再引用它的 state path**。所以该 binding 不能再流到 state-builder 当普通 binding 收集，否则产**死 destructure**（`const cls = initialState...` 无人引用）。

### 处理方式（与现有 lift 机制同构）
tree-finalizer 已有 propRoute / useState lift。对 className binding：
- 提升为 const 数组声明（loop）或直接 `styles.{nodeId}`（absolute，无需 const）
- prop 值替换为 `RawExprValue`：
  - absolute：值不变（emitClassName 已输出 `styles.{nodeId}`），binding 在 transform/style-converter 消费后从 props 移除/标记已消费
  - loop：`Value.rawExpr({ value: 'itemClasses[idx]' })`
- 下游 state-builder 不再收到该 binding → 无死代码

> 待定细节：absolute 的 binding 怎么从 props "消失"以避免 state-builder 收集——是在 transform 里把 className binding 解析后替换为占位/移除，还是 tree-finalizer 统一 lift。计划阶段需定。

---

## 6. 收集时机与注入点

### 6.1 收集（值解析）
两个候选，二选一（计划阶段定）：
- **(a) 扩展 build-trees 预扫描** `#collectEventMutatedPaths`（[build-trees.ts:209](api/src/steps/build-trees.ts#L209)）：已遍历 elements + state。扩展收集 className binding：
  - absolute：state 直取
  - relative：沿 `children={path, componentId}` 定位循环数组、遍历所有项取值
- **(b) build-trees 树遍历** 内收集（loopStack 已 live）：与 `#collectRelativeIconFromLoop` 同范式，把值集合（absolute: string；loop: string[]）挂到 binding 上（如新增 `collectedClassStrings`）。

推荐 (b)：贴合现有 snapshot / icon 收集范式，挂载到 binding 后下游统一消费。

### 6.2 编译（style-converter）
- 需 file-generator 把 `mappedPage.state` 注入 style-converter，**或** style-converter 直接读 binding 上挂载的 collected 值（推荐后者，零状态注入）。
- absolute：从 collected string 编译进 `.{nodeId}`。
- loop：从 collected `string[]` 逐项编译进 `.item{i}`（命名空间：`.{nodeId}__item{i}` 或 `{loopVar}` 前缀防撞）。

### 6.3 const 注入（tree-finalizer / file-assembler）
- tree-finalizer 注册 const 数组声明进文件单元（复用 moduleTopConsts 机制）。
- file-assembler 顶部 emit（已有 buildFileTopConsts 机制）。

### 6.4 emit（jsx-emitter）
- `emitClassName` 对 className binding：
  - absolute：`styles.{nodeId}`（不变）
  - loop：`itemClasses[idx]`——需把 const 名 + 循环 idx 上下文传到 emit
- 因 prop 值已替换为 `rawExpr`，emit 走通用 `emitValue` → rawExpr 分支输出裸串；`emitClassName` 的 CSS Modules 强制 `styles.{id}` 分支需对 rawExpr/rawExpr-from-classname 放行（不强制覆盖）。

---

## 7. 改动清单（文件级，按实施顺序）

### P0 — codegen 核心（决定特性是否通）

| # | 文件 | 改动 |
|---|---|---|
| 1 | [api/src/codegen/style-converter.ts](api/src/codegen/style-converter.ts) `readPropClassName` / `collectRulesFromNode` / `collectRulesFromValue` | className 是 BindingValue 时读 collected 值编译：absolute → `.{nodeId}`；loop → 逐项 `.item{i}` 规则 |
| 2 | [api/src/codegen/split-width-style.ts](api/src/codegen/split-width-style.ts) `splitWidthToStyle` / `extractIconSizeFromClassName` | 参数是 BindingValue 时读 collected 串再拆宽度类（→ inputStyle/iconSize）；B 类 10 个调用点零改动 |
| 3 | [api/src/codegen/tree-finalizer.ts](api/src/codegen/tree-finalizer.ts) | className binding lift：absolute 消费掉 binding；loop 产 const 数组声明 + prop 值替 `rawExpr('itemClasses[idx]')` |
| 4 | [api/src/codegen/file-assembler.ts](api/src/codegen/file-assembler.ts) `buildFileTopConsts` | emit className const 数组（复用 moduleTopConsts 通路） |
| 5 | [api/src/codegen/jsx-emitter.ts](api/src/codegen/jsx-emitter.ts) `emitClassName` | CSS Modules 分支放行 rawExpr（来自 className binding 的 `itemClasses[idx]`），不强制 `styles.{id}` |

### P1 — 映射文件

| # | 文件 | 改动 |
|---|---|---|
| 6 | [api/config/mappings/eview-ui/Tag.ts](api/config/mappings/eview-ui/Tag.ts) | variant `'filled'` 与 className binding 合并：`'filled'` 进 collected token 集合 + 产 `itemClasses`/`styles` 时并入 |
| 7 | B 类 10 个 splitWidthToStyle 调用点 | 若 #2 在 split-width-style 内部统一处理则**零改动**；否则逐个加 `typeof === 'string'` 守卫。推荐 #2 内部统一 |

### P2 — 收集

| # | 文件 | 改动 |
|---|---|---|
| 8 | [api/src/steps/build-trees.ts](api/src/steps/build-trees.ts) | 扩展预扫描或树遍历收集 className binding 的 collected 值（absolute: string；loop: string[] 全量），挂到 binding |

### P3 — 测试

| # | 改动 |
|---|---|
| 9 | split-width-style 单测加非 string（BindingValue + collected）用例 |
| 10 | 受影响 mapping 单测（Input/Select/Tag 等）加 DataBinding className 用例 |
| 11 | e2e：新增含 DataBinding className 的 fixture 页（放 `pages-source/`，加进 `PAGES`），含：①absolute binding className ②循环内 per-item 不同类串。生成两库（react + ui）快照 |
| 12 | 跑 `config.id=true` + tailwind-converter CLI 块后 `npx vitest run -u test/e2e`，review delta 后接受 |

---

## 8. 实施分阶段（建议）

- **阶段 1（baseline）**：absolute className binding 通——只改 #1（style-converter 读 stateValue）+ #8（收集 absolute）。最小可跑，先验证 `styles.{nodeId}` 路径。
- **阶段 2**：loop className binding——#1(loop) + #3 + #4 + #5 + #8(loop)。
- **阶段 3**：mapping 连带（#6 Tag、#7 宽度类）+ 测试（#9-#12）。

---

## 9. 遗留 / 待定（启动时定）

1. **absolute binding 如何从 props "消失"** 以避免 state-builder 死 destructure：transform 内解析后移除 vs tree-finalizer 统一 lift。
2. **loop const 命名空间**：`itemClasses` 在多循环同文件会撞名，需按 nodeId/componentName 唯一化（如 `{nodeId}Classes`）。
3. **宽度类（w-*）在 binding 时**：静态拆分（→ inputStyle）在 binding 时跳过，还是从 collected 串里抽？语义上宽度类是 tailwind 静态 token，运行时类串无法静态拆——但数据确定下可从 collected 串拆。计划阶段定。
4. **collectRulesFromValue**（const 值内 className，如 resolveIcon 产物的 className）是否也需支持 binding——目前 const 值内 className 多为静态串，暂不扩展，e2e 兜底。
5. **非 CSS Modules 模式**（`config.css=false`，legacy、当前对 className 本身已不 coherent）：暂不处理，仅保证 CSS Modules 默认模式。

---

## 10. 不做 / 显式排除

- 运行时动态 className（event 改写 state 后类串变化跟随）——tailwind 构建期编译固有边界。
- 运行时新冒出的类串（编译期没收集过）无规则——同上。
- 非 CSS Modules 模式的 className binding——legacy，out of scope。
- 值映射（`classMap`）方案——数据确定无运行时顾虑，索引方案已足够，不引入。
