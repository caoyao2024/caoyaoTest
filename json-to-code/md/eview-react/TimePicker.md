# TimePicker

**Import:** `import TimePicker from '@nce/eview-react/TimePicker'`

## 基本用法

### 基础时间选择器

```tsx
import TimePicker from '@nce/eview-react/TimePicker'

function Example() {
  const [time, setTime] = React.useState([14, 30, 0])

  const handleChange = (time: number[]) => {
    setTime(time)
    console.log('Selected time:', time) // [14, 30, 0]
  }

  return (
    <TimePicker
      label="选择时间"
      time={time}
      format="hh:mm:ss"
      onChange={handleChange}
    />
  )
}
```

### AM/PM 格式和空时间支持

```tsx
import TimePicker from '@nce/eview-react/TimePicker'

function Example() {
  const [time, setTime] = React.useState([9, 0, 0])

  return (
    <div>
      <TimePicker
        label="12小时制"
        time={time}
        format="hh:mm:ss"
        amPm
        onChange={(t) => setTime(t)}
      />
      <TimePicker
        label="支持空时间"
        time={[]}
        format="hh:mm"
        supportEmptyTime
        onChange={(t) => console.log('Time:', t)}
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
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| label | `string` | - | 标签文本 |
| timeClassName | `string` | - | 时间组件类名 |
| timeStyle | `React.CSSProperties` | - | 时间组件样式 |
| time | `any` | `[currentH, currentM, currentS]` | 时间值，格式为 `[时, 分, 秒]` |
| disabled | `boolean` | `false` | 禁用状态 |
| display | `boolean` | `true` | 显示/隐藏 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| required | `boolean` | `false` | 是否必填 |
| format | `string` | `'hh:mm:ss'` | 时间格式 |
| direction | `string` | `'auto'` | 菜单方向 |
| amPm | `boolean` | `false` | AM/PM 格式 |
| supportEmptyTime | `boolean` | `false` | 允许空时间 |
| bottomButtons | `boolean` | - | 是否需要底部按钮 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(time: array)` | 时间变化；time = `[时, 分, 秒]` |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 时间选择器不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any[]` | 获取当前时间（数组形式） |

## 注意事项

- **时间值使用 `time` prop（不是 `value`）**，格式为 `[hours, minutes, seconds]` 数字数组
- `onChange` 返回的也是 `[hours, minutes, seconds]` 数字数组
- `format` 使用 `hh` 表示 12 小时制（不是 ISO 的 `HH`），`mm` 表示分钟，`ss` 表示秒
- `amPm=true` 启用 AM/PM 格式，配合 12 小时制使用
- `supportEmptyTime=true` 允许时间为空（空数组 `[]`），默认必须有时间值