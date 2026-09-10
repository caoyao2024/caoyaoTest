# Menu 菜单

**Import:** `import Menu from '@cloudsop/eview-ui/Menu'`

## 基本用法

### 垂直菜单（默认）

```tsx
import Menu from '@cloudsop/eview-ui/Menu'

function Example() {
  return (
    <Menu onClick={(e) => console.log('click:', e.key)}>
      <Menu.Item key="1">选项一</Menu.Item>
      <Menu.Item key="2">选项二</Menu.Item>
      <Menu.Item key="3" disabled>禁用项</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4">选项四</Menu.Item>
    </Menu>
  )
}
```

### 可选中菜单

```tsx
import Menu from '@cloudsop/eview-ui/Menu'

function Example() {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['1'])
  return (
    <Menu
      selectable
      selectedKeys={selectedKeys}
      onSelect={(e) => setSelectedKeys(e.selectedKeys)}
    >
      <Menu.Item key="1">选项一</Menu.Item>
      <Menu.Item key="2">选项二</Menu.Item>
      <Menu.Item key="3">选项三</Menu.Item>
    </Menu>
  )
}
```

### 多选菜单

```tsx
import Menu from '@cloudsop/eview-ui/Menu'

function Example() {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  return (
    <Menu
      selectable
      multiple
      selectedKeys={selectedKeys}
      onSelect={(e) => setSelectedKeys(e.selectedKeys)}
      onDeselect={(e) => setSelectedKeys(e.selectedKeys)}
    >
      <Menu.Item key="1">选项一</Menu.Item>
      <Menu.Item key="2">选项二</Menu.Item>
      <Menu.Item key="3">选项三</Menu.Item>
    </Menu>
  )
}
```

### 带子菜单

```tsx
import Menu from '@cloudsop/eview-ui/Menu'

function Example() {
  return (
    <Menu>
      <Menu.Item key="1">选项一</Menu.Item>
      <Menu.SubMenu key="sub1" title="子菜单">
        <Menu.Item key="1-1">子选项一</Menu.Item>
        <Menu.Item key="1-2">子选项二</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="2">选项二</Menu.Item>
    </Menu>
  )
}
```

### 水平菜单 + 受控展开子菜单

```tsx
import Menu from '@cloudsop/eview-ui/Menu'

function Example() {
  const [openKeys, setOpenKeys] = useState<React.Key[]>([])
  return (
    <Menu
      mode="horizontal"
      openKeys={openKeys}
      onOpenKeysChange={(keys) => setOpenKeys(keys ?? [])}
      triggerSubMenuAction="hover"
    >
      <Menu.Item key="1">首页</Menu.Item>
      <Menu.SubMenu key="sub1" title="管理">
        <Menu.Item key="1-1">用户管理</Menu.Item>
        <Menu.Item key="1-2">权限管理</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="2">设置</Menu.Item>
    </Menu>
  )
}
```

### 小尺寸菜单

```tsx
import Menu from '@cloudsop/eview-ui/Menu'

function Example() {
  return (
    <Menu size="small">
      <Menu.Item key="1">选项一</Menu.Item>
      <Menu.Item key="2">选项二</Menu.Item>
    </Menu>
  )
}
```

## Props（Menu）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| mode | `'vertical' \| 'horizontal' \| 'inline'` | `'vertical'` | 菜单类型 |
| selectable | `boolean` | `false` | 是否支持选中 |
| multiple | `boolean` | `false` | 是否支持多选（需 `selectable=true`） |
| size | `'normal' \| 'small'` | `'normal'` | 菜单尺寸 |
| defaultOpenKeys | `React.Key[]` | `[]` | 初始展开的 SubMenu key 数组（非受控） |
| openKeys | `React.Key[]` | - | 当前展开的 SubMenu key 数组（受控） |
| onOpenKeysChange | `(openKeys?: React.Key[]) => void` | - | SubMenu 展开/收起回调 |
| defaultSelectedKeys | `React.Key[]` | - | 初始选中的 MenuItem key 数组（非受控） |
| selectedKeys | `React.Key[]` | - | 当前选中的 MenuItem key 数组（受控） |
| style | `CSSProperties` | - | 菜单节点样式（仅作用于第一级） |
| className | `string` | - | 额外 CSS 类名 |
| onClick | `(event?: ClickItemEvent) => void` | - | MenuItem 点击回调 |
| onSelect | `(event?: SelectItemEvent) => void` | - | MenuItem 选中回调（需 `selectable=true`） |
| onDeselect | `(event?: SelectItemEvent) => void` | - | MenuItem 取消选中回调（需 `multiple=true`） |
| triggerSubMenuAction | `'hover' \| 'click'` | `'hover'` | SubMenu 展开触发方式 |
| children | `React.ReactNode` | - | 菜单项子元素，使用 MenuItem / SubMenu / Divider |
| version | `string` | - | 设置组件版本（影响样式类名），默认取 ThemeContext |
| theme | `string` | - | 设置组件主题，默认取 ThemeContext |

### ClickItemEvent

| 属性名 | 类型 | 说明 |
|--------|------|------|
| item | `HTMLElement \| null` | 被点击的 DOM 元素 |
| key | `React.Key` | 被点击项的 key |
| keyPath | `React.Key[]` | 从根到被点击项的完整 key 路径 |
| domEvent | `React.MouseEvent<HTMLElement>` | 原生 DOM 事件 |

### SelectItemEvent（继承 ClickItemEvent）

| 属性名 | 类型 | 说明 |
|--------|------|------|
| selectedKeys | `React.Key[]` | 当前所有选中的 key |
| *继承 ClickItemEvent 所有字段* | | |

## Props（Menu.Item）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| key | `React.Key` | - | 唯一标识 |
| disabled | `boolean` | `false` | 是否禁用 |
| icon | `string` | `null` | 菜单项图标（字符串，渲染为 `<span class="eui-menu-icon">` 内容） |
| title | `string` | `''` | 折叠时的悬停标题（暂未实现） |
| keyCode | `number` | - | 快捷键码 |
| children | `React.ReactNode` | - | 菜单项文本或元素 |

## Props（Menu.SubMenu）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| key | `React.Key` | - | 唯一标识 |
| title | `React.ReactNode` | `''` | 子菜单标题文本或元素 |
| icon | `React.ReactElement` | `null` | 图标元素（ReactElement，渲染在 `<span class="eui-menu-icon">` 内） |
| disabled | `boolean` | `false` | 是否禁用 |
| popupClassName | `string` | - | 子菜单弹出容器 className |
| useAbsolute | `boolean` | `false` | 子菜单弹出是否使用 absolute 定位 |
| keyCode | `number` | - | 快捷键码 |
| onTitleClick | `(event?: { key?: React.Key; domEvent: React.MouseEvent<HTMLLIElement> }) => void` | - | 子菜单标题点击回调 |
| children | `React.ReactNode` | - | 子菜单项，使用 MenuItem / SubMenu / Divider |

## Props（Menu.Divider）

继承标准 `<li>` HTML 属性（`className`、`style` 等），无额外属性。渲染为带 `eui-menu-item-divider` 类名的分隔线。

## 注意事项

- Menu 对应 A2UI 的 Menu 组件
- `Menu.Item`、`Menu.SubMenu`、`Menu.Divider` 通过静态属性访问，不支持单独 import
- `selectedKeys` 受控模式下，`selectable=false` 时强制为空数组；`multiple=false` 时只保留第一个 key
- `openKeys` / `selectedKeys` 支持受控与非受控两种模式，非受控时使用 `defaultOpenKeys` / `defaultSelectedKeys`
- `Menu.Item` 的 `icon` 类型为 `string`，`Menu.SubMenu` 的 `icon` 类型为 `React.ReactElement`，两者类型不同
- `keyPath` 由父级自动注入，请勿手动设置
- 键盘导航支持方向键、Enter、Escape 和快捷键（`keyCode`）
