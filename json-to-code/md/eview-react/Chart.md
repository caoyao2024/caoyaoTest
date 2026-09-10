# Chart

**Import:** `import Chart from '@nce/eview-react/Chart'`

## 基本用法

### 声明式图表（推荐）

```tsx
import Chart from '@nce/eview-react/Chart'

function Example() {
  const option = {
    data: [
      { name: 'Category A', value: 100 },
      { name: 'Category B', value: 200 },
    ],
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
  }

  return (
    <Chart
      style={{ width: '100%', height: 400 }}
      option={option}
      name="BarChart"
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
| name | `string` | - | 支持的图表名称： 
`AreaChart`, 
`AssembleBubbleChart`, 
`BarChart`, 
`BoxplotChart`, 
`BubbleChart`, 
`BulletChart`, 
`CandlestickChart`, 
`FunnelChart`, 
`GaugeChart` ,
`GraphChart` ,
`GraphTreeChart`, 
`HeatMapChart`, 
`HillChart`, 
`JadeJueChart` ,
`LineChart`, 
`LiquidfillChart`, 
`PieChart`, 
`PolarBarChart`, 
`ProcessChart`, 
`RadarChart`,
`RegionChart`, 
`SankeyChart`, 
`ScatterChart`, 
`SunburstChart`, 
`TreeChart`, 
`TreeMapChart`, 
`WordCloudChart` |
| option | `any`（必填） | - | 图表配置项,根据name传入不同的图表配置option |
| onChartRendered | `(instance: any) => void` | - | 图表渲染完成回调 |
| loading | `boolean` | `false` | 显示加载状态 |
| plugins | `any` | `{}` | 图表插件 |
| notMerge | `boolean` | `false` | echarts notMerge 选项 |
| lazyUpdate | `boolean` | `false` | echarts lazyUpdate 选项 |
| onEvents | `{ [key: string]: (params: any) => void } \| null` | - | 事件处理器映射 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| onChartRendered | `(instance: any)` | 图表渲染完成回调 |
| onEvents | `{ [key: string]: (params: any) => void }` | 通过 onEvents prop 绑定 echarts 事件 |

## Slots

| slot 名 | 说明 |
|---------|------|
| 无 | 图表组件不支持 children slot |

## Public Methods

| 方法名 | 签名 | 说明 |
|--------|------|------|
| getEchartsInstance | `() => any` | 获取 echarts 实例 |
| on | `(...rest: any[]) => void` | 绑定事件 |
| off | `(...rest: any[]) => void` | 解绑事件 |
| resizeHandler | `() => void` | 调整图表尺寸 |

## 注意事项
- 图表容器必须设置明确的宽高，否则可能无法渲染