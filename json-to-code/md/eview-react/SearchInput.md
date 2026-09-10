# SearchInput

**Import:** `import SearchInput from '@nce/eview-react/SearchInput'`

## 基本用法

### 基础搜索输入框

```tsx
import SearchInput from '@nce/eview-react/SearchInput'

function Example() {
  const [value, setValue] = React.useState('')

  const popItems = [
    { text: '选项一', value: '1' },
    { text: '选项二', value: '2' },
    { text: '选项三', value: '3' },
  ]

  return (
    <SearchInput
      label="搜索"
      value={value}
      popItems={popItems}
      onSearch={(val) => console.log('搜索:', val)}
      onChange={(val) => setValue(val)}
      placeholder="请输入搜索内容"
    />
  )
}
```

### 动态建议搜索

```tsx
import SearchInput from '@nce/eview-react/SearchInput'

function Example() {
  const [value, setValue] = React.useState('')

  const handleSuggest = (val: any) => {
    return [
      { text: `结果1: ${val}`, value: '1' },
      { text: `结果2: ${val}`, value: '2' },
    ]
  }

  return (
    <SearchInput
      label="动态搜索"
      value={value}
      onSuggest={handleSuggest}
      onSearch={(val) => console.log('搜索:', val)}
      onChange={(val) => setValue(val)}
      placeholder="输入获取建议"
      clearButton
      required
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 搜索输入框根节点的 id |
| className | `string` | - | 搜索输入框根节点的样式类名 |
| style | `React.CSSProperties` | - | 覆盖搜索输入框根节点的行内样式 |
| required | `boolean` | `false` | 指定其为必填字段 |
| hideRequiredMark | `boolean` | `false` | 设置 required 后隐藏红色 * 标记 |
| disabled | `boolean` | `false` | 设置组件灰化 |
| inputClassName | `string` | - | 输入框的样式类名 |
| inputStyle | `React.CSSProperties` | - | 覆盖搜索框的行内样式 |
| labelClassName | `string` | - | 自定义 label 名称的样式类名 |
| labelStyle | `React.CSSProperties` | - | 自定义 label 名称的样式 |
| label | `string` | - | 设置下拉框的名称文字 |
| labelPosition | `'before' \| 'after'` | `'before'` | 设置输入框名称文字的位置，before 为左边，after 为右边 |
| value | `any` | - | 搜索输入框的文本值 |
| popItems | `{ text: string; value: any; disabled?: boolean }[]` | - | 下拉列表内容，与 onSuggest 互斥 |
| placeholder | `string` | - | 搜索输入框的占位语 |
| maxLengthInput | `number` | - | 限制搜索输入框的字符数 |
| showPopUp | `boolean` | `false` | 控制弹出层是否显示 |
| lazySearch | `object` | - | 懒搜索配置（含 `totalRecords`、`onLoadRecords`），启用后下拉列表分页懒加载 |
| virtualScroll | `boolean` | - | 虚拟滚动支持 |
| validator | `(value: string, id?: string, type?: string) => { result: boolean; message?: string \| Element }` | - | 自定义校验规则 |
| inputProps | `React.InputHTMLAttributes<HTMLElement>` | - | 传递给原生 input 的额外属性 |
| isBlurTrim | `boolean` | `true` | 在有失焦事件情况下，失焦时是否去除字符串两端空白字符 |
| zindex | `string` | `'9999'` | 弹出层 z-index |
| showTip | `boolean` | `false` | 控制自定义提示信息展示，当 value 长度超过文本框长度时展示 |
| clearButton | `boolean` | `true` | 是否显示清除按钮 |
| isLoading | `boolean` | `false` | 是否显示加载图标 |
| hintType | `'div' \| 'tip'` | `'div'` | 设置提示的类型 |
| isAllowSpaceBar | `boolean` | `true` | 是否允许空格键 |
| autoSearch | `boolean` | `true` | 是否开启自动搜索 |
| isCharacterAllowed | `any` | - | 字符过滤器 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onSearch | `(value: any) => void` | 点击搜索图标、按回车或输入框文本值变化时触发 |
| onSuggest | `(value: any) => Array` | 搜索框值变化时回调，动态设置下拉列表内容，与 popItems 互斥 |
| onItemClick | `(value: any, obj: object) => void` | 弹出层中每项数据被点击后触发 |
| onClear | `(value: any) => void` | 点击清除图标时触发 |
| onChange | `(value: string) => void` | 搜索框值更改时触发 |
| onClosePopup | `() => void` | 弹出层销毁后触发 |
| onBlur | `(value: string) => void` | 搜索框失焦时触发，返回当前文本值 |
| onFocus | `() => void` | 搜索框聚焦时触发 |




## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => string` | 获取当前搜索框文本值 |
| validate | `() => boolean` | 验证 |
| focus | `() => void` | 聚焦 |

## 注意事项

- `popItems` 与 `onSuggest` 互斥，不能同时设置：`popItems` 为静态下拉列表，`onSuggest` 为动态回调生成
- `autoSearch` 为 `true` 时，输入值变化即触发搜索；设为 `false` 则需手动点击搜索图标或按回车
- `lazySearch` 启用后下拉列表分页懒加载，需提供 `totalRecords` 和 `onLoadRecords`
- `clearButton` 默认为 `true`，显示清除按钮
- `isBlurTrim` 默认为 `true`，失焦时自动去除两端空白

