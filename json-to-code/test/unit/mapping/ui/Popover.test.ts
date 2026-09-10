import { describe, it, expect } from 'vitest'
import PopoverMapping from '../../../../api/config/mappings/eview-ui/Popover'
import { fakeCtx, absBinding, comp, UI_PKG } from '../fake-ctx'
import { Value } from '../../../../api/src/core/value-factory'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Popover bespoke（A2UI Popover → eview-ui Tooltip）
//
// 聚焦与 eview-react（→TipBox）的差异点（CLAUDE.md 惯例：bespoke 单测不重复覆盖
// 与 react 一致的逻辑，那些由 react 单测覆盖、eview-ui 靠 e2e 兜底）：
//  - tag/import：Tooltip / @cloudsop/eview-ui/Tooltip（react 为 TipBox / @nce/eview-react/TipBox）
//  - placement → placement 同名透传（react 改名 → direction）
//  - title → 丢弃（react 透传；Tooltip 无 title prop）
// content（三形态）/trigger 过滤 contextMenu/className/children 与 react 一致，此处仅断核心 content SlotNode
// 形态确认同型（避免 bespoke 静默回归 slotNode 重包逻辑）。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Popover bespoke (Tooltip)', () => {
  const transform = (node: any, ctx = fakeCtx()) => PopoverMapping.transform!(node, ctx)

  it('tag=Tooltip；import 路径（@cloudsop/eview-ui/Tooltip，非 react 的 TipBox）', () => {
    expect(PopoverMapping.tag).toBe('Tooltip')
    expect(PopoverMapping.import).toBe(`${UI_PKG}/Tooltip`)
  })

  // ─── 差异点 1：placement → placement 同名透传（react 改名 → direction） ───

  it('placement → placement 同名透传（非 react 的 direction 改名）；12 方向枚举逐字一致', () => {
    const r = transform({ props: { content: 'c', placement: 'topRight' } })
    expect(r!.props!.placement).toBe('topRight')
    // 不 emit direction（react 才改名 direction；eview-ui Tooltip 用 placement）
    expect((r!.props as any).direction).toBeUndefined()
  })

  it('placement 缺省 → 不 emit（走 Tooltip 默认 top，与 A2UI 默认一致）', () => {
    expect(transform({ props: { content: 'c' } }).props!.placement).toBeUndefined()
  })

  // ─── 差异点 2：title → 丢弃（react 透传；Tooltip 无 title prop） ───

  it('title → 丢弃（eview-ui Tooltip 无 title prop；react 透传）', () => {
    const r = transform({ props: { content: 'c', title: '提示标题' } })
    expect(r!.props!.title).toBeUndefined()
    // title（字面量 / DataBinding）一律丢弃
    expect(transform({ props: { content: 'c', title: absBinding('title') } }).props!.title).toBeUndefined()
  })

  // ─── content SlotNode 形态：与 react 同型（resolveNode + 重包 slotNode），确认不静默回归 ───

  it('content SlotNode → 调 ctx.resolveNode 解析子树后重新包 slotNode 留作 prop（与 react 同型）', () => {
    const contentNode = comp('span', { value: '弹出内容' })
    let resolvedCalled = false
    const ctx = fakeCtx({
      resolveNode: (n: any) => { resolvedCalled = true; return n },
    })
    const r = transform({ props: { content: Value.slotNode({ node: contentNode as any }) } }, ctx)
    expect(resolvedCalled).toBe(true) // 调 resolveNode（非原样透传 slotNode）
    const out = r!.props!.content as any
    expect(out.type).toBe('slotNode')
    expect(out.node).toBe(contentNode)
  })

  it('content 字面量 / DataBinding → 同名透传（rule 1，与 react 一致）', () => {
    expect(transform({ props: { content: '一段内容' } }).props!.content).toBe('一段内容')
    const b = absBinding('tipContent')
    expect(transform({ props: { content: b } }).props!.content).toBe(b)
  })

  // ─── trigger 过滤 contextMenu（与 react 一致，断一态确认不回归） ───

  it('trigger 含 contextMenu → 过滤（与 react 一致）；单项→单值', () => {
    expect(transform({ props: { content: 'c', trigger: ['contextMenu', 'click'] } }).props!.trigger).toBe('click')
  })

  // ─── className / children（与 react 一致） ───

  it('className 透传；不返回 children（管线沿用原始 node.children）', () => {
    const r = transform({ props: { content: 'c', className: 'tip' } })
    expect(r!.props!.className).toBe('tip')
    expect(r!.children).toBeUndefined()
  })
})
