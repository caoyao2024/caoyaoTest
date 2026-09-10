/**
 * eview-ui 图标占位 URL（统一常量）
 *
 * eview-ui npm 包（`@cloudsop/eview-ui`）自带的组件，其 icon 相关属性**只接 URL 字符串、
 * 不接 React DOM**（与 eview-react 不同——后者用 `resolveIcon` 产 BuildNode）。
 *
 * 当前阶段：**所有 icon 一律用这个统一占位 URL**，不管输入 json 是字面量图标名、
 * DataBinding、还是 iconType 值——transform 产出的图标都是这个写死的字符串。
 * 用的地方引用本常量，路径写死在此处，便于后续统一替换为真实图标 URL 解析。
 *
 * 涉及的 eview-ui 映射（凡原 eview-react 用到 `resolveIcon` 的）：
 *   - 本地工厂副本：Input(suffix) / Menu(Accordion dataItem.icon) / TabItem(icon) /
 *     Timeline(自定义 icon，iconType 枚举保留) / Tree(节点 icon，**属性名
 *     treeNodePrefix→icon**，递归 normalizeTreeNode)
 *   - bespoke：Button(leftIcon/rightIcon) / Dropdown(Menu.Item icon) / Steps(iconUrl)
 *
 * 不涉及（无需引用本常量）：
 *   - Icon 组件本身（独立映射，单独处理）
 *   - `@/shared` 共享实现（Badge/Tag/Divider/Chart）——共享组件能接 React DOM icon，
 *     不属 eview-ui 包组件（见 [AGENTS.md](../../../AGENTS.md) §7 icon-URL 边界）
 *   - Switch bespoke（已丢弃 checkedChildrenIcon/unCheckedChildrenIcon）
 *   - DatePicker/Rate/Progress/TextArea bespoke 及所有复用工厂（均不调 resolveIcon）
 */
export const PLACEHOLDER_ICON_URL = '/icons/placeholder.svg'

import type { PropValue } from '../../../src/core/value-types'
import { Value } from '../../../src/core/value-factory'

/**
 * 图标名 → 产物路径字符串：/icons/<name>.svg
 *
 * eview-ui 的 icon 属性只接 URL 路径字符串（不接 React DOM），故每个收集到的图标
 * 在 BuildTrees 的 resolveAll 里按 getIconInfo 的 url 下载真实 SVG，由 GenerateIconAssets
 * 发射为 public/icons/<name>.svg；mapping 用本函数把图标名转成 /icons/<name>.svg 引用。
 */
export function iconNameToPath(name: string): string {
  return `/icons/${name}.svg`
}

/**
 * 构造 icon prop 值（eview-ui 专用，替代旧的「一律占位 URL」策略）
 *
 * - 字面量图标名（string）→ 路径字符串 `/icons/<name>.svg`
 * - DataBinding（{type:'binding', path, ...}）→ ComputedValue（containsJSX:false），
 *   transform 把运行时图标名拼成 `/icons/<name>.svg`；raw 非字符串时回退占位 URL
 * - 无值/其他 → null
 *
 * transform 是纯闭包字符串拼接，不依赖 cvCtx/ctx 查表——故无需管线 carrier / state-builder
 * 挂 resolveIconUrl。路径由 name 直接算出；svg 文件由下载步保证存在。
 */
export function buildIconPathProp(iconProp: any): PropValue | null {
  if (!iconProp) return null

  if (typeof iconProp === 'object' && iconProp.type === 'binding') {
    return Value.computed({
      path: iconProp.path,
      pathType: iconProp.pathType ?? 'absolute',
      accessPath: iconProp.accessPath,
      containsJSX: false,
      transform: (rawValue) =>
        typeof rawValue === 'string' ? iconNameToPath(rawValue) : PLACEHOLDER_ICON_URL,
    })
  }

  if (typeof iconProp === 'string') {
    return iconNameToPath(iconProp)
  }

  return null
}
