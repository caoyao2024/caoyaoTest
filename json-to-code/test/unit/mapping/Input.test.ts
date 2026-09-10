import { describe, it, expect } from 'vitest'
import { createInputMapping } from '../../../api/config/mappings/eview-react/Input'
import { fakeCtx, absBinding, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Input 映射（不测 w-xx→inputStyle，触 tailwind，由 e2e 覆盖）
// ═══════════════════════════════════════════════════════════════════

describe('Input mapping', () => {
  const mapping = createInputMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=TextField；import 路径', () => {
    expect(mapping.tag).toBe('TextField')
    expect(mapping.import).toBe(`${PKG}/TextField`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 'hi' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('hi')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('val')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
  })

  it('placeholder 字面量/DataBinding 透传', () => {
    expect(transform({ placeholder: '输入' }).props!.placeholder).toBe('输入')
    const b = absBinding('ph')
    expect(transform({ placeholder: b }).props!.placeholder).toBe(b)
  })

  it('maxLength 透传；suffix 字面量→resolveIcon / DataBinding→ComputedValue', () => {
    const ctx = fakeCtx()
    const r = transform({ maxLength: 10, suffix: 'star' }, ctx)
    expect(r!.props!.maxLength).toBe(10)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('star')
    expect(r!.props!.suffix).toStrictEqual(ICON_SENTINEL('star'))
    const b = absBinding('icon')
    const s = transform({ suffix: b }).props!.suffix as any
    expect(s.type).toBe('computed')
    expect(s.containsJSX).toBe(true)
  })

  it('password:true→type:password；prefix/size 丢弃', () => {
    const r = transform({ password: true, prefix: 'p', size: 'large' })
    expect(r!.props!.type).toBe('password')
    expect('prefix' in r!.props!).toBe(false)
    expect('size' in r!.props!).toBe(false)
  })

  it('className（无 w-xx）透传，无 inputStyle', () => {
    const r = transform({ className: 'text-red' })
    expect(r!.props!.className).toBe('text-red')
    expect('inputStyle' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
