# TextField

**Import:** `import TextField from '@nce/eview-react/TextField'`

## 基本用法

### 基础文本输入框

```tsx
import TextField from '@nce/eview-react/TextField'

function Example() {
  const [value, setValue] = React.useState('')

  const handleChange = (value: string, oldValue: string | number, event: React.ChangeEvent) => {
    setValue(value)
  }

  return (
    <TextField
      label="用户名"
      value={value}
      onChange={handleChange}
      placeholder="请输入用户名"
    />
  )
}
```

### 带验证的输入框

```tsx
import TextField from '@nce/eview-react/TextField'

function Example() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <div>
      <TextField
        label="邮箱"
        value={email}
        onChange={(val) => setEmail(val)}
        validator={TextField.defaultValidator.email}
        required
        placeholder="请输入邮箱地址"
      />
      <TextField
        label="密码"
        value={password}
        onChange={(val) => setPassword(val)}
        type="password"
        validator={(value) => {
          if (value.length < 8) {
            return { result: false, message: '密码至少8位', type: 'error' }
          }
          return { result: true, message: '' }
        }}
        maxLength={20}
        placeholder="请输入密码"
      />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| style | `React.CSSProperties` | - | 外层样式 |
| className | `string` | - | 外层类名 |
| label | `string` | - | 标签文本 |
| placeholder | `string` | - | 占位文本 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| inputClassName | `string` | - | 输入框类名 |
| inputStyle | `React.CSSProperties` | - | 输入框样式 |
| value | `string` | - | 值 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| type | `'password' \| 'text'` | `'text'` | 输入类型 |
| required | `boolean` | `false` | 是否必填 |
| hideRequiredMark | `boolean` | `false` | 隐藏必填星号 |
| disabled | `boolean` | `false` | 禁用状态 |
| selectOnfocus | `boolean` | `true` | 聚焦时选中文本 |
| isCharacterAllowed | `(value: string, id: string) => boolean` | - | 字符过滤器 |
| validator | `(value: string, id?: string) => { result: boolean, message: string\|Element, type?: string }` | - | 自定义验证 |
| validateWhileEmpty | `boolean` | `false` | 空值时也验证 |
| format | `'number' \| 'any'` | `'any'` | 输入格式 |
| hintType | `'div' \| 'tip'` | `'div'` | 提示类型 |
| readOnly | `boolean` | `false` | 只读 |
| focusTip | `string` | - | 聚焦提示 |
| showFocusTipAndError | `boolean` | `false` | 同时显示聚焦提示和错误 |
| zIndex | `number` | `9999` | 提示框 z-index |
| autoZindex | `boolean` | `false` | 自动 z-index |
| autoComplete | `'off' \| 'on' \| 'new-password'` | `'off'` | 自动补全 |
| tipStyle | `React.CSSProperties` | - | 提示框样式 |
| maxLength | `number` | - | 最大长度 |
| maxLengthByte | `boolean` | `false` | 按字节计算最大长度 |
| containerStyle | `React.CSSProperties` | - | 容器区域样式 |
| canPasswordPaste | `boolean` | `false` | 密码框允许粘贴 |
| title | `string` | - | 标题 |
| isAllowToModifyPasswordByProps | `boolean` | `false` | 允许通过 props 修改密码 |
| ruleText | `string` | - | 右侧规则文本 |
| enableFixWidth | `'small' \| 'middle' \| 'large' \| 'none'` | `'none'` | 标签-输入框间距 |
| suffix | `React.ReactNode` | - | 后缀元素 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onBlur | `(event: React.FocusEvent, value: any)` | 失焦事件 |
| onChange | `(value: string, oldValue: string\|number, event: React.ChangeEvent)` | 值变化 |
| onClick | `(event: any)` | 点击 |
| onFocus | `(event: React.FocusEvent)` | 聚焦 |
| onKeyDown | `(event: React.KeyboardEvent<HTMLInputElement>)` | 按键 |
| onKeyUp | `(event: React.KeyboardEvent)` | 按键释放 |
| onPaste | `(event: React.ClipboardEvent<HTMLInputElement>)` | 粘贴 |

## 静态验证器（TextField.defaultValidator）

| 验证器名 | 说明 |
|---------|------|
| `min` | 最小值 |
| `max` | 最大值 |
| `integer` | 整数 |
| `range` | 范围 |
| `rangeAndInteger` | 范围且整数 |
| `number` | 数字 |
| `email` | 邮箱 |
| `digit` | 数字字符 |
| `url` | URL |
| `alpha` | 字母 |
| `regex` | 正则表达式 |
| `postfix` | 后缀匹配 |
| `ipv4` | IPv4 地址 |
| `ipv6` | IPv6 地址 |
| `creditCard` | 信用卡号 |
| `equalTo` | 等于指定值 |
| `notEqualTo` | 不等于指定值 |
| `minLength` | 最小长度 |
| `maxLength` | 最大长度 |
| `rangeLength` | 长度范围 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 文本框组件不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getValue | `() => any` | 获取当前值 |
| getOldValue | `() => string` | 获取之前的值 |
| validate | `() => boolean` | 验证 |
| focus | `() => void` | 聚焦 |

## 注意事项

- TextField 对应 A2UI 的 Input 组件
- 内置丰富的静态验证器 `TextField.defaultValidator`，可直接使用如 `validator={TextField.defaultValidator.email}`
- `validator` 返回对象包含 `result`、`message`、`type`（'error' 或 'tip'）
- `type='password'` 时为密码输入框，`canPasswordPaste` 控制是否允许粘贴
- `isCharacterAllowed` 可用于实时过滤输入字符，返回 false 的字符将被阻止
- `format='number'` 时仅允许数字输入
- `suffix` 可添加后缀元素（如单位、图标等）
- `onChange` 第二个参数 `oldValue` 为变化前的值