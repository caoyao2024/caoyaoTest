# DatePicker

**Import:** `import DatePicker from '@nce/eview-react/DatePicker'`

## 基本用法

### 基础日期选择

```tsx
import DatePicker from '@nce/eview-react/DatePicker'

function Example() {
  const [date, setDate] = React.useState('')

  const handleChange = (dateString: string, date?: Date) => {
    setDate(dateString)
    console.log('Selected date:', dateString, date)
  }

  return (
    <DatePicker
      label="选择日期"
      value={date}
      format="yyyy-MM-dd"
      onChange={handleChange}
    />
  )
}
```

### 日期时间选择与范围限制

```tsx
import DatePicker from '@nce/eview-react/DatePicker'

function Example() {
  const [datetime, setDatetime] = React.useState('')

  return (
    <DatePicker
      label="选择时间"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      value={datetime}
      onChange={(dateString) => setDatetime(dateString)}
      dateRange={{
        dateFrom: new Date(2024, 0, 1),
        dateTo: new Date(2025, 11, 31),
      }}
      required
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| style | `React.CSSProperties` | - | 外层 div 样式 |
| className | `string` | - | 外层 div 类名 |
| value | `Date \| string` | - | 日期值 |
| defaultValue | `Date \| string` | - | 默认日期（仅初始化时生效） |
| dateRange | `{ dateFrom?: Date, dateTo?: Date }` | - | 日期范围限制 |
| disabled | `boolean` | `false` | 禁用状态 |
| label | `string` | - | 字段标签 |
| type | `'date' \| 'datetime' \| 'month' \| 'quarter' \| 'year' \| 'week'` | `'date'` | 选择器类型 |
| selectStyle | `React.CSSProperties` | - | 输入框样式 |
| selectClassName | `string` | - | 输入框类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| labelClassName | `string` | - | 标签类名 |
| required | `boolean` | `false` | 是否必填 |
| time | `object` | - | 自定义时间配置 |
| format | `string` | `'yyyy-MM-dd'` | 日期格式字符串 |
| timeFormat | `string` | `'hh:mm:ss'` | 时间格式 |
| range | `Array<Date \| string>` | - | 启用日期范围选择 |
| timezoneRule | `any` | - | 夏令时规则函数 |
| showTimezone | `boolean` | - | 在输入框中显示时区 |
| popupDirection | `'top' \| 'bottom' \| 'left' \| 'right'` | - | 弹出方向 |
| amPm | `boolean` | `false` | 启用 AM/PM 格式 |
| zIndex | `number` | `9999` | 弹出层 z-index |
| ifTriggerOnChangeWithCalender | `boolean` | `true` | 日历面板打开时是否触发 onChange |
| tipDisplay | `boolean` | `true` | 显示提示 |
| tipDirection | `string` | - | 提示方向 |
| placeholder | `string` | - | 占位文本 |
| hintType | `'div' \| 'tip' \| 'none'` | `'tip'` | 提示类型 |
| showNow | `boolean` | `false` | 显示"现在"按钮 |
| timeEmbedded | `boolean` | - | 内嵌时间选择器 |
| focusShowCalender | `boolean` | - | 输入框聚焦时显示日历 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(dateString: string, date?: Date, target?: string, dstDate?: string)` | 日期变化回调 |
| onBlur | `(ev: object)` | 失焦回调 |
| onOkClick | `(obj: object, event: object, target?: any)` | 确定按钮点击（范围选择时） |
| onCancelClick | `(obj: object, event: object, target?: string)` | 取消按钮点击（范围选择时） |
| onOpenChange | `()` | 展开回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 日期选择器不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取当前日期值（数组形式） |
| clear | `() => void` | 清空输入值 |
| validate | `() => boolean` | 验证日期 |
| focus | `(focusTo?: boolean) => void` | 聚焦输入框 |

## 注意事项

- 格式化使用 Java 风格 token，**不是** moment/dayjs 风格：`yyyy` = 年，`MM` = 月，`dd` = 日，`hh` = 12小时，`HH` = 24小时，`mm` = 分钟，`ss` = 秒
- `type` 支持 6 种模式：date、datetime、month、quarter、year、week
- `range` 属性启用日期范围选择模式，传入数组 `[startDate, endDate]`
- `dateRange` 用于限制可选日期范围，`range` 用于启用范围选择模式，两者用途不同
- `ifTriggerOnChangeWithCalender` 默认为 true，即打开日历面板就会触发 onChange，如需仅在确认选择时触发需设为 false