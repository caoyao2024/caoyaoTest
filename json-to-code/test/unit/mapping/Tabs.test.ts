import { describe, it, expect } from 'vitest'
import { createTabsMapping } from '../../../api/config/mappings/eview-react/Tabs'
import { fakeCtx, absBinding, comp, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Tabs 映射
// ═══════════════════════════════════════════════════════════════════

describe('Tabs mapping', () => {
  const mapping = createTabsMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag=Tab；defaults.lazyLoad=true', () => {
    expect(mapping.tag).toBe('Tab')
    expect(mapping.import).toBe(`${PKG}/Tab`)
    expect(mapping.defaults).toEqual({ lazyLoad: true })
  })

  it('activeKey 字面量 + 静态 children → selectedIndex=index LiteralValue.useState(onClick)', () => {
    const r = transform({
      props: { activeKey: 'k2' },
      children: [comp('TabItem', { key: 'k1' }), comp('TabItem', { key: 'k2' })],
    })
    const s = r!.props!.selectedIndex as any
    expect(s.type).toBe('literal')
    expect(s.value).toBe(1)
    expect(s.useState.event).toBe('onClick')
    expect(s.useState.extractor('set')).toBe('(index) => set(index)')
  })

  it('activeKey DataBinding → ComputedValue.useState(onClick)', () => {
    const b = absBinding('active')
    const r = transform({
      props: { activeKey: b },
      children: [comp('TabItem', { key: 'k1' })],
    })
    const s = r!.props!.selectedIndex as any
    expect(s.type).toBe('computed')
    expect(s.path).toBe(b.path)
    expect(s.useState.event).toBe('onClick')
  })

  it('无 activeKey → 不输出 selectedIndex', () => {
    const r = transform({ props: {}, children: [comp('TabItem', { key: 'k1' })] })
    expect('selectedIndex' in r!.props!).toBe(false)
  })

  it('types:line/separator→type:main；card→type:sub', () => {
    expect(transform({ props: { types: 'line' } }).props!.type).toBe('main')
    expect(transform({ props: { types: 'separator' } }).props!.type).toBe('main')
    expect(transform({ props: { types: 'card' } }).props!.type).toBe('sub')
  })

  it('tabPlacement → position 映射（top/end/bottom/start）', () => {
    expect(transform({ props: { tabPlacement: 'top' } }).props!.position).toBe('top')
    expect(transform({ props: { tabPlacement: 'end' } }).props!.position).toBe('right')
    expect(transform({ props: { tabPlacement: 'bottom' } }).props!.position).toBe('bottom')
    expect(transform({ props: { tabPlacement: 'start' } }).props!.position).toBe('left')
  })

  it('maxVisible / size 丢弃；className 透传', () => {
    const r = transform({ props: { maxVisible: 5, size: 'large', className: 'tb' } })
    expect('maxVisible' in r!.props!).toBe(false)
    expect('size' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('tb')
  })
})
