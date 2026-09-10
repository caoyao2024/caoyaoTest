import { describe, it, expect } from 'vitest'
import { createPopoverMapping } from '../../../api/config/mappings/eview-react/Popover'
import { fakeCtx, absBinding, comp, PKG } from './fake-ctx'
import { Value } from '../../../api/src/core/value-factory'

// ═══════════════════════════════════════════════════════════════════
// Popover 映射（A2UI Popover → eview-react TipBox）
//
// content 三形态：string / DataBinding（rule 1 同名透传）/ SlotNode（ctx.resolveNode 解析后重包 slotNode）。
// placement→direction 纯改名（12 方向枚举逐字一致）；trigger 过滤 contextMenu；children 透传。
// ═══════════════════════════════════════════════════════════════════

describe('Popover mapping', () => {
  const mapping = createPopoverMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=TipBox；import 路径', () => {
    expect(mapping.tag).toBe('TipBox')
    expect(mapping.import).toBe(`${PKG}/TipBox`)
  })

  // ─── content 三形态 ───

  it('content 字面量 string → 同名透传（rule 1，原语 string）', () => {
    expect(transform({ content: '一段提示内容' }).props!.content).toBe('一段提示内容')
  })

  it('content DataBinding → 同名透传 BindingValue（rule 1，不改值、不包 computed）', () => {
    const b = absBinding('tipContent')
    const r = transform({ content: b })
    // 原样 BindingValue 透传（不包 computed）
    expect(r!.props!.content).toBe(b)
    expect((r!.props!.content as any).type).toBe('binding')
    expect((r!.props!.content as any).path).toBe('/tipContent')
  })

  it('content SlotNode → 调 ctx.resolveNode 解析子树（非原样透传）后重新包 slotNode 留作 prop', () => {
    const contentNode = comp('span', { value: '弹出内容' })
    let resolvedCalled = false
    const ctx = fakeCtx({
      resolveNode: (n: any) => { resolvedCalled = true; return n },
    })
    const r = transform({ content: Value.slotNode({ node: contentNode as any }) }, ctx)
    expect(resolvedCalled).toBe(true) // 调 resolveNode（非原样透传 slotNode）
    const out = r!.props!.content as any
    expect(out.type).toBe('slotNode')
    // resolveNode identity → 重新包的 node 是原 contentNode
    expect(out.node).toBe(contentNode)
  })

  // ─── title ───

  it('title 字面量 / DataBinding → 同名透传（rule 1）', () => {
    expect(transform({ content: 'c', title: '提示' }).props!.title).toBe('提示')
    const b = absBinding('currentUser')
    expect(transform({ content: 'c', title: b }).props!.title).toBe(b)
  })

  it('title 缺省 → 不 emit', () => {
    expect(transform({ content: 'c' }).props!.title).toBeUndefined()
  })

  // ─── placement → direction（纯改名，12 方向枚举逐字一致） ───

  it('placement → direction 同名值透传（12 方向枚举逐字一致）', () => {
    expect(transform({ content: 'c', placement: 'top' }).props!.direction).toBe('top')
    expect(transform({ content: 'c', placement: 'topRight' }).props!.direction).toBe('topRight')
    expect(transform({ content: 'c', placement: 'leftTop' }).props!.direction).toBe('leftTop')
    expect(transform({ content: 'c', placement: 'bottom' }).props!.direction).toBe('bottom')
    expect(transform({ content: 'c', placement: 'rightBottom' }).props!.direction).toBe('rightBottom')
  })

  it('placement 缺省 → 不 emit direction（走 TipBox 默认 topLeft）', () => {
    expect(transform({ content: 'c' }).props!.direction).toBeUndefined()
  })

  // ─── trigger（过滤 contextMenu） ───

  it('trigger 单项 → 单值透传', () => {
    expect(transform({ content: 'c', trigger: ['click'] }).props!.trigger).toBe('click')
    expect(transform({ content: 'c', trigger: ['hover'] }).props!.trigger).toBe('hover')
  })

  it('trigger 多项 → 数组透传', () => {
    expect(transform({ content: 'c', trigger: ['hover', 'click'] }).props!.trigger).toEqual(['hover', 'click'])
  })

  it('trigger 含 contextMenu → 过滤 contextMenu', () => {
    // contextMenu + click → 只留 click（单值）
    expect(transform({ content: 'c', trigger: ['contextMenu', 'click'] }).props!.trigger).toBe('click')
    // hover + contextMenu + click → 数组（contextMenu 过滤）
    expect(transform({ content: 'c', trigger: ['hover', 'contextMenu', 'click'] }).props!.trigger).toEqual(['hover', 'click'])
  })

  it('trigger 全 contextMenu → 省略（TipBox 默认 hover）', () => {
    expect(transform({ content: 'c', trigger: ['contextMenu'] }).props!.trigger).toBeUndefined()
  })

  it('trigger 缺省 → 省略（TipBox 默认 hover，与 A2UI 默认一致）', () => {
    expect(transform({ content: 'c' }).props!.trigger).toBeUndefined()
  })

  // ─── className / children ───

  it('className 透传', () => {
    expect(transform({ content: 'c', className: 'tip-class' }).props!.className).toBe('tip-class')
  })

  it('不返回 children → 管线沿用原始 node.children（TipBox Children.only 触发元素）', () => {
    expect(transform({ content: 'c' }).children).toBeUndefined()
  })
})
