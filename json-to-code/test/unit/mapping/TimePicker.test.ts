import { describe, it, expect } from 'vitest'
import { createTimePickerMapping } from '../../../api/config/mappings/eview-react/TimePicker'
import { fakeCtx, absBinding, PKG } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// TimePicker → TimePicker 映射
// 注：用 splitWidthToStyle，className 不带 w-xx → 不触发 tailwind 设计系统加载，保持纯/快
// ═══════════════════════════════════════════════════════════════════

describe('TimePicker mapping', () => {
  const mapping = createTimePickerMapping(PKG)
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    mapping.transform!({ props } as any, ctx)

  it('tag=TimePicker；import 路径', () => {
    expect(mapping.tag).toBe('TimePicker')
    expect(mapping.import).toBe(`${PKG}/TimePicker`)
  })

  it('value 字面量 "HH:mm:ss" → time LiteralValue.useState(onChange)，转 [时,分,秒]', () => {
    const v = transform({ value: '14:30:00' }).props!.time as any
    expect(v.type).toBe('literal')
    expect(v.value).toEqual([14, 30, 0])
    expect(v.useState.event).toBe('onChange')
    expect(v.useState.extractor('set')).toBe('(time) => set(time)')
  })

  it('value 字面量 "HH:mm" → 秒缺省 0', () => {
    expect((transform({ value: '09:05' }).props!.time as any).value).toEqual([9, 5, 0])
  })

  it('value DataBinding → ComputedValue.useState(onChange，transform 字符串→数组/数组原样)', () => {
    const b = absBinding('tp')
    const v = transform({ value: b }).props!.time as any
    expect(v.type).toBe('computed')
    expect(v.path).toBe(b.path)
    expect(v.transform('14:30:00')).toEqual([14, 30, 0])
    expect(v.transform([1, 2, 3])).toEqual([1, 2, 3])
    expect(v.transform(123)).toEqual([0, 0, 0])
  })

  it('format antd→eview-react：HH→hh', () => {
    expect(transform({ format: 'HH:mm:ss' }).props!.format).toBe('hh:mm:ss')
  })

  it('disabled 透传；placeholder/secondStep/minuteStep/hourStep/range/size 丢弃', () => {
    const r = transform({
      disabled: true, placeholder: '选时间', secondStep: 5, minuteStep: 5,
      hourStep: 1, range: true, size: 'large',
    })
    expect(r!.props!.disabled).toBe(true)
    for (const k of ['placeholder', 'secondStep', 'minuteStep', 'hourStep', 'range', 'size']) {
      expect(k in r!.props!).toBe(false)
    }
  })

  it('className（无 w-xx）透传，无 timeStyle', () => {
    const r = transform({ className: 'text-red' })
    expect(r!.props!.className).toBe('text-red')
    expect('timeStyle' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })
})
