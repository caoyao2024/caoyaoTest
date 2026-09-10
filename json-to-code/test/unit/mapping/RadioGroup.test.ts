import { describe, it, expect } from 'vitest'
import { createRadioGroupMapping } from '../../../api/config/mappings/eview-react/RadioGroup'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// RadioGroup 映射
// ═══════════════════════════════════════════════════════════════════

describe('RadioGroup mapping', () => {
  const mapping = createRadioGroupMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import；defaults.isControlled=true', () => {
    expect(mapping.tag).toBe('RadioGroup')
    expect(mapping.import).toBe(`${PKG}/RadioGroup`)
    expect(mapping.defaults).toEqual({ isControlled: true })
  })

  it('value 字面量 → LiteralValue.useState(onChange，extractor (oldVal,val)=>setter(val))', () => {
    const v = transform({ value: 'a' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('a')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(oldVal, val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('val')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
  })

  it('options 字面量 → data：label→text + 简单值展开', () => {
    expect(transform({ options: ['x', { label: 'Y', value: 'y' }] }).props!.data).toEqual([
      { text: 'x', value: 'x' },
      { text: 'Y', value: 'y' },
    ])
  })

  it('options DataBinding → data ComputedValue', () => {
    const b = absBinding('opts')
    expect((transform({ options: b }).props!.data as any).type).toBe('computed')
  })

  it('orientation→type；size 丢弃；className 透传', () => {
    const r = transform({ orientation: 'horizontal', size: 'large', className: 'rg' })
    expect(r!.props!.type).toBe('horizontal')
    expect('size' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('rg')
    expect(r!.children).toBeNull()
  })
})
