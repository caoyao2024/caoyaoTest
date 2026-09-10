# Slider

**Import:** `import Slider from '@nce/eview-react/Slider'`

## 基本用法

### 单值滑块

```tsx
import Slider from '@nce/eview-react/Slider'

function Example() {
  const [value, setValue] = React.useState([50])

  const handleChange = (value: number[], changeValue?: number[]) => {
    setValue(value)
  }

  return (
    <Slider
      label="滑块"
      min={0}
      max={100}
      value={value}
      onChange={handleChange}
    />
  )
}
```

### 范围滑块

```tsx
import Slider from '@nce/eview-react/Slider'

function Example() {
  const [value, setValue] = React.useState([20, 80])

  return (
    <Slider
      label="范围"
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(val) => setValue(val)}
      markIndexes={[0, 25, 50, 75, 100]}
      unit="%"
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| style | `React.CSSProperties` | - | 自定义样式 |
| className | `string` | - | 自定义类名 |
| stickClassName | `string` | - | 刻度条类名 |
| stickStyle | `React.CSSProperties` | - | 刻度条样式 |
| barClassName | `string` | - | 控制旋钮类名 |
| barStyle | `React.CSSProperties` | - | 控制旋钮样式 |
| inputStyle | `React.CSSProperties` | - | 输入框样式 |
| inputClassName | `string` | - | 输入框类名 |
| precision | `number` | `0` | 小数精度 |
| min | `number` | `0` | 最小值 |
| max | `number` | `100` | 最大值 |
| value | `number[]` | - | 当前值 |
| markIndexes | `number[]` | - | 显示标记的位置 |
| unit | `string` | - | 单位标签 |
| labelFormat | `(value?: number) => { formatValue: string }` | - | 值格式化函数 |
| displayInput | `boolean` | `true` | 显示输入框 |
| type | `'single' \| 'range'` | `'single'` | 滑块类型 |
| label | `string` | - | 标签文本 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| labelClassName | `string` | - | 标签类名 |
| disabled | `boolean` | `false` | 禁用状态 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(value: number[], changeValue?: number[])` | 值变化回调 |
| onBlur | `(value: number[])` | 失焦事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 滑块组件不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any[]` | 获取当前值 |

## 注意事项

- `value` 始终为数组类型，即使单值模式也是 `[50]` 而非 `50`
- `type='single'` 为单值滑块，`type='range'` 为范围滑块
- `displayInput=true` 时在滑块旁显示输入框，可直接输入数值
- `precision` 控制小数位数，默认 0 为整数
- `markIndexes` 在指定位置显示刻度标记
- `labelFormat` 可自定义值的显示格式