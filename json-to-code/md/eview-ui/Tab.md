# Tab 页签

**Import:** `import Tab from '@cloudsop/eview-ui/Tab'`

## 基本用法

```tsx
import Tab from '@cloudsop/eview-ui/Tab'

function Example() {
  return (
    <Tab type="main" position="top" onClick={(index, title, e) => console.log(index, title)}>
      <Tab.Item title="页签一">内容一</Tab.Item>
      <Tab.Item title="页签二">内容二</Tab.Item>
      <Tab.Item title="页签三" closable>内容三</Tab.Item>
    </Tab>
  )
}
```

### 可拖拽与可关闭

```tsx
import Tab from '@cloudsop/eview-ui/Tab'

function Example() {
  return (
    <Tab
      draggable
      isShowCloseBtns
      isCloseByTabIds
      onClose={(index, e, title) => console.log('closed', title)}
      onBeforeClose={(ids) => { console.log(ids); return true; }}
    >
      <Tab.Item title="Tab 1" closable>Content 1</Tab.Item>
    </Tab>
  )
}
```

## Tab Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 设置 Tab 的 id |
| selectedIndex | `number` | `0` | 设置选中的 index |
| className | `string` | - | 通过自定义 class 改变整体样式 |
| style | `object` | - | 通过自定义 style 改变整体样式 |
| disabled | `boolean` | `false` | tab 全体禁用 |
| hover | `boolean` | `false` | 用 hover 切换 tab 页 |
| type | `'main' \| 'sub'` | `'main'` | 设置页签类型 |
| position | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 设置页签位置 |
| titleLength | `number` | - | 设置标题最大长度 |
| lazyLoad | `boolean` | `false` | 是否在页签激活时动态加载内容 |
| draggable | `boolean` | `true` | Tab 项是否可拖动 |
| isAutoClose | `boolean` | `true` | onClose 为 true 时是否可删除 tab |
| isShowCloseBtns | `boolean` | `false` | 是否展示删除 popOver |
| isCloseByTabIds | `boolean` | `false` | 是否按 tabId 关闭 |
| alwaysShowIcon | `boolean` | `false` | tabItem 数量过多时是否显示收起的 tabItem 中的图标 |
| tabContentStyle | `object` | - | Tab 内容区域样式 |
| tabContentClassName | `string` | - | Tab 内容区域 className |
| tabTitleStyle | `object` | - | Tab 标题样式 |
| tabTitleClassName | `string` | - | Tab 标题 className |
| children | `ReactNode` | - | Tab 子元素 |
| confirmBeforeLeave | `() => Promise<any>` | - | 点击切换 tab 的回调，返回 Promise 控制是否允许切换 |
| version | `string` | - | 设置组件版本 |
| theme | `string` | - | 设置组件主题 |

## Tab Events

| 事件名 | 类型 | 说明 |
|--------|------|------|
| onClick | `(index: string, title: string, e: MouseEvent<HTMLSpanElement>) => unknown` | Tab 页签切换回调 |
| onClose | `(index: number, e: MouseEvent<HTMLSpanElement>, title: string) => unknown` | Tab 关闭回调 |
| onBeforeClose | `(ids: string[]) => unknown` | 关闭前回调，返回 ids 数组 |
| onCloseByTabIds | `(tabIds: string[], ids: number) => unknown` | 按 tabId 关闭回调 |

## TabItem Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | TabItem id |
| title | `string` | - | tab 的标题内容 |
| tips | `string` | - | 提示内容 |
| closable | `boolean` | `false` | 页签是否可关闭 |
| disabled | `boolean` | `false` | 是否禁用 |
| hover | `boolean` | - | 是否启用 hover 效果 |
| icon | `string` | - | 页签项图标路径 |
| setEditing | `boolean` | - | 是否启用页签编辑 |
| tabItemStyle | `object` | - | 页签标题样式 |
| titleLength | `number` | - | 标题最大长度 |

## 注意事项

- 旧版 `type` 包含 `'page'` 值，当前接口仅支持 `'main' | 'sub'`
- 旧版 `showAddButton` 和 `onAddClick` 属性已移除，不在当前接口定义中
- `onClick` 的第一个参数 `index` 类型为 `string`（非 `number`）
- `confirmBeforeLeave` 返回 `Promise<any>`，用于异步控制切换行为
- `isCloseByTabIds` 启用后配合 `onCloseByTabIds` 使用
