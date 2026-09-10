import { describe, it, expect } from 'vitest'
import { createTimelineMapping } from '../../../api/config/mappings/eview-react/Timeline'
import { Value } from '../../../api/src/core/value-factory'
import { fakeCtx, comp, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Timeline → TimeLine 映射（吞噬 children → data + render）
// ═══════════════════════════════════════════════════════════════════

describe('Timeline mapping', () => {
  const mapping = createTimelineMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag=TimeLine；import 路径', () => {
    expect(mapping.tag).toBe('TimeLine')
    expect(mapping.import).toBe(`${PKG}/TimeLine`)
  })

  it('orientation/mode/variant 丢弃；className 透传；无 children → data: []', () => {
    const r = transform({ props: { orientation: 'horizontal', mode: 'x', variant: 'y', className: 'tl' } })
    for (const k of ['orientation', 'mode', 'variant']) {
      expect(k in r!.props!).toBe(false)
    }
    expect(r!.props!.className).toBe('tl')
    expect(r!.props!.data).toEqual([])
  })

  it('静态 children 文本 content → data(title+content[{title,text}]) + render rawExpr，propRoute 无', () => {
    const r = transform({
      props: {},
      children: [
        comp('TimelineItem', { title: '2024-01-01', content: '事件A' }),
      ],
    })
    expect(r!.props!.data).toEqual([
      { title: '2024-01-01', content: [{ title: '2024-01-01', text: '事件A' }] },
    ])
    const render = r!.props!.render as any
    expect(render.type).toBe('rawExpr')
    expect(r!.propRoute).toBeUndefined()
    expect(r!.children).toBeNull()
  })

  it('静态 children SlotNode content → render renderFn，propRoute.render=module-top', () => {
    const slotNode = comp('Div', {})
    const r = transform({
      props: {},
      children: [
        comp('TimelineItem', { content: Value.slotNode({ node: slotNode as any }) }),
      ],
    })
    const render = r!.props!.render as any
    expect(render.type).toBe('renderFn')
    expect(render.params).toEqual([{ name: 'content' }])
    expect(r!.propRoute.render).toBe('module-top')
  })

  it('icon 字面量 → resolveIcon → data[].icon', () => {
    const ctx = fakeCtx()
    const r = transform({
      props: {},
      children: [
        comp('TimelineItem', { title: '2024-01-01', content: 'A', icon: 'plus' }),
      ],
    }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('plus')
    expect(r!.props!.data[0].icon).toStrictEqual(ICON_SENTINEL('plus'))
  })

  it('icon DataBinding → data[].icon ComputedValue（containsJSX:true）', () => {
    const r = transform({
      props: {},
      children: [
        comp('TimelineItem', { title: '2024-01-01', content: 'A', icon: { type: 'binding', path: '/ic', pathType: 'absolute', accessPath: '/ic' } }),
      ],
    })
    const icon = r!.props!.data[0].icon as any
    expect(icon.type).toBe('computed')
    expect(icon.containsJSX).toBe(true)
  })
})
