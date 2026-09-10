import { describe, it, expect } from 'vitest'
import ProgressMapping from '../../../../api/config/mappings/eview-ui/Progress'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Progress → ProgressBar bespoke 映射
// 与 eview-react 差异：status 丢弃（eview-react 保留 status:success/exception）。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Progress bespoke (ProgressBar)', () => {
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    ProgressMapping.transform!({ props } as any, ctx)

  it('tag=ProgressBar；import 路径', () => {
    expect(ProgressMapping.tag).toBe('ProgressBar')
    expect(ProgressMapping.import).toBe(`${UI_PKG}/ProgressBar`)
  })

  it('percent 字面量 → current + max:100', () => {
    const r = transform({ percent: 60 })
    expect(r!.props!.current).toBe(60)
    expect(r!.props!.max).toBe(100)
  })

  it('percent DataBinding → current（BindingValue 透传）+ max:100', () => {
    const b = absBinding('pct')
    const r = transform({ percent: b })
    expect((r!.props!.current as any).type).toBe('binding')
    expect((r!.props!.current as any).path).toBe(b.path)
    expect(r!.props!.max).toBe(100)
  })

  it('status 丢弃（与 eview-react 差异）', () => {
    const r = transform({ percent: 50, status: 'success' })
    expect('status' in r!.props!).toBe(false)
  })

  it('showInfo:false → labelPosition:none；showInfo 其他值不设', () => {
    expect(transform({ percent: 50, showInfo: false }).props!.labelPosition).toBe('none')
    expect('labelPosition' in transform({ percent: 50, showInfo: true }).props!).toBe(false)
  })

  it('strokeColor → barStyle.backgroundColor', () => {
    expect(transform({ percent: 50, strokeColor: '#1890ff' }).props!.barStyle).toEqual({ backgroundColor: '#1890ff' })
  })

  it('size 丢弃；className 透传', () => {
    const r = transform({ percent: 50, size: 'large', className: 'pg' })
    expect('size' in r!.props!).toBe(false)
    expect(r!.props!.className).toBe('pg')
    expect(r!.children).toBeNull()
  })
})
