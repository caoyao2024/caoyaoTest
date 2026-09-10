import { describe, it, expect } from 'vitest'
import { createTimelineMapping } from '../../../../api/config/mappings/eview-ui/Timeline'
import { iconNameToPath } from '../../../../api/config/mappings/eview-ui/icon-placeholder'
import { fakeCtx, absBinding, comp, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Timeline 映射（本地副本）
// 与 eview-react 差异：自定义图标（非 iconType 枚举）走真实路径 /icons/<name>.svg
// （icon 名直接拼），不调 resolveIcon、不产 React DOM。iconType 枚举（success/error/default）保留。
// icon 是路径字符串 → data 无 JSX → 循环 data containsJSX:false。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Timeline mapping', () => {
  const mapping = createTimelineMapping(UI_PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)
  const item = (props: Record<string, any>) => comp('TimelineItem', props)

  it('tag=TimeLine；import', () => {
    expect(mapping.tag).toBe('TimeLine')
    expect(mapping.import).toBe(`${UI_PKG}/TimeLine`)
  })

  it('静态 children：自定义图标（非枚举）→ data[].icon=真实路径；不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const r = transform({ props: {}, children: [item({ title: 't1', icon: 'home' })] }, ctx)
    const data = r!.props!.data as any[]
    expect(data[0].icon).toBe(iconNameToPath('home'))
    expect(data[0].title).toBe('t1')
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })

  it('静态 children：iconType 枚举（success/error/default）→ iconType 保留，不出 icon', () => {
    const r = transform({ props: {}, children: [item({ title: 't1', icon: 'success' })] })
    const data = r!.props!.data as any[]
    expect(data[0].iconType).toBe('success')
    expect('icon' in data[0]).toBe(false)
  })

  it('静态 children：DataBinding icon → icon CV containsJSX:false、返回真实路径；iconType CV 检测枚举', () => {
    const b = absBinding('ic')
    const r = transform({ props: {}, children: [item({ title: 't1', icon: b })] })
    const data = r!.props!.data as any[]
    const iconCV = data[0].icon as any
    expect(iconCV.type).toBe('computed')
    expect(iconCV.containsJSX).toBe(false)
    expect(iconCV.path).toBe(b.path)
    // transform：非枚举字符串 → 真实路径；枚举 → null（由 iconType 接管）
    expect(iconCV.transform('home')).toBe(iconNameToPath('home'))
    expect(iconCV.transform('success')).toBeNull()
    const iconTypeCV = data[0].iconType as any
    expect(iconTypeCV.transform('success')).toBe('success')
    expect(iconTypeCV.transform('home')).toBeUndefined()
  })
})
