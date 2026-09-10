# Spinner 计数器

**Import:** `import Spinner from '@cloudsop/eview-ui/Spinner'`

## 基本用法

```tsx
import Spinner from '@cloudsop/eview-ui/Spinner'

function Example() {
  return (
    <Spinner
      value={0}
      min={0}
      max={100}
      step={1}
      onChange={(value) => console.log(value)}
    />
  )
}
```

### 时间类型

```tsx
import Spinner from '@cloudsop/eview-ui/Spinner'

function Example() {
  return (
    <Spinner
      type="time"
      timeFormat="hh:mm"
      value="12:30"
      amPm
      locale="en"
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 定制组件 id |
| className | `string` | - | 通过 class 自定义组件样式 |
| version | `string` | - | 设置组件版本 |
| theme | `string` | - | 设置组件主题 |
| disabledBlurFunction | `boolean` | `false` | 设置是否禁用 blur 事件对应功能（自动修正错误值） |
| style | `React.CSSProperties` | - | 自定义计数器样式 |
| inputClassName | `string` | - | 自定义计数器输入框的 className |
| labelClassName | `string` | - | 自定义 label 的 className |
| labelStyle | `React.CSSProperties` | - | 自定义 label 的 style |
| label | `string` | - | 设置计数器的 label |
| tipStyle | `React.CSSProperties` | - | 自定义提示框样式 |
| labelPosition | `'before' \| 'after'` | `'before'` | 设置 label 的位置 |
| focusTip | `string` | `''` | 组件获取焦点时弹出提示，失去焦点时消失 |
| decTitle | `string` | - | 鼠标获取减号焦点时显示的文本 |
| incTitle | `string` | - | 鼠标获取加号焦点时显示的文本 |
| min | `number \| string` | `Number.MIN_SAFE_INTEGER` | 自定义最小值 |
| max | `number \| string` | `Number.MAX_SAFE_INTEGER` | 自定义最大值 |
| step | `number` | `1` | 自定义步伐 |
| value | `string \| number` | `0` | 设置初始值 |
| disabled | `boolean` | `false` | 是否灰化 |
| required | `boolean` | `false` | 设置组件值是否必须 |
| precision | `number` | `0` | 设置组件值精度 |
| type | `'number' \| 'time' \| 'customWithPrefixs'` | `'number'` | Spinner 类型 |
| timeFormat | `'hh:mm:ss' \| 'hh:mm'` | `'hh:mm:ss'` | 指定时间格式 |
| amPm | `boolean` | `false` | 使用 AM/PM 格式 |
| locale | `'en' \| 'zh'` | - | 设置 AM/PM 后缀名语言 |
| rangeArray | `number[][]` | - | （即将废弃） |
| minMaxCycle | `boolean` | `false` | 数字是否循环显示 |
| doNotFocusWhenValueUpdate | `boolean` | `false` | 值更新时是否不自动聚焦 |
| customPrefix | `string` | - | 自定义前缀（type 为 customWithPrefixs 时使用） |
| isCustomerValidatorMsg | `boolean` | `false` | 配合 form 控制是否显示自定义异常提示 |
| noZeroPrecise | `boolean` | `false` | 是否禁用零精度处理 |
| formatter | `(value: number \| string, precision?: number) => string` | - | 格式化输入框显示，聚焦时显示原值 |
| selectionStart | `number` | - | 选区起始位置 |
| selectionEnd | `number` | - | 选区结束位置 |

## Events

| 事件名 | 类型 | 说明 |
|--------|------|------|
| onChange | `(value: number \| string) => void` | 文本框值改变时回调（有效值时调用） |
| onError | `(value: number \| string) => void` | 文本框值改变时回调（无效值时调用） |
| onFocus | `(event: React.FocusEvent) => void` | 文本框聚焦时的回调 |
| onBlur | `(value: number \| string) => void` | 文本框失焦时的回调 |
| onInputError | `(value: string \| number) => void` | 输入错误时的回调 |
| onCustomIncOrDecClick | `(content: string, step: number, value: string \| number) => void` | type 为 customWithPrefixs 时点击加减号的回调 |

## 注意事项

- 旧版 `onFoucs` 拼写已更正为 `onFocus`
- `value` 类型为 `string | number`，非 `'number' | 'String'`
- `min` / `max` 类型为 `number | string`
- `onCustomIncOrDecClick` 回调参数为 `(content, step, value)`，非旧版的 `(changeTag, direction, currentValue)`
- `rangeArray` 即将废弃，不建议使用
- `disabledBlurFunction` 设为 true 后 onBlur 会失效
