import { describe, it, expect } from 'vitest'
import { createPaginationMapping } from '../../../api/config/mappings/eview-react/Pagination'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Pagination 映射
// ═══════════════════════════════════════════════════════════════════

describe('Pagination mapping', () => {
  const mapping = createPaginationMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=Paging；import 路径', () => {
    expect(mapping.tag).toBe('Paging')
    expect(mapping.import).toBe(`${PKG}/Paging`)
  })

  it('current 字面量 → currentPage LiteralValue.useState(onPageChange)', () => {
    const v = transform({ current: 3 }).props!.currentPage as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe(3)
    expect(v.useState.event).toBe('onPageChange')
    expect(v.useState.extractor('set')).toBe('(page) => set(page)')
  })

  it('current DataBinding → currentPage ComputedValue.useState(onPageChange)', () => {
    const b = absBinding('page')
    const v = transform({ current: b }).props!.currentPage as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
  })

  it('total 字面量 → recordCount；total DataBinding → recordCount 改名 BindingValue', () => {
    expect(transform({ total: 100 }).props!.recordCount).toBe(100)
    const b = absBinding('total')
    const rc = transform({ total: b }).props!.recordCount as any
    expect(rc.type).toBe('binding')
    expect(rc.path).toBe(b.path)
  })

  it('simple:true→type:select；simple:false→不设 type；simple DataBinding→ComputedValue', () => {
    expect(transform({ simple: true }).props!.type).toBe('select')
    expect('type' in transform({ simple: false }).props!).toBe(false)
    const b = absBinding('simple')
    expect((transform({ simple: b }).props!.type as any).type).toBe('computed')
  })

  it('showTotal 丢弃；className 透传；propRoute.currentPage=component-internal', () => {
    const r = transform({ current: 1, showTotal: true, className: 'pg' })
    expect('showTotal' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('pg')
    expect(r!.propRoute.currentPage).toBe('component-internal')
    expect(r!.children).toBeNull()
  })
})
