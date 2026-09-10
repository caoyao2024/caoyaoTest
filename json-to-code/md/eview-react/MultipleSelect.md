# MultipleSelect

**Import:** `import MultipleSelect from '@nce/eview-react/MultipleSelect'`

## 基本用法

### 基础多选下拉

```tsx
import MultipleSelect from '@nce/eview-react/MultipleSelect'

function Example() {
  const [value, setValue] = React.useState([])

  const options = [
    { text: '选项一', value: '1' },
    { text: '选项二', value: '2' },
    { text: '选项三', value: '3' },
    { text: '选项四', value: '4' },
  ]

  const handleChange = (value: any[], changeValue: any[], event: object) => {
    setValue(value)
  }

  return (
    <MultipleSelect
      label="多选"
      options={options}
      value={value}
      onChange={handleChange}
      placeholder="请选择"
    />
  )
}
```

### 带全选和搜索的多选

```tsx
import MultipleSelect from '@nce/eview-react/MultipleSelect'

function Example() {
  const [value, setValue] = React.useState([])

  const options = Array.from({ length: 50 }, (_, i) => ({
    text: `选项 ${i + 1}`,
    value: String(i + 1),
  }))

  return (
    <MultipleSelect
      label="带搜索多选"
      options={options}
      value={value}
      onChange={(val) => setValue(val)}
      selectAll
      selectAllText="全选"
      searchable
      virtualScroll
      placeholder="请选择"
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 外层类名 |
| style | `React.CSSProperties` | - | 外层样式 |
| inputStyle | `React.CSSProperties` | - | 输入容器样式 |
| selectClassName | `string` | - | 选择容器类名 |
| selectStyle | `React.CSSProperties` | - | 选择容器样式 |
| options | `any`（必填） | - | 选项数据：`[{ text, value, disabled }]` |
| selectedIndex | `any` | - | 默认选中索引 |
| value | `any` | - | 选中值 |
| disabled | `boolean` | `false` | 禁用状态 |
| label | `string` | - | 标签文本 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| optionStyle | `React.CSSProperties` | - | 选项样式 |
| optionClassName | `string` | - | 选项类名 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| required | `boolean` | `false` | 是否必填 |
| popupDirection | `'top' \| 'bottom'` | `'bottom'` | 弹出方向 |
| selectAll | `boolean` | `false` | 显示"全选"选项 |
| disableToolTip | `boolean` | `false` | 禁用提示 |
| delimiter | `string` | `','` | 显示分隔符 |
| zIndex | `string` | `'9999'` | 弹出层 z-index |
| enableCloseIcon | `boolean` | `false` | 标签上显示关闭图标 |
| toolTipPosition | `'top' \| 'bottom'` | `'top'` | 提示位置 |
| dropdownClassName | `string` | - | 下拉类名 |
| displayItems | `number` | - | 最大显示项数 |
| maxLengthInput | `number` | - | 最大输入长度 |
| inputClassName | `string` | - | 输入容器类名 |
| listHeight | `number` | - | 列表高度 |
| searchable | `boolean` | - | 启用搜索 |
| showPopUp | `boolean` | `true` | 显示弹出层 |
| hintType | `'div' \| 'tip'` | `'div'` | 提示类型 |
| tipStyle | `React.CSSProperties` | - | 提示样式 |
| placeholder | `string` | - | 占位文本 |
| virtualScroll | `boolean` | `false` | 虚拟滚动 |
| preventPopupClick | `boolean` | - | 阻止弹出层点击/鼠标按下事件 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onBlur | `(event: React.MouseEvent)` | 失焦事件 |
| onOpenMultipleSelectPopup | `any` | 弹出层打开/关闭回调 |
| onChange | `(value: array, changeValue: array, event: object)` | 值变化回调 |
| onSearchChange | `(value: string, options?: any)` | 搜索变化回调 |
| onFocus | `(event: React.MouseEvent)` | 聚焦事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 options prop 传入，不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取选中值 |
| validate | `() => boolean` | 验证 |
| clear | `() => void` | 清空所有选择 |

## 注意事项

- 选项数据通过 `options` prop 传入，不是通过子组件方式
- `onChange` 第二个参数 `changeValue` 是本次变化的值（新增或移除的项）
- 大数据量场景建议启用 `virtualScroll` 虚拟滚动
- `searchable` 启用搜索功能，`onSearchChange` 可用于远程搜索
- `selectAll` 显示全选选项
- `delimiter` 控制输入框中多个选中项的显示分隔符，默认逗号