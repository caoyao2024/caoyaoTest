import { describe, it, expect } from 'vitest'
import { createStepsMapping } from '../../../api/config/mappings/eview-react/Steps'
import { fakeCtx, absBinding, comp, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Steps → Steps 映射（吞噬 children → data）
// ═══════════════════════════════════════════════════════════════════

describe('Steps mapping', () => {
  const mapping = createStepsMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag=Steps；import 路径', () => {
    expect(mapping.tag).toBe('Steps')
    expect(mapping.import).toBe(`${PKG}/Steps`)
  })

  it('current 字面量/DataBinding → currentStep；orientation→direction；className 透传；types/variant/status/size 丢弃', () => {
    const b = absBinding('cur')
    const r = transform({ props: { current: b, orientation: 'vertical', className: 'st', types: 'x', variant: 'y', status: 'z', size: 'large' } })
    expect((r!.props!.currentStep as any).type).toBe('binding')
    expect((r!.props!.currentStep as any).path).toBe(b.path)
    expect(r!.props!.direction).toBe('vertical')
    expect(r!.props!.className).toBe('st')
    for (const k of ['types', 'variant', 'status', 'size']) {
      expect(k in r!.props!).toBe(false)
    }
  })

  it('无 children → data: []', () => {
    expect(transform({ props: {} }).props!.data).toEqual([])
  })

  it('静态 children → data：text=title / value=idx / description=content / iconUrl=resolveIcon / status', () => {
    const ctx = fakeCtx()
    const r = transform({
      props: {},
      children: [
        comp('StepItem', { title: '第一步', content: '描述1', icon: 'plus', status: 'finish' }),
        comp('StepItem', { title: '第二步', content: '描述2' }),
      ],
    }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('plus')
    expect(r!.props!.data).toEqual([
      { text: '第一步', value: 0, description: '描述1', iconUrl: ICON_SENTINEL('plus'), status: 'finish' },
      { text: '第二步', value: 1, description: '描述2' },
    ])
    expect(r!.children).toBeNull()
  })

  it('content SlotNode → resolveNode 后作 description', () => {
    const ctx = fakeCtx()
    const slotNode = comp('Div', {})
    const r = transform({
      props: {},
      children: [
        comp('StepItem', { title: 'T', content: { type: 'slotNode', node: slotNode as any } }),
      ],
    }, ctx)
    expect(r!.props!.data[0].description).toBe(slotNode)
  })

  it('icon DataBinding → iconUrl ComputedValue（containsJSX:true）', () => {
    const b = absBinding('ic')
    const r = transform({
      props: {},
      children: [comp('StepItem', { title: 'T', icon: b })],
    })
    const icon = r!.props!.data[0].iconUrl as any
    expect(icon.type).toBe('computed')
    expect(icon.containsJSX).toBe(true)
    expect(icon.path).toBe(b.path)
  })
})
