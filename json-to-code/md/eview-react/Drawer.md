# Drawer

**Import:** `import Drawer from '@nce/eview-react/Drawer'`

## 基本用法

### 右侧抽屉

```tsx
import Drawer from '@nce/eview-react/Drawer'

function Example() {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <button onClick={() => setVisible(true)}>打开抽屉</button>
      <Drawer
        title="详情"
        visible={visible}
        width={400}
        onClose={() => setVisible(false)}
      >
        <div>抽屉内容</div>
      </Drawer>
    </>
  )
}
```

### 不同方向

```tsx
import Drawer from '@nce/eview-react/Drawer'

function Example() {
  const [visible, setVisible] = React.useState(false)
  const [placement, setPlacement] = React.useState('right')
  return (
    <>
      <button onClick={() => { setPlacement('left'); setVisible(true) }}>左侧</button>
      <button onClick={() => { setPlacement('top'); setVisible(true) }}>上方</button>
      <button onClick={() => { setPlacement('bottom'); setVisible(true) }}>下方</button>
      <Drawer
        title="方向抽屉"
        visible={visible}
        placement={placement}
        width={300}
        height={300}
        onClose={() => setVisible(false)}
      >
        <div>{placement} 方向抽屉</div>
      </Drawer>
    </>
  )
}
```

### 可拖拽调整大小 + 关闭销毁

```tsx
import Drawer from '@nce/eview-react/Drawer'

function Example() {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <button onClick={() => setVisible(true)}>打开可拖拽抽屉</button>
      <Drawer
        title="面板"
        visible={visible}
        width={360}
        sizeDraggable
        destroyOnClose
        onDragFinished={(e) => console.log('拖拽结束', e)}
        onDragMove={(size) => console.log('当前尺寸', size)}
        onClose={() => setVisible(false)}
      >
        <div>可拖拽调整宽度，关闭时销毁内容</div>
      </Drawer>
    </>
  )
}
```

### 无遮罩 + 点击遮罩不关闭

```tsx
import Drawer from '@nce/eview-react/Drawer'

function Example() {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <button onClick={() => setVisible(true)}>打开无遮罩抽屉</button>
      <Drawer
        title="信息面板"
        visible={visible}
        width={320}
        showMask={false}
        isClickMask={false}
        onClose={() => setVisible(false)}
      >
        <div>无遮罩层，不阻断背景交互</div>
      </Drawer>
    </>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件外层容器 id |
| className | `string` | `''` | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式（zIndex 可在此设置，默认 2022） |
|visible | `boolean` | `false` | 是否显示抽屉 |
| showMask | `boolean` | `true` | 是否显示遮罩 |
| showTitle | `boolean` | `true` | 是否显示标题 |
| showClose | `boolean` | `true` | 是否显示关闭按钮 |
| isClickMask | `boolean` | `true` | 是否点击遮罩关闭抽屉 |
| title | `string` | `''` | 抽屉标题 |
| tipData | `string` | `''` | 标题的 tooltip 内容 |
| placement | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | 抽屉弹出方向 |
| width | `number` | `300` | 宽度（placement 为 left / right 时使用） |
| height | `number` | `300` | 高度（placement 为 top / bottom 时使用） |
| destroyOnClose | `boolean` | `false` | 关闭抽屉时是否销毁内容区子节点 |
| isMountBody | `boolean` | `true` | 是否挂载在 body 节点（false 为挂载在当前 DOM） |
| mountId | `string` | - | 自定义挂载节点 ID（与 `isMountBody=false` 互斥） |
| sizeDraggable | `boolean` | `false` | 是否可拖拽调整抽屉大小（横向调整宽度，纵向调整高度） |
| contentClassName | `string` | - | 自定义内容区 className |
| animationDuration | `number` | `300` | 动画持续时间（毫秒） |
| children | `React.ReactNode` | - | 抽屉内容 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClose | `(isShowDrawer: false) => void` | 点击关闭按钮或遮罩关闭时的回调，参数固定为 `false` |
| onDragFinished | `(event: MouseEvent) => void` | 拖拽调整大小结束时的回调 |
| onDragMove | `(size: number) => void` | 拖拽调整大小过程中的回调，参数为当前尺寸（px） |

## Slots

| slot 名 | 说明 |
|---------|------|
| children | 抽屉主体内容区域 |

## 注意事项

- Drawer 对应 A2UI 的 Drawer 组件
- 使用函数组件 + Hooks 实现（区别于 Dialog 的 Class Component）
- `visible` 由外部控制（受控模式），组件内部通过 `useEffect` 同步 `showDrawer` 状态
- `width` / `height` 默认均为 `300px`，根据 `placement` 方向决定使用哪个值
- `isMountBody=true`（默认）时通过 `createPortal` 挂载到 `document.body`；设为 `false` 则挂载在当前 DOM 位置
- `mountId` 可指定挂载节点，优先于 `isMountBody`；设置 `mountId` 时通过 `createPortal` 挂载到对应 DOM 节点
- `showMask=false` 时不显示遮罩层，背景可正常交互
- `isClickMask=false` 时点击遮罩不关闭抽屉（需配合 `showMask=true`）
- `sizeDraggable=true` 时在抽屉边缘显示拖拽条，横向抽屉可调整宽度，纵向可调整高度
- `destroyOnClose=true` 关闭时会销毁子节点，再次打开时重新渲染
- `animationDuration` 控制展开/收起动画时长
- 打开抽屉时自动将父容器 `overflow` 设为 `hidden`，关闭时恢复
- 默认 z-index 为 `2022`（可通过 `style.zIndex` 覆盖）
- `tipData` 可为标题添加 tooltip 提示
