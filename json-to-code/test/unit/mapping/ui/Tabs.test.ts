import { describe, it, expect } from 'vitest'
import { createTabsMapping } from '../../../../api/config/mappings/eview-ui/Tabs'
import { fakeCtx, absBinding, comp, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Tabs 映射（本地副本）
// 与 eview-react 差异：
//   1. onClick extractor 用 Number(index)（eview-ui onClick index 为 string 类型）
//   2. types / tabPlacement 补齐 DataBinding 双形态支持
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Tabs mapping', () => {
  const mapping = createTabsMapping(UI_PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag=Tab；import=UI_PKG/Tab；defaults.lazyLoad=true', () => {
    expect(mapping.tag).toBe('Tab')
    expect(mapping.import).toBe(`${UI_PKG}/Tab`)
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
  })

  it('activeKey 字面量 → extractor 用 Number(index)（与 eview-react 差异）', () => {
    const r = transform({
      props: { activeKey: 'k1' },
      children: [comp('TabItem', { key: 'k1' })],
    })
    const s = r!.props!.selectedIndex as any
    // eview-ui: onClick(index: string) → 需要 Number(index) 转换
    expect(s.useState.extractor('set')).toBe('(index) => set(Number(index))')
  })

  it('activeKey DataBinding → ComputedValue.useState(onClick)；extractor 用 Number(index)', () => {
    const b = absBinding('active')
    const r = transform({
      props: { activeKey: b },
      children: [comp('TabItem', { key: 'k1' })],
    })
    const s = r!.props!.selectedIndex as any
    expect(s.type).toBe('computed')
    expect(s.path).toBe(b.path)
    expect(s.useState.event).toBe('onClick')
    expect(s.useState.extractor('set')).toBe('(index) => set(Number(index))')
  })

  it('无 activeKey → 不输出 selectedIndex', () => {
    const r = transform({ props: {}, children: [comp('TabItem', { key: 'k1' })] })
    expect('selectedIndex' in r!.props!).toBe(false)
  })

  it('types:line/separator→type:main；card→type:sub（字面量）', () => {
    expect(transform({ props: { types: 'line' } }).props!.type).toBe('main')
    expect(transform({ props: { types: 'separator' } }).props!.type).toBe('main')
    expect(transform({ props: { types: 'card' } }).props!.type).toBe('sub')
  })

  it('types DataBinding → ComputedValue 值映射（与 eview-react 差异：react 不支持）', () => {
    const b = absBinding('tabType')
    const r = transform({ props: { types: b } })
    const t = r!.props!.type as any
    expect(t.type).toBe('computed')
    expect(t.path).toBe(b.path)
    expect(t.containsJSX).toBe(false)
    // transform: card→sub，其余→main
    expect(t.transform('card')).toBe('sub')
    expect(t.transform('line')).toBe('main')
    expect(t.transform('separator')).toBe('main')
    expect(t.transform(undefined)).toBe('main') // 默认 line → main
  })

  it('tabPlacement → position 映射（字面量）', () => {
    expect(transform({ props: { tabPlacement: 'top' } }).props!.position).toBe('top')
    expect(transform({ props: { tabPlacement: 'end' } }).props!.position).toBe('right')
    expect(transform({ props: { tabPlacement: 'bottom' } }).props!.position).toBe('bottom')
    expect(transform({ props: { tabPlacement: 'start' } }).props!.position).toBe('left')
  })

  it('tabPlacement DataBinding → ComputedValue 值映射', () => {
    const b = absBinding('placement')
    const r = transform({ props: { tabPlacement: b } })
    const p = r!.props!.position as any
    expect(p.type).toBe('computed')
    expect(p.path).toBe(b.path)
    expect(p.containsJSX).toBe(false)
    // transform: end→right，top→top，未知→top
    expect(p.transform('end')).toBe('right')
    expect(p.transform('top')).toBe('top')
    expect(p.transform('start')).toBe('left')
    expect(p.transform('bottom')).toBe('bottom')
    expect(p.transform('unknown')).toBe('top') // fallback
  })

  it('maxVisible / size 丢弃；className 透传', () => {
    const r = transform({ props: { maxVisible: 5, size: 'large', className: 'tb' } })
    expect('maxVisible' in r!.props!).toBe(false)
    expect('size' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('tb')
  })
})
