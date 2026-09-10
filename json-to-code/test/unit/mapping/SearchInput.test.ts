import { describe, it, expect } from 'vitest'
import { createSearchInputMapping } from '../../../api/config/mappings/eview-react/SearchInput'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

describe('SearchInput mapping', () => {
  const mapping = createSearchInputMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import', () => {
    expect(mapping.tag).toBe('SearchInput')
    expect(mapping.import).toBe(`${PKG}/SearchInput`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 'hi' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('hi')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange) containsJSX:false', () => {
    const b = absBinding('q')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.containsJSX).toBe(false)
  })

  it('placeholder 字面量/DataBinding 透传', () => {
    expect(transform({ placeholder: '搜索' }).props!.placeholder).toBe('搜索')
    const b = absBinding('ph')
    expect(transform({ placeholder: b }).props!.placeholder).toBe(b)
  })

  it('disabled 透传', () => {
    expect(transform({ disabled: true }).props!.disabled).toBe(true)
  })

  it('popItems 字面量数组直传 / DataBinding→ComputedValue containsJSX:false', () => {
    const items = [{ text: 'a', value: '1' }]
    expect(transform({ popItems: items }).props!.popItems).toBe(items)
    const b = absBinding('items')
    const p = transform({ popItems: b }).props!.popItems as any
    expect(p.type).toBe('computed')
    expect(p.path).toBe(b.path)
    expect(p.containsJSX).toBe(false)
  })

  it('className（无 w-xx）透传，无 inputStyle', () => {
    const r = transform({ className: 'text-red' })
    expect(r.props!.className).toBe('text-red')
    expect('inputStyle' in r.props!).toBe(false)
    expect(r.children).toBeNull()
  })
})
