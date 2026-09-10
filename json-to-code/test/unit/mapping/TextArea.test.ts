import { describe, it, expect } from 'vitest'
import { createTextAreaMapping } from '../../../api/config/mappings/eview-react/TextArea'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// TextArea → TextArea 映射
// 注：用 splitWidthToStyle，className 不带 w-xx → 不触发 tailwind 设计系统加载，保持纯/快
// ═══════════════════════════════════════════════════════════════════

describe('TextArea mapping', () => {
  const mapping = createTextAreaMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=TextArea；import 路径', () => {
    expect(mapping.tag).toBe('TextArea')
    expect(mapping.import).toBe(`${PKG}/TextArea`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 'hello' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('hello')
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onChange，transform raw??"")', () => {
    const b = absBinding('ta')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.transform('x')).toBe('x')
    expect(v.transform(null)).toBe('')
  })

  it('placeholder/maxLength 透传；autoSize→sizeAuto', () => {
    const r = transform({ placeholder: '请输入', maxLength: 200, autoSize: true })
    expect(r!.props!.placeholder).toBe('请输入')
    expect(r!.props!.maxLength).toBe(200)
    expect(r!.props!.sizeAuto).toBe(true)
  })

  it('size 丢弃；className（无 w-xx）透传，无 inputStyle', () => {
    const r = transform({ size: 'large', className: 'text-red' })
    expect('size' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('text-red')
    expect('inputStyle' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
