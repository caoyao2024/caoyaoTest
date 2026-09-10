# Dialog

**Import:** `import Dialog from '@cloudsop/eview-ui/Dialog'`

## 基本用法

### 基础对话框

```tsx
import Dialog from '@cloudsop/eview-ui/Dialog'

function Example() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开</button>
      <Dialog
        isOpen={isOpen}
        title="提示"
        onClose={() => setIsOpen(false)}
      >
        <p>对话框内容</p>
      </Dialog>
    </>
  )
}
```

### 模态对话框

```tsx
import Dialog from '@cloudsop/eview-ui/Dialog'

function Example() {
  return (
    <Dialog isOpen modal title="模态对话框" onClose={() => {}}>
      <p>模态内容</p>
    </Dialog>
  )
}
```

### 自定义按钮

```tsx
import Dialog from '@cloudsop/eview-ui/Dialog'

function Example() {
  return (
    <Dialog
      isOpen
      title="确认"
      buttons={[
        { text: '取消', onClick: () => {} },
        { text: '确定', status: 'primary', onClick: () => {} }
      ]}
      onClose={() => {}}
    >
      <p>确认操作？</p>
    </Dialog>
  )
}
```

### 可移动/可缩放对话框

```tsx
import Dialog from '@cloudsop/eview-ui/Dialog'

function Example() {
  return (
    <Dialog
      isOpen
      title="可操作"
      movable
      resizable
      onResize={(el) => console.log('resized:', el)}
      onMove={(el) => console.log('moved:', el)}
      onClose={() => {}}
    >
      <p>内容</p>
    </Dialog>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 定制组件 dom 元素 id，传入该值可覆盖组件自动生成的 id |
| className | `string` | - | 定制组件 dom 元素 className |
| title | `ReactNode \| string` | - | 定制弹出框标题，当为 ReactNode 类型时可以通过 titleTip 属性设置 title 提示信息 |
| titleTip | `string` | - | 通过 title 设置弹出框标题的提示 |
| titleStyle | `CSSProperties` | - | 自定义弹出框标题样式 |
| customIcons | `Array<CustomIcon>` | - | 自定义图标，CustomIcon 结构：`{ tip?: string; iconUrl: string; customIconClick?: () => void }` |
| url | `string` | - | 自定义弹出框传入第三方页面 url |
| position | `Array<number \| null>` | - | 自定义弹出框显示位置，数字数组 [x, y, a, b] |
| size | `Array<number \| string>` | - | 自定义弹出框大小，两个数字的数组 [宽度, 高度] |
| minimizable | `boolean` | `false` | 控制对话框最小化属性 |
| minimizModalEnable | `boolean` | `false` | 弹出框最小化后模态是否显示 |
| customClose | `boolean` | - | 是否自定义关闭 |
| closable | `boolean` | `true` | 自定义弹出框是否显示关闭按钮 |
| isOpen | `boolean` | `false` | 自定义弹出框是否显示（必填） |
| modal | `boolean` | `true` | 自定义弹出框是否模态 |
| resizable | `boolean` | `false` | 对话框是否可缩放 |
| movable | `boolean` | `false` | 对话框是否可移动 |
| maskStyle | `CSSProperties` | - | 自定义蒙层样式 |
| style | `CSSProperties` | - | 自定义弹出框样式，允许设置 minWidth 和 minHeight 来限制缩放的最小尺寸 |
| contentStyle | `CSSProperties` | - | 自定义弹出框内容区样式 |
| buttonStyle | `CSSProperties` | - | 自定义弹出框按钮对齐样式 |
| buttons | `Array<ButtonProps>` | - | 自定义弹出框按钮区按钮 |
| children | `React.ReactNode` | - | 自定义弹出框传入页面内容，支持 React 标签以及 HTML 原生标签 |
| onClose | `(arg?: object) => void` | - | 自定义点击关闭按钮关闭弹出框时的回调方法 |
| onResize | `(arg?: HTMLDivElement) => void` | - | 当调整大小时激活的函数 |
| onMove | `(arg?: HTMLDivElement) => void` | - | 当移动对话框时激活的函数 |
| closeOnEscape | `boolean` | `true` | 是否支持 ESC 键关闭 |
| focusOnClose | `boolean` | `true` | 打开弹层时自动聚焦到关闭按钮 |
| zIndex | `number` | `9992` | 设置弹出框的 z-index |
| isMinimized | `boolean` | - | 设置弹出框的最小化属性，提供外部控制最小化 |
| mountId | `string` | - | Dialog 挂载节点 id |
| mountOnBody | `boolean` | - | 是否挂载到 body 上 |
| destroyOnClose | `boolean` | `true` | 关闭时销毁 |
| closeStyle | `CSSProperties` | - | 自定义弹窗关闭按钮样式 |
| version | `string` | - | 设置组件版本（影响样式类名） |
| theme | `string` | - | 设置组件主题 |

## CustomIcon

| 字段 | 类型 | 说明 |
|------|------|------|
| tip | `string` | 图标提示信息 |
| iconUrl | `string` | 图标 url |
| customIconClick | `() => void` | 图标点击回调 |

## 注意事项

- `isOpen` 为必填属性，控制对话框的显示与隐藏
- `movable` 默认值为 `false`（非 true），需显式设置才能拖动
- `mountOnBody` 控制挂载位置，为 `true` 时挂载到 document.body
- `customIcons` 可添加自定义图标到标题栏
- `closeOnEscape` 默认为 `true`，按 ESC 键可关闭对话框
- `destroyOnClose` 默认为 `true`，关闭时销毁内部内容
