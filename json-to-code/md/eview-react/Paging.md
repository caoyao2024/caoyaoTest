# Paging

**Import:** `import Paging from '@nce/eview-react/Paging'`

## 基本用法

### 数字列表分页

```tsx
import Paging from '@nce/eview-react/Paging'

function Example() {
  return (
    <Paging
      recordCount={200}
      pageSize={10}
      currentPage={1}
      onPageChange={(page) => console.log('page:', page)}
      onPageSizeChange={(size) => console.log('pageSize:', size)}
    />
  )
}
```

### 下拉框分页（select 模式）

```tsx
import Paging from '@nce/eview-react/Paging'

function Example() {
  return (
    <Paging
      recordCount={200}
      pageSize={10}
      currentPage={1}
      type="select"
      onPageChange={(page) => console.log('page:', page)}
    />
  )
}
```

### 显示选中行数与跳转

```tsx
import Paging from '@nce/eview-react/Paging'

function Example() {
  return (
    <Paging
      recordCount={500}
      pageSize={10}
      currentPage={1}
      enableSelectedCount
      selectedCount={3}
      enableGoInput
      onSelectedCountClick={() => console.log('selected count clicked')}
      onPageChange={(page) => console.log('page:', page)}
    />
  )
}
```

### 分页右对齐 + 自定义每页条数

```tsx
import Paging from '@nce/eview-react/Paging'

function Example() {
  return (
    <Paging
      recordCount={200}
      pageSize={20}
      currentPage={1}
      pageSizeOptions={[20, 50, 100]}
      splitPagination
      pageSizeDisp
      onPageChange={(page) => console.log('page:', page)}
      onPageSizeChange={(size) => console.log('pageSize:', size)}
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 设置多选下拉组件外层容器id |
| style | `React.CSSProperties` | - | 通过style属性控制组件的样式，作用组件的最外层div |
| className | `string` | - | 通过添加class的方式控制组件的样式，作用于组件的最外层div |
| recordCount | `number` | - | 总记录条数（必须） |
| recordCountDisp | `string` | - | 分页统计区域展示的总条数文本（替代 recordCount 显示，不影响页数计算） |
| pageSize | `number` | `10` | 单页大小，切换分页下拉框会改变 |
| currentPage | `number` | `1` | 当前页码，点击分页会切换 |
| splitPagination | `boolean` | `false` | 为 `true` 时分页控件右对齐（float: right） |
| pageSizeOptions | `number[]` | `[10, 20, 50, 100]` | 分页大小选项 |
| type | `'list' \| 'select'` | `'list'` | 分页类型：`list` 数字列表，`select` 下拉框 |
| popupDirection | `'top' \| 'bottom'` | `'bottom'` | 每页条数下拉框弹出方向 |
| selectWidth | `string` | - | 分页下拉选择框宽度 |
| enableSelectedCount | `boolean` | `false` | 是否显示"已选中行数"文本 |
| selectedCount | `string \| number` | `0` | 自定义已选中行数的数量 |
| onSelectedCountClick | `() => void` | - | 已选中行数被点击后的回调 |
| pageSizeDisp | `boolean` | `false` | 分页下拉后面是否显示"条/页"单位 |
| pagingCountContent | `React.ReactNode` | - | 自定义分页统计内容（设置后替代默认总条数与选中计数区域） |
| disableSelect | `boolean` | `false` | 是否禁用分页下拉选择框 |
| enableGoInput | `boolean` | `true` | 是否需要跳转输入框与跳转按钮（页数超过 7 页时生效） |
| zindex | `string` | - | 下拉选项 z-index 的设置 |
| disabled | `boolean` | `false` | 禁用整个分页组件 |
| showMorePage | `boolean` | - | 是否显示更多页（省略号阈值从 7 页扩展到 9 页） |
| selectVirtualScroll | `boolean` | - | select 模式下拉框是否启用虚拟滚动 |
| enablePageSizeAlways | `boolean` | - | select 模式下是否始终显示 pageSize 选择框 |
| enableGotoAlways | `boolean` | - | select 模式下是否始终显示跳转控件 |
| singlePageJump | `boolean` | - | select 模式下单页跳转（显示"当前页/总页"文本，不可点击） |
| enablePageJumpTrigger | `boolean` | - | 分页跳转时若 `onPageChange` 返回 `false` 则不跳转 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onPageChange | `(currentPage: number) => void \| boolean` | 点击切换页码时触发；若 `enablePageJumpTrigger=true`，返回 `false` 可阻止跳转 |
| onPageSizeChange | `(pageSize: number) => void` | 切换每页条数时触发 |
| onSelectedCountClick | `() => void` | 已选中行数文本被点击时触发 |

## Slots

| slot 名 | 说明 |
|---------|------|
| pagingCountContent | 自定义分页统计内容区域（替代默认的总条数 + 选中计数） |

## 注意事项

- Paging 对应 A2UI 的 Paging 组件
- `recordCount` 为必传属性，总页数计算为 `Math.ceil(recordCount / pageSize)`
- `type='list'` 模式下显示数字页码列表，页数超过阈值时显示省略号（默认 7 页以内无省略号，`showMorePage=true` 扩展到 9 页）
- `type='select'` 模式下使用下拉框切换页码，显示"当前页/总页"格式
- `enableGoInput` 仅在 `type='list'` 模式且页数超过阈值或 `enableGotoAlways=true` 时展示跳转输入框
- `enablePageJumpTrigger` 开启后，`onPageChange` 返回 `false` 会阻止页码跳转（适用于前后翻页、页码点击、跳转按钮三种操作）
- `splitPagination=true` 将分页控件浮动到右侧
- 组件使用 Class Component 实现，内部维持 `currentPage` / `pageSize` / `pageCount` 等状态
