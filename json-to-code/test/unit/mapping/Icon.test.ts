import { describe, it, expect } from 'vitest'
import { createIconMapping } from '../../../api/config/mappings/eview-react/Icon'
import { fakeCtx, ICON_SENTINEL, absBinding } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Icon 映射
// ═══════════════════════════════════════════════════════════════════

describe('Icon mapping', () => {
  const mapping = createIconMapping('@nce/eview-react')
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('字面量 name → resolveIcon 直出（无 binding 分支）', () => {
    const ctx = fakeCtx()
    const r = transform({ name: 'home' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('home', {})
    expect(r).toStrictEqual(ICON_SENTINEL('home', {}))
  })

  it('字面量 color → 透传 resolveIcon 的 iconProps.color', () => {
    const ctx = fakeCtx()
    transform({ name: 'home', color: 'red' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('home', { color: 'red' })
  })

  it('shape→type 映射：outline→lined / filled→filled / square→square-bg / circle→round-bg / 未知→lined', () => {
    const cases: Array<[string, string]> = [
      ['outline', 'lined'],
      ['filled', 'filled'],
      ['square', 'square-bg'],
      ['circle', 'round-bg'],
      ['whatever', 'lined'],
    ]
    for (const [shape, type] of cases) {
      const ctx = fakeCtx()
      transform({ name: 'home', shape }, ctx)
      expect(ctx.resolveIcon).toHaveBeenCalledWith('home', { type })
    }
  })

  it('className 无 w-xx → 透传 className，不提取 iconSize（不触 tailwind）', () => {
    const ctx = fakeCtx()
    transform({ name: 'home', className: 'text-red-500' }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('home', { className: 'text-red-500' })
  })

  it('name DataBinding → Fragment + Node.text(ComputedValue containsJSX)', () => {
    const nameBinding = absBinding('icon')
    const r = transform({ name: nameBinding }) as any
    expect(r.tag).toBe('Fragment')
    expect(r.import).toEqual({ source: 'react', named: true })
    expect(r.props).toEqual({})
    expect(Array.isArray(r.children)).toBe(true)
    const cv = r.children[0].value
    expect(cv.type).toBe('computed')
    expect(cv.containsJSX).toBe(true)
    expect(cv.path).toBe(nameBinding.path)
  })

  it('color DataBinding（name 字面量）→ Fragment，cvPath=color', () => {
    const colorBinding = absBinding('color')
    const r = transform({ name: 'home', color: colorBinding }) as any
    expect(r.tag).toBe('Fragment')
    const cv = r.children[0].value
    expect(cv.path).toBe(colorBinding.path)
  })

  // ─── src 优先分支 → 渲染原生 <img> ───

  it('src 字面量 → 渲染 <img>，不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const r = transform({ src: '/assets/logo.png', className: 'w-5 h-5' }, ctx) as any
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    expect(r.tag).toBe('img')
    expect(r.import).toBe('')
    expect(r.props).toEqual({ src: '/assets/logo.png', className: 'w-5 h-5' })
    expect(r.selfClosing).toBe(true)
  })

  it('src 无 className → props 只含 src', () => {
    const ctx = fakeCtx()
    const r = transform({ src: '/a.png' }, ctx) as any
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    expect(r.tag).toBe('img')
    expect(r.props).toEqual({ src: '/a.png' })
  })

  it('src + name 同现 → 走 img 分支，name 被忽略（不调 resolveIcon）', () => {
    const ctx = fakeCtx()
    const r = transform({ src: '/a.png', name: 'home' }, ctx) as any
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    expect(r.tag).toBe('img')
    expect(r.props).toEqual({ src: '/a.png' })
  })

  it('src DataBinding → 透传 BindingValue（state-builder 收集）', () => {
    const ctx = fakeCtx()
    const srcBinding = absBinding('iconSrc')
    const r = transform({ src: srcBinding }, ctx) as any
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    expect(r.tag).toBe('img')
    expect(r.import).toBe('')
    expect(r.props.src).toBe(srcBinding)
  })
})
