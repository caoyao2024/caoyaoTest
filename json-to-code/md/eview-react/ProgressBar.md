# ProgressBar（进度条）

**Import:** `import ProgressBar from '@nce/eview-react/ProgressBar'`

## 基本用法

### 线形进度条

```tsx
import ProgressBar from '@nce/eview-react/ProgressBar'

function Example() {
  const [current, setCurrent] = React.useState(60)

  return (
    <div>
      <ProgressBar current={current} max={100} />
      <ProgressBar current={30} max={100} status="success" />
      <ProgressBar current={80} max={100} status="exception" />
      <button onClick={() => setCurrent(prev => Math.min(prev + 10, 100))}>
        增加
      </button>
    </div>
  )
}
```

### 圆形进度条

```tsx
import ProgressBar from '@nce/eview-react/ProgressBar'

function Example() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <ProgressBar type="circle" current={75} max={100} />
      <ProgressBar type="circle" current={100} max={100} circleStatus="success" />
      <ProgressBar type="circle" current={50} max={100} circleStatus="exception" />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| type | `'line' \| 'circle'` | `'line'` | 进度条类型 |
| format | `'percent' \| 'steps'` | `'percent'` | 文本格式（仅 line 类型） |
| current | `number` | `0` | 当前进度值 |
| max | `number` | `100` | 最大值 |
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |
| status | `'success' \| 'exception'` | - | 线形进度条状态 |
| barStyle | `React.CSSProperties` | - | 进度条样式 |
| barBackStyle | `React.CSSProperties` | - | 背景样式 |
| labelPosition | `'before' \| 'after' \| 'middle' \| 'none'` | `'after'` | 标签位置 |
| overTime | `number` | - | 超时设置 |
| modal | `boolean` | `false` | 模态模式 |
| isOpen | `boolean` | `false` | 模态是否可见 |
| mountId | `string` | `'body'` | 模态挂载 DOM id |
| strokeWidth | `number` | `6` | 圆形进度条宽度 |
| circleWidth | `number` | `160` | 圆形画布宽度 |
| circleStatus | `'success' \| 'exception'` | - | 圆形进度条状态 |
| strokeColor | `string` | - | 圆形颜色（覆盖 circleStatus） |
| strokeLinecap | `'round' \| 'butt' \| 'square'` | `'round'` | 圆形线帽样式 |
| modalMessageTip | `string \| React.ReactNode` | - | 模态消息文本 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onOverTime | `any` | 超时回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 进度条组件不支持 children slot |

## 注意事项

- ProgressBar 对应 A2UI 的 Progress 组件
- `type='line'` 为线形进度条，`type='circle'` 为圆形进度条
- 线形进度条用 `status` 控制状态，圆形进度条用 `circleStatus` 控制状态
- `strokeColor` 可自定义圆形进度条颜色，优先级高于 `circleStatus`
- `modal=true` 时为全屏模态进度条，配合 `isOpen` 控制显示
- `format='steps'` 时显示步进格式文本（仅线形）
- `labelPosition='middle'` 时百分比文本显示在进度条内部（仅线形）