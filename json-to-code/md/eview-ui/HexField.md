# HexField 十六进制输入框

**Import:** `import HexField from '@cloudsop/eview-ui/HexField'`

## 基本用法

### 基础十六进制输入

```tsx
import HexField from '@cloudsop/eview-ui/HexField'

function Example() {
  return <HexField onChange={(value) => console.log('hex:', value)} />
}
```

### 带标签和必填校验

```tsx
import HexField from '@cloudsop/eview-ui/HexField'

function Example() {
  return (
    <HexField
      label="十六进制值"
      required
      onChange={(value) => console.log('hex:', value)}
    />
  )
}
```

### 受控模式

```tsx
import HexField from '@cloudsop/eview-ui/HexField'

function Example() {
  const [hex, setHex] = useState('0A1B')
  return <HexField value={hex} onChange={(value) => setHex(value)} />
}
```

### 带输入标准提示

```tsx
import HexField from '@cloudsop/eview-ui/HexField'

function Example() {
  return <HexField ruleText="0-9, A-F" />
}
```

### 自定义校验

```tsx
import HexField from '@cloudsop/eview-ui/HexField'

function Example() {
  return (
    <HexField
      validator={(value, id) => {
        if (value.length < 4) {
          return { result: false, message: '至少输入 4 位' }
        }
        return { result: true, message: '' }
      }}
    />
  )
}
```

### 限制最大长度

```tsx
import HexField from '@cloudsop/eview-ui/HexField'

function Example() {
  return <HexField maxLength={16} placeholder="请输入最多16位十六进制值" />
}
```

### 自定义字符过滤

```tsx
import HexField from '@cloudsop/eview-ui/HexField'

function Example() {
  return (
    <HexField
      isCharacterAllowed={(value, id) => {
        return !value.includes('00')
      }}
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | 自动生成（`eui_tf_` 前缀） | 组件 id |
| className | `string` | - | 外层 div 额外类名 |
| style | `CSSProperties` | - | 外层 div 自定义样式 |
| value | `string` | - | 输入框值 |
| label | `string` | - | 输入框名称文字 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置；before=左侧，after=右侧 |
| labelStyle | `CSSProperties` | - | 标签自定义样式 |
| labelClassName | `string` | - | 标签额外类名 |
| inputStyle | `CSSProperties` | - | 输入框自定义样式 |
| inputClassName | `string` | - | 输入框额外类名 |
| containerStyle | `CSSProperties` | - | 输入框容器样式 |
| errorLabelStyle | `CSSProperties` | `{}` | 错误提示标签样式 |
| placeholder | `string` | - | 输入框占位文本 |
| ruleText | `string` | - | 输入标准提示文本，显示在输入框右侧（始终可见） |
| required | `boolean` | `false` | 是否必填（必填时 label 前加 `*`，支持非空校验） |
| disabled | `boolean` | `false` | 是否禁用 |
| selectOnfocus | `boolean` | `true` | 聚焦时是否自动选中输入框文本 |
| maxLength | `number` | - | 最大输入长度 |
| validator | `(value: string, id: string, onChange: string) => { result: boolean; message: string }` | - | 自定义校验规则 |
| isCharacterAllowed | `(value: string, id: string) => boolean` | - | 字符过滤函数；返回 `false` 时拒绝当前输入 |
| onBlur | `(event: FocusEvent) => void` | - | 失焦回调 |
| onChange | `(value: string, oldValue: string, event: ChangeEvent) => void` | - | 值变化回调；提供新值和旧值 |
| onFocus | `(event: FocusEvent) => void` | - | 聚焦回调 |
| version | `string` | 取 ThemeContext | 设置组件版本（影响样式类名） |
| theme | `string` | 取 ThemeContext | 设置组件主题 |

## 注意事项

- HexField 对应 A2UI 的 HexField 组件
- 仅允许输入 `0-9`、`a-f`、`A-F`，其他字符自动被 `keydown` 事件拦截
- 输入值自动格式化：每 2 位十六进制字符后插入空格（如 `0A 1B 2C`），合法字符外的字符替换为 `0`
- `onChange` 回调提供三个参数：`(value, oldValue, event)`，其中 `value` 和 `oldValue` 均为格式化后的值
- `validator` 回调提供三个参数：`(value, id, onChange)`，第三个参数标识触发来源
- `isCharacterAllowed` 返回 `false` 时整个输入变更被拒绝（而非仅过滤单个字符）
- `selectOnfocus` 默认为 `true`，聚焦时自动全选文本便于快速替换
- `id` 未提供时通过内部 `IdGenerator` 自动生成（前缀 `eui_tf_`）
- 组件暴露 `validate()` 和 `focus()` 方法，可通过 ref 调用
