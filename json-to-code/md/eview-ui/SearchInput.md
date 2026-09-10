# SearchInput 搜索输入框

**Import:** `import SearchInput from '@cloudsop/eview-ui/SearchInput'`

## 基本用法

### 基础搜索框

```tsx
import SearchInput from '@cloudsop/eview-ui/SearchInput'

function Example() {
  return (
    <SearchInput
      placeholder="请输入关键词"
      onSearch={(value) => console.log('search:', value)}
    />
  )
}
```

### 带下拉建议（静态数据）

```tsx
import SearchInput from '@cloudsop/eview-ui/SearchInput'

function Example() {
  const items = [
    { text: '选项一', value: '1' },
    { text: '选项二', value: '2' },
    { text: '选项三', value: '3' },
  ]
  return (
    <SearchInput
      popItems={items}
      placeholder="搜索..."
      onSearch={(value) => console.log('search:', value)}
      onItemClick={(value, obj) => console.log('item:', value, obj)}
    />
  )
}
```

### 动态搜索建议（onSuggest）

```tsx
import SearchInput from '@cloudsop/eview-ui/SearchInput'

function Example() {
  const handleSuggest = (value: string) => {
    if (!value) return []
    return [
      { text: `${value} - 结果一`, value: '1' },
      { text: `${value} - 结果二`, value: '2' },
    ]
  }
  return (
    <SearchInput
      onSuggest={handleSuggest}
      onSearch={(value) => console.log('search:', value)}
    />
  )
}
```

### 受控模式

```tsx
import SearchInput from '@cloudsop/eview-ui/SearchInput'

function Example() {
  const [value, setValue] = useState('')
  return (
    <SearchInput
      value={value}
      onChange={(v) => setValue(v)}
      onSearch={(v) => console.log('search:', v)}
    />
  )
}
```


### 聚焦时显示全部建议

```tsx
import SearchInput from '@cloudsop/eview-ui/SearchInput'

function Example() {
  const handleSuggest = (value: string) => {
    return [
      { text: '全部项目一', value: '1' },
      { text: '全部项目二', value: '2' },
    ]
  }
  return (
    <SearchInput
      onSuggest={handleSuggest}
      showSuggest
      onSearch={(value) => console.log('search:', value)}
    />
  )
}
```

### 懒加载搜索（分页加载建议）

```tsx
import SearchInput from '@cloudsop/eview-ui/SearchInput'

function Example() {
  const lazySearch = {
    totalRecords: 100,
    onLoadRecords: (startIndex: number) => {
      return Array.from({ length: 10 }, (_, i) => ({
        text: `结果 ${startIndex + i + 1}`,
        value: String(startIndex + i + 1),
      }))
    },
  }
  return (
    <SearchInput
      onSuggest={(v) => []}
      lazySearch={lazySearch}
      onSearch={(value) => console.log('search:', value)}
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | 自动生成（`eui_search_` 前缀） | 搜索输入框根节点 id |
| className | `string` | - | 根节点额外类名 |
| style | `object` | `{ width: '100%' }` | 根节点行内样式 |
| value | `string` | `''` | 输入框文本值 |
| placeholder | `string` | - | 输入框占位语 |
| disabled | `boolean` | `false` | 是否禁用 |
| required | `boolean` | - | 是否必填（必填时 label 前加 `*`，空值提交校验报错） |
| label | `string` | - | 标签文字 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置；before=左侧，after=右侧 |
| labelStyle | `object` | - | 标签自定义样式 |
| labelClassName | `string` | - | 标签额外类名 |
| inputStyle | `object` | `{ width: '100%' }` | 输入框行内样式 |
| inputClassName | `string` | - | 输入框额外类名 |
| inputProps | `object` | - | 透传给 `<input>` 的额外属性 |
| maxLengthInput | `number` | - | 输入最大字符长度 |
| popItems | `{ text: string; value: string }[]` | `[]` | 下拉列表静态数据（与 `onSuggest` 互斥） |
| onSuggest | `(value: string) => Array<{ text: string; value: string }>` | - | 动态搜索建议回调（与 `popItems` 互斥），返回下拉列表数据 |
| onSearch | `(value: string) => unknown` | - | 搜索回调；点击搜索图标、按回车时触发 |
| onChange | `(value: string) => unknown` | - | 输入值变化回调 |
| onClear | `(value: string) => unknown` | - | 清除按钮点击回调，参数为清除前的旧值 |
| onItemClick | `(value: string, obj: any) => unknown` | - | 下拉列表项点击回调 |
| onBlur | `() => unknown` | - | 失焦回调 |
| onFocus | `() => unknown` | - | 聚焦回调 |
| onClick | `MouseEventHandler<HTMLInputElement>` | - | 输入框点击回调 |
| onMouseEnter | `MouseEventHandler<HTMLInputElement>` | - | 鼠标进入回调 |
| onMouseLeave | `MouseEventHandler<HTMLInputElement>` | - | 鼠标离开回调 |
| clearButton | `boolean` | `true` | 是否显示清除按钮 |
| showTip | `boolean` | `false` | 是否在鼠标悬停时显示 Tooltip（文本溢出时展示完整内容） |
| showSuggest | `boolean` | `false` | 聚焦时是否显示下拉建议列表（需配合 `onSuggest` 使用） |
| showPopUp | `boolean` | - | 手动控制下拉列表显隐 |
| searchable | `boolean` | - | 可搜索模式；为 true 时失焦不关闭下拉列表 |
| zIndex | `number` | baseZIndex + baseZIndexUnit | 下拉列表 z-index |
| lazySearch | `{ totalRecords: number; onLoadRecords: (startIndex: number) => Array }` | - | 懒加载配置；数据分页加载，每次 `onLoadRecords` 加载约 10 条 |
| iconStyle | `object` | - | 下拉项图标的自定义样式 |
| onClosePopup | `() => unknown` | - | 下拉列表关闭回调 |
| title | `string` | - | 输入框 title 属性 |
| disable | `boolean` | - | 禁用（与 `disabled` 同义，建议使用 `disabled`） |


## 注意事项

- SearchInput 对应 A2UI 的 SearchInput 组件
- `popItems` 与 `onSuggest` **互斥**，不能同时设置：
  - `popItems`：静态数据，输入时自动按 `text` 本地模糊匹配过滤
  - `onSuggest`：动态回调，由调用方根据输入值返回匹配结果
- 本地过滤匹配规则：对 `popItems` 中 `text` 做不区分大小写的正则匹配
- `onSearch` 触发时机：点击搜索图标、按回车键（忽略长按重复）
- 下拉列表支持键盘上下方向键导航，Enter 选中，Escape 关闭
- 下拉列表中 `disabled` 项会被跳过（键盘导航和点击均忽略）
- `clearButton` 默认为 `true`，输入框有值时显示清除图标
- `showSuggest=true` 时，聚焦瞬间会调用 `onSuggest('')` 获取初始建议列表
- `lazySearch` 用于大数据量场景，下拉列表内部实现虚拟滚动，`onLoadRecords` 按需加载
- 清除按钮点击后输入框自动重新聚焦
- Tooltip 提示仅在 `showTip=true` 且输入文本溢出时展示完整内容
