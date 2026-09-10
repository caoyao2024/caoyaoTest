# Switch

**Import:** `import Switch from '@nce/eview-react/Switch'`

## 基本用法

### 基础开关

```tsx
import Switch from '@nce/eview-react/Switch'

function Example() {
  const [toggled, setToggled] = React.useState(false)

  const handleToggle = (data: any) => {
    setToggled(!toggled)
  }

  return (
    <Switch
      label="开关"
      toggled={toggled}
      onToggle={handleToggle}
    />
  )
}
```

### 自定义 on/off 值和内容

```tsx
import Switch from '@nce/eview-react/Switch'

function Example() {
  const [toggled, setToggled] = React.useState(false)

  return (
    <div>
      <Switch
        label="启用通知"
        toggled={toggled}
        data={['off', 'on']}
        onToggle={(val) => setToggled(!toggled)}
        taggledChildren="已开启"
        unTaggledChildren="已关闭"
      />
      <Switch
        label="禁用状态"
        toggled={true}
        disabled
      />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 外层类名 |
| style | `React.CSSProperties` | - | 外层样式 |
| labelClassName | `string` | - | 标签类名 |
| labelStyle | `React.CSSProperties` | - | 标签样式 |
| data | `any[]` | - | 值对：`["offValue", "onValue"]` |
| label | `string` | - | 标签文本 |
| labelPosition | `'before' \| 'after'` | `'before'` | 标签位置 |
| toggled | `boolean` | `false` | 开关状态 |
| disabled | `boolean` | `false` | 禁用状态 |
| required | `boolean` | `false` | 是否必填 |
| taggledChildren | `string \| React.ReactNode` | - | 开启时显示的内容 |
| unTaggledChildren | `string \| React.ReactNode` | - | 关闭时显示的内容 |
| allowPropagation | `boolean` | `false` | 允许事件冒泡 |
| isControlToggled | `boolean` | - | 外部控制模式（用于确认对话框） |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onToggle | `(data: any)` | 切换回调；data 为当前 data prop 中的值 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 开关组件不支持 children slot |

## 注意事项

- **`taggledChildren` / `unTaggledChildren` 拼写有误**（应为 toggled），这是 API 的实际命名，不能修改
- `data` prop 定义 on/off 的值对，格式为 `[offValue, onValue]`，`onToggle` 回调返回当前对应的值
- `toggled` 控制开关状态，`true` 为开启，`false` 为关闭
- `isControlToggled=true` 时为外部控制模式，适用于切换前需要确认的场景（如弹出确认框）
- `allowPropagation=true` 允许事件冒泡，默认阻止冒泡
- Switch 的 A2UI 映射使用 `checked` + `onChange` 模式，与 eview 的 `toggled` + `onToggle` 不同