import { describe, it, expect } from 'vitest'
import TagMapping from '../../../../api/config/mappings/eview-ui/Tag'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Tag bespoke 映射
// 与 eview-react 差异：
//   1. color 直传（eview-react 也直传，一致）
//   2. variant → className `filled`（eview-react variant→fill prop）
//   3. icon 丢弃（eview-react 映射 iconName+hasIcon）
//   4. size: small→normal（eview-react 保留 small）
//   5. closable 丢弃（eview-ui Tag 不支持关闭按钮）
//   6. 无 type prop 输出（eview-ui Tag 默认 type 生效）
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Tag bespoke', () => {
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    TagMapping.transform!({ props } as any, ctx)

  it('tag=Tag；import=@cloudsop/eview-ui/Tag；无 defaults', () => {
    expect(TagMapping.tag).toBe('Tag')
    expect(TagMapping.import).toBe(`${UI_PKG}/Tag`)
    expect(TagMapping.defaults).toBeUndefined()
  })

  it('value 字面量 → children=[TextNode]', () => {
    const r = transform({ value: '标签' })
    expect(r!.children[0]).toMatchObject({ kind: 'text', value: '标签' })
  })

  it('value DataBinding → children=[TextNode(binding)]', () => {
    const b = absBinding('text')
    expect(transform({ value: b }).children[0]).toMatchObject({ kind: 'text' })
  })

  it('color 直传枚举：info/error/alert/warning/success/default', () => {
    expect(transform({ color: 'info' }).props!.color).toBe('info')
    expect(transform({ color: 'error' }).props!.color).toBe('error')
    expect(transform({ color: 'alert' }).props!.color).toBe('alert')
    expect(transform({ color: 'warning' }).props!.color).toBe('warning')
    expect(transform({ color: 'success' }).props!.color).toBe('success')
    expect(transform({ color: 'default' }).props!.color).toBe('default')
  })

  it('color 扩展枚举直传：disabled/green/rose/pink/purple/indigo/cyan', () => {
    expect(transform({ color: 'disabled' }).props!.color).toBe('disabled')
    expect(transform({ color: 'green' }).props!.color).toBe('green')
    expect(transform({ color: 'rose' }).props!.color).toBe('rose')
    expect(transform({ color: 'pink' }).props!.color).toBe('pink')
    expect(transform({ color: 'purple' }).props!.color).toBe('purple')
    expect(transform({ color: 'indigo' }).props!.color).toBe('indigo')
    expect(transform({ color: 'cyan' }).props!.color).toBe('cyan')
  })

  it('color #HEX 原样透传', () => {
    expect(transform({ color: '#ff4d4f' }).props!.color).toBe('#ff4d4f')
  })

  it('color 未知值→default；无 color→default', () => {
    expect(transform({ color: 'weird' }).props!.color).toBe('default')
    expect(transform({}).props!.color).toBe('default')
  })

  it('color DataBinding → ComputedValue + transform 直传校验', () => {
    const b = absBinding('color')
    const c = transform({ color: b }).props!.color as any
    expect(c.type).toBe('computed')
    expect(c.path).toBe(b.path)
    // transform 直传校验（不映射）
    expect(c.transform('info')).toBe('info')
    expect(c.transform('error')).toBe('error')
    expect(c.transform('#aabbcc')).toBe('#aabbcc')
    expect(c.transform('weird')).toBe('default')
  })

  it('icon 丢弃（不调 resolveIcon）— 与 eview-react 差异', () => {
    const ctx = fakeCtx()
    const r = transform({ icon: 'star' }, ctx)
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    expect('iconName' in r!.props!).toBe(false)
    expect('hasIcon' in r!.props!).toBe(false)
  })

  it('size: medium→normal / large→large / small→normal（与 eview-react 差异：react 保留 small）', () => {
    expect(transform({ size: 'medium' }).props!.size).toBe('normal')
    expect(transform({ size: 'large' }).props!.size).toBe('large')
    expect(transform({ size: 'small' }).props!.size).toBe('normal')
  })

  it('variant: solid/无 → 不加 filled className（solid 样式，对应 ev_tag 无 ev_tag_fill）', () => {
    expect(transform({ color: 'info', variant: 'solid' }).props!.className).toBeUndefined()
    // 无 variant → 默认 solid
    expect(transform({ color: 'info' }).props!.className).toBeUndefined()
  })

  it('variant: filled/outlined + 非default颜色 → className 包含 filled（outline 样式，对应 ev_tag_fill）', () => {
    expect(transform({ color: 'info', variant: 'filled' }).props!.className).toBe('filled')
    expect(transform({ color: 'info', variant: 'outlined' }).props!.className).toBe('filled')
  })

  it('color=default 不受 variant 影响，不追加 filled', () => {
    expect(transform({ color: 'default', variant: 'filled' }).props!.className).toBeUndefined()
    expect(transform({ color: 'default', variant: 'outlined' }).props!.className).toBeUndefined()
    expect(transform({ variant: 'filled' }).props!.className).toBeUndefined()
  })

  it('variant + className 合并', () => {
    expect(transform({ color: 'info', variant: 'filled', className: 'tg' }).props!.className).toBe('filled tg')
    expect(transform({ color: 'info', variant: 'solid', className: 'tg' }).props!.className).toBe('tg')
  })

  it('closable 丢弃；closeIcon 丢弃（与 eview-react 差异：react closable 透传）', () => {
    const r = transform({ closable: true, closeIcon: 'x' })
    expect('closable' in r!.props!).toBe(false)
    expect('closeIcon' in r!.props!).toBe(false)
  })

  it('无 type prop 输出（与 eview-react 差异）', () => {
    const r = transform({})
    expect('type' in r!.props!).toBe(false)
  })

  it('className 透传', () => {
    expect(transform({ className: 'tg' }).props!.className).toBe('tg')
  })
})
