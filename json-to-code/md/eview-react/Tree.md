# Tree

**Import:** `import Tree from '@nce/eview-react/Tree'`

## 基本用法

### 基础树

```tsx
import Tree from '@nce/eview-react/Tree'

function Example() {
  const [selectedKeys, setSelectedKeys] = React.useState([])

  const data = [
    {
      text: '根节点',
      id: '1',
      children: [
        {
          text: '子节点1',
          id: '1-1',
          children: [
            { text: '叶子1', id: '1-1-1', isLeaf: true },
            { text: '叶子2', id: '1-1-2', isLeaf: true },
          ],
        },
        { text: '子节点2', id: '1-2', isLeaf: true },
      ],
    },
  ]

  const handleSelect = (keys, node, event) => {
    setSelectedKeys(keys)
  }

  return (
    <Tree
      data={data}
      expandedKeys={['1', '1-1']}
      selectedKeys={selectedKeys}
      onSelect={handleSelect}
    />
  )
}
```

### 带勾选与拖拽

```tsx
import Tree from '@nce/eview-react/Tree'

function Example() {
  const [checkedKeys, setCheckedKeys] = React.useState([])

  const data = [
    {
      text: '根节点',
      id: '1',
      children: [
        { text: '节点A', id: '1-1' },
        { text: '节点B', id: '1-2' },
        { text: '节点C', id: '1-3' },
      ],
    },
  ]

  return (
    <Tree
      data={data}
      expandAll
      enableCheckbox
      checkedKeys={checkedKeys}
      onCheck={(keys) => setCheckedKeys(keys)}
      draggable
      connectLine
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件唯一标识 |
| data | `any[]` | - | 树节点数据（必填） |
| nodeKey | `string` | `'id'` | 节点标识属性名 |
| style | `React.CSSProperties` | - | 最外层 div 样式 |
| className | `string` | - | 最外层 div 类名 |
| disabled | `boolean` | `false` | 禁用组件 |
| enableCheckbox | `boolean` | `false` | 是否显示勾选框 |
| selectBoxType | `'check' \| 'radio'` | `'check'` | 勾选框类型 |
| radioSelectMode | `string` | `'level'` | radio 选中方式 |
| checkWhenSelect | `boolean` | `true` | 选中节点是否同时触发勾选 |
| selectTriggerCheck | `boolean` | `true` | 节点点击选中是否触发复选框选中 |
| enableMultiSelect | `boolean` | `true` | 是否支持多选 |
| selectedKeys | `any[]` | - | 默认选中节点 key 数组 |
| checkedKeys | `any[]` | - | 默认勾选节点 key 数组（需 enableCheckbox=true） |
| radioKey | `any` | - | 默认选中 radio 的 key |
| expandedKeys | `any[]` | - | 默认展开节点 key 数组 |
| expandAll | `boolean` | `false` | 展开全部节点 |
| cancelAll | `boolean` | `false` | 关闭全部节点 |
| enableMultiExpand | `boolean` | `true` | 是否允许同级节点多个展开 |
| radioCancelable | `boolean` | `false` | radio 模式下点击是否取消选中 |
| disabledLinkage | `boolean` | `true` | 子节点置灰时勾选是否与父节点联动 |
| disabelCheckAssociated | `boolean` | `true` | 父子节点选中状态是否联动 |
| enableSelectWithHideRootCheckbox | `boolean` | `true` | 隐藏根节点复选框后是否仍支持 select |
| iconLeaf | `string \| React.ReactElement` | - | 叶子节点图标 |
| iconLeafArr | `any[]` | - | 叶子节点展开图标数组（与 iconLeaf 互斥） |
| iconExpanded | `string \| React.ReactElement` | - | 非叶子节点展开时图标 |
| iconCollapsed | `string \| React.ReactElement` | - | 非叶子节点收起时图标 |
| iconLeafClassName | `string` | - | 叶子节点图标类名 |
| iconExpandedClassName | `string` | - | 展开节点图标类名 |
| iconCollapsedClassName | `string` | - | 收起节点图标类名 |
| iconLeafArrClassName | `string[]` | - | 叶子节点多图标各自类名 |
| showRightIcon | `string \| React.ReactElement` | - | 节点文本右侧图标 |
| showRightIconArr | `string[] \| React.ReactElement[]` | - | 节点文本右侧多个图标（优先级高于 showRightIcon） |
| showRightIconArrClassName | `string[]` | - | 右侧多图标各自类名 |
| treeNodeSuffix | `React.ReactElement` | - | 节点右侧自定义后缀（全局配置，可在 data 中单独配置） |
| treeNodePrefix | `React.ReactElement` | - | 节点左侧自定义前缀（全局配置，可在 data 中单独配置） |
| nodeSuffixTrigger | `'default' \| 'hover'` | `'default'` | 节点右侧后缀展示方式，default 直接显示，hover 划入显示 |
| selectedAlwaysShow | `boolean` | `false` | hover 模式下节点选中时是否长显后缀 |
| treeNodeStyle | `any` | - | 节点样式（可在 data 中单独配置） |
| treeTextStyle | `React.CSSProperties` | - | 节点文本样式（可在 data 中单独配置） |
| focusNode | `object` | - | 聚焦节点，如 `{ key: '1-1' }` |
| enableScroll | `boolean` | `false` | 是否启用水平滚动 |
| lazyLoad | `boolean` | `false` | 未展开的子项不渲染 DOM（优化大量节点性能） |
| draggable | `boolean` | `false` | 节点是否可拖拽 |
| superLevel | `boolean` | `false` | 超多级树节点，外层容器不足时使用 |
| connectLine | `boolean` | `false` | 是否显示节点之间的连线 |
| height | `number` | - | 视口高度，启用虚拟滚动（仅支持 number 像素值） |
| loadData | `(itemData: any, callback: any) => void` | - | 异步加载数据（onExpand 且节点为收起态时触发） |
| onRef | `Function` | - | 子组件 expandedKeys 改变回传 |

## data 节点数据结构

| 属性名 | 类型 | 说明 |
|--------|------|------|
| text | `string` | 节点文本（必填） |
| id | `string` | 节点标识（必填） |
| expanded | `boolean` | 节点展开状态（权重高于 expandedKeys） |
| isLeaf | `boolean` | 是否为叶子节点 |
| children | `any[]` | 子节点数组 |
| tip | `string` | 节点提示 |
| icon | `string \| React.ReactElement` | 节点图标 |
| iconExpanded | `string \| React.ReactElement` | 展开时图标（覆盖全局配置） |
| iconCollapsed | `string \| React.ReactElement` | 收起时图标（覆盖全局配置） |
| iconLeaf | `string \| React.ReactElement` | 叶子节点图标（覆盖全局配置） |
| showRightIcon | `string \| React.ReactElement` | 右侧图标（覆盖全局配置） |
| showRightIconArr | `string[] \| React.ReactElement[]` | 右侧多图标（覆盖全局配置） |
| treeNodeSuffix | `React.ReactElement` | 节点右侧后缀（覆盖全局配置） |
| treeNodePrefix | `React.ReactElement` | 节点左侧前缀（覆盖全局配置） |
| treeNodeStyle | `any` | 节点样式（覆盖全局配置） |
| hideRootCheckbox | `boolean` | 是否隐藏该节点复选框 |
| draggable | `boolean` | 该节点是否可拖拽（覆盖全局配置） |
| show | `boolean` | 该节点是否展示 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onSelect | `(selectedKeys: any[], node: any, event: React.MouseEvent) => void` | 节点单击选中回调 |
| onCheck | `(checkedKeys: any[], node: any, checkedNodeArr?: TreeNode[]) => void` | 节点勾选/去选回调（需 enableCheckbox=true） |
| onExpand | `(expandedKeys: any[], node: any) => void` | 节点展开/折叠回调（仅非叶子节点触发） |
| onNodeDoubleClick | `(eventKey: string \| number, node: any, event: React.MouseEvent) => void` | 节点双击回调 |
| onNodeRightClick | `(node: any, event: React.MouseEvent) => void` | 节点右键回调 |
| onClickRightIcon | `(node: any, event: React.MouseEvent) => void` | 右侧图标点击回调 |
| onDragStart | `(event: React.DragEvent, node?: any, dragKey?: number) => void` | 拖拽开始回调 |
| onDragEnd | `(event: React.DragEvent, node?: any, dragKey?: number) => void` | 拖拽结束回调 |
| onDragEnter | `(event: React.DragEvent, node?: any, dragKey?: number) => void` | 拖拽进入目标回调 |
| onDragOver | `(event: React.DragEvent, node?: any, dragKey?: number) => void` | 拖拽悬停目标回调 |
| onDragLeave | `(event: React.DragEvent, node?: any, dragKey?: number) => void` | 拖拽离开目标回调 |
| onDrop | `(event: React.DragEvent, node?: any, dragType?: string) => void` | 拖拽释放回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，不支持 children slot |

## 注意事项

- Tree 对应 A2UI 的 Tree 组件
- 数据通过 `data` prop 传入，不是通过子组件方式
- `enableCheckbox=true` 显示勾选框，`selectBoxType` 可切换 checkbox/radio 模式
- `disabelCheckAssociated=false` 可取消父子节点选中联动（注意属性名拼写）
- `lazyLoad=true` 优化大量节点性能，未展开的子节点不渲染 DOM
- `draggable=true` 启用拖拽，配合 onDragStart/onDrop 等事件使用
- `connectLine=true` 显示节点间连线
- `height` 传入数字像素值启用虚拟滚动
- `loadData` 用于异步加载子节点数据
- data 中各节点可单独配置 icon、treeNodeSuffix、treeNodePrefix 等属性，权重高于全局配置