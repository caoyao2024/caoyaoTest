import { describe, it, expect } from 'vitest'
import ButtonMapping from '../../../../api/config/mappings/eview-ui/Button'
import { iconNameToPath } from '../../../../api/config/mappings/eview-ui/icon-placeholder'
import { Value } from '../../../../api/src/core/value-factory'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Button bespoke 映射
// 与 eview-react 差异：types:link→TextButton（切组件）；无 IconButton 分支；
// color danger→status:risk；size medium→normal；shape circle 丢弃不处理。
// icon 差异：leftIcon/rightIcon 走真实路径 /icons/<name>.svg（字面量直接拼；
// DataBinding 走 ComputedValue 闭包拼接），不调 resolveIcon。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Button bespoke', () => {
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    ButtonMapping.transform!({ props } as any, ctx)

  it('tag=Button；import 路径', () => {
    expect(ButtonMapping.tag).toBe('Button')
    expect(ButtonMapping.import).toBe(`${UI_PKG}/Button`)
  })

  it('types:link → 切换 TextButton：tag/import/value→text/onClick 占位/selfClosing', () => {
    const r = transform({ types: 'link', value: '更多', className: 'lnk' })
    expect(r!.tag).toBe('TextButton')
    expect(r!.import).toBe(`${UI_PKG}/TextButton`)
    expect(r!.props!.text).toBe('更多')
    expect((r!.props!.onClick as any).type).toBe('rawExpr')
    expect((r!.props!.onClick as any).value).toBe('(e) => {}')
    expect(r!.props!.className).toBe('lnk')
    expect(r!.selfClosing).toBe(true)
    expect(r!.children).toBeNull()
  })

  it('纯图标（有 icon 无 value）→ 普通 Button，无 IconButton 分支；leftIcon=真实路径、不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const r = transform({ icon: 'plus' }, ctx)
    expect(r!.tag).toBeUndefined() // 未切组件，沿用 MappingDef 的 Button
    expect(r!.props!.leftIcon).toBe(iconNameToPath('plus'))
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    expect('text' in r!.props!).toBe(false)
    expect((r!.props!.onClick as any).value).toBe('(e) => {}')
  })

  it('icon iconPlacement:end → rightIcon=真实路径；默认 → leftIcon=真实路径', () => {
    const r1 = transform({ icon: 'plus', iconPlacement: 'end' })
    expect(r1!.props!.rightIcon).toBe(iconNameToPath('plus'))
    expect('leftIcon' in r1!.props!).toBe(false)
    const r2 = transform({ icon: 'minus' })
    expect(r2!.props!.leftIcon).toBe(iconNameToPath('minus'))
  })

  it('icon DataBinding → leftIcon=ComputedValue containsJSX:false（transform 闭包拼路径）；不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const b = absBinding('ic')
    const r = transform({ icon: b }, ctx)
    const leftIcon = r!.props!.leftIcon as any
    expect(leftIcon.type).toBe('computed')
    expect(leftIcon.containsJSX).toBe(false)
    expect(leftIcon.path).toBe('/ic')
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })

  it('color：primary→status:primary；danger→status:risk；palette→style.backgroundColor；#hex→style.backgroundColor', () => {
    expect(transform({ color: 'primary' }).props!.status).toBe('primary')
    expect(transform({ color: 'danger' }).props!.status).toBe('risk')
    expect(transform({ color: 'error' }).props!.status).toBe('risk')
    expect(transform({ color: 'blue' }).props!.style).toEqual({ backgroundColor: 'blue' })
    expect(transform({ color: '#1a2b3c' }).props!.style).toEqual({ backgroundColor: '#1a2b3c' })
  })

  it('size medium→normal；large/small 透传', () => {
    expect(transform({ size: 'medium' }).props!.size).toBe('normal')
    expect(transform({ size: 'large' }).props!.size).toBe('large')
    expect(transform({ size: 'small' }).props!.size).toBe('small')
  })

  it('shape:circle 丢弃不处理（不产 style.borderRadius）', () => {
    expect(transform({ shape: 'circle' }).props!.style).toBeUndefined()
  })

  it('value 字面量 → text；className 透传；onClick 占位', () => {
    const r = transform({ value: '提交', className: 'btn' })
    expect(r!.props!.text).toBe('提交')
    expect(r!.props!.className).toBe('btn')
    expect((r!.props!.onClick as any).value).toBe('(e) => {}')
    expect(r!.children).toBeNull()
  })

  // ─── onClick Action 透传（弹窗场景：Button 写 open 路径） ───
  // 与 eview-react 一致：有 Action（build-trees 已转 ActionValue）则透传，
  // emitValue 产 setSharedState；无则占位 (e) => {}。
  const onClickAction = Value.action({
    event: 'onClick',
    action: 'setState',
    path: '/isDetailOpen',
    value: true,
  })

  it('普通 Button：有 onClick Action → 原样透传（不替换为占位）', () => {
    const r = transform({ value: '展开详情', color: 'primary', onClick: onClickAction })
    expect(r!.props!.onClick).toBe(onClickAction) // 引用相等：原样透传
  })

  it('TextButton（types:link）：有 onClick Action → 原样透传', () => {
    const r = transform({ types: 'link', value: '更多', onClick: onClickAction })
    expect(r!.tag).toBe('TextButton')
    expect(r!.props!.onClick).toBe(onClickAction) // 引用相等：原样透传
  })

  it('无 onClick 时仍占位 (e) => {}（普通 Button + TextButton 双分支兜底）', () => {
    expect((transform({ value: 'x' })!.props!.onClick as any).value).toBe('(e) => {}')
    expect((transform({ types: 'link', value: 'x' })!.props!.onClick as any).value).toBe('(e) => {}')
  })
})
