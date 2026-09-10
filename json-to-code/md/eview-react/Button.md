# Button

**Import:** `import Button from '@nce/eview-react/Button'`

## 基本用法

### 基础按钮

```tsx
import Button from '@nce/eview-react/Button'

function Example() {
  const handleClick = (event: object, value: any) => {
    console.log('Button clicked', value)
  }

  return (
    <div>
      <Button text="默认按钮" onClick={handleClick} />
      <Button text="主要按钮" status="primary" onClick={handleClick} />
      <Button text="危险按钮" status="risk" onClick={handleClick} />
    </div>
  )
}
```

### 带图标和尺寸的按钮

```tsx
import Button from '@nce/eview-react/Button'

function Example() {
  return (
    <div>
      <Button text="小按钮" size="small" />
      <Button text="正常按钮" size="normal" />
      <Button text="大按钮" size="large" />
      <Button text="左侧图标" leftIcon="/path/to/icon.svg" />
      <Button text="禁用状态" disabled />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | Button id |
| className | `string` | - | 自定义 CSS 类名 |
| style | `object` | - | 自定义内联样式 |
| status | `'default' \| 'primary' \| 'risk'` | `'default'` | 按钮使用场景 |
| size | `'normal' \| 'large' \| 'small'` | `'normal'` | 按钮尺寸 |
| text | `any` | - | 按钮文本内容 |
| leftIcon | `string` | - | 左侧图标路径 |
| rightIcon | `string` | - | 右侧图标路径 |
| lIconClassName | `string` | - | 左侧图标自定义类名 |
| rIconClassName | `string` | - | 右侧图标自定义类名 |
| lIconStyle | `any` | - | 左侧图标样式 |
| rIconStyle | `any` | - | 右侧图标样式 |
| focused | `boolean` | `false` | 是否默认聚焦 |
| disabled | `boolean` | `false` | 禁用状态 |
| additionalData | `object` | - | 附加数据，点击时在 onClick 中返回 |
| tipShow | `'always' \| 'never' \| 'overflow'` | `'never'` | 何时显示 title 提示 |
| tipData | `string` | - | 自定义提示文本（否则使用 text） |
| tipType | `'title' \| 'tipbox'` | `'title'` | 提示类型 |
| disableBlur | `boolean` | `false` | 禁用失焦效果 |
| children | `React.ReactNode` | - | 按钮内容（与 text 相同） |

### leftIconProps / rightIconProps

| 属性名 | 类型 | 说明 |
|--------|------|------|
| leftHoverIcon / rightHoverIcon | `string` | 悬停图标路径 |
| leftDisabledIcon / rightDisabledIcon | `string` | 禁用图标路径 |
| leftIconClass / rightIconClass | `string` | 图标类名 |
| leftIconDisabledClass / rightIconDisabledClass | `string` | 禁用图标类名 |
## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(event: object, value: any)` | 点击事件；value 为 additionalData |
| onKeyDown | `any` | 按键事件 |
| onMouseLeave | `any` | 鼠标离开事件 |
| onBlur | `any` | 失焦事件 |
| onFocus | `(event: object)` | 聚焦事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children | 按钮内容，与 text prop 功能相同，优先使用 children |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| changeStyle | `(style: any) => void` | 动态修改按钮样式 |
| dom | - | DOM 引用 |

## 注意事项

- `text` 和 `children` 都可以设置按钮内容，同时使用时 `children` 优先
- `status='risk'` 对应危险操作按钮（红色）
- `leftIcon` / `rightIcon` 支持传入 SVG 图标路径字符串
- `additionalData` 可用于在列表中传递行数据，点击时通过 onClick 第二个参数返回