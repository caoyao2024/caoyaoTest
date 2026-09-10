import { describe, it, expect } from 'vitest'
import { createTreeMapping } from '../../../api/config/mappings/eview-react/Tree'
import { fakeCtx, absBinding, PKG, ICON_SENTINEL } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Tree → Tree 映射
// ═══════════════════════════════════════════════════════════════════

describe('Tree mapping', () => {
  const mapping = createTreeMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=Tree；import 路径', () => {
    expect(mapping.tag).toBe('Tree')
    expect(mapping.import).toBe(`${PKG}/Tree`)
  })

  it('checkable → enableCheckbox', () => {
    expect(transform({ checkable: true }).props!.enableCheckbox).toBe(true)
  })

  it('defaultExpandedKeys 字面量数组 → expandedKeys 改名透传', () => {
    expect(transform({ defaultExpandedKeys: ['1', '2'] }).props!.expandedKeys).toEqual(['1', '2'])
  })

  it('defaultExpandedKeys DataBinding → expandedKeys BindingValue 原样透传（只改名）', () => {
    const b = absBinding('exp')
    const e = transform({ defaultExpandedKeys: b }).props!.expandedKeys as any
    expect(e.type).toBe('binding')
    expect(e.path).toBe(b.path)
  })

  it('defaultSelectedKeys → selectedKeys（双形态改名）', () => {
    expect(transform({ defaultSelectedKeys: ['a'] }).props!.selectedKeys).toEqual(['a'])
    const b = absBinding('sel')
    expect((transform({ defaultSelectedKeys: b }).props!.selectedKeys as any).type).toBe('binding')
  })

  it('options 字面量 → data 递归转换：title→text / key→id / icon→treeNodePrefix(resolveIcon)', () => {
    const ctx = fakeCtx()
    const r = transform({
      options: [
        { title: '父', key: 'p', icon: 'plus', children: [{ title: '子', key: 'c' }] },
      ],
    }, ctx)
    expect(ctx.resolveIcon).toHaveBeenCalledWith('plus')
    expect(r!.props!.data).toEqual([
      { text: '父', id: 'p', treeNodePrefix: ICON_SENTINEL('plus'), children: [{ text: '子', id: 'c' }] },
    ])
  })

  it('options DataBinding → data ComputedValue（containsJSX:true，transform 内递归 normalize）', () => {
    const b = absBinding('opts')
    const d = transform({ options: b }).props!.data as any
    expect(d.type).toBe('computed')
    expect(d.containsJSX).toBe(true)
    expect(d.path).toBe(b.path)
    expect(d.transform([{ title: 'A', key: 'a' }])).toEqual([{ text: 'A', id: 'a' }])
  })

  it('className 透传', () => {
    expect(transform({ className: 'tr' }).props!.className).toBe('tr')
    expect(transform({ className: 'tr' }).children).toBeNull()
  })
})
