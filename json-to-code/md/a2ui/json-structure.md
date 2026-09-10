# A2UI JSON 结构规范

## 1. 顶层结构

JSON 是一个包含三个顶层 key 的单一对象：`state`、`rootId`、`elements`。

| 字段 | 类型 | 说明 |
|---|---|---|
| `state` | `object` | 定义动态数据，用于双向绑定 |
| `rootId` | `string` | 最外层容器元素的 ID |
| `elements` | `array` | 扁平数组，定义完整 UI 的所有元素 |

**关键约束**：
- 字段输出顺序**必须**为：`state` → `rootId` → `elements`
- 必须对照 Schema 验证 JSON 格式合法性

```json
{
  "state": { ... },
  "rootId": "root",
  "elements": [
    { "id": "root", "component": "div", "props": { "className": "flex flex-col" }, "children": ["headerTitle", "mainBtn"] },
    { "id": "headerTitle", "component": "span", "props": { "className": "text-lg font-bold", "value": "标题文本" } },
    { "id": "mainBtn", "component": "Button", "props": { "type": "primary", "value": "确认" } }
  ]
}
```

## 2. Elements 数组结构

`elements` 是一个**扁平数组**，通过 ID 引用建立父子关系。支持 HTML5 标签 + A2UI 组件库组件 + Tailwind CSS 类名。

### 节点字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | ✅ | 全局唯一标识符 |
| `component` | `string` | ✅ | 组件名称（如 `Button`、`Table`、`div`） |
| `props` | `object` | ✅ | 组件属性 |
| `children` | `array` / `object` | ❌ | 子节点 |

### ID 命名规范

**必须**遵循 `[Zone][Module][Type]` 三段式 camelCase 模式：
- ❌ 错误：`btn1`、`actionBtnItem`（缺少 zone）、`div3`（无语义）
- ✅ 正确：`headerNavBtn`、`sidebarSearchInput`、`mainMetricCard`、`mainTableIdCell`

### Elements 关键约束

- **父在前**：父组件必须在 children 之前定义
- **扁平数组**：不要嵌套元素对象，通过 `children` 中的 ID 引用建立关系
- **唯一 ID**：每个元素的 `id` 必须全局唯一
- **完整引用**：`children` 中引用的每个 ID 都必须在 `elements` 数组中定义
- **完整渲染**：UI 树必须解析到所有叶子节点

## 3. Children 三种形式

### 静态子节点列表（数组）

```json
"children": ["node1", "node2", "node3"]
```
→ 直接按顺序渲染子组件。**children 数组只能包含元素 ID 引用，不能包含原始文本字符串。**

### 模板循环（对象，含 path + componentId）

```json
"children": { "path": "/userList", "componentId": "rowTemplate" }
```
→ 循环渲染 `state.userList`，每个元素使用 `rowTemplate` 组件模板。

### 无 children

→ 叶子节点，无子组件。

## 4. DataBinding（数据绑定）

数据赋值分为**静态字面量**和**动态指针**两类。

### 静态字面量

固定的 UI 文本，不引用 state：

```json
{ "value": "确认出行" }
```

### 动态指针

使用 `path` 对象指向 state 数据，遵循 JSON Pointer（RFC 6901）：

```json
{ "value": { "path": "/emailValue" } }
```
→ 绑定到 `state.emailValue`

```json
{ "children": { "path": "/employeeList", "componentId": "listItem" } }
```
→ 循环 `state.employeeList`，每项渲染 `listItem` 组件

**绝对路径 vs 相对路径**：
- **绝对路径**（带前导 `/`）：`{ "path": "/title" }` → `state.title`，引用根级 state
- **相对路径**（无前导 `/`）：`{ "path": "name" }` → 当前循环项的 `item.name`，仅在循环体内使用

### Slot 绑定

```json
{ "content": { "componentId": "tabItemContent" } }
```
→ 将插槽属性映射到指定的子元素 ID

### 数据绑定关键约束

- **Children 规则**：`children` 数组只能包含元素 ID 引用，**不能包含原始文本**
- **文本赋值**：HTML5 元素的文本**必须**通过 `props` 赋值（如 `span` 使用 `props: { "value": "Next" }`）
- **混合兄弟节点**：文本和元素共享同一父级时，**必须**用 `<span>` 包裹文本以生成 ID 引用
  - ❌ 错误：`<a>文本<icon/></a>`（原始文本无法生成 ID）
  - ✅ 正确：`<a><span>文本</span><icon/></a>`
  - ✅ 纯文本时直接用 `props.value`，不需要包裹
- **语义化 key**：state 中的数据 key 必须有清晰的语义（✅ `hotel_name`，❌ `val1`）
- **引用完整性**：每个 `path` 引用必须在 `state` 中存在

## 5. 循环生成

**语法**：`"children": { "path": "/employeeList", "componentId": "card_employee" }`
- `path`：指向 state 中的数据数组
- `componentId`：每项渲染使用的模板组件 ID

**关键约束**：
- **不强制循环**：只为结构相同的数据使用循环
- **不规则数据处理**：不均匀或不规则的信息结构**不要**强制循环，应使用静态字面量逐个展开

## 6. 组合组件与 Slot 语法

以下组件支持组合模式：`Tabs/TabItem`、`Steps/StepItem`、`Table/TableRow`、`Collapse/CollapseItem`、`Timeline/TimelineItem`。

### 相同结构 → 循环模式

当子项结构一致时，使用 path + componentId 循环：

```json
{
  "id": "mainSteps",
  "component": "Steps",
  "children": { "path": "/stepsData", "componentId": "stepItem" }
}
```

### 不同结构 → 静态列表模式

当子项各自结构不同或逻辑独立时，使用 ID 数组：

```json
{
  "id": "mainTabs",
  "component": "Tabs",
  "children": ["tabItemUser", "tabItemProduct", "tabItemServer"]
}
```

### Slot 语法

将属性映射到子元素：

```json
{
  "id": "tabItem",
  "component": "TabItem",
  "props": {
    "key": { "path": "id" },
    "label": { "path": "name" },
    "content": { "componentId": "tabItemContent" }
  }
}
```
- `key` / `label` / `icon`：从当前数组项直接映射的相对数据绑定
- `content`：插槽绑定，**必须**使用 `{ "componentId": "elementId" }` 引用复杂结构节点

## 组件分类

| 类别 | 组件 |
|---|---|
| **HTML** | `div`、`span`、`p`、`img`、`a` 等 |
| **通用** | `Button`、`Icon` |
| **数据录入** | `Input`、`TextArea`、`Select`、`Checkbox`、`CheckboxGroup`、`RadioGroup`、`Switch`、`DatePicker`、`TimePicker`、`InputNumber`、`Rate`、`Slider` |
| **数据展示** | `Table`、`TableRow`、`Tag`、`Badge`、`Timeline`、`TimelineItem`、`Collapse`、`CollapseItem`、`Divider`、`Carousel`、`Segmented`、`Tree` |
| **导航** | `Tabs`、`TabItem`、`Breadcrumb`、`Steps`、`StepItem`、`Dropdown`、`Menu`、`Pagination` |
| **反馈** | `Progress`、`Modal`、`Drawer` |
| **图表** | `BarChart`、`LineChart`、`PieChart`、`RadarChart`、`GaugeChart`、`ProcessChart`、`AssembleBubbleChart`、`BubbleChart`、`BulletChart`、`CircleProcessChart`、`FunnelChart`、`HillChart`、`JadeJueChart`、`ScatterChart` |
