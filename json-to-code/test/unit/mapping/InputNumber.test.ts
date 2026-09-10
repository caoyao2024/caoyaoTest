import { describe, it, expect } from 'vitest'
import { createInputNumberMapping } from '../../../api/config/mappings/eview-react/InputNumber'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// InputNumber 映射
// ═══════════════════════════════════════════════════════════════════

describe('InputNumber mapping', () => {
  const mapping = createInputNumberMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=Spinner；import 路径', () => {
    expect(mapping.tag).toBe('Spinner')
    expect(mapping.import).toBe(`${PKG}/Spinner`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 5 }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe(5)
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('num')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
  })

  it('min / max / step 透传；controls/size/placeholder 丢弃', () => {
    const r = transform({ min: 0, max: 100, step: 5, controls: false, size: 'large', placeholder: 'p' })
    expect(r!.props!.min).toBe(0)
    expect(r!.props!.max).toBe(100)
    expect(r!.props!.step).toBe(5)
    expect('controls' in r!.props!).toBe(false)
    expect('size' in r!.props!).toBe(false)
    expect('placeholder' in r!.props!).toBe(false)
  })

  it('className 透传；children=null', () => {
    const r = transform({ className: 'sp' })
    expect(r!.props!.className).toBe('sp')
    expect(r!.children).toBeNull()
  })
})
