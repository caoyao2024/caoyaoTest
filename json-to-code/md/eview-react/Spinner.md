# Spinner（数字步进器 / InputNumber）

**Import:** `import Spinner from '@nce/eview-react/Spinner'`

## 基本用法

### 基础数字步进器

```tsx
import Spinner from '@nce/eview-react/Spinner'

function Example() {
  const [value, setValue] = React.useState(0)

  const handleChange = (value: number | string) => {
    setValue(Number(value))
  }

  return (
    <Spinner
      label="数量"
      min={0}
      max={100}
      step={1}
      value={value}
      onChange={handleChange}
    />
  )
}
```

### 时间步进器和自定义范围

```tsx
import Spinner from '@nce/eview-react/Spinner'

function Example() {
  const [timeValue, setTimeValue] = React.useState('00:00:00')
  const [customValue, setCustomValue] = React.useState(5)

  return (
    <div>
      <Spinner
        label="时间"
        type="time"
        timeFormat="hh:mm:ss"
        value={timeValue}
        onChange={(val) => setTimeValue(String(val))}
      />
      <Spinner
        label="自定义范围"
        type="number"
        min={1}
        max={10}
        step={1}
        rangeArray={[[1, 3], [6, 7]]}
        value={customValue}
        onChange={(val) => setCustomValue(Number(val))}
      />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |
| label | `string` | - | 标签文本 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| tipStyle | `React.CSSProperties` | - | 提示样式 |
| decTitle | `string` | - | 减少按钮标题 |
| incTitle | `string` | - | 增加按钮标题 |
| min | `number \| string` | `0` | 最小值 |
| max | `number \| string` | `100` | 最大值 |
| step | `number` | `1` | 步长 |
| value | `string \| number` | `0` | 当前值 |
| disabled | `boolean` | `false` | 禁用状态 |
| required | `boolean` | `false` | 是否必填 |
| precision | `number` | `0` | 小数精度 |
| type | `'number' \| 'time' \| 'customWithPrefixs'` | `'number'` | 步进器类型 |
| timeFormat | `'hh:mm:ss' \| 'hh:mm'` | `'hh:mm:ss'` | 时间格式 |
| amPm | `boolean` | `false` | AM/PM 支持 |
| rangeArray | `number[][]` | - | 自定义值范围，如 `[[1,3],[6,7]]` |
| focusTip | `string` | `''` | 聚焦提示文本 |
| minMaxCycle | `boolean` | `false` | 到达最小/最大值时循环 |
| doNotFocusWhenValueUpdate | `boolean` | - | 值更新时不自动聚焦 |
| customPrefix | `string` | - | 自定义前缀 |
| inputClassName | `string` | - | 输入框类名 |
| selectionStart | `number` | - | 选区起始位置 |
| selectionEnd | `number` | - | 选区结束位置 |
| locale | `'en' \| 'zh'` | `'zh'` | AM/PM 语言 |
| hintType | `'div' \| 'tip'` | `'div'` | 提示类型 |
| noZeroPrecise | `boolean` | - | precision=0 时显示整数提示 |
| disabledBlurFunction | `boolean` | - | 禁用失焦自动修正 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(value: number \| string)` | 值变化回调（有效值） |
| onFocus | `(event: React.FocusEvent)` | 聚焦事件 |
| onBlur | `(value: number \| string)` | 失焦事件 |
| onInputError | `(value: number \| string)` | 输入无效值回调 |
| onCustomIncOrDecClick | `(content: string, step: number, value: string \| number)` | 自定义前缀增减点击 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 步进器组件不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取当前值 |
| validate | `() => boolean` | 验证值 |

## 注意事项

- Spinner 对应 A2UI 的 InputNumber 组件
- `type` 支持三种模式：`'number'`（数字）、`'time'`（时间）、`'customWithPrefixs'`（自定义前缀）
- `rangeArray` 可定义不连续的值范围，如 `[[1,3],[6,7]]` 表示可选 1-3 和 6-7
- `minMaxCycle=true` 时，到达最大值后再增加会回到最小值，反之亦然
- `onInputError` 在用户输入超出范围的值时触发，可用于错误提示
- `precision` 控制小数位数，默认 0 为整数模式