import { describe, it, expect } from 'vitest'
import { createBadgeMapping } from '../../../api/config/mappings/eview-react/Badge'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Badge 映射
// ═══════════════════════════════════════════════════════════════════

describe('Badge mapping', () => {
  const mapping = createBadgeMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import 与 MappingDef 一致', () => {
    expect(mapping.tag).toBe('Badge')
    expect(mapping.import).toBe(`${PKG}/Badge`)
  })

  it('count 字面量 → content', () => {
    expect(transform({ count: 5 }).props!.content).toBe(5)
  })

  it('count DataBinding → content 保持原样（纯改名）', () => {
    const b = absBinding('total')
    const r = transform({ count: b })
    expect(r!.props!.content).toBe(b)
  })

  it('overflowCount → max', () => {
    expect(transform({ overflowCount: 99 }).props!.max).toBe(99)
  })

  it('status 值映射：processing→default，其余同名，未知原样透传', () => {
    expect(transform({ status: 'processing' }).props!.status).toBe('default')
    expect(transform({ status: 'success' }).props!.status).toBe('success')
    expect(transform({ status: 'error' }).props!.status).toBe('error')
    expect(transform({ status: 'warning' }).props!.status).toBe('warning')
    expect(transform({ status: 'weird' }).props!.status).toBe('weird')
  })

  it('color → badgeStyle.backgroundColor', () => {
    expect(transform({ color: '#f00' }).props!.badgeStyle).toEqual({ backgroundColor: '#f00' })
  })

  it('dot / offset / showZero 透传', () => {
    const p = transform({ dot: true, offset: [2, 3], showZero: false }).props!
    expect(p.dot).toBe(true)
    expect(p.offset).toEqual([2, 3])
    expect(p.showZero).toBe(false)
  })

  it('className 透传', () => {
    expect(transform({ className: 'bdg' }).props!.className).toBe('bdg')
  })
})
