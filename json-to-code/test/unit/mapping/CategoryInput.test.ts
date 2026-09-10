import { describe, it, expect } from 'vitest'
import { createCategoryInputMapping } from '../../../api/config/mappings/eview-react/CategoryInput'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// CategoryInput 映射
// ═══════════════════════════════════════════════════════════════════

describe('CategoryInput mapping', () => {
  const mapping = createCategoryInputMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=CategoryInput；import 路径', () => {
    expect(mapping.tag).toBe('CategoryInput')
    expect(mapping.import).toBe(`${PKG}/CategoryInput`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 'hello' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('hello')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('inputValue')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.transform('x')).toBe('x')
    expect(v.transform(null)).toBe('')
  })

  it('value 字面量 undefined → 空字符串初始值', () => {
    const v = transform({ value: undefined }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('')
  })

  it('categoryOptions 字面量数组直传 / DataBinding→ComputedValue containsJSX:false', () => {
    const opts = [
      { text: 'NE1', value: 1 },
      { text: 'NE2', value: 2 },
    ]
    expect(transform({ value: '', categoryOptions: opts }).props!.categoryOptions).toEqual(opts)
    const b = absBinding('options')
    const p = transform({ value: '', categoryOptions: b }).props!.categoryOptions as any
    expect(p.type).toBe('computed')
    expect(p.path).toBe(b.path)
    expect(p.containsJSX).toBe(false)
    expect(p.transform([{ text: 'a', value: 1 }])).toEqual([{ text: 'a', value: 1 }])
    expect(p.transform(null)).toEqual([])
  })

  it('category 字面量/DataBinding 透传', () => {
    expect(transform({ value: '', category: 1 }).props!.category).toBe(1)
    const b = absBinding('cat')
    expect(transform({ value: '', category: b }).props!.category).toBe(b)
  })

  it('placeholder 字面量/DataBinding 透传', () => {
    expect(transform({ value: '', placeholder: 'Please enter...' }).props!.placeholder).toBe('Please enter...')
    const b = absBinding('ph')
    expect(transform({ value: '', placeholder: b }).props!.placeholder).toBe(b)
  })

  it('disabled / inputPosition 透传', () => {
    const r = transform({ value: '', disabled: true, inputPosition: 'left' })
    expect(r!.props!.disabled).toBe(true)
    expect(r!.props!.inputPosition).toBe('left')
  })

  it('className 透传；children=null', () => {
    const r = transform({ value: '', className: 'ev_category_input' })
    expect(r!.props!.className).toBe('ev_category_input')
    expect(r!.children).toBeNull()
  })
})
