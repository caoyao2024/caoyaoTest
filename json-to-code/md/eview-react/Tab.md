# Tab

**Import:** `import Tab, { TabItem } from '@nce/eview-react/Tab'`

## 基本用法

### 基础标签页

```tsx
import Tab, { TabItem } from '@nce/eview-react/Tab'

function Example() {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const handleClick = (index: number, title: string) => {
    setSelectedIndex(index)
  }

  return (
    <Tab selectedIndex={selectedIndex} onClick={handleClick}>
      <TabItem title="标签一">内容一</TabItem>
      <TabItem title="标签二">内容二</TabItem>
      <TabItem title="标签三">内容三</TabItem>
    </Tab>
  )
}
```

### 不同类型和位置的标签页

```tsx
import Tab, { TabItem } from '@nce/eview-react/Tab'

function Example() {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  return (
    <div>
      <Tab selectedIndex={selectedIndex} type="main" onClick={(i) => setSelectedIndex(i)}>
        <TabItem title="主线标签">主线内容</TabItem>
        <TabItem title="标签二">内容二</TabItem>
      </Tab>

      <Tab selectedIndex={0} type="sub" position="top">
        <TabItem title="卡片标签">卡片内容</TabItem>
        <TabItem title="标签二">内容二</TabItem>
      </Tab>

      <Tab selectedIndex={0} type="split" position="left">
        <TabItem title="左侧标签">左侧内容</TabItem>
        <TabItem title="标签二">内容二</TabItem>
      </Tab>
    </div>
  )
}
```

## Tab Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| selectedIndex | `number` | - | 选中标签索引 |
| className | `string` | - | 自定义类名 |
| disabled | `boolean` | `false` | 禁用所有标签 |
| hover | `boolean` | `false` | 悬停切换标签 |
| style | `React.CSSProperties` | - | 自定义样式 |
| type | `'main' \| 'sub' \| 'split'` | `'main'` | 标签类型 |
| position | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 标签位置 |
| lazyLoad | `boolean` | `false` | 懒加载标签内容 |
| draggable | `boolean` | `true` | 允许标签拖拽排序 |
| isAutoClose | `boolean` | `true` | 自动关闭标签 |
| isShowCloseBtns | `boolean` | `false` | 显示关闭按钮 |
| isCloseByTabIds | `boolean` | `false` | 通过 ID 关闭标签 |
| tabContentClassName | `string` | - | 标签内容类名 |
| tabContentStyle | `React.CSSProperties` | - | 标签内容样式 |
| isUpdateContent | `boolean` | `false` | 切换标签时更新内容（lazyLoad=false 时） |
| children | `any` | - | TabItem 子组件 |
| onlyHideNone | `boolean` | `false` | 折叠显示模式 |
| headStyle | `React.CSSProperties` | - | 标签头部区域样式 |
| observerWidthChange | `boolean` | - | 监听外层 div 宽度变化 |
| observerTabItemChange | `boolean` | - | 监听 tabItem 宽度变化 |

## Tab Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(index: number, title: string, e: React.MouseEvent \| React.KeyboardEvent)` | 标签点击 |
| onClose | `(index: number, e: React.MouseEvent \| React.KeyboardEvent, title: string)` | 标签关闭 |
| onBeforeClose | `(tabIds: [])` | 关闭前回调 |
| onCloseByTabIds | `(tabIds: [] \| '', buttonIdentify: number)` | 通过 ID 关闭回调 |
| ondragEnd | `(nodeAfterDrag: {id, title}[], e: React.MouseEvent)` | 拖拽结束回调 |

## TabItem Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | TabItem id |
| className | `string` | - | 项类名 |
| title | `string` | - | 标签标题 |
| closable | `boolean` | `false` | 是否可关闭 |
| disabled | `boolean` | `false` | 禁用状态 |
| icon | `string \| React.ReactElement` | - | 标签图标 |
| setEditing | `boolean` | `false` | 编辑模式 |
| tabItemStyle | `React.CSSProperties` | - | 标签头部样式 |
| titleExtraContent | `React.ReactElement` | - | 自定义标题内容 |
| itemTip | `string` | - | 悬停提示内容 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children (Tab) | TabItem 子组件，定义每个标签页 |
| children (TabItem) | 标签页展开后的内容区域 |

## 注意事项

- **必须使用子组件 TabItem**，不能单独使用 Tab
- `selectedIndex` 使用数字索引（0-based），不是字符串 key
- `type` 映射：`'main'` = 线型标签，`'sub'` = 卡片标签，`'split'` = 分割标签
- `position` 控制标签头部的位置，支持上下左右四个方向
- `lazyLoad=true` 时标签内容在首次激活时才渲染，可优化性能
- `draggable=true` 允许用户拖拽标签重新排序，`ondragEnd` 获取排序后的结果
- Tab 对应 A2UI 的 Tabs + TabItem