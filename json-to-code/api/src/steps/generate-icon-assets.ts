/**
 * Step: GenerateIconAssets — 把 eview-ui 下载的图标 SVG 发射为产物文件
 *
 * 输入 ctx.builtPages[].iconSvgMap（A2UI name → SVG 文本；仅 eview-ui 在 BuildTrees
 * 的 resolveAll 里按 getIconInfo 的 url 直取填充，eview-react 为空对象）。
 * 写入 ctx.generatedFiles（与页面文件同列，由 WriteOutput 落到产物 public/icons/<name>.svg）。
 *
 * eview-ui 的 icon 属性只接 URL 路径字符串（不接 React DOM），mapping emit /icons/<name>.svg，
 * 故每个收集到的图标需有对应 svg 文件。本步骤聚合各页 iconSvgMap（按 name 去重）发射。
 *
 * eview-react 不下载 SVG（走 resolveIcon→@nce/icon-plus BuildNode），iconSvgMap 全空 → 本步无输出，
 * 零行为变化。
 *
 * 与 WriteOutput 的关系：WriteOutput step-1 模板目录扫描会复制既有 public/icons/placeholder.svg；
 * 本步骤 push 的 public/icons/<name>.svg 经 WriteOutput step-3（...ctx.generatedFiles）透传，
 * 与 placeholder.svg 并存于产物 public/icons/。
 */

import { Step } from '../core/step-base'
import type { PipelineContext } from '../pipeline/pipeline-context'

/** 文件名安全化：kebab-case 已安全，防御性把非法字符替换为 - */
function sanitizeIconName(name: string): string {
  return name.replace(/[^a-z0-9-]/gi, '-')
}

export class GenerateIconAssets extends Step {
  async execute(ctx: PipelineContext): Promise<void> {
    // 聚合各页 iconSvgMap（按 name 去重，同 name 取首次）
    const merged: Record<string, string> = {}
    for (const page of ctx.builtPages || []) {
      const map = page?.iconSvgMap
      if (!map || typeof map !== 'object') continue
      for (const [name, svg] of Object.entries(map)) {
        if (typeof svg === 'string' && svg && !(name in merged)) {
          merged[name] = svg
        }
      }
    }

    let count = 0
    for (const [name, svg] of Object.entries(merged)) {
      // 防御：跳过 placeholder（与模板既有 public/icons/placeholder.svg 同名避免覆盖）
      if (name === 'placeholder') continue
      const safe = sanitizeIconName(name)
      ctx.generatedFiles.push({
        path: `public/icons/${safe}.svg`,
        content: svg,
      })
      count++
    }

    if (count > 0) {
      console.log(`  ℹ  GenerateIconAssets: public/icons/*.svg (${count} 个图标)`)
    }
  }
}
