import { describe, it, expect } from 'vitest'
import {
  buildState,
  consumeValue,
  processLoop,
  getValueFromState,
  sharedKeyOfPath,
  type FileUnit,
  type StateBuilderContext,
} from '../../api/src/codegen/state-builder'
import { Value } from '../../api/src/core/value-factory'
import { applyScopedCV } from '../../api/src/core/scoped-enrichment'
import type { BuildNode, LoopNode } from '../../api/src/core/node-types'

// ═══════════════════════════════════════════════════════════════════
// state-builder 单测
//
// state-builder 是 FileGenerator 内最复杂的模块（consumeValue 分发 + processLoop
// enrichment + shared 打标）。这些内部函数已 test-exported（见 state-builder.ts
// 上下文注释），此处用最小 ctx / LoopNode fixture 隔离测，绕过整条管线，
// 给最复杂那块上「快」反馈网。e2e 兜全管线连带。
// ═══════════════════════════════════════════════════════════════════

// ─── fixture 构造器 ───────────────────────────────────────────────

function makeUnit(fileKey = 'main'): FileUnit {
  return { fileKey, bindingRefs: [], computedRefs: [], jsxLiteralConsts: [], enrichmentConsts: [] }
}

function makeCtx(opts: { rawState?: Record<string, any>; eventMutatedPaths?: Set<string> } = {}): StateBuilderContext {
  const unit = makeUnit()
  return {
    rawState: opts.rawState ?? {},
    fileUnits: new Map([['main', unit]]),
    currentUnit: unit,
    stateEntries: {},
    iconNameMap: {},
    loopEnrichmentMap: new Map(),
    eventMutatedPaths: opts.eventMutatedPaths ?? new Set(),
    sharedKeys: new Set(),
    currentScope: undefined,
  } as any
}

function comp(component: string, props: Record<string, any>, children: any = []): BuildNode {
  return { __node: true, kind: 'component', component, props, children } as any
}

function absBind(accessPath: string, path = `/${accessPath}`) {
  return Value.binding({ path, pathType: 'absolute', accessPath })
}
function relBind(accessPath: string) {
  return Value.binding({ path: accessPath, pathType: 'relative', accessPath })
}
function relCV(p: string, transform: (v: any) => any = (v: any) => v, containsJSX = false) {
  return Value.computed({ path: p, pathType: 'relative', accessPath: p, containsJSX, transform })
}
function absCV(accessPath: string, transform: (v: any) => any, containsJSX = false, path = `/${accessPath}`) {
  return Value.computed({ path, pathType: 'absolute', accessPath, containsJSX, transform })
}

function loop(opts: {
  data: any
  body: BuildNode[]
  componentName?: string
  loopScope?: any
  inline?: boolean
}): LoopNode {
  return {
    __node: true,
    kind: 'loop',
    data: opts.data,
    template: { __node: true, kind: 'extract', componentName: opts.componentName ?? 'Item', purpose: 'module' as const, body: opts.body },
    loopScope: opts.loopScope,
    inline: opts.inline,
  } as any
}

// ─── 纯叶子函数 ───────────────────────────────────────────────────

describe('getValueFromState', () => {
  it('按 / 分段取嵌套值', () => {
    const s = { a: { b: 1 } }
    expect(getValueFromState(s, '/a/b')).toBe(1)
  })
  it('路径缺失 → undefined', () => {
    expect(getValueFromState({ a: 1 }, '/a/x')).toBeUndefined()
  })
  it('非数组的单值 → 包装为 [val]（resolveLoopData 用）', () => {
    // getValueFromState 自身返回裸值；包装逻辑在 resolveLoopData
    expect(getValueFromState({ a: 'x' }, '/a')).toBe('x')
  })
  it('空 path / null state → undefined', () => {
    expect(getValueFromState({}, '')).toBeUndefined()
    expect(getValueFromState(null as any, '/a')).toBeUndefined()
  })
})

describe('sharedKeyOfPath', () => {
  it('剥前导 /，取首段（共享 path 协议：只在 state 顶层）', () => {
    expect(sharedKeyOfPath('/open')).toBe('open')
    expect(sharedKeyOfPath('/a/b')).toBe('a')
  })
  it('无前导 / 也能取首段', () => {
    expect(sharedKeyOfPath('open')).toBe('open')
  })
})

// ─── consumeValue 分发（核心） ─────────────────────────────────────

describe('consumeValue', () => {
  it('absolute binding → 收 bindingRefs + 写 stateEntries（裸取 rawState）', () => {
    const ctx = makeCtx({ rawState: { a: 123 } })
    consumeValue(absBind('a'), ctx)
    expect(ctx.currentUnit.bindingRefs).toHaveLength(1)
    expect((ctx.currentUnit.bindingRefs[0] as any).path).toBe('/a')
    expect(ctx.stateEntries.a).toBe(123)
  })

  it('absolute binding 命中 eventMutatedPaths → shared=true，不进 bindingRefs，仍写 stateEntries', () => {
    const ctx = makeCtx({ rawState: { open: false }, eventMutatedPaths: new Set(['/open']) })
    const b = absBind('open')
    consumeValue(b, ctx)
    expect((b as any).shared).toBe(true)
    expect(ctx.sharedKeys.has('open')).toBe(true)
    expect(ctx.currentUnit.bindingRefs).toHaveLength(0)
    expect(ctx.stateEntries.open).toBe(false)
  })

  it('relative binding → 跳过（不收集、不写 stateEntries；由 enrichment 处理）', () => {
    const ctx = makeCtx()
    consumeValue(relBind('field'), ctx)
    expect(ctx.currentUnit.bindingRefs).toHaveLength(0)
    expect(Object.keys(ctx.stateEntries)).toHaveLength(0)
  })

  it('absolute computed containsJSX:false → 收 computedRefs + 写 stateEntries（transform 结果）', () => {
    const ctx = makeCtx({ rawState: { c: 5 } })
    consumeValue(absCV('c', raw => raw * 2), ctx)
    expect(ctx.currentUnit.computedRefs).toHaveLength(1)
    expect(ctx.stateEntries.c).toBe(10)
  })

  it('absolute computed containsJSX:true → 进 jsxLiteralConsts，不进 computedRefs、不写 stateEntries', () => {
    const ctx = makeCtx({ rawState: { c: 5 } })
    consumeValue(absCV('c', raw => raw, true), ctx)
    expect(ctx.currentUnit.jsxLiteralConsts).toHaveLength(1)
    expect(ctx.currentUnit.jsxLiteralConsts[0].name).toBe('c')
    expect(ctx.currentUnit.jsxLiteralConsts[0].value).toBe(5)
    expect(ctx.currentUnit.computedRefs).toHaveLength(0)
    expect(ctx.stateEntries.c).toBeUndefined()
  })

  it('absolute computed 命中 eventMutatedPaths（containsJSX:false）→ shared，不进 computedRefs，仍写 stateEntries', () => {
    const ctx = makeCtx({ rawState: { val: 'x' }, eventMutatedPaths: new Set(['/val']) })
    const cv = absCV('val', raw => raw)
    consumeValue(cv, ctx)
    expect((cv as any).shared).toBe(true)
    expect(ctx.sharedKeys.has('val')).toBe(true)
    expect(ctx.currentUnit.computedRefs).toHaveLength(0)
    expect(ctx.stateEntries.val).toBe('x')
  })

  it('action → sharedKeys 加 key + stateEntries 含该 key 初值', () => {
    const ctx = makeCtx({ rawState: { open: false } })
    consumeValue(Value.action({ event: 'onClick', action: 'setState', path: '/open', value: false }), ctx)
    expect(ctx.sharedKeys.has('open')).toBe(true)
    expect(ctx.stateEntries.open).toBe(false)
  })

  it('literal / varRef / rawExpr → 跳过（无副作用）', () => {
    const ctx = makeCtx()
    consumeValue(Value.literal({ value: 1 }), ctx)
    consumeValue(Value.varRef({ name: 'x' }), ctx)
    consumeValue(Value.rawExpr({ value: '() => {}' }), ctx)
    expect(ctx.currentUnit.bindingRefs).toHaveLength(0)
    expect(Object.keys(ctx.stateEntries)).toHaveLength(0)
  })

  it('slotNode → walk 进入子树，收集内嵌 binding', () => {
    const ctx = makeCtx({ rawState: { a: 1 } })
    consumeValue(Value.slotNode({ node: comp('Div', { v: absBind('a') }) }), ctx)
    expect(ctx.currentUnit.bindingRefs).toHaveLength(1)
    expect(ctx.stateEntries.a).toBe(1)
  })

  it('纯对象（无 type 无 __node）→ 递归属性，收集内嵌 binding', () => {
    const ctx = makeCtx({ rawState: { c: 'red' } })
    consumeValue({ style: { color: absBind('c') } }, ctx)
    expect(ctx.currentUnit.bindingRefs).toHaveLength(1)
    expect(ctx.stateEntries.c).toBe('red')
  })

  it('数组 → 递归每个元素', () => {
    const ctx = makeCtx({ rawState: { a: 1, b: 2 } })
    consumeValue([absBind('a'), absBind('b')], ctx)
    expect(ctx.currentUnit.bindingRefs).toHaveLength(2)
    expect(ctx.stateEntries).toEqual({ a: 1, b: 2 })
  })

  it('null / undefined / 原始值 → 跳过', () => {
    const ctx = makeCtx()
    expect(() => consumeValue(null, ctx)).not.toThrow()
    expect(() => consumeValue(undefined, ctx)).not.toThrow()
    expect(() => consumeValue('str', ctx)).not.toThrow()
    expect(() => consumeValue(42, ctx)).not.toThrow()
    expect(ctx.currentUnit.bindingRefs).toHaveLength(0)
  })

  // ─── override 旁路（transform 改写所属节点 tag/import） ───
  // 机制：transform 往 ctx.override 写 tag/import，evalCvWithOverride 跑完 transform 后
  // 应用到 ctx.currentNode（owning node）。return 主路照走，override 是正交旁路。opt-in。

  it('absolute computed transform 写 ctx.override.tag/import → currentNode 被改写（containsJSX:true）', () => {
    const ctx = makeCtx({ rawState: { c: 5 } })
    const owner = comp('DropDown', { data: absCV('c', (raw, cvCtx) => {
      if (cvCtx) cvCtx.override = { tag: 'PopUpMenu', import: 'pkg/PopUpMenu' }
      return raw
    }, true) })
    ;(owner as any).tag = 'DropDown'
    ctx.currentNode = owner
    consumeValue(owner.props.data, ctx)
    // override 应用到 owning node
    expect((owner as any).tag).toBe('PopUpMenu')
    expect((owner as any).import).toBe('pkg/PopUpMenu')
    // return 主路照走 → jsxLiteralConsts
    expect(ctx.currentUnit.jsxLiteralConsts).toHaveLength(1)
    expect(ctx.currentUnit.jsxLiteralConsts[0].value).toBe(5)
  })

  it('absolute computed transform 写 ctx.override.tag → currentNode 被改写（containsJSX:false）', () => {
    const ctx = makeCtx({ rawState: { c: 5 } })
    const owner = comp('DropDown', { data: absCV('c', (raw, cvCtx) => {
      if (cvCtx) cvCtx.override = { tag: 'PopUpMenu' }
      return raw * 2
    }) })   // containsJSX:false
    ;(owner as any).tag = 'DropDown'
    ctx.currentNode = owner
    consumeValue(owner.props.data, ctx)
    expect((owner as any).tag).toBe('PopUpMenu')
    expect((owner as any).import).toBeUndefined()   // 未写 import → 不变
    // return 主路照走 → stateEntries
    expect(ctx.stateEntries.c).toBe(10)
  })

  it('transform 不写 override → currentNode 不变（opt-in 防御）', () => {
    const ctx = makeCtx({ rawState: { c: 5 } })
    const owner = comp('DropDown', { data: absCV('c', raw => raw, true) })
    ;(owner as any).tag = 'DropDown'
    ctx.currentNode = owner
    consumeValue(owner.props.data, ctx)
    expect((owner as any).tag).toBe('DropDown')     // 不变
    expect((owner as any).import).toBeUndefined()
  })

  it('ctx.currentNode 缺省（裸调 consumeValue 不经 walk）→ override 写了也不崩', () => {
    const ctx = makeCtx({ rawState: { c: 5 } })
    // 不设 currentNode → evalCvWithOverride 里 `if (node)` 兜住，跳过应用
    expect(() => consumeValue(absCV('c', (raw, cvCtx) => {
      if (cvCtx) cvCtx.override = { tag: 'X', import: 'pkg/X' }
      return raw
    }, true), ctx)).not.toThrow()
    // result 仍照走主路
    expect(ctx.currentUnit.jsxLiteralConsts[0].value).toBe(5)
  })
})

// ─── processLoop（enrichment 核心） ────────────────────────────────

describe('processLoop', () => {
  it('relative 嵌套循环（pathType relative + loopScope）→ 不做 enrichment，walk template body', () => {
    const ctx = makeCtx({ rawState: { a: 1 } })
    const lp = loop({
      data: relBind('items'),
      body: [comp('Div', { v: absBind('a') })],
      loopScope: { scopeType: 'loopScope', loopNode: {} as any },
      inline: true,
    })
    processLoop(lp, ctx, 'parent')
    // body 内 absolute binding 被收集到当前单元（inline → currentUnit）
    expect(ctx.currentUnit.bindingRefs).toHaveLength(1)
    expect(ctx.stateEntries.a).toBe(1)
    // 无 enrichment
    expect(ctx.currentUnit.enrichmentConsts).toHaveLength(0)
    expect(ctx.loopEnrichmentMap.size).toBe(0)
    // stateEntries 不含 items（relative 数据源不进 state）
    expect(ctx.stateEntries.items).toBeUndefined()
  })

  it('absolute 无 relative CV → setNested stateEntries + bindingRefs 收 loopData，无 enrichment map', () => {
    const ctx = makeCtx({ rawState: { items: [{ x: 1 }], a: 2 } })
    const lp = loop({
      data: absBind('items'),
      body: [comp('Div', { v: absBind('a') })],
    })
    processLoop(lp, ctx, 'parent')
    expect(ctx.stateEntries.items).toEqual([{ x: 1 }])
    // loopData 进 bindingRefs + body 内 'a' binding 也进
    expect(ctx.currentUnit.bindingRefs.some((b: any) => b.accessPath === 'items')).toBe(true)
    expect(ctx.stateEntries.a).toBe(2)
    expect(ctx.currentUnit.enrichmentConsts).toHaveLength(0)
    expect(ctx.loopEnrichmentMap.size).toBe(0)
  })

  it('absolute 数据为空（rawState 无该 path）→ warn + 跳过 enrichment，仍 walk body', () => {
    const ctx = makeCtx({ rawState: { a: 2 } }) // 无 items
    const lp = loop({ data: absBind('items'), body: [comp('Div', { v: absBind('a') })], inline: true })
    processLoop(lp, ctx, 'parent')
    expect(ctx.stateEntries.items).toBeUndefined()
    expect(ctx.currentUnit.enrichmentConsts).toHaveLength(0)
    // body 仍被 walk（inline → currentUnit）
    expect(ctx.currentUnit.bindingRefs.some((b: any) => b.accessPath === 'a')).toBe(true)
  })

  it('absolute + relative CV（containsJSX:false）→ enrichment 进 stateEntries + bindingRefs(constName) + loopEnrichmentMap', () => {
    const ctx = makeCtx({ rawState: { items: [{ title: 'a' }, { title: 'b' }] } })
    const lp = loop({
      data: absBind('items'),
      body: [comp('Div', { title: relCV('title', v => v.toUpperCase()) })],
      componentName: 'Item',
    })
    processLoop(lp, ctx, 'P')
    const { constName } = ctx.loopEnrichmentMap.get('P:Item')!
    expect(ctx.stateEntries[constName]).toEqual([{ title: 'A' }, { title: 'B' }])
    expect(ctx.currentUnit.bindingRefs.some((b: any) => b.accessPath === constName)).toBe(true)
    expect(ctx.currentUnit.enrichmentConsts).toHaveLength(0)
  })

  it('absolute + relative CV（containsJSX:true）→ enrichment 进 enrichmentConsts，不进 stateEntries', () => {
    const ctx = makeCtx({ rawState: { items: [{ icon: 'x' }] } })
    const lp = loop({
      data: absBind('items'),
      body: [comp('Div', { icon: relCV('icon', v => v, true) })],
      componentName: 'Item',
    })
    processLoop(lp, ctx, 'P')
    expect(ctx.currentUnit.enrichmentConsts).toHaveLength(1)
    expect(ctx.currentUnit.enrichmentConsts[0].containsJSX).toBe(true)
    // 仍记录 loopEnrichmentMap（含 JSX 的 enrichment 也记 const 名供 routeLoopNode）
    expect(ctx.loopEnrichmentMap.has('P:Item')).toBe(true)
  })

  // ─── override 旁路（调用点 2：相对路径 CV / processLoop / applyScopedCV） ───
  // 机制：transform 往 ctx.override 写 tag/import，applyScopedCV 在 leaf seed per-CV store、
  // save/restore cvCtx.override（隔离外层 CV）、read-back（兼容原地改写与整体赋值）、应用到 ownerNode。
  // 用户契约：循环每项都有对应数据 → uniform override（per-item idempotent）。

  it('调用点 2：relative CV transform 写 ctx.override.tag/import → 模板 ownerNode 被改写', () => {
    const ctx = makeCtx({ rawState: { items: [{ type: 'a' }, { type: 'b' }] } })
    const owner = comp('DropDown', { type: relCV('type', (raw, cvCtx) => {
      if (cvCtx) cvCtx.override = { tag: 'PopUpMenu', import: 'pkg/PopUpMenu' }
      return raw
    }) })
    const lp = loop({ data: absBind('items'), body: [owner], componentName: 'Item' })
    processLoop(lp, ctx, 'P')
    // override 应用到模板内 ownerNode（不是 ctx.currentNode——processLoop 不设它）
    expect((owner as any).tag).toBe('PopUpMenu')
    expect((owner as any).import).toBe('pkg/PopUpMenu')
  })

  it('调用点 2：relative CV 整体赋值 / 原地改写 两种写法都覆盖（read-back）', () => {
    const ctx = makeCtx({ rawState: { items: [{ type: 'a' }] } })
    // 整体赋值
    const ownerA = comp('DropDown', { type: relCV('type', (raw, cvCtx) => {
      if (cvCtx) cvCtx.override = { tag: 'PopUpMenuA' }
      return raw
    }) })
    processLoop(loop({ data: absBind('items'), body: [ownerA], componentName: 'Item' }), ctx, 'P')
    expect((ownerA as any).tag).toBe('PopUpMenuA')
    // 原地改写（seed 的 store 本体被 mutate）
    const ctx2 = makeCtx({ rawState: { items: [{ type: 'a' }] } })
    const ownerB = comp('DropDown', { type: relCV('type', (raw, cvCtx) => {
      if (cvCtx && cvCtx.override) { cvCtx.override.tag = 'PopUpMenuB'; cvCtx.override.import = 'pkg/B' }
      return raw
    }) })
    processLoop(loop({ data: absBind('items'), body: [ownerB], componentName: 'Item' }), ctx2, 'P')
    expect((ownerB as any).tag).toBe('PopUpMenuB')
    expect((ownerB as any).import).toBe('pkg/B')
  })

  it('调用点 2：transform 不写 override → ownerNode 不变（opt-in 防御）', () => {
    const ctx = makeCtx({ rawState: { items: [{ type: 'a' }] } })
    const owner = comp('DropDown', { type: relCV('type', raw => raw) })
    processLoop(loop({ data: absBind('items'), body: [owner], componentName: 'Item' }), ctx, 'P')
    expect((owner as any).tag).toBeUndefined()   // 不变
  })

  it('调用点 2：override 不污染外层 cvCtx.override（enrichScopedData 路径 save/restore）', () => {
    // 模拟 enrichScopedData 场景：外层 cvCtx 已带 override（dataset 外层 CV 的 store），
    // 内层相对 CV 跑完 transform 后应 restore 回外层 store、不被内层覆盖。
    // 这里用 applyScopedCV 直测：cvCtx.override 预置外层 store，跑内层 CV（写自己的 override），
    // 跑完 cvCtx.override 应恢复为外层 store 引用。
    const outerStore: any = { tag: 'OuterShouldRemain' }
    const cvCtx: any = { override: outerStore, rawState: {}, resolveValueFromPath: () => undefined, resolveIcon: () => null }
    const owner = comp('DropDown', { type: relCV('type', (raw, cvCtx2) => {
      if (cvCtx2) cvCtx2.override = { tag: 'Inner' }   // 整体赋值（会改 cvCtx.override 引用）
      return raw
    }) })
    applyScopedCV({ type: 'a' }, [], owner.props.type, cvCtx, owner, {} as any)
    expect((owner as any).tag).toBe('Inner')            // 内层 override 应用到 ownerNode
    expect(cvCtx.override).toBe(outerStore)             // 外层 store 引用恢复
    expect(cvCtx.override.tag).toBe('OuterShouldRemain')// 外层值未受污染
  })

  it('撞键去重：两个同 path 的 relative CV → 第一个 accessPath 保留原 key、第二个 diverted 到 _1', () => {
    // 去重契约（见 scoped-enrichment 源码注释）：多个 CV 写同一 path 会撞键，
    // 后一个 CV 从 out（已被前一个 CV 改写）读到非原始值 → transform 误读。
    // 处理：第一个保留原 accessPath，后续撞键的 CV 改 accessPath 为 _1/_2/...，
    // 把第二个的写入位置 divert 到独立键，避免覆盖第一个的结果。
    // 注意：第二个 CV 仍读 out[原 path]（已被改写），故其 transform 拿到的是改写后的值——
    // 现实里 resolveIcon 第一个 CV 把 string 变成 BuildNode，第二个 CV（同为 resolveIcon-style
    // `typeof raw==='string' ? rIcon(raw) : null`）读到 BuildNode → 返回 null → 写入 _1=null。
    const ctx = makeCtx({ rawState: { items: [{ icon: 'plus' }] } })
    const iconNode = (raw: string) => ({ __node: true, kind: 'component', component: 'Icon', props: { name: raw } })
    const lp = loop({
      data: absBind('items'),
      body: [
        comp('A', { icon: relCV('icon', (raw) => iconNode(raw)) }),
        comp('B', { icon: relCV('icon', (raw) => (typeof raw === 'string' ? iconNode(raw) : null)) }),
      ],
      componentName: 'Item',
    })
    processLoop(lp, ctx, 'P')
    const { constName } = ctx.loopEnrichmentMap.get('P:Item')!
    const item = ctx.stateEntries[constName][0]
    // 第一个 CV 写入 'icon'（BuildNode，保留）；第二个 CV diverted 到 'icon_1'，读到 BuildNode → null
    expect(item.icon).toStrictEqual(iconNode('plus'))
    expect(item.icon_1).toBeNull()
  })
})

// ─── buildState 入口（wiring 烟雾测） ──────────────────────────────

describe('buildState', () => {
  it('最小树 → newState 含 binding 值，stateContent 含 initialState', () => {
    const tree = comp('Div', { v: absBind('a') })
    const result = buildState({ rootTree: tree, state: { a: 1 } } as any)
    expect(result.newState.a).toBe(1)
    expect(result.stateContent).toContain('initialState')
    expect(result.sharedStateContent).toBeUndefined()
  })

  it('含 action eventMutatedPaths → sharedKeys 非空，生成 sharedStateContent', () => {
    const tree = comp('Div', {
      onClick: Value.action({ event: 'onClick', action: 'setState', path: '/open', value: false }),
    })
    const result = buildState({ rootTree: tree, state: { open: true }, eventMutatedPaths: new Set(['/open']) } as any)
    expect(result.sharedKeys.has('open')).toBe(true)
    expect(result.sharedStateContent).toBeDefined()
    expect(result.sharedStateContent).toContain('useSharedState')
  })
})
