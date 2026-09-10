# Checkbox

**Import:** `import Checkbox from '@cloudsop/eview-ui/Checkbox'`

## 基本用法

### 基础复选框

```tsx
import Checkbox from '@cloudsop/eview-ui/Checkbox'

function Example() {
  return (
    <Checkbox
      label="同意协议"
      value="agree"
      onChange={(value, checked) => console.log(value, checked)}
    />
  )
}
```

### 半选状态

```tsx
import Checkbox from '@cloudsop/eview-ui/Checkbox'

function Example() {
  return (
    <Checkbox
      label="全选"
      halfChecked
      halfToChecked
      onChange={(value, checked) => console.log(value, checked)}
    />
  )
}
```

### 禁用状态

```tsx
import Checkbox from '@cloudsop/eview-ui/Checkbox'

function Example() {
  return <Checkbox label="不可操作" disabled />
}
```

### 文本位置

```tsx
import Checkbox from '@cloudsop/eview-ui/Checkbox'

function Example() {
  return (
    <>
      <Checkbox label="文本在右" labelPosition="after" />
      <Checkbox label="文本在左" labelPosition="before" />
    </>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 设置 Checkbox 的 id |
| name | `string` | - | 设置组件的 name |
| className | `string` | - | 通过自定义类控制 checkbox 的整体样式（最外层 div） |
| style | `object` | - | 通过自定义 style 控制 checkbox 的整体样式（最外层 div） |
| checkboxClassName | `string` | - | 通过自定义类控制 checkbox 的图标尺寸以及颜色 |
| checkboxStyle | `object` | - | 通过自定义 style 控制 checkbox 的图标尺寸以及颜色 |
| labelClassName | `string` | - | 通过添加 class 控制 label 的样式以及 checkbox 与文本之间的间距 |
| labelStyle | `object` | - | 通过添加 style 控制 label 的样式以及 checkbox 与文本之间的间距 |
| label | `string` | - | 设置 Checkbox 的展示文本值 |
| text | `string` | - | 设置 Checkbox 的展示文本 |
| children | `ReactNode` | - | Checkbox 子内容 |
| value | `string` | - | 设置 Checkbox 在数据库中存取的 value |
| labelPosition | `'before' \| 'after'` | `'after'` | 设置文本值在图标左侧还是右侧，before 代表文本在左边，after 代表文本在右边 |
| disabled | `boolean` | `false` | 设置 checkbox 的灰化 |
| checked | `boolean` | `false` | 设置 Checkbox 是否是选中状态 |
| halfChecked | `boolean` | `false` | 设置 Checkbox 的半选状态 |
| halfToChecked | `boolean` | - | 设置 Checkbox 从半选状态点击后是否变为全选 |
| onPreChange | `(value: string \| undefined, checked: boolean, e: MouseEvent<HTMLSpanElement>) => unknown` | - | 设置 Checkbox 的预变更事件，返回值可阻止 onChange |
| onChange | `(value: string \| undefined, checked: boolean, e: MouseEvent<HTMLSpanElement>, additionalData: object \| undefined) => unknown` | - | 设置 Checkbox 的 onChange 事件 |
| onFocus | `(value: string \| undefined, checked: boolean, e: FocusEvent) => unknown` | - | 设置 Checkbox 的聚焦事件 |
| onBlur | `(value: string \| undefined, e: FocusEvent) => void` | - | 设置 Checkbox 的失焦事件 |
| additionalData | `object` | - | 从上层组件传递附加数据，配合 onChange 属性使用，作为 onChange 回调函数的第四个参数 |
| tipText | `string` | - | 配置 Checkbox 气泡提示内容 |
| tipData | `object` | `{}` | 配置 Checkbox 气泡提示，参考 Tooltip |
| boxTabIndex | `string` | `''` | 定制 Checkbox 的 tabIndex |
| iconClassName | `string` | - | 自定义图标 className |
| iconStyle | `object` | - | 自定义图标 style |
| icon | `string` | - | 自定义图标 |
| onKeyDown | `KeyboardEventHandler<HTMLSpanElement>` | - | 键盘按下事件 |
| required | `boolean` | - | 设置组件是否为必填项 |
| version | `string` | - | 设置组件版本（影响样式类名） |
| theme | `string` | - | 设置组件主题 |

## 注意事项

- `halfChecked` 为 `true` 时显示半选状态（横线），常用于全选/反选场景
- `halfToChecked` 控制从半选状态点击后的行为：为 `true` 时变为全选，否则变为未选
- `onPreChange` 在 `onChange` 之前触发，返回值可用于阻止后续的 `onChange` 调用
- `label` 和 `text` 均可设置展示文本，`children` 也可用于渲染自定义内容
