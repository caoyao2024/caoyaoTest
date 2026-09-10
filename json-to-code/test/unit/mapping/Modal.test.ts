import { describe, it, expect } from 'vitest'
import { createModalMapping } from '../../../api/config/mappings/eview-react/Modal'
import { Value } from '../../../api/src/core/value-factory'
import { fakeCtx, absBinding, comp, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Modal 映射（结构同 Drawer，prop 名 isOpen/modal）
// ═══════════════════════════════════════════════════════════════════

describe('Modal mapping', () => {
  const mapping = createModalMapping(PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag=Dialog；import 路径', () => {
    expect(mapping.tag).toBe('Dialog')
    expect(mapping.import).toBe(`${PKG}/Dialog`)
  })

  it('open DataBinding + onClose Action.value → isOpen ComputedValue.useState(onClose)，extractor 写 closeVal', () => {
    const openB = absBinding('open')
    const onClose = Value.action({ event: 'onClose', action: 'setState', path: '/open', value: false })
    const r = transform({ props: { open: openB, onClose } })
    const v = r!.props!.isOpen as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(openB.path)
    expect(v.useState.event).toBe('onClose')
    expect(v.useState.extractor('set')).toBe('() => set(false)')
    expect(r!.propRoute.isOpen).toBe('component-internal')
  })

  it('mask→modal；title 透传', () => {
    const openB = absBinding('open')
    const r = transform({ props: { open: openB, mask: true, title: '弹窗' } })
    expect(r!.props!.modal).toBe(true)
    expect(r!.props!.title).toBe('弹窗')
  })

  it('footer SlotNode → resolveNode 后追加到 children', () => {
    const ctx = fakeCtx()
    const footerNode = comp('Div', {})
    const body = comp('Span', {})
    const r = transform({
      props: { open: absBinding('open'), footer: Value.slotNode({ node: footerNode as any }) },
      children: [body],
    }, ctx)
    expect(r!.children).toHaveLength(2)
    expect(r!.children[0]).toBe(body)
    expect(r!.children[1]).toBe(footerNode)
  })

  it('无 footer → 不返回 children；className 透传', () => {
    const r = transform({ props: { open: absBinding('open'), className: 'md' } })
    expect(r!.children).toBeUndefined()
    expect(r!.props!.className).toBe('md')
  })
})
