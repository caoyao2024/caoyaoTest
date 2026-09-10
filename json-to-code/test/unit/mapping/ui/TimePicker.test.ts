import { describe, it, expect } from 'vitest'
import TimePickerMapping from '../../../../api/config/mappings/eview-ui/TimePicker'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui TimePicker bespoke 映射
// 与 eview-react 差异：format 直接透传（不转 HH→hh）；placeholder 映射（eview-react 丢弃）；
// className 宽度类→style（eview-react 用 timeStyle）。
// 注：用 splitWidthToStyle，className 不带 w-xx → 不触发 tailwind 设计系统加载，保持纯/快
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui TimePicker bespoke', () => {
  const transform = (props: Record<string, any>, ctx = fakeCtx()) =>
    TimePickerMapping.transform!({ props } as any, ctx)

  it('tag=TimePicker；import 路径', () => {
    expect(TimePickerMapping.tag).toBe('TimePicker')
    expect(TimePickerMapping.import).toBe(`${UI_PKG}/TimePicker`)
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

  it('format 直接透传（不转 HH→hh，与 eview-react 差异）', () => {
    // eview-react 会转 HH→hh，eview-ui 原生用 hh 小写，直接透传
    expect(transform({ format: 'HH:mm:ss' }).props!.format).toBe('HH:mm:ss')
    expect(transform({ format: 'hh:mm:ss' }).props!.format).toBe('hh:mm:ss')
  })

  it('placeholder：string→原样；array→首项；DataBinding→ComputedValue（数组取首项）', () => {
    expect(transform({ placeholder: '选时间' }).props!.placeholder).toBe('选时间')
    expect(transform({ placeholder: ['开始', '结束'] }).props!.placeholder).toBe('开始')
    const b = absBinding('ph')
    const p = transform({ placeholder: b }).props!.placeholder as any
    expect(p.type).toBe('computed')
    expect(p.transform(['A', 'B'])).toBe('A')
    expect(p.transform('X')).toBe('X')
  })

  it('disabled 透传', () => {
    expect(transform({ disabled: true }).props!.disabled).toBe(true)
  })

  it('className（无 w-xx）透传，无 style', () => {
    const r = transform({ className: 'text-red' })
    expect(r!.props!.className).toBe('text-red')
    expect('style' in r!.props!).toBe(false)
    expect(r!.children).toBeNull()
  })

  it('丢弃 props：secondStep/minuteStep/hourStep/range/size', () => {
    const r = transform({
      secondStep: 5, minuteStep: 5, hourStep: 1, range: true, size: 'large',
    })
    for (const k of ['secondStep', 'minuteStep', 'hourStep', 'range', 'size']) {
      expect(k in r!.props!).toBe(false)
    }
  })
})
