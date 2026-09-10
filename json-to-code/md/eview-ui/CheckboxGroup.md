# CheckboxGroup

**Import:** `import CheckboxGroup from '@cloudsop/eview-ui/CheckboxGroup'`

## 基本用法

### 基础复选框组

```tsx
import CheckboxGroup from '@cloudsop/eview-ui/CheckboxGroup'

function Example() {
  const data = [
    { value: 'apple', text: '苹果', checked: true },
    { value: 'banana', text: '香蕉' },
    { value: 'orange', text: '橙子' }
  ]

  return (
    <CheckboxGroup
      data={data}
      label="水果"
      onChange={(newValue, oldValue) => console.log(newValue, oldValue)}
    />
  )
}
```

### 禁用状态

```tsx
import CheckboxGroup from '@cloudsop/eview-ui/CheckboxGroup'

function Example() {
  return <CheckboxGroup data={data} label="水果" disabled />
}
```

### 文本位置控制

```tsx
import CheckboxGroup from '@cloudsop/eview-ui/CheckboxGroup'

function Example() {
  return (
    <CheckboxGroup
      data={data}
      label="水果"
      labelPosition="before"
      itemLabelPosition="before"
    />
  )
}
```

### 全选功能

```tsx
import CheckboxGroup from '@cloudsop/eview-ui/CheckboxGroup'

function Example() {
  return (
    <CheckboxGroup
      data={data}
      label="水果"
      selectAll={{ enable: true }}
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | `any` | - | 设置 checkbox 的数据，其中 checked 设置是否选中，value 为数据库存取值，text 为文本展示值，tipText 为气泡提示内容 |
| id | `string` | - | 设置 CheckboxGroup 的 id |
| className | `string` | - | 通过自定义 class 来添加自定义样式，可控制整个组件的整体样式（最外层 div） |
| style | `object` | - | 通过自定义 style 来添加自定义样式，可控制整个组件的整体样式（最外层 div） |
| label | `string` | - | 设置 CheckboxGroup 的文本名称 |
| labelClassName | `string` | - | 通过添加 class 的方式控制 label 的样式 |
| labelStyle | `object` | - | 通过添加 style 的方式控制 label 的样式 |
| fieldStyle | `object` | - | 设置复选框组件（checkbox + label）的样式，例如 width |
| fieldClassName | `string` | - | 设置复选框组件的 className |
| tipData | `object` | `{}` | 配置 Checkbox 气泡提示，参考 Tooltip |
| labelPosition | `'before' \| 'after'` | `'before'` | CheckboxGroup 的文本名称与复选框组的位置，before 代表文本名称在左边，after 代表文本名称在右边 |
| itemLabelPosition | `'before' \| 'after'` | `'after'` | CheckboxGroup 中单个 checkbox 的文本名称与复选框的位置 |
| itemClassName | `string` | - | 单个 checkbox 项的 className |
| itemStyle | `object` | - | 单个 checkbox 项的 style |
| value | `any` | - | 设置所选值的值 |
| tipStyle | `object` | - | 提示框样式 |
| tipValidatorClass | `string` | - | 提示校验 class |
| validtor | `object` | - | 校验器配置 |
| rows | `string` | - | 设置行数 |
| selectAll | `object` | - | 全选配置 |
| required | `boolean` | `false` | 设置组件是否为必填项 |
| disabled | `boolean` | `false` | 设置组件的灰化状态 |
| onChange | `any` | - | 设置 CheckboxGroup 的 onClick 事件 |

## 注意事项

- `labelPosition` 控制 CheckboxGroup 标签与复选框组的整体位置关系
- `itemLabelPosition` 控制组内每个 checkbox 自身的文本与图标位置关系
- `selectAll` 可配置全选功能
- `rows` 可设置复选框排列的行数
