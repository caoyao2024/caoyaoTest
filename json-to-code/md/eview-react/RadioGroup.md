# RadioGroup

**Import:** `import RadioGroup from '@nce/eview-react/RadioGroup'`

## 基本用法

### 基础单选框组

```tsx
import RadioGroup from '@nce/eview-react/RadioGroup'

function Example() {
  const [value, setValue] = React.useState('')

  const data = [
    { value: 'option1', text: '选项一' },
    { value: 'option2', text: '选项二' },
    { value: 'option3', text: '选项三' },
  ]

  const handleChange = (oldValue: any, value: any, event: object) => {
    setValue(value)
  }

  return (
    <RadioGroup
      label="单选"
      data={data}
      value={value}
      onChange={handleChange}
    />
  )
}
```

### 垂直布局单选框组

```tsx
import RadioGroup from '@nce/eview-react/RadioGroup'

function Example() {
  const [value, setValue] = React.useState('')

  const data = [
    { value: 'a', text: '选项 A' },
    { value: 'b', text: '选项 B' },
    { value: 'c', text: '选项 C' },
  ]

  return (
    <RadioGroup
      label="垂直单选"
      data={data}
      value={value}
      onChange={(oldVal, val) => setValue(val)}
      type="vertical"
      required
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | `any` | - | 单选数据：`[{ value, text }]` |
| label | `string` | - | 组标签文本 |
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名 |
| style | `object` | - | 自定义样式 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `object` | - | 标签样式 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| value | `any` | - | 选中值 |
| required | `boolean` | `false` | 是否必填 |
| disabled | `boolean` | `false` | 禁用状态 |
| rows | `string` | - | 布局行规格 |
| rowSpacing | `string` | - | 行间距 |
| colSpacing | `string` | - | 列间距 |
| title | `string` | - | 标题 |
| isControlled | `boolean` | `false` | 受控组件模式 |
| type | `'vertical' \| 'horizontal'` | `'horizontal'` | 布局方向 |
| hintType | `'' \| 'div' \| 'tip'` | `'tip'` | 提示类型 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(oldValue: any, value: any, event: object)` | 值变化回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取选中值 |
| validate | `() => boolean` | 验证选择 |
| focus | `() => void` | 聚焦组件 |

## 注意事项

- 选项数据通过 `data` prop 传入，不是通过子组件方式
- **onChange 参数顺序为 `(oldValue, value, event)`**，与常见库的 `(value, oldValue)` 顺序相反，容易出错
- `type='vertical'` 为垂直布局，`type='horizontal'` 为水平布局
- `isControlled=true` 启用受控组件模式，需要配合 `value` + `onChange` 使用