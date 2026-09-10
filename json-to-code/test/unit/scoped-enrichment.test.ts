import { describe, it, expect } from 'vitest'
import {
  collectRelativeCVs,
  collectRelativeFields,
  collectRelativeCVsDeep,
  applyScopedCV,
  enrichScopedData,
  buildRenderFn,
} from '../../api/src/core/scoped-enrichment'
import { Value } from '../../api/src/core/value-factory'
import type { BuildNode } from '../../api/src/core/node-types'

// 辅助：构造组件节点
function comp(component: string, props: Record<string, any>, children: any = []): BuildNode {
  return { __node: true, kind: 'component', component, props, children } as any
}
function text(value: any): BuildNode {
  return { __node: true, kind: 'text', value } as any
}
// 相对 ComputedValue
function relCV(p: string, transform: (v: any) => any = (v: any) => v, containsJSX = false) {
  return Value.computed({
    path: p,
    pathType: 'relative',
    accessPath: p,
    containsJSX,
    transform,
  })
}
// 相对 BindingValue
function relBinding(p: string) {
  return Value.binding({ path: p, pathType: 'relative', accessPath: p })
}

// ─── collectRelativeFields ───

describe('collectRelativeFields', () => {
  it('收相对 binding 的顶级字段', () => {
    const root = comp('Div', {
      title: relBinding('user.email'),
      name: relBinding('name'),
    })
    expect(collectRelativeFields(root)).toEqual(new Set(['user', 'name']))
  })
  it('忽略绝对 binding', () => {
    const root = comp('Div', {
      a: Value.binding({ path: '/abs', pathType: 'absolute', accessPath: 'abs' }),
      b: relBinding('rel'),
    })
    expect(collectRelativeFields(root)).toEqual(new Set(['rel']))
  })
  it('嵌套 relative LoopNode.data → 收外层字段', () => {
    const root = comp('Div', {}, {
      __node: true,
      kind: 'loop',
      data: Value.varRef({ name: 'tags', pathType: 'relative' }),
      template: { __node: true, kind: 'extract', componentName: 'Tag', purpose: 'module', body: [] },
    } as any)
    expect(collectRelativeFields(root)).toEqual(new Set(['tags']))
  })
  it('absolute varRef 跳过（不进外层 destructure）', () => {
    const root = comp('Div', {}, {
      __node: true,
      kind: 'loop',
      data: Value.varRef({ name: 'initialState.stlTabs', pathType: 'absolute' }),
      template: { __node: true, kind: 'extract', componentName: 'Tab', purpose: 'module', body: [] },
    } as any)
    expect(collectRelativeFields(root)).toEqual(new Set())
  })
  it('TextNode 的相对 binding 也收', () => {
    const root = comp('Div', {}, [text(relBinding('label'))] as any)
    expect(collectRelativeFields(root)).toEqual(new Set(['label']))
  })
})

// ─── collectRelativeCVs（浅，跳过嵌套循环） ───

describe('collectRelativeCVs', () => {
  it('收当前层相对 CV', () => {
    const body = [comp('Div', { title: relCV('user.name') })]
    const r = collectRelativeCVs(body as any)
    expect(r).toHaveLength(1)
    expect(r[0].path).toBe('user.name')
  })
  it('TextNode.value 的 CV 也收', () => {
    const body = [text(relCV('label'))]
    expect(collectRelativeCVs(body as any)).toHaveLength(1)
  })
  it('跳过嵌套循环内的 CV（浅）', () => {
    const body = [comp('Div', { outer: relCV('outer') }, [
      {
        __node: true,
        kind: 'loop',
        data: relBinding('items'),
        template: {
          __node: true,
          kind: 'extract',
          componentName: 'Item',
          purpose: 'module',
          body: [comp('Span', { inner: relCV('inner') })],
        },
      } as any,
    ] as any)]
    const r = collectRelativeCVs(body as any)
    // 只收外层 outer，不深入循环收 inner
    expect(r).toHaveLength(1)
    expect(r[0].path).toBe('outer')
  })
  it('忽略绝对 CV', () => {
    const body = [comp('Div', {
      a: Value.computed({ path: '/abs', pathType: 'absolute', accessPath: 'abs', containsJSX: false, transform: (v: any) => v }),
    })]
    expect(collectRelativeCVs(body as any)).toHaveLength(0)
  })
})

// ─── collectRelativeCVsDeep（深，带 loopChain） ───

describe('collectRelativeCVsDeep', () => {
  it('深入 relative 嵌套循环并记录 loopChain', () => {
    const body = [comp('Row', { title: relCV('title') }, {
      __node: true,
      kind: 'loop',
      data: relBinding('actions'),
      template: {
        __node: true,
        kind: 'extract',
        componentName: 'Action',
        purpose: 'module',
        body: [comp('Btn', { icon: relCV('icon') })],
      },
    } as any)]
    const r = collectRelativeCVsDeep(body as any)
    expect(r).toHaveLength(2)
    const title = r.find(s => s.cv.path === 'title')!
    const icon = r.find(s => s.cv.path === 'icon')!
    expect(title.loopChain).toEqual([])
    expect(icon.loopChain).toEqual(['actions'])
  })
  it('absolute 嵌套循环不深入', () => {
    const body = [comp('Row', {}, {
      __node: true,
      kind: 'loop',
      data: Value.binding({ path: '/globalAlerts', pathType: 'absolute', accessPath: 'globalAlerts' }),
      template: {
        __node: true,
        kind: 'extract',
        componentName: 'Alert',
        purpose: 'module',
        body: [comp('Div', { msg: relCV('msg') })],
      },
    } as any)]
    const r = collectRelativeCVsDeep(body as any)
    // 外层无 CV，内层 absolute 不深入 → 空
    expect(r).toHaveLength(0)
  })
})

// ─── applyScopedCV ───

describe('applyScopedCV', () => {
  it('loopChain 空 → 直接写当前项', () => {
    const obj = { title: 'raw' }
    const cv = relCV('title', v => v.toUpperCase())
    applyScopedCV(obj, [], cv as any)
    expect(obj.title).toBe('RAW')
  })
  it("loopChain=['actions'] → 沿链逐层 map 写嵌套", () => {
    const obj = { actions: [{ icon: 'x' }, { icon: 'y' }] }
    const cv = relCV('icon', v => v + '!')
    applyScopedCV(obj, ['actions'], cv as any)
    expect(obj.actions[0].icon).toBe('x!')
    expect(obj.actions[1].icon).toBe('y!')
  })
  it('null/非对象 → 安全跳过', () => {
    const cv = relCV('x', v => v)
    expect(() => applyScopedCV(null, [], cv as any)).not.toThrow()
    expect(() => applyScopedCV(undefined, [], cv as any)).not.toThrow()
  })
  it('loopChain 指向非数组 → 跳过', () => {
    const obj = { actions: 'notarray' }
    const cv = relCV('icon', v => v)
    applyScopedCV(obj, ['actions'], cv as any)
    expect(obj.actions).toBe('notarray')
  })
})

// ─── enrichScopedData ───

describe('enrichScopedData', () => {
  it('返回 ComputedValue，逐项应用 enrichment', () => {
    const scopedBinding = relBinding('rows')
    const body = [comp('Div', { title: relCV('title', v => v.toUpperCase()) })]
    const result = enrichScopedData(scopedBinding, body as any)
    expect(result.type).toBe('computed')
    expect(result.path).toBe('rows')
    expect(result.containsJSX).toBe(false)
    const out = result.transform([{ title: 'a' }, { title: 'b' }] as any)
    expect(out).toEqual([{ title: 'A' }, { title: 'B' }])
  })
  it('非数组 rawData → 返回 []', () => {
    const scopedBinding = relBinding('rows')
    const body = [comp('Div', { title: relCV('title') })]
    const result = enrichScopedData(scopedBinding, body as any)
    expect(result.transform(null as any)).toEqual([])
    expect(result.transform({} as any)).toEqual([])
  })
  it('不污染原始数据（structuredClone）', () => {
    const scopedBinding = relBinding('rows')
    const raw = [{ title: 'a' }]
    const body = [comp('Div', { title: relCV('title', v => v.toUpperCase()) })]
    const result = enrichScopedData(scopedBinding, body as any)
    result.transform(raw as any)
    // 原始对象未被 mutate
    expect(raw[0].title).toBe('a')
  })
  it('任一 CV containsJSX → 整体 containsJSX=true', () => {
    const scopedBinding = relBinding('rows')
    const body = [comp('Div', { title: relCV('title', v => v, true) })]
    const result = enrichScopedData(scopedBinding, body as any)
    expect(result.containsJSX).toBe(true)
  })
})

// ─── buildRenderFn ───

describe('buildRenderFn', () => {
  it('构造 RenderFnValue（结构化 params）', () => {
    const body = comp('Div', {})
    const params = [{ name: 'row', dataField: 'rawData' }] as any
    const r = buildRenderFn(body, params)
    expect(r.__node).toBe(true)
    expect(r.type).toBe('renderFn')
    expect(r.params).toBe(params)
    expect(r.body).toBe(body)
  })
})
