/**
 * cli.ts — transformer CLI 调试入口（根目录）
 *
 * 调用 api/index.ts 的 downloadHuiCode，把 A2UI JSON 转成 React 项目代码。
 * 用法：npx tsx cli.ts / npm run dev
 *
 * 把生成的 .tsx / .ts 文件写到 ./output/ 下供人眼检查。
 */

import fs from 'fs'
import path from 'path'

import { downloadHuiCode } from './api/index'

async function main() {
  // 读取 pages-source 下的页面作为测试输入（平铺：每个 .json 一页，文件名即页名）
  const pagesDir = path.resolve('./pages-source')
  const pages: any[] = []

  if (fs.existsSync(pagesDir)) {
    const files = fs.readdirSync(pagesDir, { withFileTypes: true })
      .filter(d => d.isFile() && d.name.toLowerCase().endsWith('.json'))
      .map(d => d.name)
      .sort()

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(pagesDir, file), 'utf-8'))
      pages.push({
        planner: data.planner,
        mergedA2UI: data.mergedA2UI ?? data,
      })
    }
  }

  if (pages.length === 0) {
    console.log('[cli] 未找到测试页面，使用空输入')
  } else {
    console.log(`[cli] 加载了 ${pages.length} 个测试页面:`, pages.map(p => p._pageName))
  }

  // targetLib 取自命令行参数（npx tsx cli.ts [eview-react|eview-ui] [light|dark]），默认 eview-react / light
  const targetLib = process.argv[2] || 'eview-react'
  const themeArg = process.argv[3] || 'light'
  // theme 收窄到 'light' | 'dark'（与 downloadHuiCode options.theme 类型对齐），非法值 fail-fast
  if (themeArg !== 'light' && themeArg !== 'dark') {
    throw new Error(`[cli] 无效的 theme 参数: ${themeArg}（可选: light | dark）`)
  }
  const theme: 'light' | 'dark' = themeArg
  const result = await downloadHuiCode(pages, { targetLib, theme })
  console.log(`管线执行完成（targetLib=${targetLib}，theme=${theme}），共 ${result.files.length} 个产出文件`)

  // 写到 ./output/，先清空目录再写入
  const outDir = path.resolve('./output')
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
  for (const file of result.files) {
    const target = path.join(outDir, file.path)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, file.content, 'utf-8')
  }
  console.log(`已写入 ${result.files.length} 个文件到 ${outDir}/`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
