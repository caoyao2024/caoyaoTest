import { describe, it, expect } from 'vitest'
import { createCollapseMapping } from '../../../api/config/mappings/eview-react/Collapse'
import { fakeCtx, absBinding, comp, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Collapse 映射
// ═══════════════════════════════════════════════════════════════════

describe('Collapse mapping', () => {
  const mapping = createCollapseMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag=Panel；import 路径', () => {
    expect(mapping.tag).toBe('Panel')
    expect(mapping.import).toBe(`${PKG}/Panel`)
  })

  it('activeKey 字面量 + 静态 children → selectedIndex=[index] LiteralValue.useState(onExpand)', () => {
    const r = transform({
      props: { activeKey: 'k2' },
      children: [comp('PanelItem', { key: 'k1' }), comp('PanelItem', { key: 'k2' })],
    })
    const s = r!.props!.selectedIndex as any
    expect(s.type).toBe('literal')
    expect(s.value).toEqual([1])
    expect(s.useState.event).toBe('onExpand')
    expect(s.useState.extractor('set')).toBe('(index, event) => set([index])')
  })

  it('activeKey 不匹配 → selectedIndex=[0]', () => {
    const r = transform({
      props: { activeKey: 'nope' },
      children: [comp('PanelItem', { key: 'k1' })],
    })
    expect((r!.props!.selectedIndex as any).value).toEqual([0])
  })

  it('activeKey DataBinding → ComputedValue.useState(onExpand)', () => {
    const b = absBinding('active')
    const r = transform({
      props: { activeKey: b },
      children: [comp('PanelItem', { key: 'k1' })],
    })
    const s = r!.props!.selectedIndex as any
    expect(s.type).toBe('computed')
    expect(s.path).toBe(b.path)
    expect(s.useState.event).toBe('onExpand')
  })

  it('accordion:false → enableMultiExpand:true；size/expandIcon/expandIconPlacement 丢弃', () => {
    const r = transform({
      props: { accordion: false, size: 'large', expandIcon: 'x', expandIconPlacement: 'start' },
      children: [comp('PanelItem', { key: 'k1' })],
    })
    expect(r!.props!.enableMultiExpand).toBe(true)
    expect('size' in r!.props!).toBe(false)
    expect('expandIcon' in r!.props!).toBe(false)
    expect('expandIconPlacement' in r!.props!).toBe(false)
  })

  it('className 透传', () => {
    const r = transform({ props: { className: 'cl' }, children: [comp('PanelItem', { key: 'k1' })] })
    expect(r!.props!.className).toBe('cl')
  })
})
