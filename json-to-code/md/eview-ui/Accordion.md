# Accordion

**Import:** `import Accordion from '@cloudsop/eview-ui/Accordion'`

## 基本用法

### 基础手风琴导航

```tsx
import Accordion from '@cloudsop/eview-ui/Accordion'

function Example() {
  const data = [
    { title: '菜单1', value: '1', icon: 'icon-menu1', children: [
      { title: '子菜单1-1', value: '1-1' },
      { title: '子菜单1-2', value: '1-2' }
    ]},
    { title: '菜单2', value: '2', icon: 'icon-menu2' }
  ]

  return (
    <Accordion
      data={data}
      headerText="导航"
      onClick={(node) => console.log('clicked:', node)}
    />
  )
}
```

### 可折叠手风琴

```tsx
import Accordion from '@cloudsop/eview-ui/Accordion'

function Example() {
  return (
    <Accordion
      data={data}
      enableExpand
      expanded
      onExpand={(isExpand) => console.log('expanded:', isExpand)}
    />
  )
}
```

### 可拖动宽度

```tsx
import Accordion from '@cloudsop/eview-ui/Accordion'

function Example() {
  return (
    <Accordion
      data={data}
      allowResize
      maxResizableWidth="30rem"
      onResize={({ oldWidth, newWidth }) => console.log(oldWidth, newWidth)}
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 用户传入自定义 id 用于覆盖组件自动生成 id |
| data | `AccordionNode[]` | - | 手风琴数据，AccordionNode 结构见下表 |
| selectedValue | `string` | - | 默认被选中的项的 value，不设置则为第一项的 value |
| headerText | `ReactNode` | - | 手风琴标题文字 |
| headerIcon | `string` | - | 手风琴标题图标的 url |
| headerIconPosition | `'top' \| 'left'` | `'top'` | 控制头部 Icon 布局 |
| enableTooltip | `boolean` | `true` | 是否使用提示 |
| toolTipProps | `CustomTooltipType` | - | 自定义手风琴菜单的 Tooltip 属性，需要将 enableTooltip 设置为 true |
| forceShowTip | `'title' \| boolean` | `false` | 强制展示 tip，设置为 `'title'` 使用浏览器默认的 title 属性，此时会忽略 enableTooltip 属性；enableTooltip 只会在有溢出时才展示 |
| defaultOpenKeys | `string[]` | - | 默认展示项的 key |
| disabledItemKeys | `string[]` | - | 禁用项的 key |
| hideTitleBar | `boolean` | `false` | 隐藏标题栏 |
| enableMultiOpen | `boolean` | `false` | 是否允许同时展开多个一级菜单 |
| showArrow | `boolean` | `false` | 隐藏图标 |
| enableExpand | `boolean` | `false` | 是否允许折叠 |
| expanded | `boolean` | `true` | 默认是否展开 |
| allowResize | `boolean` | `false` | 是否允许拖动 |
| maxResizableWidth | `string` | - | 最大可拖动宽度，支持 px 和 rem 单位 |
| style | `React.CSSProperties` | - | 通过 style 控制组件最外层样式 |
| className | `string` | - | 通过 class 控制组件最外层样式 |
| version | `string` | - | 设置组件版本（影响样式类名） |
| theme | `string` | - | 设置组件主题 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(node: AccordionNode) => void` | 手风琴元素被点击后的回调函数，node 为被点击项对应 data 中的原始数据 |
| onItemRightClick | `(e: MouseEvent, { data }: { data: AccordionNodeData }) => void` | 右键点击项的回调 |
| onExpand | `(isExpand: boolean) => void` | 面板收起展开回调，isExpand 为 true 时展开，false 时收起 |
| onResize | `(resizeData: { oldWidth: string; newWidth: string }) => void` | 拖动回调函数 |

## AccordionNode

| 字段 | 类型 | 说明 |
|------|------|------|
| title | `ReactNode` | 菜单项标题 |
| value | `string` | 菜单项值 |
| icon | `string` | 图标 |
| description | `string` | 描述 |
| activeIcon | `string` | 激活状态图标 |
| disabled | `boolean` | 是否禁用 |
| children | `AccordionNode[]` | 子菜单项 |

## 注意事项

- `enableExpand` 为 `true` 时才允许折叠/展开整个手风琴
- `allowResize` 为 `true` 时允许拖动改变宽度，需配合 `maxResizableWidth` 使用
- `forceShowTip` 设为 `'title'` 时使用浏览器原生 title，忽略 `enableTooltip`
- `headerIconPosition` 控制标题图标的布局方向
