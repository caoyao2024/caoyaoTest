import { describe, it, expect } from 'vitest'
import { createDropdownMapping } from '../../../api/config/mappings/eview-react/Dropdown'
import { fakeCtx, absBinding, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Dropdown 映射
//
// 两条判定路径：
//  - 字面量 menu：transform 期 inspect 决定分支（tag 在 TransformResult 定死）。
//  - DataBinding menu：transform 期不定分支——统一产 data CV + 默认 DropDown tag，
//    分支判定 deferred 到 CV transform（state-builder 期按运行时数据写 ctx.override
//    切 tag/import/renameProps/deleteProps）。本测对 binding 分支既断 transform 期输出
//    （统一形态），又直接调 CV.transform 断 override 旁路 + 返回形态。
// ═══════════════════════════════════════════════════════════════════

describe('Dropdown mapping', () => {
  const mapping = createDropdownMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=DropDown（大小写如此）', () => {
    expect(mapping.tag).toBe('DropDown')
    expect(mapping.import).toBe(`${PKG}/DropDown`)
  })

  it('menu 字面量 → data：label→text / key→value / icon→resolveIcon', () => {
    const ctx = fakeCtx()
    const r = transform({ menu: [{ label: '新增', key: 'add', icon: 'plus' }] }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('plus')
    expect(r!.props!.data).toEqual([
      { text: '新增', value: 'add', icon: ICON_SENTINEL('plus') },
    ])
  })

  it('placement 映射：bottom→position:auto/popupDirection:bottom；bottomLeft→position:left', () => {
    expect(transform({ placement: 'bottom' }).props).toMatchObject({
      position: 'auto', popupDirection: 'bottom',
    })
    expect(transform({ placement: 'bottomLeft' }).props).toMatchObject({
      position: 'left', popupDirection: 'bottom',
    })
    expect(transform({ placement: 'top' }).props).toMatchObject({
      position: 'auto', popupDirection: 'top',
    })
  })

  it('menu 字面量含 children → PopUpMenu（tag/import 覆盖, options 含 submenus, icon→iconUrl, 丢弃 trigger）', () => {
    const ctx = fakeCtx()
    const r = transform({
      menu: [{
        label: '更多', key: 'more', icon: 'plus',
        children: [{ label: '导出', key: 'export' }, { label: '导入', key: 'import' }],
      }],
    }, ctx)
    // tag/import 覆盖到 PopUpMenu（registry.transform `result.tag ?? def.tag`）
    expect(r!.tag).toBe('PopUpMenu')
    expect(r!.import).toBe(`${PKG}/PopUpMenu`)
    // icon 走 resolveIcon → iconUrl（非 DropDown 的 icon 字段）
    expect(ctx.resolveIcon).toHaveBeenCalledWith('plus')
    expect(r!.props!.options).toEqual([
      { text: '更多', value: 'more', iconUrl: ICON_SENTINEL('plus'), submenus: [
        { text: '导出', value: 'export' },
        { text: '导入', value: 'import' },
      ] },
    ])
    // PopUpMenu 触发固定 click → 不 emit trigger
    expect(r!.props!.trigger).toBeUndefined()
    // 不返回 children → 管线沿用原始 node.children 作触发元素
    expect(r!.children).toBeUndefined()
  })

  it('PopUpMenu placement → direction + hDirection（top→up/auto；bottomLeft→down/left）', () => {
    const menu = [{ label: 'a', key: 'a', children: [{ label: 'b', key: 'b' }] }]
    expect(transform({ menu, placement: 'bottomLeft' }).props).toMatchObject({
      direction: 'down', hDirection: 'left',
    })
    expect(transform({ menu, placement: 'top' }).props).toMatchObject({
      direction: 'up', hDirection: 'auto',
    })
  })

  it('PopUpMenu 横向 placement 命不中 → 不 emit direction/hDirection（fallback 组件默认 auto）', () => {
    const r = transform({ menu: [{ label: 'a', key: 'a', children: [{ label: 'b', key: 'b' }] }], placement: 'leftTop' })
    expect(r!.tag).toBe('PopUpMenu')
    expect(r!.props!.direction).toBeUndefined()
    expect(r!.props!.hDirection).toBeUndefined()
  })

  it('trigger 数组→取首项', () => {
    expect(transform({ trigger: ['hover', 'click'] }).props!.trigger).toBe('hover')
  })

  it('className 透传', () => {
    expect(transform({ className: 'dd' }).props!.className).toBe('dd')
  })

  // ════════════════════════════════════════════════════════════════
  // DataBinding menu：override 迁移后，transform 期统一形态（不定分支）
  // ════════════════════════════════════════════════════════════════

  it('menu DataBinding → 统一 data CV containsJSX:true + 默认 DropDown tag（transform 期不切分支）', () => {
    const r = transform({ menu: absBinding('menuData') })
    // tag 不覆盖（分支 deferred 到 state-builder）→ DropDown 默认
    expect(r!.tag).toBeUndefined()
    expect((r!.props as any).data.type).toBe('computed')
    expect((r!.props as any).data.containsJSX).toBe(true)
    // transform 期是 data（非 options）；CV transform 期才按 override 改名 data→options
    expect((r!.props as any).options).toBeUndefined()
  })

  it('binding + placement → 两套 placement 都 emit + trigger 透传（override 期删非适用那套）', () => {
    const r = transform({ menu: absBinding('menuData'), placement: 'bottomLeft', trigger: ['hover', 'click'] })
    const p = r!.props as any
    // DropDown placement（position/popupDirection）
    expect(p.position).toBe('left')
    expect(p.popupDirection).toBe('bottom')
    // PopUpMenu placement（direction/hDirection）——两套都 emit，CV transform 的 override.deleteProps 删非适用
    expect(p.direction).toBe('down')
    expect(p.hDirection).toBe('left')
    // trigger 透传（PopUpMenu 时 override 删；DropDown 保留）
    expect(p.trigger).toBe('hover')
    // 仍 data CV（非 options）
    expect(p.data.type).toBe('computed')
  })

  it('binding + 横向 placement 命不中 → 两套对应项都不 emit（fallback 组件默认）', () => {
    const r = transform({ menu: absBinding('menuData'), placement: 'leftTop' })
    const p = r!.props as any
    expect(p.position).toBeUndefined()
    expect(p.popupDirection).toBeUndefined()
    expect(p.direction).toBeUndefined()
    expect(p.hDirection).toBeUndefined()
  })

  // ─── CV transform 旁路：直接调 data CV 的 transform，断 override + 返回形态 ───

  it('CV transform（hasChildren）→ PopUpMenu 形态 + override 切 tag/renameProps/deleteProps', () => {
    const ctx = fakeCtx()
    const r = transform({ menu: absBinding('menuData') }, ctx)
    const cv = (r!.props as any).data
    const cvCtx: any = {}
    const out = cv.transform(
      [{ label: '更多', key: 'more', icon: 'plus', children: [{ label: '导出', key: 'export' }] }],
      cvCtx,
    )
    // override：切 PopUpMenu + data→options + 删 DropDown 专属 placement + trigger
    expect(cvCtx.override).toEqual({
      tag: 'PopUpMenu',
      import: `${PKG}/PopUpMenu`,
      renameProps: { data: 'options' },
      deleteProps: ['position', 'popupDirection', 'trigger'],
    })
    // 返回 PopUpMenu 形态（icon→iconUrl + submenus 递归）
    expect(ctx.resolveIcon).toHaveBeenCalledWith('plus')
    expect(out).toEqual([
      { text: '更多', value: 'more', iconUrl: ICON_SENTINEL('plus'), submenus: [{ text: '导出', value: 'export' }] },
    ])
  })

  it('CV transform（无 children）→ DropDown 形态 + override 删 PopUpMenu 专属 placement', () => {
    const ctx = fakeCtx()
    const r = transform({ menu: absBinding('menuData') }, ctx)
    const cv = (r!.props as any).data
    const cvCtx: any = {}
    const out = cv.transform([{ label: '新增', key: 'add', icon: 'plus' }], cvCtx)
    // override：不切 tag/import/prop 名，只删 PopUpMenu 专属 placement
    expect(cvCtx.override).toEqual({ deleteProps: ['direction', 'hDirection'] })
    // 返回 DropDown 形态（icon→icon，无 submenus）
    expect(out).toEqual([{ text: '新增', value: 'add', icon: ICON_SENTINEL('plus') }])
  })

  it('CV transform（空/undefined 数据）→ DropDown fallback 形态 + override 删 PopUpMenu placement', () => {
    const r = transform({ menu: absBinding('menuData') })
    const cv = (r!.props as any).data
    const cvCtx: any = {}
    expect(cv.transform(undefined, cvCtx)).toEqual([])
    expect(cvCtx.override).toEqual({ deleteProps: ['direction', 'hDirection'] })
  })
})
