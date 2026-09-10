# Dropdown

**Import:** `import Dropdown from '@cloudsop/eview-ui/Dropdown'`

## 基本用法

### 基础下拉菜单

```tsx
import Dropdown from '@cloudsop/eview-ui/Dropdown'

function Example() {
  return (
    <Dropdown overlay={<div>菜单内容</div>}>
      <button>点击触发</button>
    </Dropdown>
  )
}
```

### 悬停触发

```tsx
import Dropdown from '@cloudsop/eview-ui/Dropdown'

function Example() {
  return (
    <Dropdown trigger={['hover']} overlay={<div>菜单内容</div>}>
      <button>悬停触发</button>
    </Dropdown>
  )
}
```

### 受控显示

```tsx
import Dropdown from '@cloudsop/eview-ui/Dropdown'

function Example() {
  const [visible, setVisible] = React.useState(false)

  return (
    <Dropdown
      visible={visible}
      onVisibleChange={(v) => setVisible(v)}
      overlay={<div>菜单内容</div>}
    >
      <button onClick={() => setVisible(!visible)}>切换菜单</button>
    </Dropdown>
  )
}
```

### 不同弹出位置

```tsx
import Dropdown from '@cloudsop/eview-ui/Dropdown'

function Example() {
  return (
    <>
      <Dropdown placement="bottomLeft" overlay={<div>菜单</div>}><button>左下</button></Dropdown>
      <Dropdown placement="bottomRight" overlay={<div>菜单</div>}><button>右下</button></Dropdown>
      <Dropdown placement="topLeft" overlay={<div>菜单</div>}><button>左上</button></Dropdown>
    </>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| visible | `boolean` | - | 控制菜单的显示 |
| onVisibleChange | `(visible: boolean) => void` | - | 菜单显示状态变更时调用 |
| getPopupContainer | `(() => HTMLElement) \| false` | `() => document.body` | 获取渲染父节点，设为 false 时为元素虚拟 dom 的原位置 |
| placement | `Placement` | `'bottomLeft'` | 定义 popup 依附的相对位置，可选值：`'leftTop'` \| `'left'` \| `'leftBottom'` \| `'rightTop'` \| `'right'` \| `'rightBottom'` \| `'topLeft'` \| `'top'` \| `'topRight'` \| `'bottomLeft'` \| `'bottom'` \| `'bottomRight'` |
| overlay | `React.ReactNode` | - | 菜单元素（必填） |
| overlayClassName | `string` | - | 下拉根元素类名 |
| overlayStyle | `React.CSSProperties` | - | 下拉根元素样式 |
| trigger | `Array<'click' \| 'hover' \| 'contextMenu'>` | `['click']` | 触发下拉的行为，默认为数组 `['click']` |
| children | `React.ReactElement` | - | 菜单弹出触发者元素（必填） |
| mountOnBody | `boolean` | - | 是否将下拉元素挂载到 body 下 |

## 注意事项

- `overlay` 和 `children` 为必填属性
- `trigger` 类型为数组，默认值为 `['click']`，支持组合触发如 `['click', 'hover']`
- `placement` 支持 12 个方向位置
- `visible` 配合 `onVisibleChange` 可实现受控模式
- `children` 只接受单个 ReactElement，如需多个元素请用 Fragment 包裹
