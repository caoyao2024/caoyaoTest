import { describe, it, expect } from 'vitest'
import { createAnchorMapping } from '../../../api/config/mappings/eview-react/Anchor'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Anchor 映射（eview-react，组合式：items → Anchor.Link children）
// ═══════════════════════════════════════════════════════════════════

describe('Anchor mapping (eview-react)', () => {
  const mapping = createAnchorMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import', () => {
    expect(mapping.tag).toBe('Anchor')
    expect(mapping.import).toBe(`${PKG}/Anchor`)
  })

  // ─── 字面量 items → AnchorLink 静态子节点树 ───

  it('字面量 items（flat）→ children = AnchorLink[]（_resolved:true + named import）', () => {
    const r = transform({ items: [{ href: '#s1', title: '第一节' }, { href: '#s2', title: '第二节' }] })
    expect(Array.isArray(r.children)).toBe(true)
    expect(r.children).toHaveLength(2)
    const first = r.children[0]
    expect(first.kind).toBe('component')
    expect(first.component).toBe('AnchorLink')
    expect(first.tag).toBe('AnchorLink')
    expect(first._resolved).toBe(true)
    // named import：{ source: '@nce/eview-react/Anchor', named: true }
    expect(first.import).toEqual({ source: `${PKG}/Anchor`, named: true })
    expect(first.props.href).toBe('#s1')
    expect(first.props.title).toBe('第一节')
    expect(first.selfClosing).toBe(true)
  })

  it('字面量 items（nested children）→ 递归：父 AnchorLink 的 children 为子 AnchorLink[]', () => {
    const r = transform({
      items: [
        {
          href: '#s1',
          title: '第一节',
          children: [{ href: '#s1-1', title: '1.1' }, { href: '#s1-2', title: '1.2' }],
        },
      ],
    })
    const parent = r.children[0]
    expect(parent.selfClosing).not.toBe(true)
    expect(Array.isArray(parent.children)).toBe(true)
    expect(parent.children).toHaveLength(2)
    expect(parent.children[0].component).toBe('AnchorLink')
    expect(parent.children[0]._resolved).toBe(true)
    expect(parent.children[0].props.href).toBe('#s1-1')
  })

  it('字面量 items：title 为 DataBinding / SlotNode 原样作 prop 值', () => {
    const b = absBinding('title1')
    const r = transform({ items: [{ href: '#s1', title: b }] })
    expect(r.children[0].props.title).toBe(b)
  })

  it('字面量 items：target 透传；key 丢弃', () => {
    const r = transform({ items: [{ key: 'k1', href: '#s1', title: 't', target: '_blank' }] })
    const n = r.children[0]
    expect(n.props.target).toBe('_blank')
    expect('key' in n.props).toBe(false)
  })

  // ─── DataBinding items → inline LoopNode ───

  it('DataBinding items → children 为 inline LoopNode（data binding + AnchorLink 相对 binding 模板）', () => {
    const b = absBinding('anchorItems')
    const r = transform({
      items: b,
    })
    const loop = r.children
    expect(loop.kind).toBe('loop')
    expect(loop.inline).toBe(true)
    // data = binding（path 透传）
    expect(loop.data.type).toBe('binding')
    expect(loop.data.path).toBe(b.path)
    expect(loop.data.pathType).toBe('absolute')
    // template = extract，body[0] = AnchorLink（_resolved:true + named import，相对 binding）
    const tpl = loop.template.body[0]
    expect(tpl.component).toBe('AnchorLink')
    expect(tpl._resolved).toBe(true)
    expect(tpl.import).toEqual({ source: `${PKG}/Anchor`, named: true })
    expect(tpl.props.href.type).toBe('binding')
    expect(tpl.props.href.pathType).toBe('relative')
    expect(tpl.props.href.path).toBe('href')
    expect(tpl.props.title.pathType).toBe('relative')
    expect(tpl.props.title.path).toBe('title')
    // 无样本数据 → 不加 target binding、不加 nested children loop
    expect('target' in tpl.props).toBe(false)
    expect(tpl.selfClosing).toBe(true)
  })

  it('DataBinding items：样本含 target → 模板加 target 相对 binding', () => {
    const b = absBinding('anchorItems')
    ;(b as any).stateValue = [{ href: '#s1', title: 't', target: '_blank' }]
    const r = transform({ items: b })
    const tpl = r.children.template.body[0]
    expect(tpl.props.target.type).toBe('binding')
    expect(tpl.props.target.pathType).toBe('relative')
    expect(tpl.props.target.path).toBe('target')
  })

  it('DataBinding items：样本含 nested children → 模板 children 为内联 LoopNode（相对 children，2 级）', () => {
    const b = absBinding('anchorItems')
    ;(b as any).stateValue = [{ href: '#s1', title: 't', children: [{ href: '#s1-1', title: '1.1' }] }]
    const r = transform({ items: b })
    const tpl = r.children.template.body[0]
    expect(tpl.selfClosing).not.toBe(true)
    expect(tpl.children.kind).toBe('loop')
    expect(tpl.children.inline).toBe(true)
    expect(tpl.children.data.type).toBe('binding')
    expect(tpl.children.data.pathType).toBe('relative')
    expect(tpl.children.data.path).toBe('children')
    // nested loop template = flat AnchorLink（_resolved:true + named import，相对 binding，无更深层 —— 2 级边界）
    const nestedTpl = tpl.children.template.body[0]
    expect(nestedTpl.component).toBe('AnchorLink')
    expect(nestedTpl._resolved).toBe(true)
    expect(nestedTpl.import).toEqual({ source: `${PKG}/Anchor`, named: true })
    expect(nestedTpl.props.href.pathType).toBe('relative')
    expect(nestedTpl.selfClosing).toBe(true)
  })

  // ─── 其余 props ───

  it('offsetTop 同名透传；container → containerId 改名；className 透传', () => {
    const r = transform({
      items: [{ href: '#s1', title: 't' }],
      offsetTop: 100,
      container: '#content',
      className: 'text-red',
    })
    expect(r.props.offsetTop).toBe(100)
    expect(r.props.containerId).toBe('#content')
    expect(r.props.className).toBe('text-red')
    expect('container' in r.props).toBe(false)
  })

  it('无 items → children:null', () => {
    const r = transform({ offsetTop: 50 })
    expect(r.children).toBeNull()
  })
})
