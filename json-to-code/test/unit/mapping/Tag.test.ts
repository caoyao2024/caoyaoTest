import { describe, it, expect } from 'vitest'
import { createTagMapping } from '../../../api/config/mappings/eview-react/Tag'
import { fakeCtx, absBinding, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Tag 映射
// ═══════════════════════════════════════════════════════════════════

describe('Tag mapping', () => {
  const mapping = createTagMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import 与 MappingDef 一致', () => {
    expect(mapping.tag).toBe('Tag')
    expect(mapping.import).toBe(`${PKG}/Tag`)
  })

  it('value 字面量 → children=[TextNode]', () => {
    const r = transform({ value: '标签' })
    expect(r!.children[0]).toMatchObject({ kind: 'text', value: '标签' })
  })

  it('value DataBinding → children=[TextNode(binding)]', () => {
    const b = absBinding('text')
    expect(transform({ value: b }).children[0]).toMatchObject({ kind: 'text' })
  })

  it('color 枚举值直接透传；非枚举→default；无 color→default', () => {
    expect(transform({ color: 'error' }).props!.color).toBe('error')
    expect(transform({ color: 'success' }).props!.color).toBe('success')
    expect(transform({ color: 'weird' }).props!.color).toBe('default')
    expect(transform({}).props!.color).toBe('default')
  })

  it('color DataBinding → ComputedValue', () => {
    const b = absBinding('color')
    const c = transform({ color: b }).props!.color as any
    expect(c.type).toBe('computed')
    expect(c.path).toBe(b.path)
  })

  it('icon 字面量 → iconName(resolveIcon) + hasIcon:true', () => {
    const ctx = fakeCtx()
    const r = transform({ icon: 'star' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('star')
    expect(r!.props!.iconName).toStrictEqual(ICON_SENTINEL('star'))
    expect(r!.props!.hasIcon).toBe(true)
  })

  it('size:medium→normal / large→large / small→small', () => {
    expect(transform({ size: 'medium' }).props!.size).toBe('normal')
    expect(transform({ size: 'large' }).props!.size).toBe('large')
    expect(transform({ size: 'small' }).props!.size).toBe('small')
  })

  it('variant→fill：solid→solid / filled→outline / outlined→outline / 缺省→outline', () => {
    expect(transform({ variant: 'solid' }).props!.fill).toBe('solid')
    expect(transform({ variant: 'filled' }).props!.fill).toBe('outline')
    expect(transform({ variant: 'outlined' }).props!.fill).toBe('outline')
    expect(transform({}).props!.fill).toBe('outline')
  })

  it('closable 透传；closeIcon 丢弃；className 透传', () => {
    const r = transform({ closable: true, closeIcon: 'x', className: 'tg' })
    expect(r!.props!.closable).toBe(true)
    expect('closeIcon' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('tg')
  })
})
