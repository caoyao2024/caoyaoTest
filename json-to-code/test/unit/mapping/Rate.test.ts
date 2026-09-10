import { describe, it, expect } from 'vitest'
import { createRateMapping } from '../../../api/config/mappings/eview-react/Rate'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Rate → Rating 映射
// ═══════════════════════════════════════════════════════════════════

describe('Rate mapping', () => {
  const mapping = createRateMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=Rating；import 路径', () => {
    expect(mapping.tag).toBe('Rating')
    expect(mapping.import).toBe(`${PKG}/Rating`)
  })

  it('value 字面量 → LiteralValue.useState(onClick，extractor (val)=>setter(val))', () => {
    const v = transform({ value: 3 }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe(3)
    expect(v.useState.event).toBe('onClick')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onClick，transform Number(raw)??0)', () => {
    const b = absBinding('rate')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.useState.event).toBe('onClick')
    expect(v.transform('5')).toBe(5)
    // Number(undefined) === NaN；?? 只兜 null/undefined，不兜 NaN，故 NaN 原样透出（映射实际行为）
    expect(v.transform(undefined)).toBeNaN()
  })

  it('count 字面量 → starCount（val ?? 5）', () => {
    expect(transform({ count: 7 }).props!.starCount).toBe(7)
    expect(transform({ count: undefined }).props!.starCount).toBe(5)
  })

  it('count DataBinding → starCount 原样 BindingValue 透传（只改名）', () => {
    const b = absBinding('cnt')
    const s = transform({ count: b }).props!.starCount as any
    expect(s.type).toBe('binding')
    expect(s.path).toBe(b.path)
  })

  it('size small/medium/large → 14/20/26', () => {
    expect(transform({ size: 'small' }).props!.size).toBe(14)
    expect(transform({ size: 'medium' }).props!.size).toBe(20)
    expect(transform({ size: 'large' }).props!.size).toBe(26)
  })

  it('disabled 透传；allowClear 丢弃；className 透传', () => {
    const r = transform({ disabled: true, allowClear: true, className: 'rt' })
    expect(r!.props!.disabled).toBe(true)
    expect('allowClear' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('rt')
    expect(r!.children).toBeNull()
  })
})
