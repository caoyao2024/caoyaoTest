# TimeLine

**Import:** `import TimeLine from '@nce/eview-react/TimeLine'`

## 基本用法

### 基础时间线

```tsx
import TimeLine from '@nce/eview-react/TimeLine'

function Example() {
  const data = [
    {
      title: '创建项目',
      date: '2024-01-15',
      iconType: 'success',
      content: [{ text: '项目初始化完成' }],
    },
    {
      title: '代码提交',
      date: '2024-01-20',
      iconType: 'default',
      content: [{ text: '提交了3个文件' }],
    },
    {
      title: '部署上线',
      date: '2024-02-01',
      iconType: 'error',
      content: [{ text: '部署失败，回滚中' }],
    },
  ]

  return (
    <TimeLine
      data={data}
      render={(content) => <div>{content[0]?.text}</div>}
    />
  )
}
```

### 自定义图标的时间线

```tsx
import TimeLine from '@nce/eview-react/TimeLine'

function Example() {
  const data = [
    {
      title: '步骤一',
      date: '2024-03-01',
      icon: '/assets/icons/step1.svg',
      content: [{ text: '描述信息' }],
    },
    {
      title: '步骤二',
      date: '2024-03-15',
      iconType: 'success',
      content: [{ text: '已完成' }],
    },
  ]

  return (
    <TimeLine
      title="项目进度"
      data={data}
      render={(content) => (
        <div style={{ padding: '4px 0' }}>{content[0]?.text}</div>
      )}
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |
| title | `string` | - | 标题文本 |
| titleClassName | `string` | - | 标题类名 |
| titleStyle | `React.CSSProperties` | - | 标题样式 |
| data | `dataType[]` | - | 时间线数据数组 |
| render | `(content?: { [key: string]: any }[]) => void` | - | 内容渲染函数 |
| iconClassName | `string` | - | 图标类名 |
| iconStyle | `React.CSSProperties` | - | 图标样式 |
| contentClassName | `string` | - | 内容区域类名 |
| contentStyle | `React.CSSProperties` | - | 内容区域样式 |
| dateClassName | `string` | - | 日期区域类名 |
| dateStyle | `React.CSSProperties` | - | 日期区域样式 |

## dataType（data 数据项）

| 属性名 | 类型 | 说明 |
|--------|------|------|
| title | `string?` | 项标题 |
| date | `string?` | 日期字符串 |
| icon | `string?` | 自定义图标路径 |
| iconType | `string?` | 图标类型：'success'、'error'、'default'，默认 'default' |
| iconStyle | `React.CSSProperties?` | 图标样式 |
| iconClassName | `string?` | 图标类名 |
| content | `{ [key: string]: any }[]?` | 内容数据 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| 无 | - | 时间线组件无事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，内容通过 render 函数渲染 |

## 注意事项

- 数据通过 `data` prop 传入，不是通过子组件方式
- `render` 是一个函数，eview 调用它来渲染每个项的内容区域
- `content` 数据会传递给 `render` 回调，可在回调中灵活渲染
- `iconType` 支持三种预设图标样式：'success'（绿色对勾）、'error'（红色叉号）、'default'（灰色圆点）
- `icon` 可指定自定义 SVG 图标路径，优先级高于 `iconType`
- TimeLine 对应 A2UI 的 Timeline + TimelineItem