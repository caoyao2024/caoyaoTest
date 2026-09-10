import { describe, it, expect } from 'vitest'
import { createCategorySearchMapping } from '../../../api/config/mappings/eview-react/CategorySearch'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// CategorySearch 映射
// ═══════════════════════════════════════════════════════════════════

describe('CategorySearch mapping', () => {
  const mapping = createCategorySearchMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=CategorySearch；import 路径', () => {
    expect(mapping.tag).toBe('CategorySearch')
    expect(mapping.import).toBe(`${PKG}/CategorySearch`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 'hello' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('hello')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('searchValue')
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
      { text: 'China', value: 1 },
      { text: 'UK', value: 2 },
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
    expect(transform({ value: '', category: 2 }).props!.category).toBe(2)
    const b = absBinding('cat')
    expect(transform({ value: '', category: b }).props!.category).toBe(b)
  })

  it('placeholder 字面量/DataBinding 透传', () => {
    expect(transform({ value: '', placeholder: '搜索' }).props!.placeholder).toBe('搜索')
    const b = absBinding('ph')
    expect(transform({ value: '', placeholder: b }).props!.placeholder).toBe(b)
  })

  it('className 透传；children=null', () => {
    const r = transform({ value: '', className: 'w-60' })
    expect(r!.props!.className).toBe('w-60')
    expect(r!.children).toBeNull()
  })
})
