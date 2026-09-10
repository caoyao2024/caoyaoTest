import { describe, it, expect } from 'vitest'
import { createTabItemMapping } from '../../../api/config/mappings/eview-react/TabItem'
import { Value } from '../../../api/src/core/value-factory'
import { fakeCtx, absBinding, comp, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// TabItem 映射
// ═══════════════════════════════════════════════════════════════════

describe('TabItem mapping', () => {
  const mapping = createTabItemMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=TabItem；named import from Tab', () => {
    expect(mapping.tag).toBe('TabItem')
    expect(mapping.import).toEqual({ source: `${PKG}/Tab`, named: true })
  })

  it('label 字面量 → title；DataBinding → title 保持原样', () => {
    expect(transform({ label: '页签' }).props!.title).toBe('页签')
    const b = absBinding('label')
    expect(transform({ label: b }).props!.title).toBe(b)
  })

  it('icon 字面量 → resolveIcon 直出', () => {
    const ctx = fakeCtx()
    const r = transform({ icon: 'star' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('star')
    expect(r!.props!.icon).toStrictEqual(ICON_SENTINEL('star'))
  })

  it('icon DataBinding → ComputedValue containsJSX:true', () => {
    const b = absBinding('icon')
    const r = transform({ icon: b })
    expect((r!.props!.icon as any).type).toBe('computed')
    expect((r!.props!.icon as any).containsJSX).toBe(true)
  })

  it('content 字面量 → children=[TextNode]；SlotNode → children=[node]；DataBinding → [TextNode(binding)]', () => {
    expect(transform({ content: '正文' }).children[0]).toMatchObject({ kind: 'text', value: '正文' })
    const node = comp('Span', {})
    expect(transform({ content: Value.slotNode({ node: node as any }) }).children[0]).toBe(node)
    const b = absBinding('body')
    const tn = transform({ content: b }).children[0]
    expect(tn).toMatchObject({ kind: 'text' })
    expect(tn.value).toBe(b)
  })

  it('disabled / closable 透传；key 丢弃；className 透传', () => {
    const r = transform({ key: 'k1', disabled: true, closable: false, className: 'ti' })
    expect('key' in r!.props!).toBe(false)
    expect(r!.props!.disabled).toBe(true)
    expect(r!.props!.closable).toBe(false)
    expect(r!.props!.className).toBe('ti')
  })
})
