# CheckboxGroup

**Import:**  `import CheckboxGroup from '@nce/eview-react/CheckboxGroup'`

### 基础复选框组

```tsx
import CheckboxGroup from '@nce/eview-react/CheckboxGroup'

function Example() {
  const [value, setValue] = React.useState([])

  const data = [
    { value: 'apple', text: '苹果' },
    { value: 'banana', text: '香蕉' },
    { value: 'orange', text: '橙子' },
  ]

  const handleChange = (value: any, oldValue: any, event: object) => {
    setValue(value)
  }

  return (
    <CheckboxGroup
      label="水果选择"
      data={data}
      value={value}
      onChange={handleChange}
    />
  )
}
```

### 带全选和验证的复选框组

```tsx
import CheckboxGroup from '@nce/eview-react/CheckboxGroup'

function Example() {
  const [value, setValue] = React.useState([])

  const data = [
    { value: '1', text: '选项一' },
    { value: '2', text: '选项二' },
    { value: '3', text: '选项三' },
  ]

  return (
    <CheckboxGroup
      label="多选验证"
      data={data}
      value={value}
      onChange={(val) => setValue(val)}
      required
      validtor={{ minSelect: '1', maxSelect: '2' }}
      selectAll={{ text: '全选' }}
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | `any` | - | 复选框数据数组：`[{ value, text, checked, tipText }]` |
| id | `string` | - | 组件 id |
| className | `string` | - | 外层 div 类名 |
| style | `object` | - | 外层 div 样式 |
| label | `string` | - | 组标签文本 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `object` | - | 标签样式 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签相对于复选框的位置 |
| value | `any` | - | 已选中的值 |
| required | `boolean` | `false` | 是否必填 |
| disabled | `boolean` | `false` | 禁用状态 |
| selectAll | `any` | - | "全选"复选框配置：`{ text, checked, onChange }` |
| rows | `string` | - | 布局行规格，如 `"0:1 \| 2:4 \| 5"` |
| fieldStyle | `object` | - | 复选框项样式（如宽度） |
| fieldClassName | `string` | - | 复选框项类名 |
| tipData | `object` | - | 提示框 props |
| validtor | `((index: number, selectedVal: number[]) => boolean) \| any` | - | 最小/最大选择验证，如 `{ minSelect: '2', maxSelect: '4' }` |
| tipValidatorClass | `any` | - | 验证提示类名 |
| itemLabelPosition | `'before' \| 'after'` | `'after'` | 单个复选框标签位置 |
| tipStyle | `React.CSSProperties` | `{}` | 提示框样式 |
| hintType | `'div' \| 'tip'` | `'tip'` | 提示显示类型 |
| labelTitle | `string` | - | 标签提示文本 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(value: any, oldValue: any, event: object)` | 值变化回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any[]` | 获取当前选中值 |
| validate | `() => boolean` | 验证选择 |
| focus | `() => void` | 聚焦组件 |

## 注意事项

- 选项数据通过 `data` prop 传入，不是通过子组件方式
- `validtor` prop 名拼写有误（应为 validator），这是 API 实际命名
- `validtor` 支持两种模式：函数验证器或对象配置 `{ minSelect, maxSelect }`
- `selectAll` 配置对象可添加全选功能，`text` 属性设置全选文本
- `rows` 属性控制布局，格式为 `"起始索引:列数 \| ..."`，如 `"0:3 \| 3:3"` 表示前三个一行，后三个一行