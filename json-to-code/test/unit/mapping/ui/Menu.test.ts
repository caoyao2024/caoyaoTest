import { describe, it, expect } from 'vitest'
import { createMenuMapping } from '../../../../api/config/mappings/eview-ui/Menu'
import { iconNameToPath } from '../../../../api/config/mappings/eview-ui/icon-placeholder'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Menu 映射（本地副本）
// 与 eview-react 差异：icon 走真实路径 /icons/<name>.svg（icon 名直接拼），不调
// resolveIcon、不产 React DOM。Accordion data 的 icon 是路径字符串 → data 无 JSX →
// items DataBinding 的 containsJSX 翻 false（data 走 state.js 纯 JSON）。
// Tab 分支 icon 委托 TabItem 映射（已走真实路径），此处只验委托原样透传。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Menu mapping', () => {
  const mapping = createMenuMapping(UI_PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('Accordion：tag/import', () => {
    expect(mapping.tag).toBe('Accordion')
    expect(mapping.import).toBe(`${UI_PKG}/Accordion`)
  })

  it('Accordion 字面量 items：有 icon 字段 → data[].icon=真实路径；不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const r = transform({ items: [{ key: 'k1', title: 't1', icon: 'home' }, { key: 'k2', title: 't2' }] }, ctx)
    const p = r!.props as any
    const data = p.data as any[]
    expect(data[0].icon).toBe(iconNameToPath('home'))
    expect(data[0].title).toBe('t1')
    expect(data[0].value).toBe('k1')
    expect('icon' in data[1]).toBe(false) // 无 icon 字段不加
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    // eview-ui Accordion 不支持 hideIcons：transform 内不加
    expect('hideIcons' in p).toBe(false)
    // 其余 Accordion defaults 仍加
    expect(p.hideTitleBar).toBe(true)
    expect(p.enableMultiOpen).toBe(true)
    expect(p.enableExpand).toBe(false)
  })

  it('Accordion 字面量 items 递归 children：icon 真实路径', () => {
    const r = transform({ items: [{ key: 'k1', title: 't1', icon: 'a', children: [{ key: 'k2', title: 't2', icon: 'b' }] }] })
    const data = r!.props!.data as any[]
    expect(data[0].icon).toBe(iconNameToPath('a'))
    expect(data[0].children[0].icon).toBe(iconNameToPath('b'))
  })

  it('Accordion DataBinding items：CV containsJSX:false（data 走 state.js 纯 JSON）', () => {
    const b = absBinding('menuData')
    const r = transform({ items: b })
    const cv = r!.props!.data as any
    expect(cv.type).toBe('computed')
    expect(cv.containsJSX).toBe(false)
    expect(cv.path).toBe(b.path)
  })

  it('Tab 分支（mode:horizontal）：tag=Tab/import，items→TabItem children（icon 原样委托，由 TabItem 走真实路径）', () => {
    const r = transform({ mode: 'horizontal', items: [{ key: 'k1', title: 't1', icon: 'home' }] })
    expect(r!.tag).toBe('Tab')
    expect(r!.import).toBe(`${UI_PKG}/Tab`)
    expect(Array.isArray(r!.children)).toBe(true)
    const ti = (r!.children as any[])[0]
    expect(ti.component).toBe('TabItem')
    expect(ti.props.label).toBe('t1')
    expect(ti.props.icon).toBe('home') // 原样透传，TabItem 映射负责走真实路径
  })
})
