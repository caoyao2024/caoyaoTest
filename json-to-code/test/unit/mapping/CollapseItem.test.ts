import { describe, it, expect } from 'vitest'
import { createCollapseItemMapping } from '../../../api/config/mappings/eview-react/CollapseItem'
import { Value } from '../../../api/src/core/value-factory'
import { fakeCtx, absBinding, comp, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// CollapseItem 映射
// ═══════════════════════════════════════════════════════════════════

describe('CollapseItem mapping', () => {
  const mapping = createCollapseItemMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=PanelItem；named import from Panel', () => {
    expect(mapping.tag).toBe('PanelItem')
    expect(mapping.import).toEqual({ source: `${PKG}/Panel`, named: true })
  })

  it('label 字面量 → title', () => {
    expect(transform({ label: '标题' }).props!.title).toBe('标题')
  })

  it('label DataBinding → title 保持原样', () => {
    const b = absBinding('title')
    expect(transform({ label: b }).props!.title).toBe(b)
  })

  it('content 字面量 → children=[TextNode]', () => {
    const r = transform({ content: '正文' })
    expect(r!.children[0]).toMatchObject({ kind: 'text', value: '正文' })
  })

  it('content SlotNode → children=[slot.node]（展开）', () => {
    const node = comp('Panel', {})
    const r = transform({ content: Value.slotNode({ node: node as any }) })
    expect(r!.children[0]).toBe(node)
  })

  it('content DataBinding → children=[TextNode(binding)]', () => {
    const b = absBinding('body')
    const r = transform({ content: b })
    expect(r!.children[0]).toMatchObject({ kind: 'text' })
    expect(r!.children[0].value).toBe(b)
  })

  it('key / extra 丢弃；className 透传', () => {
    const r = transform({ key: 'k1', extra: 'x', className: 'ci' })
    expect('key' in r!.props!).toBe(false)
    expect('extra' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('ci')
  })
})
