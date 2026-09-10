import { describe, it, expect } from 'vitest'
import { createInputMapping } from '../../../../api/config/mappings/eview-ui/Input'
import { iconNameToPath } from '../../../../api/config/mappings/eview-ui/icon-placeholder'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Input 映射（本地副本）
// 与 eview-react 差异：icon（suffix）走真实路径 /icons/<name>.svg（字面量直接拼；
// DataBinding 走 ComputedValue 闭包拼接），不调 resolveIcon、不产 React DOM——
// eview-ui 的 icon 相关属性只接 URL。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Input mapping', () => {
  const mapping = createInputMapping(UI_PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=TextField；import 路径用 eview-ui 包', () => {
    expect(mapping.tag).toBe('TextField')
    expect(mapping.import).toBe(`${UI_PKG}/TextField`)
  })

  it('suffix 字面量 → 真实路径 /icons/<name>.svg；不调 resolveIcon（与 eview-react 差异）', () => {
    const ctx = fakeCtx()
    const r = transform({ suffix: 'star' }, ctx)
    expect(r!.props!.suffix).toBe(iconNameToPath('star'))
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })

  it('suffix DataBinding → ComputedValue containsJSX:false（transform 闭包拼路径）；不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const b = absBinding('icon')
    const r = transform({ suffix: b }, ctx)
    const suffix = r!.props!.suffix as any
    expect(suffix.type).toBe('computed')
    expect(suffix.containsJSX).toBe(false)
    expect(suffix.path).toBe('/icon')
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })

  it('无 suffix → 不出 suffix prop', () => {
    const r = transform({ value: 'hi' })
    expect('suffix' in r!.props!).toBe(false)
  })

  it('maxLength 透传；prefix/size 丢弃（与 eview-react 一致）', () => {
    const r = transform({ maxLength: 10, prefix: 'p', size: 'large' })
    expect(r!.props!.maxLength).toBe(10)
    expect('prefix' in r!.props!).toBe(false)
    expect('size' in r!.props!).toBe(false)
  })

  it('value/placeholder/password/className 透传逻辑不变', () => {
    const v = transform({ value: 'hi' }).props!.value as any
    expect(v.type).toBe('literal')
    expect(v.value).toBe('hi')
    expect(transform({ placeholder: '输入' }).props!.placeholder).toBe('输入')
    expect(transform({ password: true }).props!.type).toBe('password')
    const r = transform({ className: 'text-red' })
    expect(r!.props!.className).toBe('text-red')
    expect(r!.children).toBeNull()
  })
})
