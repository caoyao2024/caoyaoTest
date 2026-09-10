# Tag

**Import:** `import Tag from '@nce/eview-react/Tag'`

## 基本用法

### 基础标签

```tsx
import Tag from '@nce/eview-react/Tag'

function Example() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Tag>默认标签</Tag>
      <Tag color="primary">主要标签</Tag>
      <Tag color="success">成功标签</Tag>
      <Tag color="warning">警告标签</Tag>
      <Tag color="danger">危险标签</Tag>
      <Tag color="caution">注意标签</Tag>
    </div>
  )
}
```

### 不同样式和尺寸的标签

```tsx
import Tag from '@nce/eview-react/Tag'

function Example() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag color="primary" fill="outline">镂空标签</Tag>
      <Tag color="success" fill="solid">实心标签</Tag>
      <Tag round={false}>方角标签</Tag>
      <Tag size="small">小标签</Tag>
      <Tag size="normal">正常标签</Tag>
      <Tag size="large">大标签</Tag>
      <Tag isMessageTag hasIcon iconName="info">消息标签</Tag>
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| className | `string` | - | 自定义类名 |
| id | `any` | - | 自定义 id |
| round | `boolean` | `true` | 圆角 |
| fill | `'solid' \| 'outline'` | `'solid'` | 填充模式 |
| children | `React.ReactNode` | - | 标签内容 |
| color | `string \| 'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'caution'` | `'default'` | 填充颜色 |
| style | `React.CSSProperties` | - | 自定义 CSS 变量样式 |
| size | `'small' \| 'normal' \| 'large'` | `'normal'` | 标签尺寸 |
| isMessageTag | `boolean` | `false` | 是否消息标签 |
| hasIcon | `boolean` | `false` | 消息标签是否有图标 |
| tagIconProps | `{ iconUrl?, hoverColor?, style?, className? }` | - | 图标属性 |
| iconName | `string` | - | 图标标识名称 |
| closable | `boolean` | `false` | 设置组件是否可以关闭 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(e: React.MouseEvent<HTMLSpanElement>)` | 标签点击 |
| onClose | `(e) => void` | 点击关闭时回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children | 标签内容文本 |

## CSS 变量（通过 style prop 设置）

| 变量名 | 说明 |
|--------|------|
| `--color` | 文本颜色 |
| `--background` | 背景颜色 |
| `--borderColor` | 边框颜色 |
| `--borderRadius` | 圆角（round=false 时生效） |
| `--border` | 边框设置 |

## 注意事项

- `color` 支持 6 个预设颜色和自定义颜色字符串
- `fill='outline'` 为镂空样式（仅边框有颜色），`fill='solid'` 为实心样式
- `round=false` 时标签为方角，可通过 `--borderRadius` CSS 变量自定义圆角
- `isMessageTag` 启用消息标签模式，配合 `hasIcon` 和 `iconName` 显示图标
- 自定义颜色可通过 `style` prop 的 CSS 变量实现，优先级高于 `color` 预设