# Carousel

**Import:** `import Carousel from '@nce/eview-react/Carousel'`

## 基本用法

### 基础轮播

```tsx
import Carousel from '@nce/eview-react/Carousel'

function Example() {
  return (
    <Carousel>
      <div style={{ background: '#364d79', height: 200 }}>面板 1</div>
      <div style={{ background: '#5b8c5a', height: 200 }}>面板 2</div>
      <div style={{ background: '#d4860b', height: 200 }}>面板 3</div>
    </Carousel>
  )
}
```

### 自动播放与 CarouselItem

```tsx
import Carousel, { CarouselItem } from '@nce/eview-react/Carousel'

function Example() {
  const items = [
    { key: 1, text: '面板 1' },
    { key: 2, text: '面板 2' },
    { key: 3, text: '面板 3' },
  ]

  return (
    <Carousel
      activeKey={1}
      autoplay
      autoplayInterval={5000}
      transformTime={600}
    >
      {items.map((item) => (
        <CarouselItem itemKey={item.key} key={item.key}>
          <div style={{ background: '#364d79', height: 200 }}>{item.text}</div>
        </CarouselItem>
      ))}
    </Carousel>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名（最外层 div） |
| style | `React.CSSProperties` | - | 自定义样式（最外层 div） |
| autoplay | `boolean` | `false` | 是否自动播放 |
| autoplayInterval | `number` | `3000` | 自动播放时间间隔（毫秒） |
| direction | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | 轮播方向 |
| axis | `'horizontal' \| 'vertical'` | `'horizontal'` | 水平/垂直方向 |
| transformTime | `number` | `350` | 动画切换时间（毫秒） |
| indicator | `boolean` | `true` | 是否显示指示器 |
| repeat | `boolean` | `true` | 是否重复播放 |
| activeKey | `number \| string` | - | 激活面板的 key |
| allowTouch | `boolean` | `true` | 是否支持手势拖动 |
| hasArrows | `boolean` | `true` | 是否显示左右箭头 |

## CarouselItem Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| itemKey | `number \| string` | - | 面板标识 key |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(index: number) => void` | 面板切换后回调，index 为当前面板索引 |
| onClick | `(index: number) => void` | 面板点击切换回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children | 每个子元素为一个轮播面板，可使用 CarouselItem 包裹并指定 itemKey |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| next | `() => void` | 切换到下一面板 |
| prev | `() => void` | 切换到上一面板 |

## 注意事项

- 子元素直接作为轮播面板，或使用 `CarouselItem` 包裹并通过 `itemKey` 标识
- `activeKey` 配合 `CarouselItem` 的 `itemKey` 使用，可控制初始显示面板
- `autoplay` 默认关闭，开启后通过 `autoplayInterval` 控制间隔
- `axis='vertical'` 设置垂直方向轮播，`direction` 控制具体滚动方向
- `repeat=false` 时播放到最后一个面板后停止