# Icon

**Import:** `import Icon from '@nce/eview-react/Icon'`

## 基本用法

### 基础图标

```tsx
import Icon from '@nce/eview-react/Icon'

function Example() {
  return (
    <div>
      <Icon name="search" size={[16, 16]} />
      <Icon name="settings" size={[24, 24]} color="#1890ff" />
      <Icon name="close" size={[16, 16]} hoverColor="#ff4d4f" />
    </div>
  )
}
```

### 自定义图标路径

```tsx
import Icon from '@nce/eview-react/Icon'

function Example() {
  return (
    <div>
      <Icon iconUrl="/assets/icons/custom.svg" size={[20, 20]} />
      <Icon iconUrl="/assets/icons/logo.svg" size={[32, 32]} isStandard={false} />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |
| name | `string` | - | 图标标识名称 |
| iconUrl | `string` | - | 自定义图标路径 |
| color | `string` | - | 图标颜色 |
| hoverColor | `string` | - | 悬停颜色 |
| pressColor | `string` | - | 按压颜色 |
| isStandard | `boolean` | `true` | 标准图标（light=linear, dark=filled） |
| size | `string[] \| number[]` | `[16, 16]` | 图标尺寸 [宽度, 高度] |
| disabled | `boolean` | `false` | 禁用状态 |
| disabledColor | `string` | - | 禁用颜色 |
| title | `string` | - | 图标标题 |
| isShowIconTitle | `boolean` | `false` | 是否显示图标标题 |
| component | `React.ElementType` | - | 自定义组件标签 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(e: React.MouseEvent) => void` | 点击事件 |
| onKeyDown | `(e: React.KeyboardEvent) => void` | 按键事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 图标组件不支持 children slot |

## 注意事项

- eview Icon 使用基于 SVG 的图标体系，图标资源来自 `@nce/eview-react/icons` 或 `@nce/eview-react/svg-icons`
- `name` 和 `iconUrl` 二选一：`name` 使用内置图标名，`iconUrl` 使用自定义 SVG 路径
- `isStandard=true` 时根据主题自动切换线性/填充图标样式
- **A2UI 适配建议**：使用 `lucide-react` 替代 eview Icon，因为 eview Icon 依赖华为内部 SVG 资源，外部环境可能无法访问
- 图标映射关系见 mapping-rules/icon-mapping.md