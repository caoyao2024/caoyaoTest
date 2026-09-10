import { describe, it, expect } from 'vitest'
import { createTabItemMapping } from '../../../../api/config/mappings/eview-ui/TabItem'
import { iconNameToPath } from '../../../../api/config/mappings/eview-ui/icon-placeholder'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui TabItem 映射（本地副本）
// 与 eview-react 差异：icon 走真实路径 /icons/<name>.svg（字面量直接拼；
// DataBinding 走 ComputedValue 闭包拼接），不调 resolveIcon、不产 React DOM——
// eview-ui 的 icon 相关属性只接 URL。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui TabItem mapping', () => {
  const mapping = createTabItemMapping(UI_PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=TabItem；import 是 Tab 的 named export', () => {
    expect(mapping.tag).toBe('TabItem')
    const imp = mapping.import as any
    expect(imp.source).toBe(`${UI_PKG}/Tab`)
    expect(imp.named).toBe(true)
  })

  it('icon 字面量 → 真实路径 /icons/<name>.svg；不调 resolveIcon（与 eview-react 差异）', () => {
    const ctx = fakeCtx()
    const r = transform({ icon: 'plus' }, ctx)
    expect(r!.props!.icon).toBe(iconNameToPath('plus'))
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })

  it('icon DataBinding → ComputedValue containsJSX:false（transform 闭包拼路径）；不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const r = transform({ icon: absBinding('ic') }, ctx)
    const icon = r!.props!.icon as any
    expect(icon.type).toBe('computed')
    expect(icon.containsJSX).toBe(false)
    expect(icon.path).toBe('/ic')
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })

  it('label→title（字面量/DataBinding 透传）', () => {
    expect(transform({ label: '标题' }).props!.title).toBe('标题')
    const b = absBinding('lab')
    expect(transform({ label: b }).props!.title).toBe(b)
  })

  it('content→children（TextNode）；className/disabled/closable 透传；content 不留 props', () => {
    const r = transform({ content: '正文', className: 'c', disabled: true, closable: false })
    expect(Array.isArray(r!.children)).toBe(true)
    expect(r!.props!.className).toBe('c')
    expect(r!.props!.disabled).toBe(true)
    expect(r!.props!.closable).toBe(false)
    expect('content' in r!.props!).toBe(false)
  })
})
