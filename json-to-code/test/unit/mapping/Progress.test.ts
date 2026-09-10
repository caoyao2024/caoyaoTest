import { describe, it, expect } from 'vitest'
import { createProgressMapping } from '../../../api/config/mappings/eview-react/Progress'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Progress 映射
// ═══════════════════════════════════════════════════════════════════

describe('Progress mapping', () => {
  const mapping = createProgressMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=ProgressBar；import 路径', () => {
    expect(mapping.tag).toBe('ProgressBar')
    expect(mapping.import).toBe(`${PKG}/ProgressBar`)
  })

  it('percent→current；max 固定 100', () => {
    const p = transform({ percent: 42 }).props!
    expect(p.current).toBe(42)
    expect(p.max).toBe(100)
  })

  it('percent DataBinding → current 保持原样', () => {
    const b = absBinding('pct')
    expect(transform({ percent: b }).props!.current).toBe(b)
  })

  it('status:success/exception 透传；normal/active 丢弃', () => {
    expect(transform({ status: 'success' }).props!.status).toBe('success')
    expect(transform({ status: 'exception' }).props!.status).toBe('exception')
    expect('status' in transform({ status: 'normal' }).props!).toBe(false)
    expect('status' in transform({ status: 'active' }).props!).toBe(false)
  })

  it('showInfo:false → labelPosition:none', () => {
    expect(transform({ showInfo: false }).props!.labelPosition).toBe('none')
  })

  it('strokeColor → barStyle.backgroundColor', () => {
    expect(transform({ strokeColor: '#0a0' }).props!.barStyle).toEqual({ backgroundColor: '#0a0' })
  })

  it('className 透传；children=null', () => {
    const r = transform({ className: 'pg' })
    expect(r!.props!.className).toBe('pg')
    expect(r!.children).toBeNull()
  })
})
