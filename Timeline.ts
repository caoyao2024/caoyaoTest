/**
 * Timeline → TimeLine 映射（新架构）
 *
 * A2UI Timeline → eview-react TimeLine 组件。
 *
 * ## Props 对照
 *
 * | A2UI prop | eview-react prop | 处理方式 |
 * |-----------|-----------------|---------|
 * | orientation | — | 丢弃（eview-react 只支持垂直） |
 * | mode / variant | — | 丢弃 |
 * | className | className | 透传 |
 * | children（TimelineItem 列表） | data + render | **吞噬 children** → 转为 dataType[] + render 函数 |
 *
 * ## dataType 映射
 *
 * | A2UI TimelineItem prop | eview-react dataType | 处理方式 |
 * |------------------------|---------------------|---------|
 * | title（存的是日期字符串） | date + content[{title}] | 改名透传 date，同时放入 content 数组 |
 * | content（字面量） | content[{text}] | 放入 content 数组 |
 * | content（DataBinding） | content[{text}] | 同上，每项 item[path] 映射 |
 * | content（SlotNode） | render fn body | 不放入 content 数组，resolve 后作为 render 函数 body |
 * | icon（字面量） | icon | ctx.resolveIcon() |
 * | icon（DataBinding） | icon | ComputedValue + containsJSX |
 *
 * ## render 函数
 *
 * eview-react TimeLine 组件需要 `render` prop：`(content?: { [key: string]: any }[]) => ReactNode`。
 * 组件对每个时间线项调用 render，传入该项的 content 数组。
 *
 * - SlotNode content → render body 为 resolve 后的子树
 * - 文本/绑定 content → render body 使用 rawExpr 渲染 content 数组中的文本
 *
 * ## 特殊逻辑
 *
 * - 同 Steps/Table 的"吞噬 children → data prop"模式
 * - eview-react 的 content 是对象数组 `{ title }` / `{ text }` 格式
 * - icon 字面量用 resolveIcon 直出，DataBinding 走 ComputedValue
 * - render 函数是组件级别的（所有 item 共用一个 render）
 *
 * 工厂化：接收目标组件库包名 `pkg`，构建 import 路径，便于多库复用。
 */

import type { MappingDef, TransformContext } from '../../../src/core/component-mapping'
import type { LoopNode } from '../../../src/core/node-types'
import type { PropValue, BindingValue } from '../../../src/core/value-types'
import { Value } from '../../../src/core/value-factory'

/** 从 TimelineItem 节点 props 中提取字段映射信息 */
interface ItemFieldMap {
  dateField: string | null; dateValue: string | null
  contentField: string | null; contentValue: string | null; contentIsSlot: boolean
  iconField: string | null; iconValue: string | null
  hasJSX: boolean
}

function extractFieldMap(item: any): ItemFieldMap {
  const p = item?.props || {}
  const m: ItemFieldMap = {
    dateField: null, dateValue: null,
    contentField: null, contentValue: null, contentIsSlot: false,
    iconField: null, iconValue: null,
    hasJSX: false,
  }

  // title（A2UI 中存的是日期字符串）
  if (p.title) {
    if (p.title.type === 'binding') m.dateField = p.title.path
    else if (typeof p.title === 'string') m.dateValue = p.title
  }

  // content（三分支：string / DataBinding / SlotNode）
  if (p.content) {
    if (p.content.type === 'binding') m.contentField = p.content.path
    else if (p.content.type === 'slotNode') m.contentIsSlot = true
    else if (typeof p.content === 'string') m.contentValue = p.content
  }

  // icon（string / DataBinding）
  if (p.icon) {
    if (p.icon.type === 'binding') { m.iconField = p.icon.path; m.hasJSX = true }
    else if (typeof p.icon === 'string') { m.iconValue = p.icon; m.hasJSX = true }
  }

  return m
}

/** 清除节点树中的 loopScope（断循环引用） */
function cleanLoopScope(n: any): void {
  if (!n || typeof n !== 'object') return
  delete n.loopScope
  if (Array.isArray(n.children)) n.children.forEach(cleanLoopScope)
  if (n.kind === 'loop') { cleanLoopScope(n.template); n.template?.body?.forEach(cleanLoopScope) }
  if (n.props && typeof n.props === 'object') {
    for (const v of Object.values(n.props)) {
      if (v && typeof v === "object" && !(v as any).type) cleanLoopScope(v)
    }
  }
}

export function createTimelineMapping(pkg: string): MappingDef {
  return {
    tag: 'TimeLine',
    import: `${pkg}/TimeLine`,

    transform(node: any, ctx: TransformContext) {
      const props = node.props || {}
      const children = node.children
      const outputProps: Record<string, PropValue> = {}

      // ─── 简单 prop ───
      if (props.className) outputProps.className = props.className as PropValue

      // ─── children → data + render ───
      if (!children) {
        outputProps.data = []
        return { props: outputProps, children: null }
      }

      if (Array.isArray(children)) {
        // ═══ 分支 A：静态 children ═══
        const data: any[] = []
        let hasSlotContent = false
        let slotChild: any = null

        for (let i = 0; i < children.length; i++) {
          const child = children[i] as any
          const f = extractFieldMap(child)

          // 构建 content 数组（eview-react 格式：{ title, text } 对象数组）
          const contentArr: any[] = []

          // title（日期）→ content 中的 { title } 项
          if (f.dateValue !== null) contentArr.push({ title: f.dateValue })
          else if (f.dateField) contentArr.push({ title: child.props.title })  // BindingValue

          // content → content 中的 { text } 项
          if (f.contentValue !== null) contentArr.push({ text: f.contentValue })
          else if (f.contentField) contentArr.push({ text: child.props.content })  // BindingValue
          // SlotNode content → 不放入 content 数组，由 render 函数直接渲染

          const item: Record<string, any> = {
            date: f.dateValue ?? '',
          }

          if (contentArr.length > 0) item.content = contentArr

          // icon
          if (f.iconValue) {
            const iconNode = ctx.resolveIcon(f.iconValue)
            if (iconNode) item.icon = iconNode
          } else if (f.iconField) {
            item.icon = Value.computed({
              path: child.props.icon.path,
              pathType: child.props.icon.pathType ?? 'absolute',
              accessPath: child.props.icon.accessPath ?? 'timelineIcon',
              containsJSX: true,
              transform: (raw: any, cvCtx?: any) => {
                const rIcon = cvCtx?.resolveIcon ?? ctx.resolveIcon
                return typeof raw === 'string' ? rIcon(raw) : null
              },
            })
          }

          // 记录 SlotNode content（用于 render 函数构建）
          if (f.contentIsSlot) {
            hasSlotContent = true
            slotChild = child
          }

          data.push(item)
        }
        outputProps.data = data as any

        // ─── render 函数 ───
        // eview-react 对每个时间线项调用 render，传入该项的 content 数组
        if (hasSlotContent && slotChild) {
          // SlotNode content → render body 为 resolve 后的子树
          const resolvedContent = ctx.resolveNode(slotChild.props.content.node)
          if (resolvedContent) {
            cleanLoopScope(resolvedContent)
            outputProps.render = Value.renderFn({
              params: [{ name: 'content' }],
              body: resolvedContent,
            })
          }
        } else {
          // 文本/绑定 content → render 使用 rawExpr 渲染 content 数组中的文本
          outputProps.render = Value.rawExpr({
            value: '(content) => <div>{content?.map((item, i) => <span key={i}>{item.text || item.title}</span>)}</div>',
          })
        }

        // ─── propRoute ───
        const propRoute: Record<string, any> = {}
        if (outputProps.render && (outputProps.render as any).type === 'renderFn') {
          propRoute.render = 'module-top'
        }

        return { props: outputProps, children: null, propRoute: Object.keys(propRoute).length > 0 ? propRoute : undefined }
      }

      if ((children as any).kind === 'loop') {
        // ═══ 分支 B：循环模板 ═══
        const loop = children as LoopNode
        const tmpl = loop.template.body[0] as any
        if (!tmpl) { outputProps.data = []; return { props: outputProps, children: null } }

        const f = extractFieldMap(tmpl)
        const dataBinding = loop.data as BindingValue

        // SlotNode content 预 resolve
        let resolvedSlot: any = null
        if (f.contentIsSlot) {
          resolvedSlot = ctx.resolveNode(tmpl.props.content.node)
          if (resolvedSlot) cleanLoopScope(resolvedSlot)
        }

        outputProps.data = Value.computed({
          path: dataBinding.path,
          pathType: dataBinding.pathType ?? 'absolute',
          accessPath: dataBinding.accessPath ?? 'timelineData',
          containsJSX: f.hasJSX,
          transform: (rawData: any, cvCtx?: any) => {
            if (!Array.isArray(rawData)) return []
            const rIcon = cvCtx?.resolveIcon ?? ctx.resolveIcon

            return rawData.map((item: any, idx: number) => {
              // 构建 content 数组
              const contentArr: any[] = []

              // title → content 中的 { title } 项
              if (f.dateField) contentArr.push({ title: item[f.dateField] ?? '' })
              else if (f.dateValue) contentArr.push({ title: f.dateValue })

              // content → content 中的 { text } 项
              if (f.contentField) contentArr.push({ text: item[f.contentField] ?? '' })
              else if (f.contentValue !== null) contentArr.push({ text: f.contentValue })
              // SlotNode → 不放入 content 数组

              const dataItem: Record<string, any> = {
                date: f.dateField ? (item[f.dateField] ?? '') : (f.dateValue ?? ''),
              }

              if (contentArr.length > 0) dataItem.content = contentArr

              // icon
              if (f.iconField) {
                const name = item[f.iconField]
                if (typeof name === 'string') {
                  const iconNode = rIcon(name)
                  if (iconNode) dataItem.icon = iconNode
                }
              } else if (f.iconValue) {
                const iconNode = rIcon(f.iconValue)
                if (iconNode) dataItem.icon = iconNode
              }

              return dataItem
            })
          },
        })

        // ─── render 函数 ───
        if (f.contentIsSlot && resolvedSlot) {
          // SlotNode content → render body 为 resolve 后的子树
          outputProps.render = Value.renderFn({
            params: [{ name: 'content' }],
            body: resolvedSlot,
          })
        } else {
          // 文本/绑定 content → render 使用 rawExpr 渲染 content 数组中的文本
          outputProps.render = Value.rawExpr({
            value: '(content) => <div>{content?.map((item, i) => <span key={i}>{item.text || item.title}</span>)}</div>',
          })
        }

        // ─── propRoute ───
        const propRoute: Record<string, any> = {}
        if (outputProps.render && (outputProps.render as any).type === 'renderFn') {
          propRoute.render = 'module-top'
        }

        return { props: outputProps, children: null, propRoute: Object.keys(propRoute).length > 0 ? propRoute : undefined }
      }

      return { props: outputProps, children: null }
    },
  }
}
