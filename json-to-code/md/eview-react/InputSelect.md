# InputSelect

**Import:** `import InputSelect from '@nce/eview-react/InputSelect'`

## 基本用法

### 基础可搜索下拉选择

```tsx
import InputSelect from '@nce/eview-react/InputSelect'

function Example() {
  const [value, setValue] = React.useState('')

  const options = [
    { text: '选项一', value: '1' },
    { text: '选项二', value: '2' },
    { text: '选项三', value: '3' },
  ]

  return (
    <InputSelect
      label="搜索选择"
      options={options}
      value={value}
      onChange={(val, oldVal, type) => {
        if (type === 'select') setValue(val)
      }}
      placeholder="请输入或选择"
    />
  )
}
```

### 仅选择模式 + 清除按钮

```tsx
import InputSelect from '@nce/eview-react/InputSelect'

function Example() {
  const [value, setValue] = React.useState('')

  const options = Array.from({ length: 100 }, (_, i) => ({
    text: `选项 ${i + 1}`,
    value: String(i + 1),
  }))

  return (
    <InputSelect
      label="大数据选择"
      options={options}
      value={value}
      onChange={(val) => setValue(val)}
      placeholder="请选择"
      onlySelect
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
| options | `any`（必填） | `[]` | 选项数据：`[{ text, value, disabled? }]`，text 为展示值，value 为存取值 |
| id | `string` | 自动生成 | 组件 id |
| style | `React.CSSProperties` | - | 外层样式 |
| className | `string` | - | 外层类名 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| selectClassName | `string` | - | 输入框类名 |
| selectStyle | `React.CSSProperties` | - | 输入框样式 |
| optionClassName | `string` | - | 选项类名 |
| optionStyle | `any` | - | 选项样式（含 `width`、`items` 等字段） |
| label | `string` | - | 标签文本 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| selectedIndex | `number` | - | 选中选项索引，优先级高于 value |
| value | `any` | - | 选中值（按 value 匹配选项） |
| disabled | `boolean` | `false` | 禁用状态 |
| required | `boolean` | `false` | 是否必填 |
| showSearchTip | `boolean` | `true` | 无匹配时是否显示"Not Found"提示 |
| enablHorzScroll | `boolean` | `false` | 启用水平滚动条 |
| popupDirection | `'top' \| 'bottom'` | `'bottom'` | 弹出方向 |
| zindex | `string` | `'9999'` | 弹出层 z-index |
| hintType | `'div' \| 'tip'` | `'div'` | 提示类型 |
| caseInsensitiveFilter | `boolean` | `true` | 是否忽略大小写进行模糊搜索 |
| onlySelect | `boolean` | `false` | 仅选择模式：输入仅用于过滤，失焦后清空输入，只保留下拉选中值 |
| onlySelectLastValue | `boolean` | - | 仅选择模式下，失焦时保留上次的输入值而非选中项文本 |
| enableFixWidth | `'small' \| 'middle' \| 'large' \| 'none'` | - | 固定宽度模式，支持单行省略与中英切换自适应 |
| virtualScroll | `boolean` | `false` | 虚拟滚动支持 |
| isMouseLeaveClose | `boolean` | - | 鼠标离开提示框后是否关闭 |
| placeholder | `string` | - | 输入框占位文本 |
| searchTrim | `boolean` | - | 模糊搜索时去掉头尾空格 |
| popUpProps | `PopupProps` | - | 透传给下拉弹出层的属性 |
| keepFiter | `boolean` | - | 再次打开下拉时保持搜索过滤结果 |
| enableClear | `boolean` | `false` | 显示清除按钮 |
| inputProps | `React.InputHTMLAttributes<HTMLElement>` | - | 透传给原生 input 的属性（如 `{ autoComplete: 'off' }`） |
| validator | `(value, id?, type?) => { result: boolean; message: string \| Element }` | - | 自定义校验规则 |
| shouldRender | `(stateValue, propsValue) => boolean` | - | 控制组件是否更新的自定义判断函数 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(value, oldValue, type: 'input' \| 'select')` | 值变化回调，`type` 区分输入触发还是选择触发 |
| onSelect | `(value, oldValue)` | 下拉选项被选中回调 |
| onFocus | `(event: React.MouseEvent)` | 输入框聚焦事件 |
| onBlur | `(event: React.MouseEvent)` | 输入框失焦事件 |
| onInputEnter | `(event, value)` | 输入框回车事件 |
| onInputKeyUp | `(value)` | 输入框 keyUp 事件 |
| onClear | `(event)` | 清除按钮点击回调 |
| onClosePopup | `any` | 弹出层关闭回调 |
| onOpenPopup | `any` | 弹出层打开回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 options prop 传入，不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取输入框当前值 |
| setValue | `(value) => void` | 设置输入框值 |
| getSelectedValue | `() => any` | 获取选中选项的 value |
| validate | `() => boolean` | 执行校验 |
| focus | `() => void` | 聚焦输入框 |
| clear | `() => void` | 清除选中项和输入值 |

## 注意事项

- InputSelect 是带模糊搜索功能的下拉选择组件，用户既可在输入框中输入过滤，也可点击下拉选项选中
- `onChange` 的 `type` 参数可区分 `'input'`（输入触发）和 `'select'`（选中触发），便于分别处理
- `onlySelect=true` 时，输入仅作为搜索过滤用途，失焦后输入内容被清空，只有下拉选中值会被保留
- `selectedIndex` 和 `value` 都可设置选中项：`value` 按值匹配，`selectedIndex` 按索引匹配；二者同时设置且冲突时选中项无效
- `caseInsensitiveFilter` 默认开启，模糊搜索忽略大小写
- `validator` 返回 `{ result, message }` 对象，`result` 为布尔值表示校验是否通过，`message` 为错误提示文本
- 大数据量场景建议启用 `virtualScroll` 虚拟滚动以提升性能
- `enableClear=true` 显示清除按钮，点击可清空当前选中项和输入值