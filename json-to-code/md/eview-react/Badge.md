# Badge

**Import:** `import Badge from '@nce/eview-react/Badge'`

## 基本用法

### 数字徽标与小红点

```tsx
import Badge from '@nce/eview-react/Badge'

function Example() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Badge content={5}>
        <div style={{ width: 40, height: 40, background: '#eee' }} />
      </Badge>
      <Badge content={0} showZero>
        <div style={{ width: 40, height: 40, background: '#eee' }} />
      </Badge>
      <Badge dot>
        <div style={{ width: 40, height: 40, background: '#eee' }} />
      </Badge>
      <Badge content={<span>新消息</span>}>
        <div style={{ width: 40, height: 40, background: '#eee' }} />
      </Badge>
    </div>
  )
}
```

### 状态点

```tsx
import Badge from '@nce/eview-react/Badge'

function Example() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Badge dot status="default" text="default" />
      <Badge dot status="success" text="success" />
      <Badge dot status="error" text="error" />
      <Badge dot status="warning" text="warning" />
      <Badge dot status="off" text="off" />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名（最外层 div） |
| style | `React.CSSProperties` | - | 自定义样式（最外层 div） |
| badgeClassName | `string` | - | 徽标自定义类名 |
| badgeStyle | `React.CSSProperties` | - | 徽标自定义样式 |
| dot | `boolean` | `false` | 不展示数字，只显示小红点 |
| max | `number` | `99` | 最大值，超过显示 {max}+（仅 content 为数字时有效） |
| content | `React.ReactNode \| string \| number` | - | 徽标内容，为 null/undefined/'' 时不显示 |
| offset | `[number, number]` | - | 徽标偏移量 [水平, 垂直] |
| showZero | `boolean` | - | 数值为 0 时是否展示 Badge |
| status | `'default' \| 'success' \| 'error' \| 'warning' \| 'off'` | - | 设置状态点 |
| text | `React.ReactNode \| string` | - | 状态点文本（设置 status 后有效） |
| children | `React.ReactNode` | - | 包裹的目标元素 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| 无 | - | Badge 组件无事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children | 包裹的目标元素，徽标显示在右上角 |

## 注意事项

- Badge 对应 A2UI 的 Badge 组件
- `content` 为 null、undefined 或空字符串时不显示徽标
- `dot=true` 时只显示小红点，不显示数字
- `max` 仅当 `content` 为数字时有效，超过显示如 `99+`
- `status` 模式下配合 `dot` 和 `text` 显示状态点及文本
- `showZero` 控制值为 0 时是否显示徽标，默认不显示