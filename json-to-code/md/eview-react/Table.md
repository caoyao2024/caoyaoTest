# Table

**Import:** `import Table from '@nce/eview-react/Table'`

## 基本用法

### 基础数据表格

```tsx
import Table from '@nce/eview-react/Table'

function Example() {
  const columns = [
    { key: 'name', title: '姓名', width: 120 },
    { key: 'age', title: '年龄', width: 80, align: 'center' },
    { key: 'address', title: '地址', width: 200 },
  ]

  const dataset = [
    { name: '张三', age: 28, address: '北京市' },
    { name: '李四', age: 32, address: '上海市' },
    { name: '王五', age: 25, address: '广州市' },
  ]

  return (
    <Table
      columns={columns}
      dataset={dataset}
      enablePagination
      pageSize={10}
    />
  )
}
```

### 可选择、可编辑的表格

```tsx
import Table from '@nce/eview-react/Table'

function Example() {
  const [checkedRows, setCheckedRows] = React.useState([])

  const columns = [
    { key: 'id', title: 'ID', width: 60, align: 'center' },
    { key: 'name', title: '名称', width: 150 },
    {
      key: 'status',
      title: '状态',
      width: 120,
      renderType: 'select',
      options: [
        { text: '启用', value: 'enabled' },
        { text: '禁用', value: 'disabled' },
      ],
      isEditable: true,
    },
    {
      key: 'action',
      title: '操作',
      width: 100,
      render: (cellValue, rowData) => <button>编辑</button>,
    },
  ]

  const dataset = [
    { id: 1, name: '项目A', status: 'enabled' },
    { id: 2, name: '项目B', status: 'disabled' },
  ]

  return (
    <Table
      columns={columns}
      dataset={dataset}
      checkedRows={checkedRows}
      enableCheckBox
      checkType="multi"
      onRowCheck={(row, checkedRows) => setCheckedRows(checkedRows)}
      onEdit={(oldval, newVal, cell, row) => {
        console.log('编辑:', oldval, '->', newVal)
      }}
      bordered
      enableZebraCrossing
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 表格 id |
| columns | `ColumnProps[]` | - | 列定义 |
| dataset | `any[]` | - | 行数据 |
| pagingType | `'list' \| 'select'` | - | 分页类型 |
| className | `string` | - | 表格类名 |
| height | `number \| string` | - | 表格高度 |
| width | `number \| string` | - | 表格宽度 |
| selectedRowIndex | `number \| number[]` | - | 选中行 |
| checkedRows | `(string \| number)[]` | - | 勾选行 ID |
| preserveCheckedRows | `boolean` | - | 跨页保持勾选 |
| enablePagination | `boolean` | - | 启用分页 |
| enableAutoPaging | `boolean` | - | 启用自动分页 |
| pagingProps | `PagingProps` | - | 分页组件 props |
| enableColumnDrag | `boolean` | - | 启用列拖拽 |
| enableColumnFilter | `boolean` | - | 启用列筛选 |
| enableCheckBox | `boolean` | - | 启用复选框列 |
| checkType | `'multi' \| 'single'` | - | 复选框类型 |
| enableRowExpand | `boolean` | - | 启用行展开 |
| enableMulitiExpand | `boolean` | - | 允许多行展开 |
| pageSize | `number` | - | 每页条数 |
| recordCount | `number` | - | 总记录数 |
| currentPage | `number` | - | 当前页码 |
| pageSizeOptions | `number[]` | - | 每页条数选项 |
| maxHeight | `number \| string` | - | 最大高度 |
| minHeight | `number \| string` | - | 最小高度 |
| emptyTableMsg | `string` | - | 空表格提示 |
| showEmptyImage | `boolean` | - | 显示空状态图片 |
| disableRowIds | `(number \| string)[]` | - | 禁用行 ID |
| disableCheckboxIds | `(number \| string)[]` | - | 禁用复选框行 ID |
| mutiSelectEnable | `boolean` | - | 多选 |
| groupHeaders | `any[]` | - | 分组表头配置 |
| thirdHeaders | `any[]` | - | 三级表头 |
| enableShowLineNumber | `boolean` | - | 显示行号 |
| virtualScroll | `boolean` | - | 虚拟滚动 |
| virtualShowNum | `number` | - | 虚拟滚动显示数量 |
| rowKey | `string` | - | 数据主键字段 |
| bordered | `boolean` | - | 显示边框 |
| enableZebraCrossing | `boolean` | - | 斑马纹 |
| freezeColPosition | `'left' \| 'right'` | - | 冻结列位置 |
| enableLoading | `boolean` | - | 加载状态 |
| enableSort | `boolean` | - | 启用排序 |
| keepTableWidthAfterDragging | `boolean` | - | 列拖拽后保持表格宽度 |
| enableHorizontalScrollByWheel | `boolean` | - | 鼠标滚轮水平滚动 |

## ColumnProps

| 属性名 | 类型 | 说明 |
|--------|------|------|
| key | `string` | 列 key |
| id / cid | `string \| number` | 列 id |
| title | `number \| string \| React.ReactNode` | 列标题 |
| titleTipShow | `string` | 标题提示显示 |
| titleTipData | `object` | 标题提示数据 |
| titleClassName | `string` | 标题类名 |
| width | `string \| number` | 列宽 |
| align | `'center' \| 'left' \| 'right'` | 文本对齐 |
| allowSort | `boolean` | 启用排序 |
| display | `boolean` | 列可见性 |
| displayPolicy | `string` | 'never' = 永久隐藏 |
| renderType | `RenderType` | 单元格渲染类型 |
| render | `(cellValue, rowData, options, row, idEdit) => any` | 自定义渲染函数 |
| options | `any` | 单元格选项（用于 select 等） |
| tipFormatter | `Function \| string` | 提示格式化 |
| freezeCol | `boolean` | 冻结列 |
| isMovable | `boolean` | 列可移动 |
| isEditable | `boolean` | 单元格可编辑 |
| validator | `(v: any) => boolean` | 单元格验证器 |
| sort | `'asc' \| 'desc' \| 'origin'` | 排序顺序 |
| filter | `object` | 筛选配置 |
| embeddedFilter | `object` | 内嵌筛选配置 |
| help | `HelpTipProps` | 帮助提示 |
| minWidth | `number` | 最小列宽 |
| maxWidth | `number` | 最大列宽 |
| customProps | `any` | 用户自定义组件属性 |
| disableOrderChange | `boolean` | 列不支持调整顺序 |
| isFiltered | `boolean` | 列是否已被过滤 |
| cellClassName | `string` | 单元格类名 |
| enableRowMoveUpDown | `boolean` | 支持行上移下移 |
| getCompareValue | `(v) => any` | 排序参数提取 |
| customSort | `boolean` | 列是否支持自定义排序 |

**RenderType:** `'check_box' | 'check_box_group' | 'date_picker' | 'time_selector' | 'progress_bar' | 'radio_group' | 'select' | 'input_select' | 'text_field' | 'custom'`

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onRowClick | `(row: any, event: Event)` | 行点击 |
| onRowMouseOut | `(event: any)` | 行鼠标移出 |
| onRowMouseOver | `(event: any, row: any)` | 行鼠标移入 |
| onRowCheck | `(row: any, checkedRows: (string\|number)[], e: Event)` | 行复选框勾选 |
| onHeaderCheck | `(checkedRows: any, checked: any, checkedRowsData: any)` | 表头复选框 |
| onEdit | `(oldval, newVal, cell, row, event)` | 单元格编辑 |
| onEditingCellBlur | `(cell, row)` | 编辑单元格失焦 |
| onPageChange | `(currentPage: number)` | 页码变化 |
| onPageSizeChange | `(pageSize: number)` | 每页条数变化 |
| onColumnSort | `(sortColumn, sortType: SortOrder)` | 列排序 |
| onColumnSorted | `(data: any)` | 排序完成后 |
| onRowExpend | `(row: any) => React.ReactNode` | 展开行内容 |
| onRowExpendClick | `(row: any)` | 行展开点击 |
| onRowRightClick | `(event: Event, row: any)` | 行右键点击 |
| onDoubleClick | `(evtRow, evtCell, nativeEvent)` | 单元格双击 |
| onCellClick | `(cCell, row, event)` | 单元格点击 |
| onColumnSizeChange | `(proColumn, columns?)` | 列宽变化 |
| onFilterOkClick | `(hideRow, displayRow, columns) => boolean` | 列筛选确认 |
| onFilterClosed | `(event, filterColumn)` | 筛选面板关闭 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 表格数据通过 columns + dataset props 传入 |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getSelectedRowData | `() => any[]` | 获取选中行数据 |
| getSelectedRowIndex | `() => string\|number\|(string\|number)[]` | 获取选中行索引 |
| getCheckedRowsData | `() => any[]` | 获取勾选行数据 |
| getCheckedRowsIndexes | `(preserveCheckedRows?) => (string\|number)[]` | 获取勾选行索引 |
| getDataset | `() => any[]` | 获取当前数据集 |
| getData | `() => any[]` | 获取详细数据集 |
| getColumns | `() => ColumnState[]` | 获取列信息 |
| setCheckedRows | `(checkedRows) => void` | 设置勾选行 |
| setSelectedRowIndex | `(index) => void` | 设置选中行 |
| setCurrentPage | `(page) => void` | 设置当前页码 |
| getCurrentPage | `() => number` | 获取当前页码 |
| getPageSize | `() => number` | 获取每页条数 |

## 注意事项

- 列定义通过 `columns` prop 传入，每列用 `ColumnProps` 配置
- `renderType` 支持多种内置单元格类型，`'custom'` 时使用 `render` 函数自定义渲染
- `enableCheckBox` + `checkType='multi'` 启用多选复选框列
- `virtualScroll` 适用于大数据量场景，配合 `virtualShowNum` 控制渲染数量
- `onRowExpend` 返回 ReactNode 作为展开行内容，而非事件回调
- 分页需要配合 `enablePagination`、`pageSize`、`recordCount`、`currentPage` 使用
- `freezeColPosition` 冻结列，配合 ColumnProps 的 `freezeCol=true` 使用