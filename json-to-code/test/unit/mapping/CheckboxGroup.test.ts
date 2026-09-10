import { describe, it, expect } from 'vitest'
import { createCheckboxGroupMapping } from '../../../api/config/mappings/eview-react/CheckboxGroup'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// CheckboxGroup 映射
// ═══════════════════════════════════════════════════════════════════

describe('CheckboxGroup mapping', () => {
  const mapping = createCheckboxGroupMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import 与 MappingDef 一致', () => {
    expect(mapping.tag).toBe('CheckboxGroup')
    expect(mapping.import).toBe(`${PKG}/CheckboxGroup`)
  })

  it('value 字面量数组 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: ['a', 'b'] }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toEqual(['a', 'b'])
    expect(v.useState.event).toBe('onChange')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('vals')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.useState.event).toBe('onChange')
  })

  it('options 字面量 → data：label→text 重命名 + 简单值展开为 {text,value}', () => {
    const r = transform({ options: ['x', { label: 'Y', value: 'y' }] })
    expect(r!.props!.data).toEqual([
      { text: 'x', value: 'x' },
      { text: 'Y', value: 'y' },
    ])
  })

  it('options DataBinding → data 是 ComputedValue', () => {
    const b = absBinding('opts')
    const r = transform({ options: b })
    expect((r!.props!.data as any).type).toBe('computed')
  })

  it('disabled / className 透传；children=null', () => {
    const r = transform({ disabled: true, className: 'cg' })
    expect(r!.props!.disabled).toBe(true)
    expect(r!.props!.className).toBe('cg')
    expect(r!.children).toBeNull()
  })
})
