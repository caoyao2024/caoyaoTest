# A2UI → 目标组件库 映射差异对照表 (v2)

> 视角：A2UI JSON 是源/baseline，eview-react 映射是已完成的参照，eview-ui 映射是待完善。
> 对比核心：同一个 A2UI prop，映射到 eview-react 和 eview-ui 时分别做了什么不同的事。
> 仅记录 A2UI 中提到的属性/事件，A2UI 未提及的目标组件原生 prop 不纳入。
> 生成日期：2026-08-18

---
## 0. 全局差异

| 维度 | eview-react | eview-ui |
|------|------------|----------|
| 包名 | `@nce/eview-react` | `@cloudsop/eview-ui` |
| 图标包 | `@nce/icon-plus` | `@hui/icon-plus` |
| 映射方式 | 35 工厂 + 18 chart 别名 | 27 工厂复用 + 9 bespoke + 3 shared 手动组件 |
| 缺失组件 | 无 | Badge / Divider / Chart（eview-ui 无对应 → `@/shared/` 手动实现） |

---

## 1. 无差异组件

A2UI→目标的映射逻辑在 eview-react 和 eview-ui 间完全相同，工厂复用即可：

| A2UI 组件 | 目标 tag | 说明 |
|-----------|---------|------|
| Breadcrumb | Crumbs | `seprator` 拼写两库一致 |
| Carousel | Carousel | — |
| Checkbox | Checkbox | — |
| CheckboxGroup | CheckboxGroup | — |
| Collapse | Panel | — |
| CollapseItem | PanelItem | — |
| Icon | 动态 | 仅 iconPkg 不同，resolveIcon 机制一致 |
| Input | TextField | — |
| InputNumber | Spinner | — |
| Menu（vertical） | Accordion | — |
| Menu（horizontal） | Tab | — |
| Pagination | Paging | — |
| RadioGroup | RadioGroup | — |
| Segmented | SelectCard | — |
| Select | Select / MultipleSelect | — |
| Slider | DragInput | — |
| TabItem | TabItem（named from Tab） | — |
| Tabs | Tab | onClick 签名一致：`(index: string, title, e)`，extractor 无差异 |
| Timeline | TimeLine | — |
| Tree | Tree | — |

---
## 2. Shared 手动实现（eview-ui 缺失组件）

| A2UI 组件 | eview-react 目标 | eview-ui 目标 | 说明 |
|-----------|----------------|-------------|------|
| Badge | `@nce/eview-react/Badge` | `@/shared/Badge` | 映射层复用 eview-react 工厂换 sharedPkg，产出 props 完全一致 |
| Divider | `@nce/eview-react/Divider` | `@/shared/Divider` | 同上 |
| Chart（+18 变体） | `@nce/eview-react/Chart` | `@/shared/Chart` | 同上；shared Chart 内部用 `@hui/charts` |

**A2UI→目标映射逻辑无差异**，差异仅在运行时渲染实现。

---
## 3. bespoke 组件 —— 逐项 A2UI prop 映射差异

### 3.1 Button

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| `types: link` | 同组件 `status:'text'`（Button） | **切换组件** TextButton（tag/import 变更；selfClosing:true；仅 text/onClick/className） | eview-ui TextButton 是独立组件 |
| `types: link` + `value` | `status:'text'` + value→children | value→`text` prop | TextButton 专用 prop |
| 纯图标（icon 有 / value 无） | **切换组件** IconButton（selfClosing） | 普通 Button（icon→leftIcon/rightIcon，无 text） | eview-ui 不切 IconButton |
| `icon`（字面量） | resolveIcon→BuildNode→IconButton `iconName` / Button `prefixIcon` | resolveIcon→BuildNode→Button `leftIcon`/`rightIcon` | ⚠️ eview-ui Button 左/右图标 slot 名不同；且声明 `leftIcon: string?`，映射传 BuildNode，**需运行时确认** |
| `icon`（DataBinding） | ComputedValue+containsJSX→`prefixIcon` | ComputedValue+containsJSX→`leftIcon`/`rightIcon` | 同上 |
| `iconPlacement: end` | `suffixIcon` | `rightIcon` | prop 名不同 |
| `value`（普通） | children（TextNode） | `text` prop | eview-ui Button text 是 prop 不是 children |
| `color` | → `status` / `style.backgroundColor` | → `status` / `style.backgroundColor` | 值映射逻辑一致 |
| `size: medium` | 丢弃 | → `size: 'normal'` | eview-ui 可接受 |
| `shape: circle` | 丢弃 | → `style.borderRadius: '50%'` | eview-ui 可构造 |
| `className` | 透传 | 透传 | 一致 |
### 3.2 DatePicker

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| `value` | value / range（useState → onChange） | value / range（useState → onChange） | 一致 |
| `placeholder` | 透传 | 透传 | 一致 |
| `picker` | → `type` | → `type` | 一致 |
| `range` | 模式开关（literal true） | 同 | 一致 |
| `format` | **moment→Java**（YYYY→yyyy, DD→dd） | **直接透传**（eview-ui 用 moment 风格） | 核心差异，bespoke 正确 ✅ |
| `className` | 透传 | 透传 | 一致 |

### 3.3 Rate → Rating

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| `value` | ComputedValue/LiteralValue.useState（event: onClick） | 同 | 一致 |
| `count` | → `starCount` | → `starCount` | 一致 |
| `size` | → number（14/20/26） | → number（14/20/26） | 一致 |
| `disabled` | 透传 | 透传 | 一致 |
| `allowClear` | **丢弃**（eview-react 不支持） | **透传**（eview-ui Rating 支持） | bespoke 正确 ✅ |
| `onClick` extractor | `(val) => setter(val)` | `(val) => setter(val)` | ⚠️ eview-ui Rating `onClick(e: MouseEvent, value: number)`，应取第二参 `(_, val) => setter(val)`。eview-react 签名待确认，可能也有此问题 |

### 3.4 Switch → Toggle

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| 目标组件 | Switch | **Toggle**（tag/import 变更） | 组件名不同 |
| `value` | → `checked` + useState | → `toggled` + useState | prop 名不同 |
| `onToggle` extractor | `(checked) => setter(checked)` | `(checked) => setter(checked)` | ⚠️ eview-ui Toggle `onToggle(value: string)`，参是 string 不是 boolean，**需运行时确认** |
| `checkedChildren` | → `taggledChildren`（改名） | **丢弃** | eview-ui Toggle 无此 prop |
| `unCheckedChildren` | → `unTaggledChildren` | **丢弃** | 同上 |
| `checkedChildrenIcon` | resolveIcon→`taggledChildren`（覆盖文本） | **丢弃** | 同上 |
| `unCheckedChildrenIcon` | resolveIcon→`unTaggledChildren` | **丢弃** | 同上 |
| `size` | 丢弃 | 丢弃 | 一致 |
| `className` | 透传 | 透传 | 一致 |

### 3.5 Progress → ProgressBar

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| `percent` | → `current` + `max:100` | → `current` + `max:100` | 一致 |
| `status`（success/exception） | 透传 | **丢弃** | eview-ui ProgressBar 无 status |
| `status`（normal/active） | 丢弃 | 丢弃 | 一致 |
| `showInfo` | → `labelPosition` | → `labelPosition` | 一致 |
| `strokeColor` | → `barStyle.backgroundColor` | → `barStyle.backgroundColor` | 一致 |
| `className` | 透传 | 透传 | 一致 |

### 3.6 Steps

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| 目标组件 | `Steps` / `@nce/eview-react/Steps` | ⚠️ **应为 `Wizards` / `@cloudsop/eview-ui/Wizards`**（当前 bespoke 错写 `Steps`） | 🔴 import 路径不存在 |
| `current` | → `currentStep` | → `currentStep` | 一致 |
| `orientation` | → `direction`（改名） | ⚠️ **应为同名透传** `orientation`（当前 bespoke 丢弃，实际 Wizards 有此 prop） | 🟡 功能丢失 |
| children→data | WizardData 映射 | WizardData 映射 | 一致 |
| StepItem `icon` | resolveIcon→`iconUrl`（BuildNode） | ⚠️ **应为 `iconName`（string）**（当前写 `iconUrl`，但 WizardData 用 `iconName?: string`） | 🟡 类型不匹配 |

**children→data 映射明细：**

| StepItem 子字段 | → eview-react WizardData | → eview-ui WizardData | 差异 |
|----------------|------------------------|---------------------|------|
| title | text | text | 一致 |
| content | description | description | 一致 |
| icon（字面量） | resolveIcon→iconUrl（BuildNode） | ⚠️ 应透传 iconName（string） | icon 表达方式不同 |
| icon（DataBinding） | ComputedValue+containsJSX→iconUrl | ⚠️ 应 ComputedValue（transform 返回 string）→iconName | 同上 |
| status | status | status | 一致 |

### 3.7 TextArea

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| `value` | useState（onChange） | useState（onChange） | 一致 |
| `placeholder` | 透传 | 透传 | 一致 |
| `maxLength` | 透传 | 透传 | 一致 |
| `autoSize` | → `sizeAuto`（改名透传） | **丢弃** | eview-ui 无 sizeAuto |
| `className` | 透传 | 透传 | 一致 |

### 3.8 Dropdown

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| 目标组件 | `DropDown` / `@nce/eview-react/DropDown` | ⚠️ **应为 `Dropdown`**（小写 d）/ `@cloudsop/eview-ui/Dropdown`（当前错写 `DropDown`） | 🔴 大小写错误 + 映射到废弃版 |
| `menu`（字面量） | → `data`（扁平数组：label→text, key→value, icon→resolveIcon） | → `overlay`（`<Menu><Menu.Item>...</Menu.Item></Menu>` 组件节点子树） | 核心架构差异 |
| `menu`（DataBinding） | → `data` ComputedValue | → `overlay` Menu 内 LoopNode（template = Menu.Item + 相对绑定） | ⚠️ LoopNode 在 prop 值内仍待验证 |
| `placement` | → `position` + `popupDirection`（PLACEMENT_MAP 拆分） | ⚠️ **应直接透传** `placement`（eview-ui 新版 Dropdown 有此 prop；当前 bespoke 错用旧版 position+popupDirection） | 🔴 prop 映射错误 |
| `trigger` | → 首项 | → 首项 | 一致 |
| `className` | 透传 | 透传 | 一致 |

### 3.9 Tag

| A2UI prop | → eview-react | → eview-ui | 差异 |
|-----------|-------------|-----------|------|
| 目标组件 | `Tag` / `@nce/eview-react/Tag` | `Tag` / `@cloudsop/eview-ui/Tag` | 原属 `@/shared`，已迁移为 bespoke |
| `color`（字面量） | 枚举直传（COLOR_ENUM 校验） | 枚举直传（COLOR_ENUM 校验，同 eview-react） | 一致 ✅ |
| `color`（DataBinding） | ComputedValue + transform 校验 | ComputedValue + transform 校验 | 一致 ✅ |
| `variant`（solid） | → `fill: 'solid'`（无 ev_tag_fill） | 不加 `filled` className（CSS 走 solid 样式） | 实现方式不同 |
| `variant`（filled/outlined） | → `fill: 'outline'`（有 ev_tag_fill） | 追加 `filled` className（CSS 走 outline 样式） | 实现方式不同 |
| `variant` + `color=default` | → `fill` | 不受 variant 影响，不追加 `filled` | default 只有一种形态 |
| `icon` | resolveIcon→`iconName` + `hasIcon` | **丢弃**（eview-ui Tag 无 icon 属性） | ⚠️ eview-ui 差异 |
| `size` | small→small, medium→normal | small→**normal**（eview-ui 无 small） | ⚠️ eview-ui 差异 |
| `closable` | 透传 | **丢弃**（eview-ui Tag 不支持） | ⚠️ eview-ui 差异 |
| `type` | — | 不输出（eview-ui Tag 默认 type 生效） | 映射不设 type |
| `className` | 透传 | 透传（与 `filled` 合并） | 合并逻辑差异 |

## 4. 工厂复用但隐含差异 —— 需新增 bespoke

以下组件当前用 eview-react 工厂复用（只换 `pkg`），但 eview-ui 目标组件 API 与 eview-react 不兼容：

### 4.1 Drawer

| A2UI prop | → eview-react（工厂逻辑） | eview-ui 实际 API | 问题 |
|-----------|------------------------|-----------------|------|
| `open` | → `visible` + useState（onClose extractor） | → `visible` + useState（onClose extractor） | 一致 ✅ |
| `onClose` | 丢弃（extractor 语义实现） | 丢弃（extractor 语义实现） | 一致 ✅ |
| `placement` | 同名透传 | 同名透传 | 一致 ✅ |
| `mask` | → `showMask: boolean` | ⚠️ eview-ui **无 `showMask`**，走 `maskSetting: { show?: boolean }` 对象型 prop | 🟡 工厂产出 `showMask` 无效 |
| `title` | 同名透传 | 同名透传 | 一致 ✅ |
| `footer`（SlotNode） | resolve 后追加到 children | eview-ui Drawer 有 `footer: ReactNode \| false` prop，**可直接赋 prop** | 🟢 可优化（追加 children 仍可工作） |
| `className` | 透传 | 透传 | 一致 ✅ |

### 4.2 Table

| A2UI prop | → eview-react（工厂逻辑） | eview-ui 实际 API | 问题 |
|-----------|------------------------|-----------------|------|
| `dataSource` | → `dataset`（enrichScopedData） | → `dataset` | 一致 ✅ |
| `columns` | → columns（字面量/ComputedValue） | → columns | 一致 ✅ |
| `pagination` | → `enablePagination` + `recordCount` | 同 | 一致 ✅ |
| `rowSelection.selectedRowKeys` | → `checkedRows` + onRowCheck | → `checkedRows` + onRowCheck | 一致 ✅ |
| `expandable`（存在） | enableRowExpand + enableMulitiExpand | 同 | 一致 ✅ |
| `expandable.expandedRowKeys` | → `expandedRowKeys` + onRowExpendClick | ⚠️ eview-ui **无 `expandedRowKeys`**，prop 是 **`expandedRow`** | 🟡 工厂产出 `expandedRowKeys` 无效 |
| TableRow `expandedRowRender` | → `onRowExpend`（buildRenderFn） | → `onRowExpend`（buildRenderFn） | 一致 ✅ |
| `className` | 透传 | 透传 | 一致 ✅ |

### 4.3 Modal → Dialog

| A2UI prop | → eview-react（工厂逻辑） | eview-ui 实际 API | 问题 |
|-----------|------------------------|-----------------|------|
| `open` | → `isOpen` + useState | → `isOpen` + useState | 一致 ✅ |
| `onClose` | 丢弃（extractor 语义实现） | 丢弃 | 一致 ✅ |
| `mask` | → `modal: boolean` | → `modal: boolean` | 一致 ✅ |
| `title` | 同名透传 | 同名透传 | 一致 ✅ |
| `footer`（SlotNode） | resolve 后追加到 children | eview-ui Dialog 有 `buttons: Array<ButtonProps>`（结构化） | 🟢 可优化（追加 children 仍可工作；转 buttons 需解析 SlotNode 内容，不可控） |
| `className` | 透传 | 透传 | 一致 ✅ |

### 4.4 TimePicker

| A2UI prop | → eview-react（工厂逻辑） | eview-ui 实际 API | 问题 |
|-----------|------------------------|-----------------|------|
| `value` | → `time`（[h,m,s] 数组 + useState） | ⚠️ eview-ui TimePicker **用 `time` prop**（签名一致），但值可能是 string 非数组 | ⚠️ 需确认 |
| `format` | antd→eview-react（HH→hh） | eview-ui 支持 `format: string`（moment 风格），应**直接透传**如 DatePicker | 🟡 工厂做转换可能不适用 |
| `disabled` | 透传 | 透传 | 一致 ✅ |
| `placeholder` | **丢弃** | ⚠️ eview-ui **支持** `placeholder: string` | 🟡 应透传 |
| `allowClear` | 不在 A2UI schema 中 | — | N/A |
| `className` | 拆分 width→timeStyle | 同 | 一致 ✅ |

---