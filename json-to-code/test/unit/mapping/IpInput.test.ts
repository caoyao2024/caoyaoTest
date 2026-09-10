import { describe, it, expect } from 'vitest'
import { createIpInputMapping } from '../../../api/config/mappings/eview-react/IpInput'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// IPInput 映射（不测 w-xx→inputStyle，触 tailwind，由 e2e 覆盖）
// ═══════════════════════════════════════════════════════════════════

describe('IPInput mapping', () => {
  const mapping = createIpInputMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=IPInput；import 路径', () => {
    expect(mapping.tag).toBe('IPInput')
    expect(mapping.import).toBe(`${PKG}/IPInput`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: '192.168.1.1' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('192.168.1.1')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange)', () => {
    const b = absBinding('ipv4Address')
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

  it('type/delimiter/disabled 透传', () => {
    const r = transform({
      type: 'v6',
      delimiter: ':',
      disabled: true,
    })
    expect(r!.props!.type).toBe('v6')
    expect(r!.props!.delimiter).toBe(':')
    expect(r!.props!.disabled).toBe(true)
  })

  it('className（无 w-xx）透传，无 inputStyle', () => {
    const r = transform({ className: 'text-red' })
    expect(r!.props!.className).toBe('text-red')
    expect('inputStyle' in r!.props!).toBe(false)
  })

  it('id 丢弃（由 config.id 控制）', () => {
    const r = transform({ id: 'myIp' })
    expect('id' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
