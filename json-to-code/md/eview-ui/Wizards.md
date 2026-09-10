# Wizards 步骤条

**Import:** `import Wizards from '@cloudsop/eview-ui/Wizards'`

## 基本用法

### 基础步骤条

```tsx
import Wizards from '@cloudsop/eview-ui/Wizards'

function Example() {
  const data = [
    { text: '基本信息', value: '1' },
    { text: '条件设置', value: '2' },
    { text: '操作确认', value: '3' }
  ]
  return <Wizards currentStep="1" data={data} />
}
```

### 带辅助文本

```tsx
import Wizards from '@cloudsop/eview-ui/Wizards'

function Example() {
  const data = [
    { text: '基本信息', value: '1', description: '填写基础信息' },
    { text: '条件设置', value: '2', description: '设置筛选条件' },
    { text: '操作确认', value: '3', description: '确认并提交' }
  ]
  return <Wizards currentStep="2" data={data} />
}
```

### 自定义步骤条

```tsx
import Wizards from '@cloudsop/eview-ui/Wizards'

function Example() {
  const data = [
    { text: '步骤一', value: '1', iconName: 'success' },
    { text: '步骤二', value: '2', customIcon: './step2.png' },
    { text: '步骤三', value: '3', status: 'error' }
  ]
  return (
    <Wizards
      currentStep="2"
      data={data}
      isCustomStep
      size="medium"
      customDescription={() => <span>自定义辅助内容</span>}
    />
  )
}
```


## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 外层容器 id |
| style | `React.CSSProperties` | - | 外层容器样式 |
| className | `string` | - | 外层容器 class |
| currentStep | `T` | - | 当前进行到的步骤，对应 data 中的 value 值，默认为第一步 |
| disabled | `boolean` | - | 是否禁用 |
| data | `Array<WizardData<T>>` | - | 导航内容，不配置 value 时序号默认为 1、2、3... |
| onClick | `(event: React.MouseEvent) => void` | - | 步骤点击回调 |
| version | `string` | - | 支持通过 version 设置组件版本 |
| theme | `string` | - | 支持通过 theme 设置组件主题 |
| isCustomStep | `boolean` | `false` | 是否自定义步骤条 |
| descriptionStyle | `React.CSSProperties` | - | 可以设置所有辅助文本样式，注意设置 maxwidth 要适配不同分辨率 |
| titleStyle | `React.CSSProperties` | - | 可以设置标题的样式 |
| size | `string` | `'medium'` | 设置步骤条尺寸，配置值 'large'（大）、'medium'（中）、'small'（小）、'mini'（最小） |
| orientation | `string` | - | 设置步骤条方向，包括水平与垂直，配置值 'horizontal'（水平）、'vertical'（垂直） |
| isArrowType | `boolean` | `false` | 是否支持箭头型步骤条，仅支持水平 |
| isBacktrackable | `boolean` | `false` | 是否回溯步骤，仅箭头型步骤条支持（需业务限制中间无跳过步骤），且 data 中的 value 为主键不重复 |
| customDescription | `() => ReactNode` | - | 支持自定义辅助文本（仅自定义步骤条，配置自定义函数），同时配置 description 仅 customDescription 生效 |

## data 属性

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | `string` | - | 步骤标题 |
| value | `T` | - | 步骤 value |
| description | `string` | - | 辅助文本内容（可选） |
| iconName | `string` | - | 使用 icon 图标库已有的图标，参考 icon 组件 |
| customIcon | `string` | - | 使用本地的 icon，customIcon 与 iconName 同时使用时 customIcon 生效 |
| status | `string` | - | 步骤状态，目前仅支持 `'error'`，表示错误状态 |
| onStepClick | `(event: React.MouseEvent) => void` | - | 步骤选中事件，可以设置点击选中 |

## 注意事项

- Wizards 对应 A2UI 的 Steps 组件
- 组件使用 Class Component 实现，支持泛型 `T`（value 类型）
- `data` 中每项的 `value` 为主键，不可重复
- `customDescription` 仅在 `isCustomStep=true` 时生效
- `isArrowType` 仅支持水平方向
- eview-ui 的 Wizards 接口包含 `onClick`、`version`、`theme`、`customDescription` 等属性（旧文档分散在多个表格中，现已统一）