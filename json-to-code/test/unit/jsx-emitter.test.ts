import { describe, it, expect } from 'vitest'
import {
  escapeJSX,
  indent,
  bindingRef,
  emitNode,
  serializeRenderFnBody,
} from '../../api/src/codegen/jsx-emitter'
import { Value } from '../../api/src/core/value-factory'
import type { BuildNode } from '../../api/src/core/node-types'

// 辅助节点构造
function comp(component: string, props: Record<string, any>, extra: Record<string, any> = {}): BuildNode {
  return { __node: true, kind: 'component', component, props, ...extra } as any
}
function html(tag: string, props: Record<string, any>, children: any = undefined): BuildNode {
  return { __node: true, kind: 'html', tag, props, children } as any
}
function text(value: any): BuildNode {
  return { __node: true, kind: 'text', value } as any
}

// ─── escapeJSX ───

describe('escapeJSX', () => {
  it('转义 "、{、}', () => {
    expect(escapeJSX('a"b')).toBe('a&quot;b')
    expect(escapeJSX('a{b}c')).toBe('a&#123;b&#125;c')
  })
  it('无特殊字符原样', () => {
    expect(escapeJSX('hello')).toBe('hello')
  })
})

// ─── indent ───

describe('indent', () => {
  it('多行每行加前缀', () => {
    expect(indent('a\nb', 2)).toBe('  a\n  b')
  })
  it('单行', () => {
    expect(indent('a', 4)).toBe('    a')
  })
  it('0 空格 = 不变', () => {
    expect(indent('a\nb', 0)).toBe('a\nb')
  })
})

// ─── bindingRef ───

describe('bindingRef', () => {
  it('containsJSX computed → const 名', () => {
    const cv = Value.computed({
      path: 'p', pathType: 'absolute', accessPath: 'brandInfo.logoIcon',
      containsJSX: true, transform: () => undefined,
    })
    expect(bindingRef(cv)).toBe('brandInfoLogoIcon')
  })
  it('absolute binding 平面 → 裸名', () => {
    const v = Value.binding({ path: '/x', pathType: 'absolute', accessPath: 'name' })
    expect(bindingRef(v)).toBe('name')
  })
  it('absolute binding 嵌套 → initialState.x.y', () => {
    const v = Value.binding({ path: '/x', pathType: 'absolute', accessPath: 'a.b' })
    expect(bindingRef(v)).toBe('initialState.a.b')
  })
  it('relative + inTemplate → 裸 accessPath（已 destructure）', () => {
    const v = Value.binding({ path: 'user.email', pathType: 'relative', accessPath: 'user.email' })
    expect(bindingRef(v, { inTemplate: true } as any)).toBe('user.email')
  })
  it('relative + inRenderFnBody + 非标识符首段 → base 访问', () => {
    const v = Value.binding({ path: 'a-b', pathType: 'relative', accessPath: 'a-b' })
    expect(bindingRef(v, { inRenderFnBody: true, renderFnDataVarName: 'row' } as any)).toBe('row["a-b"]')
  })
  it('relative 主树循环 → item.field', () => {
    const v = Value.binding({ path: 'title', pathType: 'relative', accessPath: 'title' })
    expect(bindingRef(v, { isInLoop: true, loopVar: 'item' } as any)).toBe('item.title')
  })
  it('relative 无 opts → 裸 accessPath（best-effort，会 warn）', () => {
    const v = Value.binding({ path: 'user.email', pathType: 'relative', accessPath: 'user.email' })
    expect(bindingRef(v)).toBe('user.email')
  })
})

// ─── emitNode ───

describe('emitNode', () => {
  it('null/undefined → "null"', () => {
    expect(emitNode(null)).toBe('null')
    expect(emitNode(undefined)).toBe('null')
  })
  it('selfClosing 组件 → <Btn />', () => {
    expect(emitNode(comp('Btn', {}, { selfClosing: true }))).toBe('<Btn />')
  })
  it('组件带 id → 输出 id 属性（emitId 默认 true）', () => {
    expect(emitNode(comp('Btn', {}, { id: 'btn1', selfClosing: true }))).toBe('<Btn id="btn1" />')
  })
  it('emitId=false → 不输出 id', () => {
    expect(emitNode(comp('Btn', {}, { id: 'btn1', selfClosing: true }), { emitId: false })).toBe('<Btn />')
  })
  it('字符串 prop → key={"value"}', () => {
    expect(emitNode(comp('Btn', { label: 'Click' }))).toBe('<Btn label={"Click"} />')
  })
  it('html + 文本子节点 → 缩进', () => {
    expect(emitNode(html('div', {}, [text('hello')]))).toBe('<div>\n  hello\n</div>')
  })
  it('TextNode 字符串 → escapeJSX（只转义 " { }，不转义 < >）', () => {
    expect(emitNode(text('a<b'))).toBe('a<b')
    expect(emitNode(text('say "hi" {x}'))).toBe('say &quot;hi&quot; &#123;x&#125;')
  })
  it('TextNode absolute binding → {stateRef}', () => {
    const v = Value.binding({ path: '/foo', pathType: 'absolute', accessPath: 'name' })
    expect(emitNode(text(v))).toBe('{name}')
  })
  it('注释占位节点 → JSX 注释', () => {
    expect(emitNode(comp('Foo', {}, { commentPlaceholder: '未映射组件: Foo (id=x)' })))
      .toBe('{/* 未映射组件: Foo (id=x) */}')
  })
})

// ─── serializeRenderFnBody ───

describe('serializeRenderFnBody', () => {
  it('有 dataSource → destructure + return 块', () => {
    const body = comp('Div', {
      title: Value.binding({ path: 'title', pathType: 'relative', accessPath: 'title' }),
    })
    const v = Value.renderFn({
      params: [{ name: 'row', dataField: 'rawData' }],
      body,
    })
    const bodyOpts = { inRenderFnBody: true, renderFnDataVarName: 'row.rawData' }
    const out = serializeRenderFnBody(v, bodyOpts, 0)
    expect(out).toBe(
      `(row) => {\n` +
      `  const { title } = row.rawData;\n` +
      `  return (\n` +
      `    <Div title={title} />\n` +
      `  )\n` +
      `}`
    )
  })
  it('无 dataSource → 箭头直接返回（无 destructure）', () => {
    const body = comp('Div', {})
    const v = Value.renderFn({ params: [{ name: 'x' }], body })
    const out = serializeRenderFnBody(v, { renderFnDataVarName: '' }, 0)
    expect(out).toBe(`(x) => (\n  <Div />\n)`)
  })
})
