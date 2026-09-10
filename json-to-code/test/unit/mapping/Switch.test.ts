import { describe, it, expect } from 'vitest'
import { createSwitchMapping } from '../../../api/config/mappings/eview-react/Switch'
import { fakeCtx, absBinding, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Switch → Switch 映射
// ═══════════════════════════════════════════════════════════════════

describe('Switch mapping', () => {
  const mapping = createSwitchMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=Switch；import 路径', () => {
    expect(mapping.tag).toBe('Switch')
    expect(mapping.import).toBe(`${PKG}/Switch`)
  })

  it('value 字面量 → toggled LiteralValue.useState(onToggle，extractor no-op 不调 setter)', () => {
    const v = transform({ value: true }).props!.toggled as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe(true)
    expect(v.useState.event).toBe('onToggle')
    // onToggle(value:string) 回传字符串非 boolean，extractor 不调 setter（no-op）
    expect(v.useState.extractor('set')).toBe('() => {}')
  })

  it('value DataBinding → toggled ComputedValue.useState(onToggle，transform !!rawValue)', () => {
    const b = absBinding('sw')
    const v = transform({ value: b }).props!.toggled as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.useState.event).toBe('onToggle')
    expect(v.transform(1)).toBe(true)
    expect(v.transform(0)).toBe(false)
  })

  it('checkedChildren/unCheckedChildren → taggledChildren/unTaggledChildren（注意 API 拼写）', () => {
    const r = transform({ checkedChildren: '开', unCheckedChildren: '关' })
    expect(r!.props!.taggledChildren).toBe('开')
    expect(r!.props!.unTaggledChildren).toBe('关')
  })

  it('checkedChildrenIcon 字面量 → resolveIcon → taggledChildren 覆盖文本', () => {
    const ctx = fakeCtx()
    const r = transform({ checkedChildren: '开', checkedChildrenIcon: 'check' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('check')
    expect(r!.props!.taggledChildren).toStrictEqual(ICON_SENTINEL('check'))
  })

  it('unCheckedChildrenIcon 字面量 → resolveIcon → unTaggledChildren 覆盖文本', () => {
    const ctx = fakeCtx()
    const r = transform({ unCheckedChildren: '关', unCheckedChildrenIcon: 'close' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('close')
    expect(r!.props!.unTaggledChildren).toStrictEqual(ICON_SENTINEL('close'))
  })

  it('checkedChildrenIcon DataBinding → taggledChildren ComputedValue（containsJSX:true）', () => {
    const b = absBinding('ic')
    const v = transform({ checkedChildrenIcon: b }).props!.taggledChildren as any
    expect(v.type).toBe('computed')
    expect(v.containsJSX).toBe(true)
    expect(v.path).toBe(b.path)
  })

  it('size 丢弃；disabled/className 透传', () => {
    const r = transform({ size: 'small', disabled: true, className: 'sw' })
    expect('size' in r!.props!).toBe(false)
    expect(r!.props!.disabled).toBe(true)
    expect(r!.props!.className).toBe('sw')
    expect(r!.children).toBeNull()
  })
})
