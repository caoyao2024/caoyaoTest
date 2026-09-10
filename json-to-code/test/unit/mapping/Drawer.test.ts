import { describe, it, expect } from 'vitest'
import { createDrawerMapping } from '../../../api/config/mappings/eview-react/Drawer'
import { Value } from '../../../api/src/core/value-factory'
import { fakeCtx, absBinding, comp, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Drawer 映射
// ═══════════════════════════════════════════════════════════════════

describe('Drawer mapping', () => {
  const mapping = createDrawerMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag/import 与 MappingDef 一致', () => {
    expect(mapping.tag).toBe('Drawer')
    expect(mapping.import).toBe(`${PKG}/Drawer`)
  })

  it('open DataBinding + onClose Action.value → visible ComputedValue.useState(onClose)，extractor 写 closeVal', () => {
    const openB = absBinding('open')
    const onClose = Value.action({ event: 'onClose', action: 'setState', path: '/open', value: false })
    const r = transform({ props: { open: openB, onClose } })
    const v = r!.props!.visible as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(openB.path)
    expect(v.useState.event).toBe('onClose')
    expect(v.useState.extractor('set')).toBe('() => set(false)')
    expect(r!.propRoute.visible).toBe('component-internal')
  })

  it('onClose Action.value=true → extractor 写 true', () => {
    const openB = absBinding('open')
    const onClose = Value.action({ event: 'onClose', action: 'setState', path: '/open', value: true })
    const r = transform({ props: { open: openB, onClose } })
    expect((r!.props!.visible as any).useState.extractor('set')).toBe('() => set(true)')
  })

  it('placement / mask→showMask / title 透传', () => {
    const openB = absBinding('open')
    const r = transform({
      props: { open: openB, placement: 'right', mask: true, title: '抽屉' },
    })
    expect(r!.props!.placement).toBe('right')
    expect(r!.props!.showMask).toBe(true)
    expect(r!.props!.title).toBe('抽屉')
  })

  it('width(number) 同名透传，无默认（不设时不出现）', () => {
    const openB = absBinding('open')
    const withW = transform({ props: { open: openB, width: 380 } })
    expect(withW!.props!.width).toBe(380)
    const noW = transform({ props: { open: absBinding('open') } })
    expect('width' in noW!.props!).toBe(false)
  })

  it('footer SlotNode → resolveNode 后追加到 children（与 body 合并）', () => {
    const ctx = fakeCtx()
    const footerNode = comp('Div', {})
    const body = comp('Span', {})
    const r = transform({
      props: { open: absBinding('open'), footer: Value.slotNode({ node: footerNode as any }) },
      children: [body],
    }, ctx)
    // resolveNode identity → footerNode 原样追加到 body children 后
    expect(r!.children).toHaveLength(2)
    expect(r!.children[0]).toBe(body)
    expect(r!.children[1]).toBe(footerNode)
  })

  it('className 透传；无 footer 时不返回 children（管线用原始 children）', () => {
    const r = transform({ props: { open: absBinding('open'), className: 'dr' } })
    expect(r!.props!.className).toBe('dr')
    expect(r!.children).toBeUndefined()
  })
})
