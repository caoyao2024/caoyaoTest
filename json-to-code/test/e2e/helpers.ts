import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { HuiCodeInput, OutputFile } from '../../api/index'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// 从 test/e2e/ 回到项目根
const ROOT = path.resolve(__dirname, '..', '..')

/**
 * 装载测试页面数据。兼容两种布局：
 *   - pages-source/{name}.json（CLI 主数据，平铺：每个 .json 一页，如 orderAdmin）
 *   - test/{name}.json（平铺 fixture，如 管理系统、页签）
 * 返回 downloadHuiCode 所需的 { planner, mergedA2UI }（兼容 a2ui 别名）。
 */
export function loadPage(name: string): HuiCodeInput {
  const candidates = [
    path.join(ROOT, 'pages-source', `${name}.json`),
    path.join(ROOT, 'test', `${name}.json`),
  ]
  const file = candidates.find(f => fs.existsSync(f))
  if (!file) {
    throw new Error(`[loadPage] 找不到页面数据: ${name}（已尝试 ${candidates.join(', ')}）`)
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  return {
    planner: data.planner,
    mergedA2UI: data.mergedA2UI ?? data.a2ui ?? data,
  }
}

/**
 * e2e 覆盖的页面名列表（react 与 ui 共用）。
 *
 * 加页：把 JSON 放到 pages-source/{name}.json 或 test/{name}.json，
 *       然后在这里加一行 name，跑 `npx vitest run test/e2e` 生成快照。
 * 删页：删掉一行 + 删 __snapshots__/{name}.snap。
 * 换数据：覆盖对应 JSON，跑 `npx vitest -u test/e2e` 刷新快照（务必 review diff）。
 */
export const PAGES = [
  'eventTest',
  'pageProductContainer',
  '系统页面',
  '页签',
]

/**
 * 把产物文件列表序列化为可快照的文本：每个文件前加 `// path` 注释，空行分隔。
 * 整页一个快照（简单）；diff 时能看到具体哪个文件变了。
 *
 * 行尾归一为 LF：generated content 可能含 CRLF（模板文件 Windows 行尾），
 * 而 `.snap` 经 `.gitattributes`（`* text=auto eol=lf`）在 git 操作
 * （commit/checkout/stash/pop）后恒为 LF。若快照保留 CRLF，则 stash/pop
 * 把快照规范成 LF 后会与 CRLF 产物逐字节不匹配 → vitest 报整文件 mismatch
 * （行尾假象，非真回归）。统一在序列化期归一 LF，快照恒为 LF，跨平台/git 操作稳定。
 * 仅影响 e2e 快照文本，不影响真实产物（cli.ts 直接写 result.files，不经此函数）。
 */
export function serializeFiles(files: OutputFile[]): string {
  return files
    .map(f => `// ${f.path}\n${f.content.replace(/\r\n/g, '\n')}`)
    .join('\n\n')
}
