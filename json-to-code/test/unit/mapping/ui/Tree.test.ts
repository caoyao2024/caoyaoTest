import { describe, it, expect } from 'vitest'
import { createTreeMapping } from '../../../../api/config/mappings/eview-ui/Tree'
import { PLACEHOLDER_ICON_URL, iconNameToPath } from '../../../../api/config/mappings/eview-ui/icon-placeholder'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Tree 映射（本地副本）
// 与 eview-react 差异：节点图标字段名 treeNodePrefix→icon，且值走真实路径
// /icons/<name>.svg（icon 名直接拼），不调 resolveIcon、不产 React DOM。
// icon 是路径字符串 → data 无 JSX → 循环 data containsJSX:false。
// title→text / key→id / children 递归同 eview-react。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Tree mapping', () => {
  const mapping = createTreeMapping(UI_PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag=Tree；import 路径', () => {
    expect(mapping.tag).toBe('Tree')
    expect(mapping.import).toBe(`${UI_PKG}/Tree`)
  })

  it('checkable→enableCheckbox；defaultExpandedKeys→expandedKeys；defaultSelectedKeys→selectedKeys；className 透传', () => {
    const b1 = absBinding('exp')
    const b2 = absBinding('sel')
    const r = transform({
      props: {
        checkable: true,
        defaultExpandedKeys: b1,
        defaultSelectedKeys: b2,
        className: 'tree',
      },
    })
    expect(r!.props!.enableCheckbox).toBe(true)
    expect((r!.props!.expandedKeys as any).path).toBe(b1.path)
    expect((r!.props!.selectedKeys as any).path).toBe(b2.path)
    expect(r!.props!.className).toBe('tree')
  })

  it('无 options → data 不输出', () => {
    expect(transform({ props: {} }).props!.data).toBeUndefined()
  })

  it('静态 options：title→text / key→id / icon→真实路径（icon 名直接拼）；不调 resolveIcon', () => {
    const ctx = fakeCtx()
    const r = transform({
      props: {
        options: [
          { title: '父', key: 'p', icon: 'home', children: [{ title: '子', key: 'c', icon: 'user' }] },
          { title: '叶', key: 'l' },
        ],
      },
    }, ctx)
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    const data = r!.props!.data as any[]
    expect(data).toEqual([
      { text: '父', id: 'p', icon: iconNameToPath('home'), children: [{ text: '子', id: 'c', icon: iconNameToPath('user') }] },
      { text: '叶', id: 'l' },
    ])
  })

  it('静态 options：icon 为非字符串（数字）→回退占位 URL', () => {
    const r = transform({ props: { options: [{ title: 't', key: 'k', icon: 1 }] } })
    expect((r!.props!.data as any[])[0].icon).toBe(PLACEHOLDER_ICON_URL)
  })

  it('静态 options：icon 缺省时不输出 icon 字段', () => {
    const r = transform({ props: { options: [{ title: 't', key: 'k' }] } })
    expect('icon' in (r!.props!.data as any[])[0]).toBe(false)
  })

  it('options DataBinding → data=ComputedValue containsJSX:false；transform 递归转换（icon→真实路径）', () => {
    const ctx = fakeCtx()
    const b = absBinding('treeData')
    const r = transform({ props: { options: b } }, ctx)
    const data = r!.props!.data as any
    expect(data.type).toBe('computed')
    expect(data.containsJSX).toBe(false)
    expect(data.path).toBe(b.path)
    expect(ctx.resolveIcon).not.toHaveBeenCalled()
    // transform 递归转换
    const out = data.transform([
      { title: 'a', key: 'a1', icon: 'home', children: [{ title: 'b', key: 'b1', icon: 'x' }] },
    ])
    expect(out).toEqual([
      { text: 'a', id: 'a1', icon: iconNameToPath('home'), children: [{ text: 'b', id: 'b1', icon: iconNameToPath('x') }] },
    ])
  })
})
