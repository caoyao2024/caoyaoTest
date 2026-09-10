import { describe, it, expect } from 'vitest'
import { createCarouselMapping } from '../../../api/config/mappings/eview-react/Carousel'
import { fakeCtx, PKG, comp } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Carousel 映射
// ═══════════════════════════════════════════════════════════════════

describe('Carousel mapping', () => {
  const mapping = createCarouselMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag/import 与 MappingDef 一致；提供 defaults（autoplay 等合理默认）', () => {
    expect(mapping.tag).toBe('Carousel')
    expect(mapping.import).toBe(`${PKG}/Carousel`)
    expect(mapping.defaults).toMatchObject({
      autoplay: true,
      indicator: true,
      repeat: true,
    })
  })

  it('arrows→hasArrows；className 透传', () => {
    const r = transform({ props: { arrows: true, className: 'cr' } })
    const p = r!.props as any
    expect(p.hasArrows).toBe(true)
    expect(p.className).toBe('cr')
  })

  it('静态 children：每个子节点附加 CarouselItem wrapper（named import）', () => {
    const child = comp('Img', {})
    const r = transform({ props: {}, children: [child] }) as any
    expect(Array.isArray(r.children)).toBe(true)
    expect(r.children[0].wrapper).toEqual({
      kind: 'component',
      tag: 'CarouselItem',
      import: { source: `${PKG}/Carousel`, named: true },
    })
  })

  it('循环 children：template.body 子节点附加 CarouselItem wrapper', () => {
    const bodyNode = comp('Img', {})
    const loop = {
      __node: true, kind: 'loop', data: {},
      template: { __node: true, kind: 'extract', componentName: 'X', purpose: 'module', body: [bodyNode] },
    }
    const r = transform({ props: {}, children: loop }) as any
    expect(r.children.kind).toBe('loop')
    expect(r.children.template.body[0].wrapper).toMatchObject({ tag: 'CarouselItem' })
  })

  it('无 children → children undefined', () => {
    const r = transform({ props: {} }) as any
    expect(r.children).toBeUndefined()
  })
})
