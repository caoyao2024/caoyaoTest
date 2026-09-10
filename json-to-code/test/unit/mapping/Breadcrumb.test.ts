import { describe, it, expect } from 'vitest'
import { createBreadcrumbMapping } from '../../../api/config/mappings/eview-react/Breadcrumb'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Breadcrumb 映射
// ═══════════════════════════════════════════════════════════════════

describe('Breadcrumb mapping', () => {
  const mapping = createBreadcrumbMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=Crumbs（非笔误，文档如此）', () => {
    expect(mapping.tag).toBe('Crumbs')
    expect(mapping.import).toBe(`${PKG}/Crumbs`)
  })

  it('items 字面量 → data：过滤 type=reference/separator 项 + 删 type/separator 字段', () => {
    const r = transform({
      items: [
        { title: '首页', type: 'reference' },
        { title: '列表' },
        { title: '/', type: 'separator' },
        { title: '详情', separator: '>' },
      ],
    })
    expect(r!.props!.data).toEqual([{ title: '列表' }, { title: '详情' }])
  })

  it('items DataBinding → data 是 ComputedValue（containsJSX:false）', () => {
    const b = absBinding('crumbs')
    const r = transform({ items: b })
    expect((r!.props!.data as any).type).toBe('computed')
    expect((r!.props!.data as any).containsJSX).toBe(false)
  })

  it('separator 字面量 → seprator（改名）', () => {
    expect(transform({ separator: '/' }).props!.seprator).toBe('/')
  })

  it('separator DataBinding → seprator 保持原样', () => {
    const b = absBinding('sep')
    expect(transform({ separator: b }).props!.seprator).toBe(b)
  })

  it('className 透传；children=null', () => {
    const r = transform({ className: 'bc' })
    expect(r!.props!.className).toBe('bc')
    expect(r!.children).toBeNull()
  })
})
