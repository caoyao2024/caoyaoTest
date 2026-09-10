# Select

**Import:** `import Select from '@nce/eview-react/Select'`

## 基本用法

### 基础下拉选择

```tsx
import Select from '@nce/eview-react/Select'

function Example() {
  const [value, setValue] = React.useState('')

  const options = [
    { text: '选项一', value: '1' },
    { text: '选项二', value: '2' },
    { text: '选项三', value: '3' },
  ]

  const handleChange = (value: any, oldValue: any, text: any, oldText: any, event: any) => {
    setValue(value)
  }

  return (
    <Select
      label="选择"
      options={options}
      value={value}
      onChange={handleChange}
      defaultLabel="请选择"
    />
  )
}
```

### 带清除和虚拟滚动的选择器

```tsx
import Select from '@nce/eview-react/Select'

function Example() {
  const [value, setValue] = React.useState('')

  const options = Array.from({ length: 100 }, (_, i) => ({
    text: `选项 ${i + 1}`,
    value: String(i + 1),
  }))

  return (
    <Select
      label="大数据选择"
      options={options}
      value={value}
      onChange={(val) => setValue(val)}
      defaultLabel="请选择"
      enableClear
      virtualScroll
      required
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| options | `any`（必填） | - | 选项数据：`[{ text, value, icon, iconActive }]` |
| id | `string` | - | 组件 id |
| style | `React.CSSProperties` | - | 外层样式 |
| title | `string` | - | 标题 |
| className | `string` | - | 外层类名 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| selectClassName | `string` | - | 选择框类名 |
| selectStyle | `React.CSSProperties` | - | 选择框样式 |
| optionClassName | `string` | - | 选项类名 |
| optionStyle | `any` | - | 选项样式 |
| iconClassName | `string` | - | 下拉图标类名 |
| iconStyle | `React.CSSProperties` | - | 下拉图标样式 |
| label | `string` | - | 标签文本 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| selectedIndex | `number` | - | 选中选项索引 |
| value | `any` | - | 选中值 |
| disabled | `boolean` | `false` | 禁用状态 |
| required | `boolean` | `false` | 是否必填 |
| enablHorzScroll | `boolean` | `false` | 启用水平滚动条 |
| isShowPopup | `boolean` | `false` | 初始化时显示弹出层 |
| popupDirection | `'top' \| 'bottom'` | `'bottom'` | 弹出方向 |
| lazySearch | `any` | - | 懒搜索配置 |
| defaultLabel | `string` | - | 默认建议文本 / 占位符 |
| zindex | `string` | `'9999'` | 弹出层 z-index |
| autoZindex | `boolean` | - | 自动生成 z-index |
| isScrollAlwaysDisplay | `boolean` | `false` | 始终显示滚动条 |
| hintType | `'div' \| 'tip'` | `'div'` | 提示类型 |
| validator | `any` | - | 验证器 |
| tipStyle | `any` | - | 提示样式 |
| enableClear | `boolean` | `false` | 显示清除按钮 |
| enableFixWidth | `'small' \| 'middle' \| 'large' \| 'none'` | - | 标签-输入框间距 |
| virtualScroll | `boolean` | `false` | 虚拟滚动支持 |
| isMouseLeaveClose | `boolean` | - | 鼠标离开关闭提示框 |
| popupAutoFocus | `boolean` | `false` | 弹出层自动聚焦 |
| selectCustomizationClassName | `string` | - | 上层 div 类名 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(value, oldValue, text, oldText, event)` | 选择变化回调 |
| onFocus | `(event: React.MouseEvent)` | 聚焦事件 |
| onBlur | `(event: React.MouseEvent)` | 失焦事件 |
| onDropdownVisibleChange | `(event: React.MouseEvent)` | 下拉框可见性变化 |
| onSelectClick | `(isSelected: boolean)` | 选择框点击 |
| onClosePopup | `any` | 弹出层关闭回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 options prop 传入，不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取选中值 |
| clear | `() => void` | 清除选择 |
| getData | `() => any` | 获取选项数据 |
| collapseDropDown | `() => void` | 关闭下拉框 |
| validate | `(showTip?: boolean) => boolean` | 验证 |
| focus | `() => void` | 聚焦 |

## 注意事项

- 选项数据通过 `options` prop 传入，不是通过子组件方式（与 Ant Design 的 Select + Option 模式不同）
- `onChange` 参数非常详细：`(value, oldValue, text, oldText, event)`，可同时获取新旧值和文本
- `defaultLabel` 相当于 placeholder，设置默认提示文本
- `enableClear` 显示清除按钮，允许用户清空选择
- 大数据量场景建议启用 `virtualScroll` 虚拟滚动
- `selectedIndex` 和 `value` 都可以设置选中项，`value` 按值匹配，`selectedIndex` 按索引匹配