# Steps

**Import:** `import Steps from '@nce/eview-react/Steps'`

## 基本用法

### 基础步骤条

```tsx
import Steps from '@nce/eview-react/Steps'

function Example() {
  const [currentStep, setCurrentStep] = React.useState(1)

  const data = [
    { text: '第一步', value: 0, description: '填写基本信息' },
    { text: '第二步', value: 1, description: '确认配置' },
    { text: '第三步', value: 2, description: '完成部署' },
  ]

  const handleClick = (index: any) => {
    setCurrentStep(index)
  }

  return (
    <Steps
      currentStep={currentStep}
      data={data}
      onClick={handleClick}
    />
  )
}
```

### 垂直步骤条

```tsx
import Steps from '@nce/eview-react/Steps'

function Example() {
  const data = [
    { text: '创建项目', value: 0, description: '选择项目模板' },
    { text: '配置参数', value: 1, description: '设置运行参数', status: 'error' },
    { text: '部署上线', value: 2, description: '发布到生产环境' },
  ]

  return (
    <Steps
      currentStep={1}
      data={data}
      direction="vertical"
      labelPlacement="horizontal"
    />
  )
}
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| id | `string` | - | 组件 id |
| style | `React.CSSProperties` | - | 自定义样式 |
| className | `string` | - | 自定义类名 |
| currentStep | `string \| number` | `0` | 当前步骤（匹配 data 中的 value） |
| disabled | `boolean` | `false` | 禁用状态 |
| data | `WizardData[]`（必填） | - | 步骤数据数组 |
| wizardTextStyle | `React.CSSProperties` | - | 步骤文本样式 |
| labelPlacement | `'vertical' \| 'horizontal'` | `'vertical'` | 标签放置位置 |
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | 步骤条方向 |

## WizardData（data 数据项）

| 属性名 | 类型 | 说明 |
|--------|------|------|
| className | `string` | 步骤类名 |
| text | `string` | 步骤标题 |
| description | `string \| React.ReactNode` | 步骤描述 |
| iconUrl | `string \| React.ReactElement` | 自定义图标 |
| value | `string \| number` | 步骤值/标识 |
| status | `string` | 状态（如 'error'） |
| onStepClick | `(event: React.MouseEvent) => void` | 步骤点击处理 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onClick | `(index: any)` | 步骤点击回调 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 数据通过 data prop 传入，不支持 children slot |

## 注意事项

- 步骤数据通过 `data` prop 传入，不是通过子组件方式
- `currentStep` 匹配 data 中的 `value` 字段，不是数组索引
- `direction='vertical'` 为垂直方向，`direction='horizontal'` 为水平方向
- `labelPlacement='vertical'` 时标题在图标下方，`labelPlacement='horizontal'` 时标题在图标右侧
- data 中的 `status='error'` 可标记该步骤为错误状态
- data 中的 `onStepClick` 可为单个步骤设置独立的点击处理