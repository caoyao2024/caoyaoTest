# Anchor

**Import:** `import Anchor, { AnchorLink } from '@nce/eview-react/Anchor'`

## 基本用法

### 基础锚点导航

```tsx
import Anchor, { AnchorLink } from '@nce/eview-react/Anchor'

function Example() {
  return (
    <Anchor containerId="scroll-container" onChange={(currentLink) => console.log('当前锚点:', currentLink)}>
      <AnchorLink href="#section-1" title="第一节" />
      <AnchorLink href="#section-2" title="第二节" />
      <AnchorLink href="#section-3" title="第三节" />
    </Anchor>
  )
}
```

### 固定模式锚点

```tsx
import Anchor, { AnchorLink } from '@nce/eview-react/Anchor'

function Example() {
  return (
    <Anchor affix affixTop={60} offsetTop={50}>
      <AnchorLink href="#overview" title="概述" />
      <AnchorLink href="#features" title="特性" />
      <AnchorLink href="#api" title="API" />
    </Anchor>
  )
}
```

## Anchor Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string \| number` | - | 组件 id |
| className | `string` | - | 类名 |
| style | `React.CSSProperties` | - | 样式 |
| containerId | `string` | `'body'` | 指定滚动的容器 ID，当作选择器处理进行节点查询 |
| onChange | `(currentLink: string) => void` | - | 锚点改变时触发 |
| onClick | `(e: MouseEvent, link: { href: string; title: string \| ReactNode }) => void` | - | 锚点被点击时触发 |
| offsetTop | `number` | - | 距离窗口顶部达到指定偏移量后触发 |
| affix | `boolean` | `false` | 固定模式 |
| affixTop | `number` | `0` | 固定模式下，距离窗口顶部达到指定偏移量后触发 affix 样式 |

## AnchorLink Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string \| number` | - | 组件 id |
| className | `string` | - | 类名 |
| style | `React.CSSProperties` | - | 样式 |
| title | `string \| ReactNode` | - | 文字内容 |
| href | `string` | - | 锚点链接 |
| target | `string` | - | 锚点打开方式，可选 `_self`、`_blank`、`_parent`、`_top` |
| level | `number` | - | 锚点层级 |
| chengeIndex | `(e: MouseEvent, link: { href: string; title: string \| ReactNode }) => void` | - | 锚点项点击回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children | 通过 `AnchorLink` 子组件定义锚点项 |

## 注意事项

- Anchor 通过 `AnchorLink` 子组件定义锚点导航项，支持 `Anchor.Link` 写法
- `containerId` 默认为 `'body'`，指定滚动容器后锚点将监听该容器的滚动
- `affix` 为 `true` 时启用固定模式，配合 `affixTop` 控制触发 affix 样式的偏移量
- `onChange` 在锚点切换时触发，参数为当前锚点的 href
- `AnchorLink` 的 `title` 支持 `ReactNode`，可传入自定义渲染内容
- `AnchorLink` 的 `target` 支持标准 HTML target 属性值
