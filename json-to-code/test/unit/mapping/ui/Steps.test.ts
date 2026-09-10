import { describe, it, expect } from 'vitest'
import StepsMapping from '../../../../api/config/mappings/eview-ui/Steps'
import { Value } from '../../../../api/src/core/value-factory'
import { PLACEHOLDER_ICON_URL, iconNameToPath } from '../../../../api/config/mappings/eview-ui/icon-placeholder'
import { fakeCtx, absBinding, comp, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Steps → Wizards bespoke 映射
// 与 eview-react 差异：
//   1. tag/import：eview-react Steps → eview-ui Wizards
//   2. orientation：eview-react 改名 direction；eview-ui Wizards 同名透传
//   3. size：eview-react 丢弃；eview-ui Wizards 同名透传
//   4. icon data 字段：eview-react iconUrl → eview-ui customIcon
//   5. icon 内容：走真实路径 /icons/<name>.svg（icon 名直接拼），不调 resolveIcon
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Steps→Wizards bespoke', () => {
  const transform = (node: any, ctx = fakeCtx()) => StepsMapping.transform!(node, ctx)

  it('tag=Wizards；import=UI_PKG/Wizards', () => {
    expect(StepsMapping.tag).toBe('Wizards')
    expect(StepsMapping.import).toBe(`${UI_PKG}/Wizards`)
  })

  it('current → currentStep；orientation 同名透传（与 eview-react 差异）；size 同名透传；types/variant/status 丢弃；className 透传', () => {
    const b = absBinding('cur')
    const r = transform({
      props: { current: b, orientation: 'vertical', types: 'x', variant: 'y', status: 'z', size: 'small', className: 'st' },
    })
    expect((r!.props!.currentStep as any).path).toBe(b.path)
    // orientation 同名透传（eview-react 改名 direction，eview-ui Wizards 保留 orientation）
    expect(r!.props!.orientation).toBe('vertical')
    expect('direction' in r!.props!).toBe(false)
    // size 同名透传（eview-react 丢弃，eview-ui Wizards 支持）
    expect(r!.props!.size).toBe('small')
    // types/variant/status 丢弃
    for (const k of ['types', 'variant', 'status']) {
      expect(k in r!.props!).toBe(false)
    }
    expect(r!.props!.className).toBe('st')
  })

  it('无 children → data: []', () => {
    expect(transform({ props: {} }).props!.data).toEqual([])
  })

  it('静态 children → data：text=title / value=idx / description=content / customIcon=真实路径 / status；不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const r = transform({
      props: {},
      children: [
        comp('StepItem', { title: '第一步', content: '描述1', icon: 'plus', status: 'finish' }),
        comp('StepItem', { title: '第二步', content: '描述2' }),
      ],
    }, ctx)
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    // customIcon（非 iconUrl，与 eview-react 差异）
    expect(r!.props!.data).toEqual([
      { text: '第一步', value: 0, description: '描述1', customIcon: iconNameToPath('plus'), status: 'finish' },
      { text: '第二步', value: 1, description: '描述2' },
    ])
    expect(r!.children).toBeNull()
  })

  it('content SlotNode → resolveNode 后作 description', () => {
    const slotNode = comp('Div', {})
    const r = transform({
      props: {},
      children: [comp('StepItem', { title: 'T', content: Value.slotNode({ node: slotNode as any }) })],
    })
    expect(r!.props!.data[0].description).toBe(slotNode)
  })

  it('icon DataBinding（静态 child，无 rawData 可解析 name）→ customIcon=占位 URL（边缘兜底，不调 resolveIcon）', () => {
    const ctx = fakeCtx()
    const b = absBinding('ic')
    const r = transform({ props: {}, children: [comp('StepItem', { title: 'T', icon: b })] }, ctx)
    // customIcon（非 iconUrl，与 eview-react 差异）
    expect(r!.props!.data[0].customIcon).toBe(PLACEHOLDER_ICON_URL)
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
  })
})
