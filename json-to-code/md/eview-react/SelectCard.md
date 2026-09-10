# SelectCard

**Import:** `import SelectCard from '@nce/eview-react/SelectCard'`

## 基本用法

### 基础选项卡

```tsx
import SelectCard from '@nce/eview-react/SelectCard'

function Example() {
  const [value, setValue] = React.useState(0)

  const data = [
    { value: 0, text: '选项一' },
    { value: 1, text: '选项二' },
    { value: 2, text: '选项三' },
  ]

  return (
    <SelectCard
      data={data}
      value={value}
      onChange={(val) => setValue(val)}
    />
  )
}
```

### 小尺寸与禁用

```tsx
import SelectCard from '@nce/eview-react/SelectCard'

function Example() {
  const data = [
    { value: 1, text: '选项一', disable: true },
    { value: 2, text: '选项二' },
    { value: 3, text: '选项三' },
  ]

  return (
    <div>
      <SelectCard data={data} value={2} type="small" />
      <SelectCard data={data} value={1} disable style={{ marginTop: 10 }} />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名（最外层 div） |
| style | `React.CSSProperties` | - | 自定义样式（最外层 div） |
| itemClassName | `string` | - | 选项卡样式类名 |
| itemStyle | `React.CSSProperties` | - | 选项卡样式 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| type | `'default' \| 'small'` | `'default'` | 选项卡尺寸类型 |
| data | `ItemType[]` | - | 选项卡数据 |
| value | `string \| number` | - | 选中项值 |
| label | `string` | - | 标签文本 |
| required | `boolean` | `false` | 是否必填 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| isTipShow | `boolean` | `true` | 是否显示 tip |
| disable | `boolean` | `true` | 是否禁用整个组件 |

## ItemType（data 数据项）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value | `string \| number` | - | 选项值（必填） |
| text | `string` | - | 选项显示文本（必填） |
| disable | `boolean` | `false` | 该选项是否禁用 |
| tipsText | `string \| React.ReactElement` | `text` | 自定义 tip，不设置时默认显示 text |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChange | `(value: string \| number, event: string \| number) => void` | 选中项变化回调，value 为当前选中值 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取选中项的值 |

## 注意事项

- SelectCard 是选项卡组件，数据通过 `data` prop 传入
- `type='small'` 使用小尺寸选项卡，`type='default'` 使用大尺寸（默认）
- `disable`（非 disabled）是 eview 的命名方式，控制整个组件禁用
- 单个选项禁用通过 data 中的 `disable` 字段控制
- `isTipShow=false` 隐藏选项的悬浮提示