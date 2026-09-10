# TimePicker 时间选择器

**Import:** `import TimePicker from '@cloudsop/eview-ui/TimePicker'`

## 基本用法

### 基础时间选择

```tsx
import TimePicker from '@cloudsop/eview-ui/TimePicker'

function Example() {
  return <TimePicker format="hh:mm:ss" onChange={(time) => console.log('time:', time)} />
}
```

### 12 小时制

```tsx
import TimePicker from '@cloudsop/eview-ui/TimePicker'

function Example() {
  return <TimePicker use12HrClock format="hh:mm:ss" />
}
```

### 受控模式

```tsx
import TimePicker from '@cloudsop/eview-ui/TimePicker'

function Example() {
  return <TimePicker time={[13, 30, 0]} format="hh:mm:ss" />
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| className | `string` | - | 输入框最外层选择器类名 |
| defaultTime | `[number, number, number] \| [number, number] \| null` | `null` | 初始传入的时间值，数组形式，24 小时制，如 [13, 2, 3] |
| time | `[number, number, number] \| [number, number] \| null` | `null` | 时间值，数组形式，24 小时制（受控） |
| onChange | `(time: [number, number, number] \| [number, number] \| null) => void` | - | 时间选择后触发回调 |
| disabled | `boolean` | `false` | 是否被禁用 |
| display | `boolean` | - | 选择弹出框是否显示（注意：props 传入布尔值后将完全由 props 控制显隐） |
| onDisplayChange | `(display: boolean) => void` | - | display 发生状态时触发的回调 |
| use12HrClock | `boolean` | `false` | 时间显示为 12 小时制（AM/PM） |
| format | `'hh:mm:ss' \| 'mm:ss' \| 'hh:mm'` | `'hh:mm:ss'` | 时间格式 |
| placeholder | `string` | - | 在输入框为空时的 placeholder |
| popupZIndex | `number` | `1000` | 下拉选择框的 z-index |
| allowClear | `boolean` | `true` | 是否显示清除按钮 |
| placement | `Placement` | `'bottomLeft'` | 下拉选择框展开位置 |
| getPopupContainer | `() => HTMLElement` | - | 设置弹窗的容器元素，默认挂载在 body 下 |
| locale | `string` | - | 设置组件国际化，该配置比 ConfigProvider 优先级更高 |
| version | `string` | - | 支持通过 version 设置组件版本 |
| theme | `string` | - | 支持通过 theme 设置组件主题 |
| ignoreDST | `boolean` | - | 是否忽略夏令时影响 |
| style | `React.CSSProperties` | - | 输入框外层 div 元素的自定义样式 |
| inputStyle | `React.CSSProperties` | - | input 输入框的自定义样式 |
| iconStyle | `React.CSSProperties` | - | 图标按钮外层 span 元素的自定义样式 |
| popupStyle | `React.CSSProperties` | - | 弹出选择框外层 div 的自定义样式 |
| selectStyle | `React.CSSProperties` | - | 下拉选择器的自定义样式 |
| cellStyle | `React.CSSProperties` | - | 选择器中元素的自定义样式 |

## 注意事项

- TimePicker 对应 A2UI 的 TimePicker 组件
- `time` 为受控属性，`defaultTime` 为非受控初始值
- `ArrayTime` 类型为 `[number, number, number] | [number, number] | null`，对应 format 中的时分秒（或时分、分秒）
- `allowClear` 默认为 `true`，设置 `false` 可隐藏清除按钮
- `placement` 类型为 `Placement`，支持 bottomLeft / bottomRight / topLeft / topRight / top / bottom 等
