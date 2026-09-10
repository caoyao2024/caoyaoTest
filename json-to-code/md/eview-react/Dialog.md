# Dialog

**Import:** `import Dialog from '@nce/eview-react/Dialog'`

## 基本用法

### 基础弹窗

```tsx
import Dialog from '@nce/eview-react/Dialog'

function Example() {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <button onClick={() => setVisible(true)}>打开弹窗</button>
      <Dialog
        title="提示"
        isOpen={visible}
        onClose={() => setVisible(false)}
      >
        <div>这是弹窗内容</div>
      </Dialog>
    </>
  )
}
```

### 模态弹窗 + 自定义按钮

```tsx
import Dialog from '@nce/eview-react/Dialog'

function Example() {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <button onClick={() => setVisible(true)}>打开确认弹窗</button>
      <Dialog
        title="确认操作"
        isOpen={visible}
        modal
        buttons={[
          { text: '取消', onClick: () => setVisible(false) },
          { text: '确定', onClick: () => { console.log('confirmed'); setVisible(false) } }
        ]}
        onClose={() => setVisible(false)}
      >
        <div>确定要执行此操作吗？</div>
      </Dialog>
    </>
  )
}
```

### 可拖拽 + 可调整大小 + 非模态

```tsx
import Dialog from '@nce/eview-react/Dialog'

function Example() {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <button onClick={() => setVisible(true)}>打开可拖拽弹窗</button>
      <Dialog
        title="详细信息"
        isOpen={visible}
        modal={false}
        movable
        resizable
        size={[600, 400]}
        onClose={() => setVisible(false)}
      >
        <div>可拖拽、可调整大小的非模态弹窗</div>
      </Dialog>
    </>
  )
}
```

### 最小化弹窗 + 边界限制

```tsx
import Dialog from '@nce/eview-react/Dialog'

function Example() {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <button onClick={() => setVisible(true)}>打开可最小化弹窗</button>
      <Dialog
        title="任务详情"
        isOpen={visible}
        minimizable
        boundary={{ top: 0, right: 1920, bottom: 1080, left: 0 }}
        onClose={() => setVisible(false)}
      >
        <div>支持最小化和拖拽边界限制</div>
      </Dialog>
    </>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件外层容器 id，可覆盖自动生成的 id |
| className | `string` | - | 自定义类名（追加到自动生成的 className） |
| style | `React.CSSProperties` | - | 自定义弹窗样式 |
| title | `React.ReactNode \| string` | - | 弹窗标题，不传则标题为空 |
| titleTip | `string` | - | 弹窗标题的提示文本 |
| customIcons | `any` | - | 自定义标题栏图标，数组对象 `{iconUrl, customIconClick, tip}` |
| url | `string` | - | 嵌入第三方页面 URL |
| position | `[number \| null, number \| null]` | - | 弹窗显示位置 [左边距, 上边距] |
| size | `[number \| string \| null, number \| string \| null]` | `['', '']` | 弹窗大小 [宽, 高] |
| isOpen | `boolean` | `false` | 是否显示弹窗 |
| modal | `boolean` | `true` | 是否模态弹窗 |
| closable | `boolean` | `true` | 是否显示关闭按钮 |
| resizable | `boolean` | `false` | 是否可调整大小 |
| movable | `boolean` | `true` | 是否可拖拽移动 |
| minimizable | `boolean` | `false` | 是否可最小化 |
| minimizModalEnable | `boolean` | `false` | 最小化后模态是否仍显示 |
| isMinimized | `boolean` | - | 是否处于最小化状态 |
| customMinimized | `boolean` | `false` | 是否自定义最小化按钮（为 true 后最小化功能需自己实现） |
| closeOnEscape | `boolean` | `true` | 是否响应 ESC 键关闭弹窗 |
| destroyOnClose | `boolean` | `true` | 关闭时是否销毁弹窗内容 |
| customClose | `boolean` | `false` | 是否自定义关闭事件（为 true 时点击关闭按钮不生效，需在 onClose 中自行处理） |
| focusOnClose | `boolean` | `true` | 打开弹层时是否自动聚焦到关闭按钮 |
| lastFocus | `boolean` | `true` | 是否记录打开弹框前最后一个聚焦点（关闭时恢复焦点） |
| autoSetPosition | `boolean` | `true` | 是否自动设置弹窗位置（为 false 时不自动调用 setPosition） |
| isAllowedExceed | `boolean` | `true` | 是否允许弹窗拖出到浏览器窗口之外 |
| boundary | `Boundary` | - | 拖拽范围边界 `{ top?, right?, bottom?, left? }` |
| zindex | `number` | `9999` | 弹窗 z-index（建议不超过 9999，否则会遮挡内部 Select 等 Popup） |
| contentStyle | `object` | - | 弹窗内容区样式 |
| buttonStyle | `object` | - | 按钮区对齐样式（需传入 buttons） |
| buttons | `Array<{ text, onClick }>` | - | 自定义底部按钮区 |
| maskStyle | `React.CSSProperties` | `{}` | 自定义蒙层样式 |
| mountId | `string` | `''` | 自定义挂载 DOM 的 ID，不传则挂载在 body |
| animationOff | `boolean` | `false` | 是否关闭动画 |
| hasChecked | `boolean` | - | 是否显示勾选项 |
| onCheckChange | `(isChecked: boolean, event: object) => void` | - | 勾选项变更回调 |
| type | `any` | - | 弹窗类型 |
| detail | `any` | - | 详细信息 |
| maxContHeight | `any` | - | 最大内容高度 |
| detailMessage | `any` | - | 详细信息内容 |
| detailMessageShow | `boolean` | - | 是否显示详细信息 |
| detailStyle | `React.CSSProperties` | - | 详细信息样式 |
| detailMessageTitle | `string` | - | 详细信息标题 |
| content | `any` | - | 弹窗内容（与 children 互为替代） |
| iconLocation | `'content' \| 'title'` | - | 图标位置 |
| children | `React.ReactNode` | - | 弹窗内容，支持 React 标签和 HTML 原生标签 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClose | `(event: React.MouseEvent \| React.KeyboardEvent) => void` | 点击关闭按钮关闭弹窗时的回调 |
| onResize | `(size: object) => void` | resizable=true 时调整大小后触发的回调，参数为弹窗尺寸对象 |
| onMinimized | `(event: React.MouseEvent \| React.KeyboardEvent) => void` | 点击最小化按钮时的回调 |
| onKeyDown | `(event: any) => void` | 键盘事件回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children | 弹窗主体内容区域，支持 React 标签和 HTML 原生标签 |

## 注意事项

- Dialog 对应 A2UI 的 Dialog 组件
- 使用 Class Component 实现，内部维持 `isOpen` / `isMinimize` / `moved` 等状态
- 弹窗布局使用 `position: fixed`
- `modal=true` 时显示遮罩层，阻止与背景交互
- `resizable=true` 时可通过拖拽边框调整弹窗大小，触发 `onResize` 回调
- `movable=true` 时可通过拖拽标题栏移动弹窗
- `zindex` 建议不超过 9999，否则会遮挡弹窗内部 Select 等 Popup 组件（其默认 zindex 为 9999）
- `closeOnEscape=true` 时按 ESC 键可关闭弹窗并关闭弹窗内聚焦循环
- `customClose=true` 会阻止默认关闭行为，需在 `onClose` 中自行处理关闭逻辑
- `destroyOnClose=true` 关闭弹窗时销毁内容，避免残留 DOM
- `boundary` 可限制拖拽范围，配合 `isAllowedExceed=false` 使用
- `autoSetPosition=false` 时打开弹窗不会自动居中定位
- `buttons` 数组中每个对象含 `text` 和 `onClick`，会渲染在底部按钮区
- MessageDialog 继承自 Dialog，扩展了 `focused` 按钮属性等
