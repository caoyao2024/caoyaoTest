# Empty

**Import:** `import Empty from '@nce/eview-react/Empty'`

## 基本用法

### 默认空状态

```tsx
import Empty from '@nce/eview-react/Empty'

function Example() {
  return (
    <div>
      <Empty />
      <Empty type="success" />
    </div>
  )
}
```

### 自定义描述与图片

```tsx
import Empty from '@nce/eview-react/Empty'

function Example() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Empty description="暂无订单数据" />
      <Empty imgSrc="/empty.svg" description="未找到相关内容" />
      <Empty icon={<span className="custom-icon" />} description="自定义图标" />
    </div>
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| style | `CSSProperties` | - | 组件最外层内联样式 |
| className | `string` | - | 自定义类名 |
| description | `ReactNode` | 国际化默认文本 | 描述文本，未设置时根据 type 显示默认描述 |
| icon | `ReactNode` | - | 自定义图标（优先级高于默认图标和 imgSrc） |
| imgSrc | `string` | - | 自定义图片 URL（优先级高于默认图标，低于 icon） |
| type | `'success' \| 'fail'` | `'fail'` | 预设空状态类型：`fail` 显示失败图标+"暂无数据"，`success` 显示成功图标+"数据为0" |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| 无 | - | Empty 组件无事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 内容通过 props 传入，不支持 children slot |

## 注意事项

- `type` 决定默认图标和默认描述文本，`fail` 对应"暂无数据"，`success` 对应"数据为0"
- 图标显示优先级：`icon` > `imgSrc` > 默认图标（由 type 决定）
- 描述文本优先级：`description` > 国际化默认文本（由 type 决定）
- 默认描述文本支持国际化（通过 FormUtil.formatMessage），中文："暂无数据"/"数据为0"，英文："No records found."/"Data is 0."
- 组件使用 `memo` + `forwardRef` 包裹，支持 ref 转发，displayName 为 `'Empty'`