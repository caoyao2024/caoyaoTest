import { describe, it, expect } from 'vitest'
import { createSelectMapping } from '../../../api/config/mappings/eview-react/Select'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Select 映射（单选 Select / 单选+搜索 InputSelect / 多选 MultipleSelect）
// ═══════════════════════════════════════════════════════════════════

describe('Select mapping', () => {
  const mapping = createSelectMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('单选：tag/import 沿用 MappingDef（override undefined）', () => {
    expect(mapping.tag).toBe('Select')
    expect(mapping.import).toBe(`${PKG}/Select`)
    const r = transform({ value: 'a' })
    expect(r!.tag).toBeUndefined()
    expect(r!.import).toBeUndefined()
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 'a' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('a')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('val')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
  })

  it('options 字面量 → options：label→text', () => {
    expect(transform({ options: [{ label: 'A', value: 'a' }] }).props!.options).toEqual([
      { text: 'A', value: 'a' },
    ])
  })

  it('单选（无 showSearch）：placeholder→defaultLabel；size 丢弃', () => {
    const r = transform({ placeholder: '请选择', size: 'large' })
    expect(r!.tag).toBeUndefined()
    expect(r!.props!.defaultLabel).toBe('请选择')
    expect('size' in r!.props!).toBe(false)
    expect('searchable' in r!.props!).toBe(false)
  })

  // ── 多选（mode=multiple）──

  it('多选：tag=MultipleSelect / import 路径；placeholder→placeholder（非 defaultLabel）；showSearch→searchable', () => {
    const r = transform({ mode: 'multiple', placeholder: '选', showSearch: true })
    expect(r!.tag).toBe('MultipleSelect')
    expect(r!.import).toBe(`${PKG}/MultipleSelect`)
    expect(r!.props!.placeholder).toBe('选')
    expect('defaultLabel' in r!.props!).toBe(false)
    expect(r!.props!.searchable).toBe(true)
  })

  it('多选 value 字面量数组 → LiteralValue.useState', () => {
    const v = transform({ mode: 'multiple', value: [1, 2] }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toEqual([1, 2])
  })

  // ── 单选+搜索 → InputSelect ──

  it('单选+showSearch：tag=InputSelect / import 路径', () => {
    const r = transform({ showSearch: true })
    expect(r!.tag).toBe('InputSelect')
    expect(r!.import).toBe(`${PKG}/InputSelect`)
  })

  it('InputSelect placeholder→placeholder（非 defaultLabel）；showSearch 不透传；size 丢弃', () => {
    const r = transform({ showSearch: true, placeholder: '请输入或选择', size: 'large' })
    expect(r!.props!.placeholder).toBe('请输入或选择')
    expect('defaultLabel' in r!.props!).toBe(false)
    expect('searchable' in r!.props!).toBe(false)
    expect('showSearch' in r!.props!).toBe(false)
    expect('size' in r!.props!).toBe(false)
  })

  it('InputSelect value 字面量 → LiteralValue.useState(onChange 空占位、不回写)', () => {
    const v = transform({ showSearch: true, value: 'a' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('a')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(value) => {}')
  })

  it('InputSelect value DataBinding → ComputedValue.useState(onChange 空占位)', () => {
    const b = absBinding('val')
    const v = transform({ showSearch: true, value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.useState.extractor('set')).toBe('(value) => {}')
  })

  it('InputSelect options 字面量 → label→text', () => {
    expect(transform({ showSearch: true, options: [{ label: 'A', value: 'a' }] }).props!.options).toEqual([
      { text: 'A', value: 'a' },
    ])
  })

  it('className（无 w-xx）透传，无 selectStyle/inputStyle', () => {
    const r = transform({ className: 'text-red' })
    expect(r!.props!.className).toBe('text-red')
    expect('selectStyle' in r!.props!).toBe(false)
    expect('inputStyle' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
