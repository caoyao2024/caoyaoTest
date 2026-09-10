import { describe, it, expect } from 'vitest'
import { createMenuMapping } from '../../../api/config/mappings/eview-react/Menu'
import { fakeCtx, absBinding, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Menu 映射（vertical→Accordion / horizontal→Tab）
// ═══════════════════════════════════════════════════════════════════

describe('Menu mapping', () => {
  const mapping = createMenuMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  // ── Accordion 分支（vertical/缺省）──

  it('tag=Accordion；import Accordion', () => {
    expect(mapping.tag).toBe('Accordion')
    expect(mapping.import).toBe(`${PKG}/Accordion`)
  })

  it('items 字面量 → data：title/value=key/icon→resolveIcon + openKeys 标记 isExpand', () => {
    const ctx = fakeCtx()
    const r = transform({
      props: {
        items: [
          { title: '新增', key: 'add', icon: 'plus' },
          { title: '编辑', key: 'edit' },
        ],
        openKeys: ['add'],
      },
    }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('plus')
    expect(r!.props!.data).toEqual([
      { title: '新增', value: 'add', icon: ICON_SENTINEL('plus'), isExpand: true },
      { title: '编辑', value: 'edit' },
    ])
  })

  it('Accordion defaults：hideTitleBar/enableMultiOpen/enableExpand(false)/hideIcons', () => {
    const r = transform({ props: { items: [] } })
    expect(r!.props).toMatchObject({
      hideTitleBar: true, enableMultiOpen: true, enableExpand: false, hideIcons: true,
    })
  })

  it('selectedKeys 字面量数组 → selectedValue LiteralValue.useState(onClick，extractor (node)=>setter(node.value))', () => {
    const r = transform({ props: { items: [], selectedKeys: ['a'] } })
    const s = r!.props!.selectedValue as any
    expect(s.type).toBe('literal')
    expect(s.value).toBe('a')
    expect(s.useState.event).toBe('onClick')
    expect(s.useState.extractor('set')).toBe('(node) => set(node.value)')
    expect(r!.propRoute.selectedValue).toBe('component-internal')
  })

  it('selectedKeys DataBinding → ComputedValue.useState(onClick)', () => {
    const b = absBinding('sel')
    const r = transform({ props: { items: [], selectedKeys: b } })
    const s = r!.props!.selectedValue as any
    expect(s.type).toBe('computed')
    expect(s.path).toBe(b.path)
  })

  it('inlineCollapsed → expanded；className 透传', () => {
    const r = transform({ props: { items: [], inlineCollapsed: true, className: 'm' } })
    expect(r!.props!.expanded).toBe(true)
    expect(r!.props!.className).toBe('m')
  })

  // ── Tab 分支（horizontal）──

  it('mode=horizontal → Tab：tag/import/lazyLoad，items→TabItem children（_resolved:false）', () => {
    const r = transform({
      props: { mode: 'horizontal', items: [{ title: 'A', key: 'a1' }] },
    })
    expect(r!.tag).toBe('Tab')
    expect(r!.import).toBe(`${PKG}/Tab`)
    expect(r!.props!.lazyLoad).toBe(true)
    expect(r!.children[0].component).toBe('TabItem')
    expect(r!.children[0]._resolved).toBe(false)
    expect(r!.children[0].props.label).toBe('A')
  })

  it('mode=horizontal + selectedKeys 字面量 → selectedIndex useState(onClick)', () => {
    const r = transform({
      props: {
        mode: 'horizontal',
        items: [{ title: 'A', key: 'a1' }, { title: 'B', key: 'b2' }],
        selectedKeys: ['b2'],
      },
    })
    const s = r!.props!.selectedIndex as any
    expect(s.type).toBe('literal')
    expect(s.value).toBe(1)
    expect(s.useState.event).toBe('onClick')
    expect(r!.propRoute.selectedIndex).toBe('component-internal')
  })
})
