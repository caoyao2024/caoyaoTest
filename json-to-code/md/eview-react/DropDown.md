# DropDown

**Import:** `import DropDown from '@nce/eview-react/DropDown'`

## 基本用法

### 基础下拉菜单

```tsx
import DropDown from '@nce/eview-react/DropDown'

function Example() {
  const options = [
    { text: '新建', value: 1 },
    { text: '编辑', value: 2 },
    { text: '删除', value: 3, disabled: true },
    { text: '导出', value: 4 },
  ]

  const handleItemClick = (item, e) => {
    console.log('选中:', item)
  }

  return (
    <DropDown
      text="操作"
      data={options}
      onItemClick={handleItemClick}
    />
  )
}
```

### 悬浮触发与带图标

```tsx
import DropDown from '@nce/eview-react/DropDown'

function Example() {
  const options = [
    { text: '新建', value: 1, icon: '/icons/create.svg', iconActive: '/icons/create-active.svg' },
    { text: '导出', value: 2, icon: '/icons/export.svg', iconActive: '/icons/export-active.svg' },
    { text: '删除', value: 3, icon: '/icons/delete.svg' },
  ]

  return (
    <DropDown
      text="菜单"
      data={options}
      trigger="hover"
      position="left"
      popupDirection="bottom"
      hasBorder
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| data | `dataType[]` | - | 菜单项数据 |
| text | `string` | - | 触发按钮文本 |
| iconUrl | `string` | - | 触发按钮图标路径 |
| iconClassName | `string` | - | 触发图标类名 |
| iconStyle | `React.CSSProperties` | - | 触发图标样式 |
| style | `React.CSSProperties` | - | 外层样式 |
| className | `string` | - | 外层类名 |
| itemStyle | `React.CSSProperties` | - | 下拉列表项样式 |
| itemClassName | `string` | - | 下拉列表项类名 |
| itemIconClassName | `string` | - | 下拉项图标类名 |
| itemIconStyle | `React.CSSProperties` | - | 下拉项图标样式 |
| position | `'left' \| 'right' \| 'auto'` | `'auto'` | 下拉菜单位置 |
| popupDirection | `'top' \| 'bottom' \| 'auto'` | `'auto'` | 弹出方向 |
| zindex | `string` | `'9999'` | 弹出层 z-index |
| autoZindex | `boolean` | `false` | 自动生成 z-index（谨慎使用，对性能有消耗） |
| isScrollAlwaysDisplay | `boolean` | `false` | 滚动条始终显示 |
| displayItems | `number` | `8` | 弹出窗口最大显示项数 |
| disabled | `boolean` | `false` | 禁用状态 |
| trigger | `'click' \| 'hover'` | `'click'` | 触发方式 |
| isAutoFirstFocus | `boolean` | `true` | 默认焦点第一项 |
| onlyShowDivider | `boolean` | - | 只显示分割线，不显示 label |
| selectedIndex | `string \| number` | - | 选中项索引 |
| blurDelayShort | `boolean` | - | 失焦隐藏延迟时间缩短 |
| hasBorder | `boolean` | - | 有边框效果 |

## dataType（data 数据项）

| 属性名 | 类型 | 说明 |
|--------|------|------|
| text | `string` | 菜单项文本 |
| tipData | `string` | 提示数据 |
| value | `any` | 菜单项值 |
| icon | `string \| React.ReactElement` | 图标路径或 React 元素 |
| iconActive | `string \| React.ReactElement` | 选中状态图标 |
| label | `boolean` | 是否为分组标签 |
| disabled | `boolean` | 是否禁用 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onDropDown | `(display: boolean) => void` | 下拉菜单展开/关闭回调 |
| onItemClick | `(item: dataType, e: any) => void` | 菜单项点击回调 |
| onKeyDown | `(e) => void` | 键盘按下事件 |
| onClosePopup | `any` | 弹出窗口关闭回调 |
| onBlur | `(e: React.MouseEvent<HTMLDivElement>) => void` | 失焦事件 |
| onClick | `() => void` | 点击事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，不支持 children slot |

## 注意事项

- DropDown 对应 A2UI 的 Dropdown 组件
- 数据通过 `data` prop 传入，不是通过子组件方式
- `trigger` 支持 `'click'`（点击触发）和 `'hover'`（悬浮触发）
- `position` 控制水平对齐（左/右/自动），`popupDirection` 控制垂直方向（上/下/自动）
- `autoZindex` 谨慎使用，对性能有消耗
- `disabled=true` 时视觉置灰，不可聚焦，cursor 显示 not-allowed
- DropDown 只支持一级下拉，多级下拉需使用 PopupMenu 组件