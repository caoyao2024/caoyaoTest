# Divider

**Import:** `import Divider from '@nce/eview-react/Divider'`

## 基本用法

### 基础分割线

```tsx
import Divider from '@nce/eview-react/Divider'

function Example() {
  return (
    <div>
      <p>上方内容</p>
      <Divider />
      <p>下方内容</p>
    </div>
  )
}
```

### 带标题和虚线分割线

```tsx
import Divider from '@nce/eview-react/Divider'

function Example() {
  return (
    <div>
      <Divider>居中标题</Divider>
      <Divider orientation="left">左对齐标题</Divider>
      <Divider orientation="right">右对齐标题</Divider>
      <Divider dashed />
      <Divider type="vertical" />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| style | `React.CSSProperties` | - | 自定义样式 |
| className | `string` | - | 自定义类名 |
| type | `'horizontal' \| 'vertical'` | `'horizontal'` | 分割线方向 |
| dashed | `boolean` | `false` | 是否虚线 |
| orientation | `'left' \| 'right' \| 'center'` | - | 标题位置 |
| children | `React.ReactNode` | - | 分割线标题内容 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| 无 | - | 分割线无事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children | 分割线标题内容，设置后分割线中间显示文字 |

## 注意事项

- `type='vertical'` 时为垂直分割线，通常用于行内分隔
- `orientation` 仅在 `children` 有内容时生效，控制标题文字的对齐位置
- `dashed` 设置为 true 时显示虚线样式