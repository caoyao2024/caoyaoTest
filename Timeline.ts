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
 * | title / label（标题/步骤名） | title | 改名透传，放入 content[{title}] |
 * | content（字面量） | content[{text}] | 放入 content 数组 |
 * | content（DataBinding） | content[{text}] | 同上，每项 item[path] 映射 |
 * | content（SlotNode） | render fn body | resolve 后作为 render 函数 body，需 dataSource 参数解析相对绑定 |
 * | icon（字面量） | icon | ctx.resolveIcon() |
 * | icon（DataBinding） | icon | ComputedValue + containsJSX |
 *
 * ## render 函数
 *
 * eview-react TimeLine 的 render 函数接收当前时间线项的 content 数组：
 *   render(content) → content 是 { [key: string]: any }[] 数组
 * 组件对每个时间线项调用一次 render，传入该项的 content 数组。
 *
 * - **文本/绑定 content** → render 使用 rawExpr 遍历 content 数组渲染文本
 * - **SlotNode content** → render body 为 resolve 后的子树。
 *   由于 render 只接收 content 参数，而 SlotNode 子树中的相对绑定需要访问当前项数据，
 *   render 函数需添加 `dataSource` 参数（如 `(content, item)`），其中 item 绑定到循环数据源，
 *   使 state-builder 建立 RenderFnScope、jsx-emitter 生成解构行。
 *   eview-react TimeLine 需在调用 render 时传入当前项数据作为第二个参数。
 *
 * ## 特殊逻辑
 *
 * - 同 Steps/Table 的"吞噬 children → data prop"模式
 * - A2UI 的 title/label 映射到 eview-react 的 title 字段
 * - eview-react 的 content 是对象数组 `{ title, text }` 格式
 * - icon 字面量用 resolveIcon 直出，DataBinding 走 ComputedValue
 * - render 函数是组件级别的（所有 item 共用一个 render）
 *
 * 工厂化：接收目标组件库包名 `pkg`，构建 import 路径，便于多库复用。
 */

import type { MappingDef, TransformContext } from '../../../src/core/component-mapping'
import type { LoopNode } from '../../../src/core/node-types'
import type { PropValue, BindingValue } from '../../../src/core/value-types'
import { Value } from '../../../src/core/value-factory'
import { buildRenderFn, enrichScopedData } from '../../../src/core/scoped-enrichment'

/** 从 TimelineItem 节点 props 中提取字段映射信息 */
interface ItemFieldMap {
  /** title/label 字段路径（相对绑定如 'step'） */
  titleField: string | null
  /** title/label 字面量值 */
  titleValue: string | null
  /** content 字段路径（相对绑定如 'projectInfo'） */
  contentField: string | null
  /** content 字面量值 */
  contentValue: string | null
  /** content 是否为 SlotNode */
  contentIsSlot: boolean
  /** icon 字段路径 */
  iconField: string | null
  /** icon 字面量值 */
  iconValue: string | null
  /** 是否包含 JSX（icon 相关） */
  hasJSX: boolean
}

function extractFieldMap(item: any): ItemFieldMap {
  const p = item?.props || {}
  const m: ItemFieldMap = {
    titleField: null, titleValue: null,
    contentField: null, contentValue: null, contentIsSlot: false,
    iconField: null, iconValue: null,
    hasJSX: false,
  }

  // title / label（A2UI 中 title 存日期，label 存步骤名；统一映射到 eview-react title）
  const titleProp = p.title || p.label
  if (titleProp) {
    if (titleProp.type === 'binding') m.titleField = titleProp.path
    else if (typeof titleProp === 'string') m.titleValue = titleProp
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
      if (v && typeof v === 'object' && !(v as any).type) cleanLoopScope(v)
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

          // title/label → content 中的 { title } 项
          if (f.titleValue !== null) contentArr.push({ title: f.titleValue })
          else if (f.titleField) contentArr.push({ title: (child.props.title || child.props.label) })  // BindingValue

          // content → content 中的 { text } 项
          if (f.contentValue !== null) contentArr.push({ text: f.contentValue })
          else if (f.contentField) contentArr.push({ text: child.props.content })  // BindingValue
          // SlotNode content → 不放入 content 数组，由 render 函数直接渲染

          const item: Record<string, any> = {
            title: f.titleValue ?? '',
          }

          if (contentArr.length > 0) item.content = contentArr

          // icon
          if (f.iconValue) {
            const iconNode = ctx.resolveIcon(f.iconValue)
            if (iconNode) item.icon = iconNode
          } else if (f.iconField) {
            item.icon = Value.computed({
              path: (child.props.icon).path,
              pathType: (child.props.icon).pathType ?? 'absolute',
              accessPath: (child.props.icon).accessPath ?? 'timelineIcon',
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
            // 静态 children 不在循环中，SlotNode 子树中的 binding 是 absolute，
            // 不需要 dataSource 参数（通过 stateRef 直接引用）
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

        // ─── data prop ───
        if (f.contentIsSlot && resolvedSlot) {
          // SlotNode content → render 函数通过 item 参数访问当前项数据，
          // 需要保留原始数据的所有字段（如 approver、result 等）。
          // enrichScopedData 会 structuredClone 原始项 + 应用 relative CV enrichment，
          // 保证 data 中的项包含所有原始字段 + icon 等 enrichment 字段。
          // 额外补充 title/content 等标准字段。
          const scopedData = enrichScopedData(dataBinding, [resolvedSlot])
          // 在 enrichScopedData 的基础上补充 eview-react 标准字段（title/content/iconType）
          // 需要合并：先 enrich（保留原始字段），再覆盖/补充标准字段
          outputProps.data = Value.computed({
            path: dataBinding.path,
            pathType: dataBinding.pathType ?? 'absolute',
            accessPath: dataBinding.accessPath ?? 'timelineData',
            containsJSX: scopedData.containsJSX || f.hasJSX,
            stateValue: dataBinding.stateValue,
            transform: (rawData: any, cvCtx?: any) => {
              if (!Array.isArray(rawData)) return []
              const rIcon = cvCtx?.resolveIcon ?? ctx.resolveIcon
              // 先走 enrichScopedData 的 transform（保留所有原始字段 + CV enrichment）
              const enriched = scopedData.transform(rawData, cvCtx)
              if (!Array.isArray(enriched)) return []
              // 再补充 eview-react 标准字段
              return enriched.map((enrichedItem: any, idx: number) => {
                // title/label → eview-react title（即使原始数据有 step 字段，也需要 title 字段）
                if (f.titleField) {
                  enrichedItem.title = enrichedItem[f.titleField] ?? ''
                } else if (f.titleValue) {
                  enrichedItem.title = f.titleValue
                }
                // content 数组（eview-react 标准 content 格式）
                if (!enrichedItem.content) {
                  const contentArr: any[] = []
                  if (f.titleField) contentArr.push({ title: enrichedItem[f.titleField] ?? '' })
                  else if (f.titleValue) contentArr.push({ title: f.titleValue })
                  if (contentArr.length > 0) enrichedItem.content = contentArr
                }
                // icon（字面量在 enrichScopedData 不处理，这里补充）
                if (f.iconValue) {
                  const iconNode = rIcon(f.iconValue)
                  if (iconNode) enrichedItem.icon = iconNode
                }
                return enrichedItem
              })
            },
          })
        } else {
          // 非 SlotNode content → 使用原有的 Value.computed 构建精简 data
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

                // title/label → content 中的 { title } 项
                if (f.titleField) contentArr.push({ title: item[f.titleField] ?? '' })
                else if (f.titleValue) contentArr.push({ title: f.titleValue })

                // content → content 中的 { text } 项
                if (f.contentField) contentArr.push({ text: item[f.contentField] ?? '' })
                else if (f.contentValue !== null) contentArr.push({ text: f.contentValue })

                const dataItem: Record<string, any> = {
                  title: f.titleField ? (item[f.titleField] ?? '') : (f.titleValue ?? ''),
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
        }

        // ─── render 函数 ───
        if (f.contentIsSlot && resolvedSlot) {
          // SlotNode content → render body 为 resolve 后的子树
          // 循环模板中的 SlotNode 子树可能含相对绑定，需要 dataSource 参数
          // 让 state-builder 建立 RenderFnScope，jsx-emitter 生成解构行
          // render 签名 (content, item)，eview-react 需在调用 render 时传当前项数据
          outputProps.render = buildRenderFn(resolvedSlot, [
            { name: 'content' },
            { name: 'item', dataSource: dataBinding },
          ])
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
