import { describe, it, expect } from 'vitest'
import { createSegmentedMapping } from '../../../api/config/mappings/eview-react/Segmented'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Segmented → SelectCard 映射
// ═══════════════════════════════════════════════════════════════════

describe('Segmented mapping', () => {
  const mapping = createSegmentedMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=SelectCard；import 路径', () => {
    expect(mapping.tag).toBe('SelectCard')
    expect(mapping.import).toBe(`${PKG}/SelectCard`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 'a' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('a')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange，transform raw??""', () => {
    const b = absBinding('seg')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.transform('x')).toBe('x')
    expect(v.transform(null)).toBe('')
  })

  it('options 字面量 → data：label→text + 简单值展开 + icon 丢弃', () => {
    expect(transform({ options: ['x', { label: 'Y', value: 'y', icon: 'plus' }] }).props!.data).toEqual([
      { text: 'x', value: 'x' },
      { text: 'Y', value: 'y' },
    ])
  })

  it('options DataBinding → data ComputedValue（transform 内做 label→text）', () => {
    const b = absBinding('opts')
    const d = transform({ options: b }).props!.data as any
    expect(d.type).toBe('computed')
    expect(d.path).toBe(b.path)
    expect(d.transform([{ label: 'A', value: 'a' }])).toEqual([{ text: 'A', value: 'a' }])
    expect(d.transform('not-array')).toEqual([])
  })

  it('size → type：small→small，medium/large→default', () => {
    expect(transform({ size: 'small' }).props!.type).toBe('small')
    expect(transform({ size: 'medium' }).props!.type).toBe('default')
    expect(transform({ size: 'large' }).props!.type).toBe('default')
  })

  it('disabled → disable；orientation/block 丢弃；className 透传', () => {
    const r = transform({ disabled: true, orientation: 'vertical', block: true, className: 'seg' })
    expect(r!.props!.disable).toBe(true)
    expect('orientation' in r!.props!).toBe(false)
    expect('block' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('seg')
    expect(r!.children).toBeNull()
  })
})
