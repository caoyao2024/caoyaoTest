import { describe, it, expect } from 'vitest'
import DropdownMapping from '../../../../api/config/mappings/eview-ui/Dropdown'
import { iconNameToPath } from '../../../../api/config/mappings/eview-ui/icon-placeholder'
import { fakeCtx, absBinding, relBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Dropdown bespoke 映射
// 与 eview-react 差异：menu → overlay 是 Menu 组件节点（eview-react 转 data 数组）。
// 组件名 Dropdown（小写 d）；placement 直接透传（eview-react 映射 position/popupDirection）。
// icon 差异：Menu.Item 的 icon 走真实路径 /icons/<name>.svg（icon 名直接拼），不调 resolveIcon。
//
// 两条判定路径：
//  - 字面量 menu：transform 期直接 buildMenuOverlayFromLiteral → SlotNode（内联 emit）。
//  - DataBinding menu：transform 期产 containsJSX:true CV（overlay=ComputedValue），
//    形状 deferred 到 materialization 烘焙（CV.transform 拿 rawData 调 buildMenuOverlayFromLiteral）。
//    本测对 binding 分支既断 transform 期输出（CV 形态），又直接调 CV.transform 断烘焙 Menu 树。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Dropdown bespoke (Dropdown)', () => {
  const transform = (node: any, ctx = fakeCtx()) => DropdownMapping.transform!(node, ctx)

  it('tag=Dropdown；import 路径', () => {
    expect(DropdownMapping.tag).toBe('Dropdown')
    expect(DropdownMapping.import).toBe(`${UI_PKG}/Dropdown`)
  })

  it('menu 字面量数组 → overlay=SlotNode，node=Menu（_resolved，import Menu），children=N 个 Menu.Item', () => {
    const ctx = fakeCtx()
    const r = transform({
      props: { menu: [{ label: '新增', key: 'add', icon: 'plus' }, { label: '编辑', key: 'edit' }] },
    }, ctx)
    const overlay = r!.props!.overlay as any
    // 包成 SlotNode 作 prop 值（consumeValue/emitValue 走 slotNode 路径处理 LoopNode）
    expect(overlay.type).toBe('slotNode')
    const menu = overlay.node
    expect(menu.component).toBe('Menu')
    expect(menu.tag).toBe('Menu')
    expect(menu.import).toBe(`${UI_PKG}/Menu`)
    expect(menu._resolved).toBe(true)
    expect(menu.children).toHaveLength(2)

    // 第一个 Menu.Item
    const item0 = menu.children[0]
    expect(item0.component).toBe('Menu.Item')
    expect(item0._resolved).toBe(true)
    expect(item0.props.key).toBe('add')
    expect(item0.props.icon).toBe(iconNameToPath('plus')) // 真实路径 /icons/plus.svg
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    // label → TextNode children
    expect(item0.children[0].kind).toBe('text')
    expect(item0.children[0].value).toBe('新增')
  })

  it('menu 字面量含 children → overlay 内 Menu.SubMenu（title=label, 递归 Menu.Item 子项, icon 真实路径）', () => {
    const ctx = fakeCtx()
    const r = transform({
      props: { menu: [{
        label: '更多', key: 'more', icon: 'more-icon',
        children: [
          { label: '导出', key: 'export' },
          { label: '导入', key: 'import' },
        ],
      }] },
    }, ctx)
    const menu = (r!.props!.overlay as any).node
    expect(menu.children).toHaveLength(1)

    // 顶层项有 children → Menu.SubMenu
    const sub = menu.children[0]
    expect(sub.component).toBe('Menu.SubMenu')
    expect(sub.tag).toBe('Menu.SubMenu')
    expect(sub._resolved).toBe(true)
    // label → title prop（SubMenu 标题是 prop，非 children TextNode）
    expect(sub.props.title).toBe('更多')
    expect(sub.props.key).toBe('more')
    expect(sub.props.icon).toBe(iconNameToPath('more-icon')) // 真实路径
    expect(sub.import).toBeUndefined() // 内联，复用父 Menu 的 default import
    expect(sub.selfClosing).toBeFalsy() // 有子项，不自闭合

    // children 递归 → 两个 Menu.Item
    expect(sub.children).toHaveLength(2)
    const item0 = sub.children[0]
    expect(item0.component).toBe('Menu.Item')
    expect(item0.props.key).toBe('export')
    expect(item0.children[0].kind).toBe('text')
    expect(item0.children[0].value).toBe('导出')
    expect(ctx.resolveIcon).not.toHaveBeenCalled() // eview-ui icon 走真实路径，不调 resolveIcon
  })

  it('menu 字面量混合（含子菜单 + 普通项）→ SubMenu 与 Menu.Item 并存', () => {
    const r = transform({
      props: { menu: [
        { label: '普通', key: 'normal' },
        { label: '更多', key: 'more', children: [{ label: '导出', key: 'export' }] },
      ] },
    }, fakeCtx())
    const menu = (r!.props!.overlay as any).node
    expect(menu.children).toHaveLength(2)
    expect(menu.children[0].component).toBe('Menu.Item')
    expect(menu.children[1].component).toBe('Menu.SubMenu')
    expect(menu.children[1].children[0].component).toBe('Menu.Item')
  })

  // ════════════════════════════════════════════════════════════════
  // DataBinding menu：overlay 烘焙为 containsJSX:true CV（替掉旧 inline LoopNode +
  // resolveAbsoluteStateValue）。transform 期产 CV（形状 deferred），materialization 期
  // CV.transform 拿 rawData 烘焙静态 Menu 树（per-item Item/SubMenu，不再要求均匀嵌套契约）。
  // ════════════════════════════════════════════════════════════════

  it('menu DataBinding → overlay=containsJSX:true CV（transform 期不定形状，deferred 到 materialization）', () => {
    const ctx = fakeCtx()
    const r = transform({ props: { menu: absBinding('menu') } }, ctx)
    const overlay = r!.props!.overlay as any
    // 烘焙 CV：type computed + containsJSX:true（非 slotNode——字面量才走 slotNode 内联 emit）
    expect(overlay.type).toBe('computed')
    expect(overlay.containsJSX).toBe(true)
    expect(overlay.path).toBe('/menu')
    expect(overlay.pathType).toBe('absolute')
    expect(overlay.accessPath).toBe('menu')
    // transform 是函数（transform 期不调，state-builder materialization 才调）
    expect(typeof overlay.transform).toBe('function')
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })

  // ─── CV transform 烘焙旁路：直接调 overlay.transform，断烘焙 Menu 树形态 ───

  it('CV transform（无 children）→ 烘焙 Menu 树，per-item Menu.Item（label→TextNode, icon=真实路径, key 透传）', () => {
    const ctx = fakeCtx()
    const r = transform({ props: { menu: absBinding('menu') } }, ctx)
    const cv = (r!.props!.overlay as any)
    const menu = cv.transform([{ label: '新增', key: 'add', icon: 'plus' }, { label: '编辑', key: 'edit' }])
    expect(menu.kind).toBe('component')
    expect(menu.component).toBe('Menu')
    expect(menu.tag).toBe('Menu')
    expect(menu.import).toBe(`${UI_PKG}/Menu`)
    expect(menu._resolved).toBe(true)
    expect(menu.children).toHaveLength(2)

    const item0 = menu.children[0]
    expect(item0.component).toBe('Menu.Item')
    expect(item0._resolved).toBe(true)
    expect(item0.props.key).toBe('add')
    expect(item0.props.icon).toBe(iconNameToPath('plus')) // 真实路径 /icons/plus.svg
    expect(item0.children[0].kind).toBe('text')
    expect(item0.children[0].value).toBe('新增')
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })

  it('CV transform（含 children）→ per-item SubMenu（title=label, 递归 Menu.Item, icon=真实路径）', () => {
    const r = transform({ props: { menu: absBinding('menu') } }, fakeCtx())
    const cv = (r!.props!.overlay as any)
    const menu = cv.transform([{
      label: '更多', key: 'more', icon: 'more-icon',
      children: [{ label: '导出', key: 'export' }, { label: '导入', key: 'import' }],
    }])
    expect(menu.children).toHaveLength(1)

    const sub = menu.children[0]
    expect(sub.component).toBe('Menu.SubMenu')
    expect(sub.tag).toBe('Menu.SubMenu')
    expect(sub._resolved).toBe(true)
    expect(sub.props.title).toBe('更多') // label → title prop（非 children TextNode）
    expect(sub.props.key).toBe('more')
    expect(sub.props.icon).toBe(iconNameToPath('more-icon'))
    expect(sub.import).toBeUndefined() // 内联，复用父 Menu default import
    expect(sub.selfClosing).toBeFalsy() // 有子项

    expect(sub.children).toHaveLength(2)
    expect(sub.children[0].component).toBe('Menu.Item')
    expect(sub.children[0].children[0].kind).toBe('text')
    expect(sub.children[0].children[0].value).toBe('导出')
  })

  it('CV transform（混合嵌套——不再要求均匀契约）→ SubMenu 与 Item 并存（per-item 独立判定）', () => {
    const r = transform({ props: { menu: absBinding('menu') } }, fakeCtx())
    const cv = (r!.props!.overlay as any)
    const menu = cv.transform([
      { label: '普通', key: 'normal' },
      { label: '更多', key: 'more', children: [{ label: '导出', key: 'export' }] },
    ])
    expect(menu.children).toHaveLength(2)
    expect(menu.children[0].component).toBe('Menu.Item')
    expect(menu.children[1].component).toBe('Menu.SubMenu')
    expect(menu.children[1].children[0].component).toBe('Menu.Item')
  })

  it('CV transform（空/undefined/非数组数据）→ 空 Menu（children=[]）', () => {
    const r = transform({ props: { menu: absBinding('menu') } }, fakeCtx())
    const cv = (r!.props!.overlay as any)
    expect(cv.transform(undefined).children).toEqual([])
    expect(cv.transform([]).children).toEqual([])
    expect(cv.transform({ not: 'array' }).children).toEqual([])
  })

  it('CV transform（相对路径 binding）→ pathType=relative 透传，transform 同机制（循环内 rawData 已是当前项）', () => {
    const r = transform({ props: { menu: relBinding('menu') } }, fakeCtx())
    const cv = (r!.props!.overlay as any)
    expect(cv.pathType).toBe('relative')
    // transform 同机制：相对路径在循环内时，materialization 期 rawData 已是当前项数据
    const menu = cv.transform([{ label: 'a', key: 'a' }])
    expect(menu.children[0].component).toBe('Menu.Item')
    expect(menu.children[0].children[0].value).toBe('a')
  })

  it('placement 直接透传（不再映射 position/popupDirection）', () => {
    const r = transform({ props: { menu: [], placement: 'bottomLeft' } })
    expect(r!.props!.placement).toBe('bottomLeft')
    expect(r!.props!.position).toBeUndefined()
    expect(r!.props!.popupDirection).toBeUndefined()
  })

  it('trigger 数组 → trigger[0]；className 透传；无 children 字段（transform 只返 props）', () => {
    const r = transform({ props: { menu: [], trigger: ['hover', 'click'], className: 'dd' } })
    expect(r!.props!.trigger).toBe('hover')
    expect(r!.props!.className).toBe('dd')
    expect(r!.children).toBeUndefined()
  })
})
