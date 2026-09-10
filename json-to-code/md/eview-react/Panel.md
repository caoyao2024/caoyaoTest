# Panel（折叠面板 / Collapse）

**Import:** `import Panel, { PanelItem } from '@nce/eview-react/Panel'`

## 基本用法

### 基础折叠面板

```tsx
import Panel, { PanelItem } from '@nce/eview-react/Panel'

function Example() {
  const [selectedIndex, setSelectedIndex] = React.useState([0])

  const handleExpand = (index: number, event: any) => {
    setSelectedIndex([index])
  }

  return (
    <Panel selectedIndex={selectedIndex} onExpand={handleExpand}>
      <PanelItem title="第一节">第一节的内容</PanelItem>
      <PanelItem title="第二节">第二节的内容</PanelItem>
      <PanelItem title="第三节">第三节的内容</PanelItem>
    </Panel>
  )
}
```

### 多个面板同时展开

```tsx
import Panel, { PanelItem } from '@nce/eview-react/Panel'

function Example() {
  const [selectedIndex, setSelectedIndex] = React.useState([0, 1])

  const handleExpand = (index: number) => {
    const newIndex = selectedIndex.includes(index)
      ? selectedIndex.filter(i => i !== index)
      : [...selectedIndex, index]
    setSelectedIndex(newIndex)
  }

  return (
    <Panel
      selectedIndex={selectedIndex}
      enableMultiExpand
      onExpand={handleExpand}
    >
      <PanelItem title="基本信息">基本信息内容</PanelItem>
      <PanelItem title="详细配置">详细配置内容</PanelItem>
      <PanelItem title="高级设置">高级设置内容</PanelItem>
    </Panel>
  )
}
```

## Panel Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |
| selectedIndex | `number[]` | - | 展开面板的索引数组 |
| enableMultiExpand | `boolean` | `false` | 允许多个面板同时展开 |
| destroyInactivePanel | `boolean` | `false` | 销毁隐藏面板内容 |
| children | `React.ReactNode` | - | PanelItem 子组件 |

## Panel Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onExpand | `(index: number, event: any)` | 面板展开回调 |
| onClose | `(index: number, event: any, collapsed: boolean)` | 面板关闭回调 |

## PanelItem Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | PanelItem id |
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |
| title | `any` | - | 面板标题（字符串或 ReactNode） |
| expanded | `boolean` | `undefined` | 是否展开 |
| closable | `boolean` | `true` | 是否显示关闭图标 |
| titleClassName | `string` | - | 标题元素类名 |
| containerClassName | `string` | - | 容器元素类名 |
| isShowTitleTips | `boolean` | `false` | 标题上显示提示 |

## PanelItem Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onExpand | `(index: number, event: any)` | 展开回调 |
| onClose | `(index: number, e: unknown, arg2: unknown)` | 关闭回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| children (Panel) | PanelItem 子组件，定义每个折叠面板项 |
| children (PanelItem) | 面板展开后的内容区域 |

## 注意事项

- **必须使用子组件 PanelItem**，不能单独使用 Panel
- `selectedIndex` 使用数字索引（0-based），是数组类型，即使只展开一个面板也用 `[0]`
- `enableMultiExpand=true` 时允许同时展开多个面板
- Panel 对应 A2UI 的 Collapse + CollapseItem
- `destroyInactivePanel=true` 可优化性能，隐藏的面板内容会被销毁而非隐藏