import { describe, it, expect } from 'vitest'
import DatePickerMapping from '../../../../api/config/mappings/eview-ui/DatePicker'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui DatePicker bespoke 映射
// 与 eview-react 差异：format 直接透传（不转 moment→Java）；range:true 触发 RangePicker 模式。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui DatePicker bespoke', () => {
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    DatePickerMapping.transform!({ props } as any, ctx)

  it('tag=DatePicker；import 路径', () => {
    expect(DatePickerMapping.tag).toBe('DatePicker')
    expect(DatePickerMapping.import).toBe(`${UI_PKG}/DatePicker`)
  })

  it('value 字面量（非 range）→ value LiteralValue.useState(onChange，extractor (dateString)=>setter(dateString))', () => {
    const v = transform({ value: '2024-01-01' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('2024-01-01')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(dateString) => set(dateString)')
  })

  it('value DataBinding（非 range）→ value ComputedValue.useState(onChange，transform raw??"")', () => {
    const b = absBinding('date')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.transform('2024-01-01')).toBe('2024-01-01')
    expect(v.transform(null)).toBe('')
  })

  it('range:true + value DataBinding → tag=DatePicker.RangePicker；value ComputedValue（transform 数组兜底 [raw]）', () => {
    const b = absBinding('range')
    const r = transform({ range: true, value: b })
    expect(r.tag).toBe('DatePicker.RangePicker')
    expect(r.selfClosing).toBe(true)
    const v = r.props!.value as any
    expect(v.type).toBe('computed')
    expect(v.transform(['a', 'b'])).toEqual(['a', 'b'])
    expect(v.transform('x')).toEqual(['x'])
    expect('range' in r.props!).toBe(false)
  })

  it('range:true + value 字面量数组 → tag=DatePicker.RangePicker；value LiteralValue', () => {
    const r = transform({ range: true, value: ['2024-01-01', '2024-01-31'] })
    expect(r.tag).toBe('DatePicker.RangePicker')
    const v = r.props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toEqual(['2024-01-01', '2024-01-31'])
  })

  it('range:true 无 placeholder → 不设默认', () => {
    expect('placeholder' in transform({ range: true, value: [] }).props!).toBe(false)
  })

  it('range:true + placeholder array → 保持数组', () => {
    expect(transform({ range: true, value: [], placeholder: ['起', '止'] }).props!.placeholder)
      .toEqual(['起', '止'])
  })

  it('range:true + placeholder string → [str, str]', () => {
    expect(transform({ range: true, value: [], placeholder: '选日期' }).props!.placeholder)
      .toEqual(['选日期', '选日期'])
  })

  it('range:true + placeholder DataBinding → ComputedValue 保持数组', () => {
    const b = absBinding('ph')
    const p = transform({ range: true, value: [], placeholder: b }).props!.placeholder as any
    expect(p.type).toBe('computed')
    expect(p.transform(['A', 'B'])).toEqual(['A', 'B'])
    expect(p.transform('X')).toEqual(['X'])
  })

  it('range DataBinding（非 literal true）→ 不进 range 模式，value→value', () => {
    const b = absBinding('range')
    const r = transform({ range: b, value: b })
    expect(r.tag).toBeUndefined()  // 非 range 模式不覆盖 tag
    expect('range' in r!.props!).toBe(false)
    expect((r!.props!.value as any).type).toBe('computed')
  })

  it('placeholder：array→首项；string→原样；DataBinding→ComputedValue（数组取首项）', () => {
    expect(transform({ placeholder: ['开始', '结束'] }).props!.placeholder).toBe('开始')
    expect(transform({ placeholder: '选日期' }).props!.placeholder).toBe('选日期')
    const b = absBinding('ph')
    const p = transform({ placeholder: b }).props!.placeholder as any
    expect(p.type).toBe('computed')
    expect(p.transform(['A', 'B'])).toBe('A')
    expect(p.transform('X')).toBe('X')
  })

  it('picker→type；size 丢弃', () => {
    const r = transform({ picker: 'month', size: 'large' })
    expect(r!.props!.type).toBe('month')
    expect('size' in r!.props!).toBe(false)
  })

  it('format 直接透传（不转 YYYY→yyyy，与 eview-react 差异）', () => {
    expect(transform({ format: 'YYYY-MM-DD' }).props!.format).toBe('YYYY-MM-DD')
    expect(transform({ format: 'HH:mm:ss' }).props!.format).toBe('HH:mm:ss')
  })

  it('className 透传', () => {
    expect(transform({ className: 'dp' }).props!.className).toBe('dp')
    expect(transform({ className: 'dp' }).children).toBeNull()
  })
})
