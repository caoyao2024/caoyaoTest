# Anchor 锚点

**Import:** `import Anchor from '@cloudsop/eview-ui/Anchor'`

## 基本用法

### 基础锚点

```tsx
import Anchor from '@cloudsop/eview-ui/Anchor'

function Example() {
  const data = [
    { id: 'section-1', title: '第一节' },
    { id: 'section-2', title: '第二节' },
    { id: 'section-3', title: '第三节' },
  ]
  return <Anchor data={data} />
}
```

### 多级锚点

```tsx
import Anchor from '@cloudsop/eview-ui/Anchor'

function Example() {
  const data = [
    {
      id: 'section-1',
      title: '第一节',
      children: [
        { id: 'section-1-1', title: '1.1 小节' },
        { id: 'section-1-2', title: '1.2 小节' },
      ],
    },
    { id: 'section-2', title: '第二节' },
  ]
  return <Anchor data={data} />
}
```

### 禁用某项

```tsx
import Anchor from '@cloudsop/eview-ui/Anchor'

function Example() {
  const data = [
    { id: 'section-1', title: '第一节' },
    { id: 'section-2', title: '第二节（禁用）', disabled: true },
    { id: 'section-3', title: '第三节' },
  ]
  return <Anchor data={data} />
}
```

### 自定义滚动偏移

```tsx
import Anchor from '@cloudsop/eview-ui/Anchor'

function Example() {
  const data = [
    { id: 'section-1', title: '第一节' },
    { id: 'section-2', title: '第二节' },
  ]
  return <Anchor data={data} offset={150} />
}
```

### 指定滚动容器

```tsx
import Anchor from '@cloudsop/eview-ui/Anchor'

function Example() {
  const data = [
    { id: 'section-1', title: '第一节' },
    { id: 'section-2', title: '第二节' },
  ]
  return <Anchor data={data} container="#scroll-container" />
}
```

### 自定义菜单样式

```tsx
import Anchor from '@cloudsop/eview-ui/Anchor'

function Example() {
  const data = [
    { id: 'section-1', title: '第一节' },
    { id: 'section-2', title: '第二节' },
  ]
  return <Anchor data={data} menuStyle={{ width: 200 }} />
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | `AnchorMenuItem[]` | - | 锚点菜单数据，必填 |
| offset | `number` | `100` | 滚动偏移量（px），点击锚点滚动时页面顶部留出的距离 |
| container | `string` | `'window'` | 滚动容器选择器；默认 `'window'` 监听 window 滚动，传入 CSS 选择器（如 `'#scroll-container'`）则在指定容器内滚动 |
| version | `string` | 取 ThemeContext | 设置组件版本（影响样式类名） |
| menuStyle | `CSSProperties` | - | 菜单区域自定义样式 |

### AnchorMenuItem

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 锚点目标元素的 DOM id，点击后滚动到对应 `id` 的元素位置 |
| title | `string` | - | 菜单项显示文本 |
| disabled | `boolean` | - | 是否禁用，禁用后点击无效且样式置灰 |
| children | `AnchorMenuItem[]` | - | 子级菜单项，支持多级嵌套 |

## 注意事项

- Anchor 对应 A2UI 的 Anchor 组件
- `data` 中的 `id` 必须与页面中对应内容的 DOM 元素 `id` 一致
- 组件为函数式组件，基于 `useState`/`useEffect`/`useCallback` 实现
- 滚动监听使用 `requestAnimationFrame` + 防抖（`SCROLL_STOP_DELAY = 100ms`）优化性能
- 点击锚点项后使用 `scrollTo({ behavior: 'smooth' })` 平滑滚动，并在滚动动画期间跳过活跃项计算
- 多级嵌套时，子级项会自动缩进（每级 `ITEM_MARGIN_LEFT = 1rem`）
- `container` 非 `'window'` 时，会给目标容器自动添加 `eui_anchor_custom_contanier` 类名
- 滚动到底部时（距离底部 < 50% 最后一节高度），自动激活最后一项
- 键盘支持：Enter 键触发锚点点击
