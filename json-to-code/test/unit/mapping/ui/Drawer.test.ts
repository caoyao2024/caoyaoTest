import { describe, it, expect } from 'vitest'
import { createDrawerMapping } from '../../../../api/config/mappings/eview-ui/Drawer'
import { Value } from '../../../../api/src/core/value-factory'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Drawer 映射（本地工厂副本）
//
// 与 eview-react/Drawer.ts 的差异（三处）：
//  1. eview-ui 默认加 height='100%'（仅 right/left/缺省 时加，top/bottom 不加），
//     eview-react 不加任何 height。width：两边都同名透传显式值，但 eview-ui 缺省时注入默认 300
//     （仅 right/left/缺省，与 height 同条件；eview-react 不注入）——差异之二。
//  2. mask → maskSetting.show（嵌套对象，eview-ui 专属形态；eview-react 为扁平 showMask）。
//  3. footer → 直接赋 footer prop（eview-ui Drawer 有 footer: ReactNode|false prop；
//     eview-react 无独立 footer slot、其副本把 footer 追加到 children）。
// 其余逻辑与 eview-react 一致（由 react 侧 Drawer.test.ts 覆盖 + e2e:ui 兜底），
// 此处只断言差异点 + width。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Drawer mapping', () => {
  const mapping = createDrawerMapping(UI_PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag/import 用 eview-ui 包名', () => {
    expect(mapping.tag).toBe('Drawer')
    expect(mapping.import).toBe(`${UI_PKG}/Drawer`)
  })

  it('placement:right → height=100% + width 默认 300', () => {
    const r = transform({ props: { open: absBinding('open'), placement: 'right' } })
    const p = r!.props as any
    expect(p.height).toBe('100%')
    expect(p.width).toBe(300)
  })

  it('placement:left → height=100% + width 默认 300', () => {
    const r = transform({ props: { open: absBinding('open'), placement: 'left' } })
    const p = r!.props as any
    expect(p.height).toBe('100%')
    expect(p.width).toBe(300)
  })

  it('缺省 placement → height=100% + width 默认 300', () => {
    const r = transform({ props: { open: absBinding('open') } })
    const p = r!.props as any
    expect(p.height).toBe('100%')
    expect(p.width).toBe(300)
  })

  it('placement:top → 不加 height（width 也不加）', () => {
    const r = transform({ props: { open: absBinding('open'), placement: 'top' } })
    const p = r!.props as any
    expect('height' in p).toBe(false)
    expect('width' in p).toBe(false)
  })

  it('placement:bottom → 不加 height（width 也不加）', () => {
    const r = transform({ props: { open: absBinding('open'), placement: 'bottom' } })
    const p = r!.props as any
    expect('height' in p).toBe(false)
    expect('width' in p).toBe(false)
  })

  it('width(number) 同名透传，不受 placement 限制；无 width 时 right 注入默认 300', () => {
    // top + width：显式 width 透传，height 仍按 placement 不加
    const r = transform({ props: { open: absBinding('open'), placement: 'top', width: 420 } })
    const p = r!.props as any
    expect(p.width).toBe(420)
    expect('height' in p).toBe(false)
    // right + width：显式 width 透传，height 默认仍加
    const r2 = transform({ props: { open: absBinding('open'), placement: 'right', width: 380 } })
    const p2 = r2!.props as any
    expect(p2.width).toBe(380)
    expect(p2.height).toBe('100%')
    // 无 width（right）：注入默认 300
    const r3 = transform({ props: { open: absBinding('open'), placement: 'right' } })
    expect((r3!.props as any).width).toBe(300)
  })

  // 其余 props（open→visible useState / className）与 eview-react 一致，由 react 侧
  // Drawer.test.ts 覆盖。mask / footer 是 eview-ui 差异点（下方单独断言）。仅冒烟 visible 仍受控。
  it('open DataBinding + onClose Action.value → visible ComputedValue.useState(onClose)', () => {
    const openB = absBinding('open')
    const onClose = Value.action({ event: 'onClose', action: 'setState', path: '/open', value: false })
    const r = transform({ props: { open: openB, onClose, placement: 'right' } })
    const v = (r!.props as any).visible as any
    expect(v.type).toBe('computed')
    expect(v.useState.event).toBe('onClose')
    expect(v.useState.extractor('set')).toBe('() => set(false)')
    expect(r!.propRoute.visible).toBe('component-internal')
  })

  // ─── eview-ui 差异点 2：mask → maskSetting.show（嵌套对象，非 react 的 showMask） ───
  it('mask → maskSetting.show（嵌套对象 { show }，非 react 的扁平 showMask）', () => {
    const r = transform({ props: { open: absBinding('open'), placement: 'right', mask: true } })
    const p = r!.props as any
    // 嵌套对象形态：maskSetting: { show: true }
    expect(p.maskSetting).toEqual({ show: true })
    // 非扁平 showMask（eview-react 才用 showMask）
    expect('showMask' in p).toBe(false)
  })

  it('缺省 mask → 不出现 maskSetting（eview-ui 默认遮罩行为，不显式设置）', () => {
    const r = transform({ props: { open: absBinding('open'), placement: 'right' } })
    const p = r!.props as any
    expect('maskSetting' in p).toBe(false)
    expect('showMask' in p).toBe(false)
  })

  // ─── eview-ui 差异点 3：footer → 直接赋 footer prop（非 react 的并入 children） ───
  it('footer SlotNode → 直接赋 footer prop（SlotNode 包裹，非并入 children）', () => {
    const footerNode = { __node: true, kind: 'component', component: 'div', tag: 'div' } as any
    const r = transform({
      props: { open: absBinding('open'), placement: 'right', footer: { __node: true, type: 'slotNode', node: footerNode } as any },
      children: [{ __node: true, kind: 'component', component: 'div', tag: 'div', id: 'body' } as any],
    })
    const p = r!.props as any
    // footer 作为 prop（SlotNode 包裹），不再并入 children
    expect(p.footer).toBeDefined()
    expect((p.footer as any).type).toBe('slotNode')
    expect((p.footer as any).node).toBeDefined()
    // 无 children 合并：result 不返回 children（footer 走 prop，body 仍走原始 children）
    expect(r!.children).toBeUndefined()
  })

  it('无 footer → 不出现 footer prop、children 不变', () => {
    const r = transform({ props: { open: absBinding('open'), placement: 'right' } })
    const p = r!.props as any
    expect('footer' in p).toBe(false)
    expect(r!.children).toBeUndefined()
  })
})
