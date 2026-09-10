# Crumbs

**Import:** `import Crumbs from '@cloudsop/eview-ui/Crumbs'`

## 基本用法

### 基础面包屑

```tsx
import Crumbs from '@cloudsop/eview-ui/Crumbs'

function Example() {
  const data = [
    { title: '首页', url: '/home' },
    { title: '列表', url: '/list' },
    { title: '详情' }
  ]

  return (
    <Crumbs
      data={data}
      onClick={(data, event) => console.log('click:', data)}
    />
  )
}
```

### 带标题和自定义分隔符

```tsx
import Crumbs from '@cloudsop/eview-ui/Crumbs'

function Example() {
  return (
    <Crumbs
      data={data}
      title="当前位置"
      seprator="/"
      splitIcon="icon-arrow"
    />
  )
}
```

### 带图标

```tsx
import Crumbs from '@cloudsop/eview-ui/Crumbs'

function Example() {
  const data = [
    { title: '首页', url: '/home', icon: 'icon-home' },
    { title: '详情' }
  ]

  return <Crumbs data={data} />
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 定制组件 dom 元素 id，传入该值可覆盖组件自动生成的 id |
| className | `string` | - | 定制组件 dom 元素 className，传入该值可追加组件自动生成的 className |
| title | `string` | - | 传入该值可定制面包屑头部标题，不传则默认不需要标题 |
| seprator | `string` | `'>'` | 自定义分隔符 |
| splitIcon | `string` | - | 自定义分隔图标 |
| data | `ICrumb[]` | - | 必填项，面包屑配置数据，ICrumb 结构见下表 |
| style | `object` | - | 自定义面包屑组件最外层样式 |
| onClick | `(data: ICrumb, event: React.MouseEvent \| React.KeyboardEvent) => void` | - | 面包屑点击事件的回调方法，data 为被点击项的原始数据 |
| itemStyle | `React.CSSProperties` | - | 项 style |
| sepratorStyle | `React.CSSProperties` | - | 分隔符 style |
| data-test-id | `string` | - | 测试用 id |
| version | `string` | - | 设置组件版本（影响样式类名） |
| theme | `string` | - | 设置组件主题 |

## ICrumb

| 字段 | 类型 | 说明 |
|------|------|------|
| url | `string` | 链接地址 |
| title | `string` | 面包屑项标题 |
| enable | `boolean` | 是否启用，默认为 true |
| icon | `string` | 图标 |
| style | `CSSProperties` | 项样式 |
| version | `string` | 版本 |
| theme | `string` | 主题 |

## 注意事项

- `data` 为必填属性，每项的 `title` 为必须字段
- `enable` 默认为 `true`，设为 `false` 时该项不可点击
- `seprator` 为分隔符文本，`splitIcon` 为分隔符图标，两者可配合使用
- `onClick` 回调的第一个参数为 `ICrumb` 对象（包含 url、title 等完整数据），而非仅 url
