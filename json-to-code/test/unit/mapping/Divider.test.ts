import { describe, it, expect } from 'vitest'
import { createDividerMapping } from '../../../api/config/mappings/eview-react/Divider'
import { Value } from '../../../api/src/core/value-factory'
import { fakeCtx, absBinding, comp, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Divider 映射
// ═══════════════════════════════════════════════════════════════════

describe('Divider mapping', () => {
  const mapping = createDividerMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import 与 MappingDef 一致', () => {
    expect(mapping.tag).toBe('Divider')
    expect(mapping.import).toBe(`${PKG}/Divider`)
  })

  it('value 字面量 → children=[TextNode]', () => {
    const r = transform({ value: '分隔' })
    expect(r!.children[0]).toMatchObject({ kind: 'text', value: '分隔' })
  })

  it('value SlotNode → children=[slot.node]', () => {
    const node = comp('Span', {})
    const r = transform({ value: Value.slotNode({ node: node as any }) })
    expect(r!.children[0]).toBe(node)
  })

  it('value DataBinding → children=[TextNode(binding)]', () => {
    const b = absBinding('text')
    const r = transform({ value: b })
    expect(r!.children[0]).toMatchObject({ kind: 'text' })
    expect(r!.children[0].value).toBe(b)
  })

  it('titlePlacement → orientation（start→left / end→right / center→center）', () => {
    expect(transform({ titlePlacement: 'start' }).props!.orientation).toBe('left')
    expect(transform({ titlePlacement: 'end' }).props!.orientation).toBe('right')
    expect(transform({ titlePlacement: 'center' }).props!.orientation).toBe('center')
  })

  it('orientation（无 titlePlacement）→ type；有 titlePlacement 时 orientation 不进 type', () => {
    expect(transform({ orientation: 'vertical' }).props!.type).toBe('vertical')
    // titlePlacement 存在 → 不写 type
    expect('type' in transform({ orientation: 'vertical', titlePlacement: 'start' }).props!).toBe(false)
  })

  it('variant:dashed→dashed:true；dotted/solid 丢弃', () => {
    expect(transform({ variant: 'dashed' }).props!.dashed).toBe(true)
    expect('dashed' in transform({ variant: 'dotted' }).props!).toBe(false)
    expect('dashed' in transform({ variant: 'solid' }).props!).toBe(false)
  })

  it('className 透传', () => {
    expect(transform({ className: 'dv' }).props!.className).toBe('dv')
  })
})
