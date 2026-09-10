# IPInput IP 输入框

**Import:** `import IPInput from '@cloudsop/eview-ui/IPInput'`

## 基本用法

### IPv4 输入框（默认）

```tsx
import IPInput from '@cloudsop/eview-ui/IPInput'

function Example() {
  return <IPInput onChange={(value) => console.log('ip:', value)} />
}
```

### IPv6 输入框

```tsx
import IPInput from '@cloudsop/eview-ui/IPInput'

function Example() {
  return <IPInput type="v6" onChange={(value) => console.log('ipv6:', value)} />
}
```

### MAC 地址输入框

```tsx
import IPInput from '@cloudsop/eview-ui/IPInput'

function Example() {
  return <IPInput type="mac" onChange={(value) => console.log('mac:', value)} />
}
```

### 带标签和必填校验

```tsx
import IPInput from '@cloudsop/eview-ui/IPInput'

function Example() {
  return <IPInput label="IP 地址" required onChange={(value) => console.log('ip:', value)} />
}
```

### 受控模式

```tsx
import IPInput from '@cloudsop/eview-ui/IPInput'

function Example() {
  const [ip, setIp] = useState('192.168.1.1')
  return <IPInput value={ip} onChange={(value) => setIp(value)} />
}
```

### 自定义校验

```tsx
import IPInput from '@cloudsop/eview-ui/IPInput'

function Example() {
  return (
    <IPInput
      validator={(value) => {
        if (value.startsWith('0')) {
          return { result: false, message: '不能以 0 开头' }
        }
        return { result: true, message: '' }
      }}
    />
  )
}
```

### 自定义分隔符

```tsx
import IPInput from '@cloudsop/eview-ui/IPInput'

function Example() {
  return <IPInput type="v4" delimiter="." onChange={(value) => console.log(value)} />
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | 自动生成（`eui_ip_input_` 前缀） | 组件 id |
| className | `string` | - | 外层 div 额外类名 |
| style | `CSSProperties` | - | 自定义样式 |
| type | `'v4' \| 'v6' \| 'mac' \| string` | `'v4'` | 输入框类型；v4=IPv4(4段，分隔符`.`)，v6=IPv6(8段，分隔符`:`)，mac=MAC地址(6段，分隔符`-`) |
| value | `string` | - | 输入框值，用分隔符连接的完整地址字符串（如 `'192.168.1.1'`） |
| delimiter | `string` | 按 type 自动推导 | 分隔符；v4 默认 `.`，v6 默认 `:`，mac 默认 `-` |
| disabled | `boolean` | `false` | 是否禁用 |
| readOnly | `boolean` | - | 是否只读 |
| label | `string` | - | 输入框名称文字 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置；before=左侧，after=右侧 |
| labelStyle | `CSSProperties` | - | 标签自定义样式 |
| labelClassName | `string` | - | 标签额外类名 |
| inputStyle | `CSSProperties` | - | 输入框外层样式 |
| required | `boolean` | - | 是否必填（必填时 label 前加 `*`，支持非空校验） |
| validator | `(value: string) => { result: boolean; message: string }` | - | 自定义校验规则 |
| hintType | `'div' \| 'tip'` | `'div'` | 错误提示类型；div=行内提示，tip=Tooltip 提示 |
| tipStyle | `CustomTooltipType` | - | 自定义 Tooltip 属性（hintType 为 tip 时生效） |
| onBlur | `(value: string, event: FocusEvent) => void` | - | 失焦回调 |
| onFocus | `(value: string, event: FocusEvent) => void` | - | 聚焦回调 |
| onChange | `(value: string, event: ChangeEvent) => void` | - | 值变化回调 |
| version | `string` | 取 ThemeContext | 设置组件版本（影响样式类名） |
| theme | `string` | 取 ThemeContext | 设置组件主题 |

## 注意事项

- IPInput 对应 A2UI 的 IPInput 组件
- `type` 决定输入段数和默认分隔符：v4=4段/`.`，v6=8段/`:`，mac=6段/`-`
- `delimiter` 显式传入时覆盖 type 对应的默认分隔符
- 输入值会自动转为大写（v6/mac 场景下十六进制字母大写）
- 组件内部按段管理输入焦点，输入满一段自动跳转到下一段
- 支持粘贴完整地址（如 `192.168.1.1`），组件自动按分隔符拆分到各段
- `validator` 返回 `{ result: boolean, message: string }`，`result=false` 时显示 `message` 作为错误提示
- `hintType='tip'` 时错误提示以 Tooltip 形式展示，`hintType='div'` 时行内展示
- `id` 未提供时通过内部 `IdGenerator` 自动生成（前缀 `eui_ip_input_`）
