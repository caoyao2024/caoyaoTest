import { describe, it, expect } from 'vitest'
import { createButtonMapping } from '../../../api/config/mappings/eview-react/Button'
import { Value } from '../../../api/src/core/value-factory'
import { fakeCtx, ICON_SENTINEL, PKG, absBinding } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Button 映射
// ═══════════════════════════════════════════════════════════════════

describe('Button mapping', () => {
  const mapping = createButtonMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('基础：value→text / color:primary→status:primary / 无 onClick→占位 (e)=>{}', () => {
    const r = transform({ value: 'Click', color: 'primary' })
    expect(r!.tag).toBeUndefined() // 沿用 MappingDef.tag 'Button'
    expect(r!.children).toBeNull()
    expect(r!.props!.text).toBe('Click')
    expect(r!.props!.status).toBe('primary')
    expect(r!.props!.onClick).toEqual(Value.rawExpr({ value: '(e) => {}' }))
  })

  it('color:danger→status:risk；color:default→status:default', () => {
    expect(transform({ color: 'danger' }).props!.status).toBe('risk')
    expect(transform({ color: 'default' }).props!.status).toBe('default')
  })

  it('types:link→status:text（覆盖 color 的 status）', () => {
    const r = transform({ value: 'Go', types: 'link', color: 'primary' })
    expect(r!.props!.status).toBe('text')
    expect(r!.props!.text).toBe('Go')
  })

  it('size:medium→size:normal；large/small 透传', () => {
    expect(transform({ size: 'medium' }).props!.size).toBe('normal')
    expect(transform({ size: 'large' }).props!.size).toBe('large')
    expect(transform({ size: 'small' }).props!.size).toBe('small')
  })

  it('shape:circle 丢弃不处理（不产 style.borderRadius）', () => {
    expect(transform({ shape: 'circle' }).props!.style).toBeUndefined()
  })

  it('disabled / className 透传', () => {
    const r = transform({ disabled: true, className: 'btn-cls' })
    expect(r!.props!.disabled).toBe(true)
    expect(r!.props!.className).toBe('btn-cls')
  })

  it('onClick Action 透传（不替换为占位）', () => {
    const action = Value.action({ event: 'onClick', action: 'setState', path: '/a', value: 1 })
    const r = transform({ onClick: action })
    expect(r!.props!.onClick).toBe(action)
  })

  // ── icon + value（普通 Button 分支）──

  it('icon 字面量 + value：iconPlacement 缺省→leftIcon；color primary→icon color #fff', () => {
    const ctx = fakeCtx()
    const r = transform({ value: 'Save', icon: 'search', color: 'primary' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('search', { color: '#fff' })
    // resolveIcon 返回 sentinel，但 ICON_SENTINEL() 每次构造新对象 → 用结构相等
    expect(r!.props!.leftIcon).toStrictEqual(ICON_SENTINEL('search', { color: '#fff' }))
    expect('rightIcon' in r!.props!).toBe(false)
  })

  it('icon 字面量 + iconPlacement:end→rightIcon', () => {
    const ctx = fakeCtx()
    const r = transform(
      { value: 'Save', icon: 'search', iconPlacement: 'end', color: 'danger' },
      ctx,
    )
    expect(ctx.resolveIcon).toHaveBeenCalledWith('search', { color: '#fff' })
    expect(r!.props!.rightIcon).toStrictEqual(ICON_SENTINEL('search', { color: '#fff' }))
    expect('leftIcon' in r!.props!).toBe(false)
  })

  it('icon 字面量 + types:link→icon color brand', () => {
    const ctx = fakeCtx()
    transform({ value: 'Go', icon: 'search', types: 'link' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('search', { color: 'brand' })
  })

  it('icon DataBinding → ComputedValue containsJSX:true', () => {
    const iconBinding = absBinding('icon')
    const r = transform({ value: 'Save', icon: iconBinding, color: 'primary' })
    const left = r!.props!.leftIcon as any
    expect(left.type).toBe('computed')
    expect(left.containsJSX).toBe(true)
    expect(left.path).toBe(iconBinding.path)
  })

  // ── 纯图标（IconButton 分支）──

  it('纯图标（icon 无 value）→ IconButton：tag/import/selfClosing/iconName', () => {
    const ctx = fakeCtx()
    const r = transform({ icon: 'search', color: 'primary' }, ctx)
    // 纯图标分支：iconProps.color = props.color（原值，不做 #fff 特化）
    expect(ctx.resolveIcon).toHaveBeenCalledWith('search', { color: 'primary' })
    expect(r!.tag).toBe('IconButton')
    expect(r!.import).toBe(`${PKG}/IconButton`)
    expect(r!.selfClosing).toBe(true)
    expect(r!.props!.iconName).toStrictEqual(ICON_SENTINEL('search', { color: 'primary' }))
    expect(r!.props!.onClick).toEqual(Value.rawExpr({ value: '(e) => {}' }))
  })

  it('纯图标 + types:link→icon color brand；disabled 透传', () => {
    const ctx = fakeCtx()
    const r = transform({ icon: 'search', types: 'link', disabled: true }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('search', { color: 'brand' })
    expect(r!.props!.disabled).toBe(true)
  })
})
