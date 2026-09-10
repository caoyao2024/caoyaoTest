import { describe, it, expect } from 'vitest'
import { createHexFieldMapping } from '../../../api/config/mappings/eview-react/HexField'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// HexField 映射（不测 w-xx→inputStyle，触 tailwind，由 e2e 覆盖）
// ═══════════════════════════════════════════════════════════════════

describe('HexField mapping', () => {
  const mapping = createHexFieldMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=HexField；import 路径', () => {
    expect(mapping.tag).toBe('HexField')
    expect(mapping.import).toBe(`${PKG}/HexField`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: '0A1B' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('0A1B')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('hexValue')
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

  it('placeholder 字面量/DataBinding 透传', () => {
    expect(transform({ value: '', placeholder: '输入十六进制' }).props!.placeholder).toBe('输入十六进制')
    const b = absBinding('ph')
    expect(transform({ value: '', placeholder: b }).props!.placeholder).toBe(b)
  })

  it('disabled 透传', () => {
    const r = transform({ value: '', disabled: true })
    expect(r!.props!.disabled).toBe(true)
  })

  it('className（无 w-xx）透传，无 inputStyle', () => {
    const r = transform({ value: '', className: 'text-red' })
    expect(r!.props!.className).toBe('text-red')
    expect('inputStyle' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
