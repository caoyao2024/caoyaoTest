import { describe, it, expect } from 'vitest'
import RateMapping from '../../../../api/config/mappings/eview-ui/Rate'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Rate → Rating bespoke 映射
// 与 eview-react 差异：allowClear 透传（eview-react 丢弃）。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Rate bespoke (Rating)', () => {
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    RateMapping.transform!({ props } as any, ctx)

  it('tag=Rating；import 路径', () => {
    expect(RateMapping.tag).toBe('Rating')
    expect(RateMapping.import).toBe(`${UI_PKG}/Rating`)
  })

  it('value 字面量 → LiteralValue.useState(onClick)，extractor 取第二参 value', () => {
    const v = transform({ value: 3 }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe(3)
    expect(v.useState.event).toBe('onClick')
    // eview-ui Rating 的 onClick 签名为 (e, value)，extractor 取第二参
    expect(v.useState.extractor('set')).toBe('(_, val) => set(val)')
  })

  it('value DataBinding → ComputedValue.useState(onClick，transform Number(raw)??0)', () => {
    const b = absBinding('rate')
    const v = transform({ value: b }).props!.value as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.transform('5')).toBe(5)
    // Number(undefined)=NaN；?? 不兜 NaN（与 eview-react Rate 同行为）
    expect(v.transform(undefined)).toBeNaN()
  })

  it('count 字面量 → starCount（val ?? 5）；DataBinding → 原样透传', () => {
    expect(transform({ count: 7 }).props!.starCount).toBe(7)
    const b = absBinding('cnt')
    expect((transform({ count: b }).props!.starCount as any).type).toBe('binding')
  })

  it('size small/medium/large → 14/20/26', () => {
    expect(transform({ size: 'small' }).props!.size).toBe(14)
    expect(transform({ size: 'medium' }).props!.size).toBe(20)
    expect(transform({ size: 'large' }).props!.size).toBe(26)
  })

  it('allowClear 透传（与 eview-react 差异：eview-react 丢弃）；disabled 透传', () => {
    const r = transform({ allowClear: true, disabled: true })
    expect(r!.props!.allowClear).toBe(true)
    expect(r!.props!.disabled).toBe(true)
  })

  it('className 透传', () => {
    expect(transform({ className: 'rt' }).props!.className).toBe('rt')
    expect(transform({ className: 'rt' }).children).toBeNull()
  })
})
