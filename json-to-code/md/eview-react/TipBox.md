# TipBox

**Import:** `import TipBox from '@nce/eview-react/TipBox'`

## 基本用法

### 子元素触发模式

传入 `children` 作为触发元素，通过 `trigger` 指定触发方式，提示框自动在触发元素旁定位显示。

```tsx
import TipBox from '@nce/eview-react/TipBox';

function Example() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <TipBox title="提示标题" content="这是提示内容" trigger="hover" direction="top">
        <button>悬停触发</button>
      </TipBox>
      <TipBox content="点击触发的提示" trigger="click" direction="bottom">
        <button>点击触发</button>
      </TipBox>
      <TipBox content="聚焦触发的提示" trigger="focus" direction="right">
        <input placeholder="聚焦触发" />
      </TipBox>
      <TipBox content="多种触发方式" trigger={['hover', 'focus']} direction="topLeft">
        <input placeholder="hover或focus触发" />
      </TipBox>
    </div>
  );
}
```

### 可关闭与自动关闭

```tsx
import TipBox from '@nce/eview-react/TipBox';

function Example() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <TipBox content="可手动关闭" isClosable={true} trigger="click">
        <button>点击打开</button>
      </TipBox>
      <TipBox content="3秒后自动关闭" disposeTimeOut={3000} trigger="hover">
        <button>悬停打开</button>
      </TipBox>
      <TipBox content="鼠标离开不关闭" isMouseLeaveClose={false} trigger="hover">
        <button>悬停打开</button>
      </TipBox>
    </div>
  );
}
```

### 错误提示框

```tsx
import TipBox from '@nce/eview-react/TipBox';

function Example() {
  return (
    <TipBox
      isErrorTip={true}
      errorTitle="输入错误"
      errorContent="请输入有效的邮箱地址"
      trigger="focus"
      direction="right"
    >
      <input placeholder="输入后聚焦查看错误" />
    </TipBox>
  );
}
```

### 始终显示

```tsx
import TipBox from '@nce/eview-react/TipBox';

function Example() {
  return (
    <TipBox content="始终显示的提示" displayMode="always" direction="top">
      <div style={{ width: 40, height: 40, background: '#eee' }} />
    </TipBox>
  );
}
```

## Props

| 属性名              | 类型                                                                                                                                                             | 默认值      | 说明                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| children            | `React.ReactNode`                                                                                                                                                | -           | **必填**，触发元素（仅支持单个子元素）                    |
| content             | `any`                                                                                                                                                            | -           | 提示内容（支持字符串、ReactNode）                         |
| title               | `string`                                                                                                                                                         | -           | 标题文字                                                  |
| trigger             | `'hover' \| 'focus' \| 'click' \| Array<'hover' \| 'focus' \| 'click'>`                                                                                          | `'hover'`   | 触发方式，支持数组组合                                    |
| direction           | `'topLeft' \| 'top' \| 'topRight' \| 'rightTop' \| 'right' \| 'rightBottom' \| 'bottomRight' \| 'bottom' \| 'bottomLeft' \| 'leftBottom' \| 'left' \| 'leftTop'` | `'topLeft'` | 提示框弹出方向（12 方向），支持 RTL 自动翻转              |
| arrowDirection      | `'left' \| 'right' \| 'top' \| 'bottom' \| 'none'`                                                                                                               | `'bottom'`  | 箭头方向（`'none'` 强制无箭头，优先级最高）               |
| className           | `string`                                                                                                                                                         | `''`        | 自定义类名                                                |
| style               | `React.CSSProperties`                                                                                                                                            | -           | 自定义样式（backgroundColor 会作为箭头边框色）            |
| displayMode         | `string`                                                                                                                                                         | -           | 设为 `'always'` 时始终显示                                |
| isClosable          | `boolean`                                                                                                                                                        | `false`     | 是否显示关闭按钮                                          |
| isMouseLeaveClose   | `boolean`                                                                                                                                                        | `true`      | 鼠标离开提示框时是否自动关闭                              |
| isErrorTip          | `boolean`                                                                                                                                                        | `false`     | 是否为错误提示框（使用 errorTitle/errorContent 渲染）     |
| errorTitle          | `string`                                                                                                                                                         | `'error'`   | 错误提示标题                                              |
| errorContent        | `React.ReactNode \| string`                                                                                                                                      | `'error'`   | 错误提示内容                                              |
| disposeTimeOut      | `number`                                                                                                                                                         | `0`         | 自动关闭延时（毫秒），>0 时到期自动关闭                   |
| triggerNode         | `HTMLElement`                                                                                                                                                    | -           | 自定义触发目标 DOM 元素（替代 children DOM 作为定位参考） |
| type                | `'normal' \| 'simple'`                                                                                                                                           | `'normal'`  | 提示框类型样式                                            |
| animationTime       | `number`                                                                                                                                                         | `200`       | 动画时长（毫秒）                                          |
| autoZindex          | `boolean`                                                                                                                                                        | -           | 自动获取页面最高 zIndex（有性能消耗）                     |
| titleStyle          | `React.CSSProperties`                                                                                                                                            | -           | 标题自定义样式                                            |
| titleClassName      | `string`                                                                                                                                                         | -           | 标题自定义类名                                            |
| errorInputClassName | `string`                                                                                                                                                         | -           | 错误输入框类名                                            |
| id                  | `string`                                                                                                                                                         | 自动生成    | 组件 DOM id                                               |

## Events

| 事件名       | 参数                        | 说明                                      |
| ------------ | --------------------------- | ----------------------------------------- |
| onClose      | `(event)`                   | 关闭回调（点击关闭按钮或 Enter 关闭）     |
| onDispose    | -                           | 自动关闭回调（disposeTimeOut 到期后触发） |
| onMouseEnter | `(event: React.MouseEvent)` | 鼠标移入提示框回调                        |
| onMouseLeave | `(event: React.MouseEvent)` | 鼠标移出提示框回调                        |
| onScroll     | `(event)`                   | 滚动导致隐藏时的回调                      |

## Slots

| slot 名  | 说明                                    |
| -------- | --------------------------------------- |
| children | 触发元素，TipBox 在触发元素旁边定位显示 |

## 注意事项

- TipBox 对应 A2UI 的 TipBox 组件
- `children` 仅支持单个子元素，使用 `React.Children.only` 校验
- `trigger` 支持数组组合，如 `['hover', 'focus']` 同时支持多种触发方式
- 触发方式映射：`hover` → mouseEnter/mouseLeave，`focus` → focus/blur，`click` → onClick
- 防误触发：窗口失焦超过 500ms 后恢复焦点时不会触发 TipBox 打开
- `direction` 支持 12 方向定位，RTL 布局下 `topLeft↔topRight`、`bottomLeft↔bottomRight` 自动翻转
- `arrowDirection='none'` 优先级最高，强制不显示箭头
- 鼠标离开提示框时默认自动关闭（`isMouseLeaveClose` 默认为 `true`）
- `isClosable` 为 `true` 时显示关闭按钮，支持 Enter 键关闭
- `disposeTimeOut > 0` 时提示框到期自动关闭，并触发 `onDispose` 回调
- 点击菜单外部触发关闭（`trigger` 非 `focus` 时），滚动/wheel 事件也可能导致关闭
- `backgroundColor` 样式值会同步应用到箭头边框色
- 提示框使用 `RenderOutside` 渲染到 body 外层，`ClickAwayListener` 监听外部点击
- `autoZindex` 会遍历页面 DOM 获取最高 zIndex，对性能有消耗，谨慎使用