import { describe, it, expect } from 'vitest'
import { createDatePickerMapping } from '../../../api/config/mappings/eview-react/DatePicker'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// DatePicker 映射（不测 w-xx→selectStyle 路径，触 tailwind，由 e2e 覆盖）
// ═══════════════════════════════════════════════════════════════════

describe('DatePicker mapping', () => {
  const mapping = createDatePickerMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import 与 MappingDef 一致', () => {
    expect(mapping.tag).toBe('DatePicker')
    expect(mapping.import).toBe(`${PKG}/DatePicker`)
  })

  it('value DataBinding（非 range）→ value ComputedValue.useState(onChange)', () => {
    const b = absBinding('date')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(dateString) => set(dateString)')
  })

  it('value 字面量（非 range）→ value LiteralValue.useState', () => {
    const v = transform({ value: '2024-01-01' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('2024-01-01')
  })

  it('range=true + value 字面量数组 → range LiteralValue.useState', () => {
    const v = transform({ range: true, value: ['a', 'b'] }).props!.range as any
    expect(v.type).toBe('literal')
    expect(v.value).toEqual(['a', 'b'])
    expect('value' in transform({ range: true, value: ['a', 'b'] }).props!).toBe(false)
  })

  it('placeholder 数组→首项 string；string 直传', () => {
    expect(transform({ placeholder: ['开始', '结束'] }).props!.placeholder).toBe('开始')
    expect(transform({ placeholder: '选日期' }).props!.placeholder).toBe('选日期')
  })

  it('picker→type；format moment→Java（YYYY-MM-DD→yyyy-MM-dd）', () => {
    expect(transform({ picker: 'month' }).props!.type).toBe('month')
    expect(transform({ format: 'YYYY-MM-DD' }).props!.format).toBe('yyyy-MM-dd')
    expect(transform({ format: 'YY/MM/DD' }).props!.format).toBe('yy/MM/dd')
  })

  it('disabled 透传；size 丢弃；className（无 w-xx）透传，无 selectStyle', () => {
    const r = transform({ disabled: true, size: 'large', className: 'text-red' })
    expect(r!.props!.disabled).toBe(true)
    expect('size' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('text-red')
    expect('selectStyle' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
