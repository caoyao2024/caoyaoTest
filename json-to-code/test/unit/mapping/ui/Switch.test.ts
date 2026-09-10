import { describe, it, expect } from 'vitest'
import SwitchMapping from '../../../../api/config/mappings/eview-ui/Switch'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Switch → Toggle bespoke 映射
// 与 eview-react 差异：tag=Toggle；checkedChildren/unCheckedChildren/*Icon 全丢弃
// （eview-ui 无 taggledChildren）。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Switch bespoke (Toggle)', () => {
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    SwitchMapping.transform!({ props } as any, ctx)

  it('tag=Toggle；import 路径', () => {
    expect(SwitchMapping.tag).toBe('Toggle')
    expect(SwitchMapping.import).toBe(`${UI_PKG}/Toggle`)
  })

  it('value 字面量 → toggled LiteralValue.useState(onToggle，extractor no-op 不调 setter)', () => {
    const v = transform({ value: true }).props!.toggled as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe(true)
    expect(v.useState.event).toBe('onToggle')
    // onToggle(value:string) 回传字符串非 boolean，extractor 不调 setter（no-op）
    expect(v.useState.extractor('set')).toBe('() => {}')
  })

  it('value DataBinding → toggled ComputedValue.useState(onToggle，transform !!raw)', () => {
    const b = absBinding('sw')
    const v = transform({ value: b }).props!.toggled as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.useState.event).toBe('onToggle')
    expect(v.transform(1)).toBe(true)
    expect(v.transform(0)).toBe(false)
  })

  it('checkedChildren / unCheckedChildren / *Icon 全丢弃（与 eview-react 差异）', () => {
    const r = transform({
      checkedChildren: '开', unCheckedChildren: '关',
      checkedChildrenIcon: 'check', unCheckedChildrenIcon: 'close',
    })
    for (const k of ['taggledChildren', 'unTaggledChildren']) {
      expect(k in r!.props!).toBe(false)
    }
    // resolveIcon 不应被 *Icon 触发（eview-react 会触发，eview-ui 丢弃）
    expect(r!.children).toBeNull()
  })

  it('size 丢弃；className 透传', () => {
    const r = transform({ size: 'small', className: 'sw' })
    expect('size' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('sw')
  })
})
