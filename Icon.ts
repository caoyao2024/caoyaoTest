/**
 * Icon → @nce/icon-plus 映射（新架构）
 *
 * A2UI Icon → @nce/icon-plus 命名导出组件。
 *
 * 核心逻辑：
 * 1. name（字面量 string）→ ctx.resolveIcon(iconName, props) 查表 resolve
 *    - 返回对应命名导出组件（如 IconPlusIcIctCircleCheck）
 *    - props 的 shape→type、color→iconColor 等映射由 resolveIcon 内部处理
 * 2. name（DataBinding）→ 用 stateValue（编译期快照值）查 iconNameMap resolve
 *    - stateValue 有效时 → 同字面量分支，返回 resolved icon 节点
 *    - stateValue 不可用时 → PLACEHOLDER_ICON 兜底，其他 props 正常映射
 * 3. 无有效 name → 纯占位
 *
 * 依赖：api-new/src/core/iconCollection.ts 中的 resolveIcon / PLACEHOLDER_ICON
 *
 * shape → type 枚举映射：
 *   outline → lined
 *   fill    → filled
 *   square  → square-bg
 *   circle  → round-bg
 *
 * color → iconColor（包装为数组）
 * className → className（透传）
 * 非标准 prop → 透传（排除 name/shape/color/className/__ 前缀）
 */

import type { MappingDef, TransformContext } from '../../../src/core/componentMapping'

/** 占位图标组件名，iconNameMap 中找不到映射时使用 */
const PLACEHOLDER_ICON = 'IconPlusIcPublicTransverseRectangleTemplate'

// A2UI shape enum → @nce/icon-plus type 枚举映射
const SHAPE_MAP: Record<string, string> = {
  outline: 'lined',
  fill: 'filled',
  square: 'square-bg',
  circle: 'round-bg',
}

const IconMapping: MappingDef = {
  // 占位值，由 transform 动态覆盖
  tag: PLACEHOLDER_ICON,
  import: { source: '@nce/icon-plus', named: true },

  transform(node: any, ctx: TransformContext) {
    const props = node.props || {}

    // ─── 处理 name ───
    const iconName = props.name

    // 路径绑定分支：用 stateValue（编译期快照值）查 iconNameMap resolve 图标名
    if (iconName && typeof iconName === 'object' && iconName.type === 'binding') {
      // 优先用 stateValue 查表 resolve，只有 stateValue 无效时才用 PLACEHOLDER_ICON
      const bindingName = iconName as { stateValue?: string; [key: string]: any }
      let iconNode: any = null
      if (typeof bindingName.stateValue === 'string') {
        iconNode = ctx.resolveIcon(bindingName.stateValue, props)
      }
      if (iconNode && iconNode.kind === 'component') {
        return {
          tag: iconNode.tag,
          import: iconNode.import,
          props: iconNode.props,
          children: null,
          selfClosing: iconNode.selfClosing ?? true,
        }
      }

      // stateValue 不可用 → 手动映射基础 props，tag 用 PLACEHOLDER_ICON
      const outputProps: Record<string, any> = {}

      // shape → type
      if (props.shape && SHAPE_MAP[props.shape]) {
        outputProps.type = SHAPE_MAP[props.shape]
      }
      // color → iconColor（包装为数组）
      if (props.color !== undefined) {
        outputProps.iconColor = [props.color]
      }
      // className 透传
      if (props.className) {
        outputProps.className = props.className
      }
      // 非标准 prop 透传（排除内部字段）
      for (const [key, value] of Object.entries(props)) {
        if (!['name', 'shape', 'color', 'className'].includes(key) && !key.startsWith('__')) {
          outputProps[key] = value
        }
      }

      return {
        tag: PLACEHOLDER_ICON,
        import: { source: '@nce/icon-plus', named: true },
        props: outputProps,
        children: null,
        selfClosing: true,
      }
    }

    // 字面量 string 分支：通过 ctx.resolveIcon 查表 resolve
    if (typeof iconName === 'string') {
      const iconNode = ctx.resolveIcon(iconName, props)
      if (iconNode && iconNode.kind === 'component') {
        return {
          tag: iconNode.tag,
          import: iconNode.import,
          props: iconNode.props,
          children: null,
          selfClosing: iconNode.selfClosing ?? true,
        }
      }
    }

    // 无有效 name → 纯占位
    return {
      tag: PLACEHOLDER_ICON,
      import: { source: '@nce/icon-plus', named: true },
      props: {},
      children: null,
      selfClosing: true,
    }
  },
}

export default IconMapping
