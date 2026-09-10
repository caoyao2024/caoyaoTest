import { describe, it, expect } from 'vitest'
import TextAreaMapping from '../../../../api/config/mappings/eview-ui/TextArea'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui TextArea bespoke 映射
// 与 eview-react 差异：autoSize 丢弃（eview-react 是 autoSize→sizeAuto）；
// 无 splitWidthToStyle（eview-ui 版不拆宽度类）。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui TextArea bespoke', () => {
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    TextAreaMapping.transform!({ props } as any, ctx)

  it('tag=TextArea；import 路径', () => {
    expect(TextAreaMapping.tag).toBe('TextArea')
    expect(TextAreaMapping.import).toBe(`${UI_PKG}/TextArea`)
  })

  it('value 字面量 → LiteralValue.useState(onChange)', () => {
    const v = transform({ value: 'hi' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('hi')
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

  it('placeholder / maxLength 透传', () => {
    const r = transform({ placeholder: '请输入', maxLength: 200 })
    expect(r!.props!.placeholder).toBe('请输入')
    expect(r!.props!.maxLength).toBe(200)
  })

  it('autoSize 丢弃（与 eview-react 差异：eview-react 转 sizeAuto）；size 丢弃', () => {
    const r = transform({ autoSize: true, size: 'large' })
    expect('sizeAuto' in r!.props!).toBe(false)
    expect('autoSize' in r!.props!).toBe(false)
    expect('size' in r!.props!).toBe(false)
  })

  it('className 直接透传（不拆宽度类，无 inputStyle）', () => {
    const r = transform({ className: 'w-200 text-red' })
    expect(r!.props!.className).toBe('w-200 text-red')
    expect('inputStyle' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
