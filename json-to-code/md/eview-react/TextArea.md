# TextArea

**Import:** `import TextArea from '@nce/eview-react/TextArea'`

## 基本用法

### 基础多行文本框

```tsx
import TextArea from '@nce/eview-react/TextArea'

function Example() {
  const [value, setValue] = React.useState('')

  const handleChange = (targetValue: string, value: string, event: React.ChangeEvent) => {
    setValue(targetValue)
  }

  return (
    <TextArea
      label="描述"
      value={value}
      onChange={handleChange}
      placeholder="请输入描述内容"
      rows={4}
    />
  )
}
```

### 带验证和字数限制的文本框

```tsx
import TextArea from '@nce/eview-react/TextArea'

function Example() {
  const [value, setValue] = React.useState('')

  return (
    <TextArea
      label="备注"
      value={value}
      onChange={(targetValue) => setValue(targetValue)}
      maxLength={200}
      required
      validator={(value: string) => {
        if (value.length < 10) {
          return { result: false, message: '至少输入10个字符' }
        }
        return { result: true, message: '' }
      }}
      sizeAuto
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| style | `React.CSSProperties` | - | 外层样式 |
| className | `string` | - | 外层类名 |
| label | `string` | - | 标签文本 |
| placeholder | `string` | - | 占位文本 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| inputClassName | `string` | - | 文本框类名 |
| inputStyle | `React.CSSProperties` | - | 文本框样式 |
| value | `string` | - | 值 |
| maxLength | `number` | - | 最大字符长度 |
| rows | `number` | - | 可见行数 |
| cols | `number` | - | 可见列数 |
| ruleText | `string` | - | 右侧规则文本 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| validator | `(value: string) => { result: boolean, message: string\|Element, type?: string }` | - | 自定义验证 |
| validateWhileEmpty | `boolean` | - | 空值时也验证 |
| required | `boolean` | `false` | 是否必填 |
| disabled | `boolean` | `false` | 禁用状态 |
| readOnly | `boolean` | `false` | 只读 |
| hintType | `'div' \| 'tip'` | `'div'` | 提示类型 |
| focusTip | `React.ReactNode` | - | 聚焦提示内容 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onBlur | `(event: React.FocusEvent)` | 失焦事件 |
| onChange | `(targetValue: string\|number\|string[], value: string\|number\|string[], event: React.ChangeEvent)` | 值变化 |
| onFocus | `(event: React.FocusEvent)` | 聚焦事件 |
| onKeyDown | `(event: React.KeyboardEvent)` | 按键事件 |
| onKeyUp | `(event: React.KeyboardEvent)` | 按键释放事件 |
| onClick | `(event: React.MouseEvent)` | 点击事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 文本框组件不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取当前值 |
| validate | `() => boolean` | 验证 |
| focus | `() => void` | 聚焦 |

## 注意事项

- `onChange` 第一个参数 `targetValue` 是当前值，第二个参数 `value` 也是当前值（与 TextField 的参数结构不同）
- `validator` 返回对象包含 `result`（是否通过）和 `message`（提示信息）