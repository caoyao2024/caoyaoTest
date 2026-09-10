**Import:** `import Rating from '@nce/eview-react/Rating'`

## 基本用法

### 基础评分

```tsx
import Rating from '@nce/eview-react/Rating'

function Example() {
  const [value, setValue] = React.useState(3)

  return (
    <Rating value={value} starCount={5} onClick={(val) => setValue(val)} />
  )
}
```

### 半星与自定义图标

```tsx
import Rating from '@nce/eview-react/Rating'

function Example() {
  const [value, setValue] = React.useState(2.5)

  return (
    <div>
      <Rating
        value={value}
        half
        size={24}
        onClick={(val) => setValue(val)}
      />
      <Rating
        iconName="ict_heart"
        value={2}
        starCount={5}
        size={24}
        starColor="#ff4d4f"
      />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名 |
| value | `number` | `0` | 绑定值 |
| starCount | `number` | `5` | star 总数 |
| disabled | `boolean` | `false` | 禁用状态（只读，无法交互） |
| half | `boolean` | `false` | 是否允许半选 |
| starColor | `string` | `'#eeba18'` | 选中颜色 |
| emptyStarColor | `string` | `'#f5f5f5'` | 未选中颜色 |
| iconName | `string` | - | 自定义图标名称（使用组件库已有图标） |
| iconProps | `React.CSSProperties` | - | 自定义图标样式（配合 iconName 使用） |
| size | `number` | `16` | 图标大小 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(value: number) => void` | 点击事件 |
| onMouseOver | `(value: number) => void` | 鼠标移入事件 |
| onMouseLeave | `(value: number) => void` | 鼠标移出事件 |
| onKeyDown | `(value: number) => void` | 键盘回调事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 评分组件不支持 children slot |

## 注意事项

- Rating 对应 A2UI 的 Rate 组件
- `half=true` 启用半星模式，value 可为小数（如 2.5）
- `iconName` 可传入组件库已有图标名称替换默认星形图标
- `disabled=true` 时视觉置灰，不可交互，不触发 onClick
- `starColor` 和 `emptyStarColor` 分别控制选中和未选中的颜色