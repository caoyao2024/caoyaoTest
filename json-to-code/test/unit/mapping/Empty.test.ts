import { describe, it, expect } from 'vitest'
import { createEmptyMapping } from '../../../api/config/mappings/eview-react/Empty'
import { fakeCtx, absBinding, comp, PKG } from './fake-ctx'
import { Value } from '../../../api/src/core/value-factory'

// ═══════════════════════════════════════════════════════════════════
// Empty 映射（A2UI Empty → eview-react Empty）
//
// description 三形态：string / DataBinding（rule 1 同名透传）/ SlotNode（resolveNode 后重包 slotNode）。
// image 三形态：string / DataBinding（改名 image→imgSrc）/ SlotNode（条件分流到 icon prop）。
// className 透传；children 吞噬（null）；无 useState/事件。
// ═══════════════════════════════════════════════════════════════════

describe('Empty mapping', () => {
  const mapping = createEmptyMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=Empty；import 路径', () => {
    expect(mapping.tag).toBe('Empty')
    expect(mapping.import).toBe(`${PKG}/Empty`)
  })

  it('children 吞噬（null）', () => {
    expect(transform({ description: '暂无数据' }).children).toBeNull()
  })

  // ─── description 三形态 ───

  it('description 字面量 string → 同名透传（rule 1）', () => {
    expect(transform({ description: '暂无数据' }).props!.description).toBe('暂无数据')
  })

  it('description DataBinding → 同名透传 BindingValue（rule 1，不改值、不包 computed）', () => {
    const b = absBinding('emptyText')
    const r = transform({ description: b })
    expect(r!.props!.description).toBe(b)
    expect((r!.props!.description as any).type).toBe('binding')
    expect((r!.props!.description as any).path).toBe('/emptyText')
  })

  it('description SlotNode → 调 ctx.resolveNode 解析子树后重新包 slotNode 留作 description prop', () => {
    const descNode = comp('span', { value: '暂无数据' })
    let resolvedCalled = false
    const ctx = fakeCtx({
      resolveNode: (n: any) => { resolvedCalled = true; return n },
    })
    const r = transform({ description: Value.slotNode({ node: descNode as any }) }, ctx)
    expect(resolvedCalled).toBe(true)
    const out = r!.props!.description as any
    expect(out.type).toBe('slotNode')
    expect(out.node).toBe(descNode)
  })

  // ─── image 三形态（条件分流：string/DataBinding→imgSrc；SlotNode→icon）───

  it('image 字面量 string → 改名 image→imgSrc（URL 透传）', () => {
    const r = transform({ image: '/images/empty.svg' })
    expect(r!.props!.imgSrc).toBe('/images/empty.svg')
    expect('icon' in r!.props!).toBe(false)
    expect('image' in r!.props!).toBe(false)
  })

  it('image DataBinding → 改名 image→imgSrc，BindingValue 原样透传（不包 computed）', () => {
    const b = absBinding('emptyImage')
    const r = transform({ image: b })
    expect(r!.props!.imgSrc).toBe(b)
    expect((r!.props!.imgSrc as any).type).toBe('binding')
    expect((r!.props!.imgSrc as any).path).toBe('/emptyImage')
    expect('icon' in r!.props!).toBe(false)
  })

  it('image SlotNode → 条件分流到 icon prop（resolveNode 后重包 slotNode，不进 imgSrc）', () => {
    const imageNode = comp('Icon', { name: 'inbox' })
    let resolvedCalled = false
    const ctx = fakeCtx({
      resolveNode: (n: any) => { resolvedCalled = true; return n },
    })
    const r = transform({ image: Value.slotNode({ node: imageNode as any }) }, ctx)
    expect(resolvedCalled).toBe(true)
    const out = r!.props!.icon as any
    expect(out.type).toBe('slotNode')
    expect(out.node).toBe(imageNode)
    expect('imgSrc' in r!.props!).toBe(false)
  })

  // ─── className ───

  it('className 透传', () => {
    expect(transform({ className: 'flex items-center' }).props!.className).toBe('flex items-center')
  })

  it('裸 Empty（无 props）→ 空 props，children null', () => {
    const r = transform({})
    expect(r!.props).toEqual({})
    expect(r!.children).toBeNull()
  })
})
