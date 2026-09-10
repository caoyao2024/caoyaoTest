# Accordion

**Import:** `import Accordion from '@nce/eview-react/Accordion'`

## 基本用法

### 基础侧边导航

```tsx
import Accordion from '@nce/eview-react/Accordion'

function Example() {
  const [selectedValue, setSelectedValue] = React.useState('1-2')

  const data = [
    {
      title: '一级菜单',
      value: '1',
      children: [
        { title: '二级菜单', value: '1-1' },
        { title: '二级菜单', value: '1-2' },
        { title: '二级菜单', value: '1-3' },
      ],
    },
    {
      title: '一级菜单',
      value: '2',
      isExpand: true,
      children: [
        { title: '二级菜单', value: '2-1' },
        { title: '二级菜单', value: '2-2' },
      ],
    },
    {
      title: '一级菜单',
      value: '3',
    },
  ]

  const handleClick = (node) => {
    if (!node.children || node.children?.length === 0) {
      setSelectedValue(node.value)
    }
  }

  return (
    <Accordion
      data={data}
      selectedValue={selectedValue}
      enableMultiOpen
      hideTitleBar
      onClick={handleClick}
    />
  )
}
```

### 可折叠侧边栏

```tsx
import Accordion from '@nce/eview-react/Accordion'

function Example() {
  const [expanded, setExpanded] = React.useState(false)

  const data = [
    {
      icon: '/icons/home.svg',
      title: '概览',
      children: [
        { title: '仪表盘' },
        { title: '统计' },
      ],
    },
    {
      icon: '/icons/settings.svg',
      title: '配置',
      children: [
        { title: '基本配置' },
        { title: '高级配置' },
      ],
    },
  ]

  const handleExpand = (flag) => {
    setExpanded(!flag)
  }

  return (
    <Accordion
      data={data}
      headerText="站点导航"
      enableExpand
      enableIconExpand
      expanded={expanded}
      enableMultiOpen
      style={{ height: 600 }}
      onExpand={handleExpand}
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| data | `dataItem[]`（必填） | - | 手风琴数据 |
| selectedValue | `string` | 第一项的 value | 选中值 |
| headerText | `string` | - | 标题文字 |
| headerIcon | `string` | - | 标题图标 URL |
| headerIconPosition | `'top' \| 'left'` | `'top'` | 标题图标位置 |
| enableMultiOpen | `boolean` | `false` | 是否允许同时展开多个一级菜单 |
| expanded | `boolean` | `false` | 面板是否展开（⚠️ false=展开，true=收起，与直觉相反） |
| hideIcons | `boolean` | `false` | 隐藏底部展开收起图标，显示右侧展开收起 |
| hideTitleBar | `boolean` | `false` | 隐藏标题栏 |
| enableExpand | `boolean` | `true` | 是否允许展开/折叠面板 |
| hideHeaderIcon | `boolean` | `false` | 隐藏头部图标 |
| keepExpandState | `boolean` | `false` | 数据变更时是否保存上一次展开收起状态 |
| hideTitleTips | `boolean` | `false` | 是否隐藏顶部 title 的 tips |
| enableIconExpand | `boolean` | `true` | 折叠状态下点击节点图标是否可展开面板 |
| isControlSelectedValue | `boolean` | `false` | 是否开启外部控制选中状态 |
| style | `React.CSSProperties` | - | 最外层样式 |
| className | `string` | - | 最外层类名 |

## dataItem（data 一级数据项）

继承 childItem 所有属性，另增：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| children | `childItem[]` | 子菜单数组 |
| isExpand | `boolean` | 该节点是否默认展开 |

## childItem（子菜单数据项）

| 属性名 | 类型 | 说明 |
|--------|------|------|
| title | `string \| React.ReactNode` | 菜单项标题（必填） |
| value | `string` | 菜单项值 |
| icon | `string \| React.ReactNode` | 图标 URL 或 React 元素 |
| activeIcon | `string` | 选中状态图标 URL |
| content | `React.ReactNode` | 自定义内容 |
| disabled | `boolean` | 是否禁用 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(node: object) => void` | 菜单项点击回调，node 为被点击项的原始数据 |
| onExpand | `(flag: boolean) => void` | 面板展开/收起回调（⚠️ 展开→收起 flag=false，收起→展开 flag=true） |
| onItemRightClick | `(event: object, node: object) => void` | 右键点击回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，不支持 children slot |

## 注意事项

- Accordion 是侧边导航/手风琴组件，数据通过 `data` prop 传入
- 支持多级嵌套菜单（一级、二级、三级、四级等）
- **`expanded` 属性有遗留问题**：`false` 表示展开，`true` 表示收起，与直觉相反
- **`onExpand` 回调有遗留问题**：面板由展开→收起时 flag 为 false，由收起→展开时 flag 为 true；使用时需取反：`setExpanded(!flag)`
- `enableMultiOpen=true` 允许同时展开多个一级菜单
- `isControlSelectedValue=true` 开启外部控制选中状态，配合 onClick 回调手动维护 selectedValue
- data 中 `isExpand: true` 设置节点默认展开
- data 中 `disabled: true` 可禁用单个菜单项
- `icon` 和 `activeIcon` 支持传入图标 URL 或 React 元素（如 @hui/icon-plus 组件）