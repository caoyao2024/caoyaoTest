import { describe, it, expect } from 'vitest'
import { createCheckboxMapping } from '../../../api/config/mappings/eview-react/Checkbox'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Checkbox 映射
// ═══════════════════════════════════════════════════════════════════

describe('Checkbox mapping', () => {
  const mapping = createCheckboxMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import 与 MappingDef 一致', () => {
    expect(mapping.tag).toBe('Checkbox')
    expect(mapping.import).toBe(`${PKG}/Checkbox`)
  })

  it('checked 字面量 → LiteralValue.useState(onChange)', () => {
    const c = transform({ checked: true }).props!.checked as any
    expect(c.type).toBe('literal')
    expect(c.value).toBe(true)
    expect(c.useState.event).toBe('onChange')
    expect(c.useState.extractor('setX')).toBe('(val) => setX(val)')
  })

  it('checked DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('on')
    const c = transform({ checked: b }).props!.checked as any
    expect(c.type).toBe('computed')
    expect(c.path).toBe(b.path)
    expect(c.useState.event).toBe('onChange')
  })

  it('label / disabled 透传', () => {
    const p = transform({ label: '同意', disabled: true }).props!
    expect(p.label).toBe('同意')
    expect(p.disabled).toBe(true)
  })

  it('indeterminate → halfChecked（改名，原值直接赋值）', () => {
    expect(transform({ indeterminate: true }).props!.halfChecked).toBe(true)
  })

  it('className 透传；children=null', () => {
    const r = transform({ className: 'cb' })
    expect(r!.props!.className).toBe('cb')
    expect(r!.children).toBeNull()
  })
})
