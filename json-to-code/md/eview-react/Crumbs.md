# Crumbs

**Import:** `import Crumbs from '@nce/eview-react/Crumbs'`

## 基本用法

### 基础面包屑

```tsx
import Crumbs from '@nce/eview-react/Crumbs'

function Example() {
  const data = [
    { title: '首页', url: '/home' },
    { title: '产品', url: '/product' },
    { title: '详情' },
  ]

  const handleClick = (data, event) => {
    console.log('点击:', data)
  }

  return (
    <Crumbs data={data} onClick={handleClick} />
  )
}
```

### 自定义分隔符与多级节点

```tsx
import Crumbs from '@nce/eview-react/Crumbs'

function Example() {
  const data = [
    { title: '首页', url: '/home' },
    { title: '管理', url: '/manage' },
    { title: '配置', url: '/config' },
    { title: '网络', url: '/network' },
    { title: '安全', url: '/security' },
    { title: '策略' },
  ]

  return (
    <div>
      <Crumbs data={data} seprator="/" />
      <Crumbs title="多级节点" data={data} countLimit={7} itemTip />
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
| title | `string` | - | 面包屑标题 |
| seprator | `string` | - | 自定义分隔符 |
| splitIcon | `string` | - | 自定义分割图标 URL |
| data | `ICrumb[]`（必填） | - | 面包屑配置数据 |
| itemStyle | `React.CSSProperties` | - | 每项样式 |
| countLimit | `number` | `6` | 超出此值展示下拉菜单 |
| itemTip | `boolean` | `false` | 鼠标移入显示 tips |

## ICrumb（data 数据项）

| 属性名 | 类型 | 说明 |
|--------|------|------|
| title | `string` | 项标题（必填） |
| url | `string` | 路由链接 |
| enable | `boolean` | 是否禁用 |
| icon | `string \| React.ReactElement` | 图标路径或 React 元素 |
| style | `React.CSSProperties` | 项样式 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(data: ICrumb, event: React.MouseEvent \| React.KeyboardEvent) => void` | 点击带链接的面包屑项回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，不支持 children slot |

## 注意事项

- Crumbs 对应 A2UI 的 Breadcrumb 组件
- 数据通过 `data` prop 传入，不是通过子组件方式
- `data` 中勿自定义 `value`、`text`、`disabled` 同名属性
- `countLimit` 控制 data 长度超出时显示下拉菜单，默认 6
- `seprator` 自定义分隔符文本，`splitIcon` 自定义分隔图标
- `url` 有值时该项可点击，触发 `onClick` 回调