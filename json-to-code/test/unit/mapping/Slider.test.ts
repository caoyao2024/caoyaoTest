import { describe, it, expect } from 'vitest'
import { createSliderMapping } from '../../../api/config/mappings/eview-react/Slider'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Slider → DragInput 映射
// 注：用 splitWidthToStyle，className 不带 w-xx → 不触发 tailwind 设计系统加载，保持纯/快
// ═══════════════════════════════════════════════════════════════════

describe('Slider mapping', () => {
  const mapping = createSliderMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=DragInput；import 路径', () => {
    expect(mapping.tag).toBe('DragInput')
    expect(mapping.import).toBe(`${PKG}/DragInput`)
  })

  it('range=true→type:range；未设/false→type:single', () => {
    expect(transform({ range: true }).props!.type).toBe('range')
    expect(transform({ range: false }).props!.type).toBe('single')
    expect(transform({}).props!.type).toBe('single')
  })

  it('value 字面量 number → LiteralValue.useState(onChange)，包装为 [val]', () => {
    const v = transform({ value: 5 }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toEqual([5])
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value 字面量 array → LiteralValue.useState（原样数组）', () => {
    const v = transform({ value: [1, 2] }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toEqual([1, 2])
  })

  it('value DataBinding → ComputedValue.useState(onChange，transform 数组原样/单值包装 [raw??0])', () => {
    const b = absBinding('sl')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.transform([1, 2])).toEqual([1, 2])
    expect(v.transform(5)).toEqual([5])
    expect(v.transform(undefined)).toEqual([0])
  })

  it('min/max 透传；orientation/step 丢弃', () => {
    const r = transform({ min: 0, max: 100, orientation: 'vertical', step: 5 })
    expect(r!.props!.min).toBe(0)
    expect(r!.props!.max).toBe(100)
    expect('orientation' in r!.props!).toBe(false)
    expect('step' in r!.props!).toBe(false)
  })

  it('input→displayInput；未设 input→displayInput=false（覆盖 eview 默认 true）', () => {
    expect(transform({ input: true }).props!.displayInput).toBe(true)
    expect(transform({}).props!.displayInput).toBe(false)
  })

  it('marks 对象 → markIndexes number[]（排序）', () => {
    expect(transform({ marks: { '50': '50', '0': '0', '25': '25' } }).props!.markIndexes).toEqual([0, 25, 50])
  })

  it('className（无 w-xx）透传，无 stickStyle', () => {
    const r = transform({ className: 'text-red' })
    expect(r!.props!.className).toBe('text-red')
    expect('stickStyle' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
