import { describe, it, expect } from 'vitest'
import { createChartMapping } from '../../../api/config/mappings/eview-react/Chart'
import { fakeCtx, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Chart 映射
// ═══════════════════════════════════════════════════════════════════

describe('Chart mapping', () => {
  const mapping = createChartMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag/import 与 MappingDef 一致', () => {
    expect(mapping.tag).toBe('Chart')
    expect(mapping.import).toBe(`${PKG}/Chart`)
  })

  it('name=node.component；option 注入 a2ui/theme/data 兜底；propRoute.option=module-top；selfClosing', () => {
    const r = transform({ component: 'BarChart', props: {} })
    const p = r!.props as any
    expect(p.name).toBe('BarChart')
    expect(p.option).toBeInstanceOf(Object)
    expect(p.option.a2ui).toBe(true)
    expect(p.option.theme).toBe('hdesign-light')
    expect(p.option.data).toEqual([])
    expect(r!.propRoute.option).toBe('module-top')
    expect(r!.selfClosing).toBe(true)
    expect(r!.children).toBeNull()
  })

  it('用户已设 theme 时不覆盖', () => {
    const r = transform({ component: 'BarChart', props: { option: { theme: 'dark' } } })
    expect((r!.props as any).option.theme).toBe('dark')
  })

  it('SPECIAL_YAXIS 图表（BarChart）：yAxisTitle→yAxis.name，yAxisTitle 被删除', () => {
    const r = transform({
      component: 'BarChart',
      props: { option: { yAxisTitle: 'My Y' } },
    })
    const opt = (r!.props as any).option
    expect(opt.yAxis.name).toBe('My Y')
    expect('yAxisTitle' in opt).toBe(false)
  })

  it('非 SPECIAL_YAXIS 图表（PieChart）：yAxisTitle 原样保留在 option（不转 yAxis.name）', () => {
    const r = transform({
      component: 'PieChart',
      props: { option: { yAxisTitle: 'Y' } },
    })
    const opt = (r!.props as any).option
    expect(opt.yAxisTitle).toBe('Y')
    expect(opt.yAxis).toBeUndefined()
  })

  it('className / id 透传', () => {
    const r = transform({ component: 'BarChart', props: { className: 'c', id: 'chart1' } })
    const p = r!.props as any
    expect(p.className).toBe('c')
    expect(p.id).toBe('chart1')
  })
})
