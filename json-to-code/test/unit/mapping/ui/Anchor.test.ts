import { describe, it, expect } from 'vitest'
import { createAnchorMapping } from '../../../../api/config/mappings/eview-ui/Anchor'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Anchor 映射（eview-ui，数据式：items → data prop）
// ═══════════════════════════════════════════════════════════════════

describe('Anchor mapping (eview-ui)', () => {
  const mapping = createAnchorMapping(UI_PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag/import', () => {
    expect(mapping.tag).toBe('Anchor')
    expect(mapping.import).toBe(`${UI_PKG}/Anchor`)
  })

  // ─── 字面量 items → data（normalize） ───

  it('字面量 items → data：href 去前导 # → id；丢 key/target；title 原样', () => {
    const r = transform({
      items: [
        { key: 'k1', href: '#section-1', title: '第一节', target: '_blank' },
        { href: 'section-2', title: '第二节' },
      ],
    })
    const data = r.props.data
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(2)
    expect(data[0]).toEqual({ id: 'section-1', title: '第一节' })  // href→id 去#，丢 key/target
    expect(data[1]).toEqual({ id: 'section-2', title: '第二节' })  // 无 # 原样
  })

  it('字面量 items（nested children）→ data 递归 normalize', () => {
    const r = transform({
      items: [
        {
          href: '#s1',
          title: '第一节',
          children: [{ href: '#s1-1', title: '1.1' }],
        },
      ],
    })
    const data = r.props.data
    expect(data[0].id).toBe('s1')
    expect(data[0].children).toHaveLength(1)
    expect(data[0].children[0]).toEqual({ id: 's1-1', title: '1.1' })
  })

  it('字面量 items：title 为 DataBinding 原样保留', () => {
    const b = absBinding('title1')
    const r = transform({ items: [{ href: '#s1', title: b }] })
    expect(r.props.data[0].title).toBe(b)
    expect(r.props.data[0].id).toBe('s1')
  })

  // ─── DataBinding items → data = ComputedValue ───

  it('DataBinding items → data = ComputedValue（containsJSX:false + transform 防御 []）', () => {
    const b = absBinding('anchorItems')
    const r = transform({ items: b })
    const data = r.props.data
    expect(data.type).toBe('computed')
    expect(data.path).toBe(b.path)
    expect(data.pathType).toBe('absolute')
    expect(data.containsJSX).toBe(false)
    // transform 防御：非数组 → []
    expect(data.transform(undefined)).toEqual([])
    expect(data.transform(null)).toEqual([])
    // 数组 → 逐项 normalize
    const normalized = data.transform([{ href: '#x', title: 't', target: '_blank' }])
    expect(normalized).toEqual([{ id: 'x', title: 't' }])
  })

  it('DataBinding items（nested）→ transform 递归 normalize', () => {
    const b = absBinding('anchorItems')
    const r = transform({ items: b })
    const data = r.props.data
    const normalized = data.transform([
      { href: '#s1', title: '第一节', children: [{ href: '#s1-1', title: '1.1' }] },
    ])
    expect(normalized[0].id).toBe('s1')
    expect(normalized[0].children).toEqual([{ id: 's1-1', title: '1.1' }])
  })

  // ─── 其余 props ───

  it('offsetTop → offset 改名；container 同名；className 透传；children:null', () => {
    const r = transform({
      items: [{ href: '#s1', title: 't' }],
      offsetTop: 100,
      container: '#content',
      className: 'text-red',
    })
    expect(r.props.offset).toBe(100)
    expect(r.props.container).toBe('#content')
    expect(r.props.className).toBe('text-red')
    expect('offsetTop' in r.props).toBe(false)
    expect(r.children).toBeNull()
  })

  it('无 items → 无 data prop，children:null', () => {
    const r = transform({ offsetTop: 50 })
    expect('data' in r.props).toBe(false)
    expect(r.children).toBeNull()
  })
})
