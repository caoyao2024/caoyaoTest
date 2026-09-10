# DatePicker

**Import:** `import DatePicker from '@cloudsop/eview-ui/DatePicker'`

## 基本用法

### 基础日期选择

```tsx
import DatePicker from '@cloudsop/eview-ui/DatePicker'

function Example() {
  return (
    <DatePicker
      value="2024-01-01"
      format="YYYY-MM-DD"
      onChange={(date) => console.log('date:', date)}
    />
  )
}
```

### 日期时间选择

```tsx
import DatePicker from '@cloudsop/eview-ui/DatePicker'

function Example() {
  return (
    <DatePicker
      type="datetime"
      format="YYYY-MM-DD HH:mm:ss"
      ampm={false}
      onChange={(date) => console.log('datetime:', date)}
    />
  )
}
```

### 带范围限制

```tsx
import DatePicker from '@cloudsop/eview-ui/DatePicker'

function Example() {
  return (
    <DatePicker
      range={['2020-01-01', '2025-12-31']}
      rangeFormat="YYYY-MM-DD"
      onChange={(date) => console.log('date:', date)}
    />
  )
}
```

### 日期区间选择（RangePicker）

```tsx
import DatePicker from '@cloudsop/eview-ui/DatePicker'

function Example() {
  return (
    <DatePicker.RangePicker
      value={['2024-01-01', '2024-12-31']}
      format="YYYY-MM-DD"
      onChange={(dates) => console.log('range:', dates)}
    />
  )
}
```

## Props（Picker）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 设置组件 id |
| panelId | `string` | - | 设置面板 id |
| value | `ValueType` | - | 日期值，ValueType 为 `Date \| string \| number` |
| placeholder | `string` | - | 输入框提示文字 |
| style | `CSSProperties` | - | 自定义输入框样式 |
| disabled | `boolean` | `false` | 是否禁用日期组件 |
| readOnly | `boolean` | `false` | 是否只读 |
| open | `boolean` | - | 控制弹出日历的打开状态 |
| type | `PickerType` | `'date'` | 设置选择器类型，PickerType 为 `'date' \| 'datetime' \| 'year' \| 'month' \| 'week'` |
| range | `[ValueType, ValueType]` | - | 日期的可选范围 [start, end]，start 与 end 可以置为 null，组件会自动填充 |
| rangeFormat | `string` | - | 可选范围的日期格式 |
| ampm | `boolean` | `false` | 是否提供 AM/PM 选择器，该值为 true 且 type='datetime' 时才会生效 |
| showToday | `boolean` | `true` | 是否展示"此刻"按钮 |
| format | `string \| string[]` | - | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 moment.js |
| timezone | `string` | - | 设置时区 |
| popupClassName | `string` | - | 自定义弹出日历 className |
| popupStyle | `CSSProperties` | - | 自定义弹出日历样式 |
| showDST | `boolean` | `true` | 是否展示夏令时标志 |
| rules | `Rule[]` | - | 检验规则 |
| validationTipsType | `'div' \| 'tipbox'` | `'div'` | 检验提示类型 |
| showFormat | `boolean` | `true` | 输入错误时是否展示日期格式提示 |
| zIndex | `number` | `100000` | 自定义弹出日历 zIndex |
| onChange | `(date: string, detail?: TimeDetail) => void` | - | 时间发生变化的回调，发生在用户选择时间时 |
| onInputKeyDown | `(e: KeyboardEvent<HTMLInputElement>) => void` | - | 输入框键盘按下回调 |
| locale | `string` | - | 设置语言，zh 显示上午下午，en 显示 AM PM |
| onOpenChange | `(open: boolean) => void` | - | 弹出日历和关闭日历的回调 |
| formatRender | `(format: string) => string` | - | 格式化渲染函数 |
| pickerRef | `MutableRefObject<PickerRef>` | - | 组件 ref |
| getPopupContainer | `(() => HTMLElement) \| false` | - | 获取渲染父节点，设为 false 时为元素虚拟 dom 的原位置 |
| minutesInterval | `IntervalConfig` | `1` | 当 PickerType 为 datetime 且可以选择到分钟时，设置分钟选项的间隔，该参数为大于 0 的整数或对象 `{ start, end, step }` |
| version | `string` | - | 设置组件版本（影响样式类名） |
| theme | `string` | - | 设置组件主题 |

## Props（RangePicker）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value | `Array<Date \| string \| number>` | - | 日期区间值 |
| style | `CSSProperties` | - | 自定义输入框样式 |
| type | `PickerType` | `'date'` | 设置选择器类型 |
| required | `boolean` | - | 是否必填 |
| range | `[DateValueType, DateValueType]` | - | 日期的可选范围 |
| rangeFormat | `string` | - | 可选范围的日期格式 |
| ampm | `boolean` | `false` | 是否提供 AM/PM 选择器 |
| format | `string` | - | 设置日期格式，配置参考 moment.js |
| open | `boolean` | - | 控制弹出日历的打开状态 |
| timezone | `string` | - | 设置时区 |
| popupClassName | `string` | - | 自定义弹出日历 className |
| popupStyle | `CSSProperties` | - | 自定义弹出日历样式 |
| showDST | `boolean` | `true` | 是否展示夏令时标志 |
| showToday | `boolean` | `true` | 是否展示"此刻"按钮 |
| placeholder | `[string, string]` | - | 输入框提示文字，数组格式 [开始提示, 结束提示] |
| disabled | `boolean` | `false` | 是否禁用 |
| readOnly | `boolean` | `false` | 是否只读 |
| zIndex | `number` | `100000` | 自定义弹出日历 zIndex |
| separator | `string` | - | 区间分隔符 |
| locale | `string` | - | 设置语言 |
| onChange | `(date: string[], detail?: TimeDetail[]) => void` | - | 时间发生变化的回调 |
| onOpenChange | `(open: boolean) => void` | - | 弹出日历和关闭日历的回调 |
| formatRender | `(format: string) => string` | - | 格式化渲染函数 |
| showFormat | `boolean` | `true` | 输入错误时是否展示日期格式提示 |
| popupRef | `RefObject<HTMLElement>` | - | 弹出层 ref |
| getPopupContainer | `(() => HTMLElement) \| false` | - | 获取渲染父节点 |
| minutesInterval | `IntervalConfig` | `1` | 分钟选项的间隔 |
| version | `string` | - | 设置组件版本（影响样式类名） |
| theme | `string` | - | 设置组件主题 |

## 注意事项

- DatePicker 对应 A2UI 的 DatePicker 组件
- `format` 配置参考 moment.js，如 `'YYYY-MM-DD'`、`'YYYY-MM-DD HH:mm:ss'`
- `range` 的 start 与 end 可以置为 null，组件会自动填充
- `ampm` 仅在 `type='datetime'` 时生效
- `minutesInterval` 支持数字（整体间隔）或对象 `{ start, end, step }`（分段间隔）
- RangePicker 通过 `DatePicker.RangePicker` 访问
- eview-ui DatePicker `format` 直接透传，使用 moment 风格格式（与 A2UI 一致）
