# Button

**Import:** `import Button from '@cloudsop/eview-ui/Button'`

## 基本用法

### 基础按钮

```tsx
import Button from '@cloudsop/eview-ui/Button'

function Example() {
  return <Button text="确定" onClick={() => console.log('clicked')} />
}
```

### 不同状态

```tsx
import Button from '@cloudsop/eview-ui/Button'

function Example() {
  return (
    <>
      <Button text="默认" status="default" />
      <Button text="主要" status="primary" />
      <Button text="危险" status="risk" />
    </>
  )
}
```

### 不同尺寸

```tsx
import Button from '@cloudsop/eview-ui/Button'

function Example() {
  return (
    <>
      <Button text="小" size="small" />
      <Button text="正常" size="normal" />
      <Button text="大" size="large" />
    </>
  )
}
```

### 带图标

```tsx
import Button from '@cloudsop/eview-ui/Button'

function Example() {
  return <Button text="保存" leftIcon="save" rightIcon="arrow-right" />
}
```

### 禁用状态

```tsx
import Button from '@cloudsop/eview-ui/Button'

function Example() {
  return <Button text="不可点击" disabled />
}
```

## Props — BaseButtonProps（基础属性）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| disabled | `boolean` | `false` | 设置 Button 的灰化状态 |
| className | `string` | - | 自定义 class |
| size | `'normal' \| 'large' \| 'small'` | `'normal'` | 设置组件的尺寸 |
| status | `'default' \| 'primary' \| 'risk'` | `'default'` | 设置 Button 的使用场景 |
| children | `React.ReactNode` | - | Button 中的内容 |
| text | `string` | `''` | Button 中的文本 |
| onKeyDown | `() => void` | - | 键盘按下回调 |
| version | `string` | - | 设置组件版本（影响样式类名） |
| theme | `string` | - | 设置组件主题 |

> Button 继承 `React.ButtonHTMLAttributes<HTMLButtonElement>`，支持所有原生 HTML button 属性，如 `id`、`style`、`title`、`onClick`、`onFocus`、`tabIndex` 等。

## Props — ButtonAdapter 扩展属性（图标与提示）

> `@cloudsop/eview-ui/Button` 默认导出的是 **ButtonAdapter**，在 BaseButtonProps 基础上扩展了以下属性。

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| focused | `boolean` | - | 是否聚焦 |
| toolTipProps | `TooltipProps` | - | Tooltip 属性配置 |
| tipType | `'title' \| 'tipbox'` | - | 提示类型（@deprecated，与原生 title 重叠，后续慢慢废弃） |
| tipShow | `'always' \| 'never' \| 'overflow'` | - | 提示显示时机：always 始终显示、never 从不显示、overflow 文本溢出时显示 |
| tipData | `string` | - | 提示内容文本 |
| tipStyle | `React.CSSProperties` | - | 提示框样式 |
| text | `string` | - | 按钮中设置的文本（Adapter 层重复声明） |
| leftIcon | `string` | - | 左侧图标名称 |
| rightIcon | `string` | - | 右侧图标名称 |
| leftIconProps | `LeftIcon` | - | 左侧图标扩展属性 |
| rightIconProps | `RightIcon` | - | 右侧图标扩展属性 |

## LeftIcon / RightIcon 结构

| 属性名 | 类型 | 说明 |
|--------|------|------|
| leftHoverIcon / rightHoverIcon | `string` | hover 状态图标 |
| leftDisabledIcon / rightDisabledIcon | `string` | 禁用状态图标 |
| leftIconClass / rightIconClass | `string` | 图标自定义 className |
| leftIconDisabledClass / rightIconDisabledClass | `string` | 禁用状态图标自定义 className |

## 注意事项

- `@cloudsop/eview-ui/Button` 默认导出的是 **ButtonAdapter**，它 = `ButtonProps & BaseButtonAdapterProps`
- Button 使用 ForwardRef 实现，支持 ref 转发
- `text` 与 `children` 均可用于设置按钮内容，`children` 优先级更高
- `status` 可选值：`default`（默认样式）、`primary`（主要/强调）、`risk`（危险/警告）
- `size` 可选值：`small`、`normal`、`large`
- `leftIcon` / `rightIcon` 为图标名称字符串，可通过 `leftIconProps` / `rightIconProps` 配置 hover/禁用态图标及样式
- `tipType` 已标记 @deprecated，建议使用原生 `title` 属性或 `toolTipProps`
- 原生 HTML button 属性（`id`、`style`、`title`、`onClick` 等）通过 `ButtonHTMLAttributes` 继承
