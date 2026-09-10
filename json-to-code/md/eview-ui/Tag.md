# Tag 标签

**Import:** `import Tag from '@cloudsop/eview-ui/Tag'`

## 基本用法

### message 类型

```tsx
import Tag from '@cloudsop/eview-ui/Tag'

function Example() {
  return <Tag type="message">文字标签</Tag>
}
```

### status 类型

```tsx
import Tag from '@cloudsop/eview-ui/Tag'

function Example() {
  return <Tag type="status" color="success">成功</Tag>
}
```

### dot 类型

```tsx
import Tag from '@cloudsop/eview-ui/Tag'

function Example() {
  return <Tag type="dot" color="danger">告警</Tag>
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| className | `string` | - | 自定义 class 改变 tag 的整体样式，作用于最外层 div |
| id | `string` | - | 自定义 id |
| children | `React.ReactNode` | - | 子元素内容 |
| type | `TagType` | - | Tag 类型，可选 `'message'`、`'dot'`、`'status'` |
| color | `string` | - | 填充颜色，可选：default、primary、success、warning、danger、caution 以及具体颜色值如 `"#ffffff"`，仅 status 和 dot 类型生效 |
| onClick | `() => void` | - | 标签点击事件，仅 message tag 生效，onClick 设置后标签有可交互状态 |
| style | `React.CSSProperties` | - | 自定义的 css 变量样式 |
| size | `'normal' \| 'large'` | `'normal'` | 设置组件的大小，dot 类型不支持该属性 |
| onClose | `(e: MouseEvent) => void` | - | 设置 message 标签的关闭回调事件 |
| selected | `boolean` | `false` | 设置 message tag 的选中状态 |
| disabled | `boolean` | `false` | 设置 message tag 的禁用状态 |

## 注意事项

- Tag 对应 A2UI 的 Tag 组件
- `size` 仅支持 `'normal'` 和 `'large'`，不支持 `'small'`
- `onClick` 无参数（`() => void`）
- `disabled`（非 `disable`）为正确属性名
