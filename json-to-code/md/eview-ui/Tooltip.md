# Tooltip 气泡框

**Import:** `import Tooltip from '@cloudsop/eview-ui/Tooltip'`

## 基本用法

### 基础悬浮提示

```tsx
import Tooltip from '@cloudsop/eview-ui/Tooltip'

function Example() {
  return (
    <Tooltip content="这是提示内容">
      <span>鼠标悬浮查看</span>
    </Tooltip>
  )
}
```

### 不同方向

```tsx
import Tooltip from '@cloudsop/eview-ui/Tooltip'

function Example() {
  return (
    <>
      <Tooltip content="上" placement="top"><span>上</span></Tooltip>
      <Tooltip content="下" placement="bottom"><span>下</span></Tooltip>
      <Tooltip content="左" placement="left"><span>左</span></Tooltip>
      <Tooltip content="右" placement="right"><span>右</span></Tooltip>
      <Tooltip content="左上" placement="topLeft"><span>左上</span></Tooltip>
      <Tooltip content="右下" placement="bottomRight"><span>右下</span></Tooltip>
    </>
  )
}
```

### 点击触发

```tsx
import Tooltip from '@cloudsop/eview-ui/Tooltip'

function Example() {
  return (
    <Tooltip content="点击触发" trigger="click">
      <span>点击我</span>
    </Tooltip>
  )
}
```

### 聚焦触发

```tsx
import Tooltip from '@cloudsop/eview-ui/Tooltip'

function Example() {
  return (
    <Tooltip content="聚焦触发" trigger="focus">
      <input placeholder="聚焦我" />
    </Tooltip>
  )
}
```

### 手动控制显隐

```tsx
import Tooltip from '@cloudsop/eview-ui/Tooltip'

function Example() {
  const [visible, setVisible] = useState(false)
  return (
    <Tooltip content="手动控制" visible={visible} onVisibleChange={setVisible}>
      <span onClick={() => setVisible(!visible)}>切换显隐</span>
    </Tooltip>
  )
}
```

### 自定义背景色

```tsx
import Tooltip from '@cloudsop/eview-ui/Tooltip'

function Example() {
  return (
    <Tooltip content="蓝色提示" color="#1890ff">
      <span>自定义颜色</span>
    </Tooltip>
  )
}
```

### 自动关闭

```tsx
import Tooltip from '@cloudsop/eview-ui/Tooltip'

function Example() {
  return (
    <Tooltip content="3秒后自动消失" autoConfig={{ autoClose: true, duration: 3000 }}>
      <span>悬浮查看</span>
    </Tooltip>
  )
}
```

### 文本溢出时才显示提示

```tsx
import Tooltip from '@cloudsop/eview-ui/Tooltip'

function Example() {
  return (
    <Tooltip content="完整文本内容" visibleOnOverflow>
      <span style={{ width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        这是一段很长很长的文本内容
      </span>
    </Tooltip>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| content | `ReactNode` | - | 气泡提示内容；为空时 Tooltip 不会显示 |
| visible | `boolean` | - | 手动控制浮层显隐；不传时由 trigger 内部管理 |
| placement | `Placement` | `'top'` | 气泡框位置，见下方 Placement 说明 |
| trigger | `'hover' \| 'focus' \| 'click' \| Array<'hover' \| 'focus' \| 'click'>` | `'hover'` | 触发方式，支持数组组合多种触发方式 |
| overlayClassName | `string` | - | 提示浮层额外类名 |
| overlayStyle | `CSSProperties` | - | 提示浮层样式 |
| color | `string` | - | 背景颜色（同时用于内容区和箭头边框颜色） |
| customContentStyle | `CSSProperties` | - | 下展内容区域的样式 |
| space | `number` | `8` | 气泡框与目标元素的间距（px） |
| zIndex | `number` | baseZIndex + baseZIndexUnit | 气泡框 z-index |
| mouseEnterDelay | `number` | `100` | 鼠标进入后显示 Tooltip 的延迟（ms） |
| mouseLeaveDelay | `number` | `100` | 鼠标移出后关闭 Tooltip 的延迟（ms） |
| onVisibleChange | `(visible: boolean) => void` | - | 显隐状态变化回调 |
| autoAdjustOverflow | `boolean` | `true` | 当气泡被遮挡时是否自动调整位置 |
| arrowPointAtCenter | `boolean` | `false` | 箭头是否指向目标元素中心 |
| hideArrow | `boolean` | `false` | 是否隐藏箭头 |
| destroyTooltipOnHide | `boolean` | `false` | 关闭后是否销毁 Tooltip DOM |
| autoConfig | `{ autoClose: boolean; duration?: number }` | `{ autoClose: false, duration: 3000 }` | 自动关闭配置；`autoClose=true` 时按 `duration`（ms）自动关闭，默认 3000ms |
| getPopupContainer | `(() => HTMLElement) \| false` | `() => document.body` | 获取渲染父节点；设为 `false` 时在原位置渲染 |
| visibleOnOverflow | `boolean` | `false` | 仅当内容不完全可见时才展示气泡 |
| calcContentIsOverflow | `(element: HTMLElement) => boolean` | `scrollWidth > clientWidth` | 判断内容是否溢出的自定义函数（visibleOnOverflow 为 true 时生效） |
| children | `ReactNode` | - | 触发元素（仅接受单个子元素） |
| version | `string` | 取 ThemeContext | 设置组件版本（影响样式类名） |
| theme | `string` | 取 ThemeContext | 设置组件主题 |

### Placement 类型

```
Placement = PlacementPreset | ((alignedRect: DOMRect, popupRect: DOMRect) => Coordinate)

PlacementPreset:
  'top' | 'topLeft' | 'topRight'
  'bottom' | 'bottomLeft' | 'bottomRight'
  'left' | 'leftTop' | 'leftBottom'
  'right' | 'rightTop' | 'rightBottom'
```

## 静态方法

| 方法 | 说明 |
|------|------|
| `Tooltip.destroyAll()` | 销毁页面上所有 Tooltip 实例 |

## 注意事项

- Tooltip 对应 A2UI 的 Tooltip 组件
- `children` 仅接受单个 React 子元素，会注入事件监听和 ref
- `content` 为空（`null`/`undefined`/`''`）时 Tooltip 不会显示
- `visible` 不传时由 trigger 内部管理显隐；传入后变为受控模式，需配合 `onVisibleChange` 使用
- `trigger` 支持数组形式，如 `['hover', 'click']` 同时响应悬浮和点击
- `hover` 触发时，鼠标移入气泡框本身不会触发关闭（气泡框内部可交互）
- ESC 键可关闭已打开的 Tooltip
- `ConfigProvider.getBaseUseSingleTooltip()` 为 true 时，同一时刻只允许一个 Tooltip 显示
- 子元素 `disabled=true` 时，Tooltip 自动包一层 `span` 解决 pointer-events 问题（`disabledCompatible` 默认开启）
- `visibleOnOverflow` 可用于表格列等场景，仅当文本被截断时才显示完整提示
