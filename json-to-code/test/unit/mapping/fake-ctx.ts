import { vi } from 'vitest'
import type { TransformContext } from '../../../api/src/core/component-mapping'

// ─── 共享 fakeCtx ──────────────────────────────────────────────────
//
// 隔离测 mapping.transform：resolveIcon 用 vi.fn spy（可断言调用参数 +
// 返回稳定 sentinel 便于结构相等断言）；resolveNode 用 identity（返回原节点，
// cell/subNode 已是 resolved 形态时成立）；state 空；resolveAbsoluteStateValue 无值。
//
// resolveIcon 返回的 sentinel 把入参（name + iconProps）透传进 props，
// 既能用 toHaveBeenCalledWith 断参数，又能读 props 验证透传参数。
// 注意：sentinel 是 ICON_SENTINEL() 每次新建的对象，故值比较用 toStrictEqual
// 而非 toBe（reference equality 会因对象实例不同而失败）。

export const ICON_SENTINEL = (name: string, iconProps?: Record<string, any>) => ({
  __node: true,
  kind: 'component' as const,
  component: 'IconStub',
  tag: 'IconStub',
  props: { name, ...(iconProps ?? {}) },
  selfClosing: true,
})

export function fakeCtx(
  overrides: Partial<TransformContext> = {},
): TransformContext & { resolveIcon: ReturnType<typeof vi.fn> } {
  return {
    state: {},
    resolveNode: (n: any) => n,
    resolveIcon: vi.fn((name: string, iconProps?: Record<string, any>) =>
      ICON_SENTINEL(name, iconProps),
    ),
    resolveAbsoluteStateValue: () => undefined,
    ...overrides,
  } as any
}

/** 目标组件库包名（eview-react 默认），用于断言 import 路径 */
export const PKG = '@nce/eview-react'

/** eview-ui bespoke 映射硬编码的包名（bespoke 是 default export 非 factory，import 已写死） */
export const UI_PKG = '@cloudsop/eview-ui'

// ─── 共享节点 / 值构造器 ────────────────────────────────────────────

import { Value } from '../../../api/src/core/value-factory'
import type { BuildNode } from '../../../api/src/core/node-types'

/** 构造 ComponentNode（带 __node brand） */
export function comp(
  component: string,
  props: Record<string, any> = {},
  extra: Record<string, any> = {},
): BuildNode {
  return { __node: true, kind: 'component', component, props, ...extra } as any
}

/** 绝对路径绑定 */
export function absBinding(accessPath: string, path = `/${accessPath}`) {
  return Value.binding({ path, pathType: 'absolute', accessPath })
}

/** 相对路径绑定 */
export function relBinding(accessPath: string) {
  return Value.binding({ path: accessPath, pathType: 'relative', accessPath })
}
