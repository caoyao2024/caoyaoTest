/**
 * jsonTest/run-batch.ts — 批量自动化生成入口
 *
 * 读取 jsonTest/input/ 下所有 .json，每个文件调用一次 downloadHuiCode，
 * 产出到 jsonTest/output/{文件名去后缀}-{时间戳}-{内容hash}/ 下，每个输入一个独立文件夹。
 *
 * 为什么不复用 cli.ts：cli.ts 每次运行都会清空 ./output/ 再写入，
 * 批量调用会互相覆盖；这里直接调用 API（downloadHuiCode），
 * 每个 input 产出写到各自的子文件夹，符合 API 模式“返回 files、由 caller 写盘”的契约。
 *
 * 为什么串行而非并发：downloadHuiCode 内部会覆写共享的 config 对象
 * （config.targetLib / config.templateDir），并发调用会产生竞态，故逐个执行。
 *
 * 为什么 output 文件夹名带时间戳 + 内容 hash：时间戳一眼区分新旧版本，
 * hash 区分内容版本；跨多次运行时，同一文件的不同内容/不同运行各落独立文件夹，保留历史。
 *
 * 容错策略（单文件失败不连累整批）：
 *   - 正常 throw / awaited rejection：per-file try/catch 兜住，记失败、跳过、继续下一个。
 *   - 游离的 unhandledRejection / uncaughtException（逃出 await 链的异步错误，
 *     try/catch 抓不到，Node 默认会直接崩进程导致整批中断）：注册进程级兜底 handler，
 *     记录后不退出。仅批量 runner 这样做——它会把所有未处理异步错误吞掉，
 *     只适用于“单文件失败不能连累整批”的批量测试场景。
 *   - 失败时清掉已创建的不完整产物目录，避免半截 output 干扰对比。
 *   - 失败列表写 jsonTest/batch-failures.log（*.log 已 gitignore），便于在 100+ 文件里定位要修的 JSON。
 *
 * 用法：
 *   npm run batch                 # 默认 targetLib = eview-react
 *   npm run batch -- eview-ui     # 指定 targetLib
 *   npx tsx jsonTest/run-batch.ts [targetLib]
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

import { downloadHuiCode } from '../api/index'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const inputDir = path.resolve(__dirname, 'input')
const outputDir = path.resolve(__dirname, 'output')
const failuresLog = path.resolve(__dirname, 'batch-failures.log')

/** sha1 前若干位作为内容指纹，用于 output 文件夹命名 */
function contentHash(buf: Buffer, len = 8): string {
  return crypto.createHash('sha1').update(buf).digest('hex').slice(0, len)
}

/**
 * 把 input/ 下的原始 JSON 归一化成 downloadHuiCode 接受的形态：
 *   { planner: { slots: [] }, mergedA2UI: { rootId, elements, state } }
 *
 * 兼容两种形态：
 *   1. 裸 mergedA2UI 文档（顶层即 rootId/elements/state，无 planner 包装）—— 当前往置形态
 *   2. { planner, mergedA2UI } （pages-source 形态）
 *
 * 裸文档缺 planner：downloadHuiCode 内部读 planner.slots 构造 splitMeta，
 * 没有就补 { slots: [] }，splitMeta 自然为空数组，下游照常走。
 */
function loadPage(filePath: string) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const mergedA2UI = data.mergedA2UI ?? data
  const planner = data.planner ?? { slots: [] }
  return { planner, mergedA2UI }
}

/**
 * 本地时间戳，格式 YYYY-MM-DD_HHmmss，放在文件夹名里便于一眼区分新旧版本。
 * 用本地时区（开发者本地时间），不用 UTC，方便和记忆对齐。
 */
function localStamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
    `_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  )
}

/** 取错误首行信息，避免多行 stack 刷屏 */
function errHead(err: any): string {
  const msg = err?.message || String(err)
  return msg.split('\n')[0]
}

async function main() {
  // targetLib 取自命令行参数，默认 eview-react
  const targetLib = process.argv[2] || 'eview-react'

  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true })
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 仅取 input/ 顶层 .json 文件（不递归，避免子目录意外参与）
  const files = fs
    .readdirSync(inputDir, { withFileTypes: true })
    .filter(d => d.isFile() && d.name.toLowerCase().endsWith('.json'))
    .map(d => d.name)
    .sort()

  if (files.length === 0) {
    console.log('[batch] jsonTest/input/ 下没有 .json 文件，请先把输入 JSON 放进去')
    process.exit(0)
  }

  console.log(`[batch] targetLib=${targetLib}，共 ${files.length} 个输入文件`)
  console.log(`[batch] 输入目录: ${inputDir}`)
  console.log(`[batch] 输出目录: ${outputDir}`)

  // ─── 进程级兜底：游离异步错误不崩进程 ───
  // 追踪当前处理的文件，给游离的 unhandledRejection / uncaughtException 归因。
  let currentFile = ''
  const seenBackstop = new Set<string>()
  const backstop = (kind: string) => (err: any) => {
    const head = errHead(err)
    const key = `${currentFile}::${kind}::${head}`
    if (seenBackstop.has(key)) return // 同一文件同类错误可能多次触发，去重
    seenBackstop.add(key)
    const where = currentFile ? ` (${currentFile})` : ''
    console.error(`[batch] ${kind}${where}: ${head}`)
  }
  process.on('unhandledRejection', backstop('UNHANDLED_REJECTION'))
  process.on('uncaughtException', backstop('UNCAUGHT_EXCEPTION'))

  let ok = 0
  let fail = 0
  const failures: { file: string; error: string }[] = []

  for (const file of files) {
    currentFile = file
    const stem = path.basename(file, '.json')
    const inPath = path.join(inputDir, file)
    const tag = `[batch] ${file}`
    let outRoot: string | null = null

    try {
      // 用原始文件字节算 hash，保证同内容幂等（不受 JSON 解析/规范化影响）
      const raw = fs.readFileSync(inPath)
      const hash = contentHash(raw)
      const stamp = localStamp(new Date())
      const folderName = `${stem}-${stamp}-${hash}`
      outRoot = path.join(outputDir, folderName)

      const page = loadPage(inPath)
      // 每个文件一次调用，返回该 input 的全部产出文件
      const result = await downloadHuiCode([page], { targetLib })

      // 文件夹名含时间戳，每次运行唯一；仅当同名已存在（同一秒重复运行）才清空兜底，
      // 否则保留历史产物，便于对比新旧版本。
      if (fs.existsSync(outRoot)) {
        fs.rmSync(outRoot, { recursive: true, force: true })
      }
      fs.mkdirSync(outRoot, { recursive: true })
      for (const f of result.files) {
        const target = path.join(outRoot, f.path)
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.writeFileSync(target, f.content, 'utf-8')
      }
      console.log(`${tag} OK  ${result.files.length} 个文件 → jsonTest/output/${folderName}/`)
      ok++
    } catch (err: any) {
      // 单个文件失败不阻断整批，末尾汇总
      fail++
      const head = errHead(err)
      failures.push({ file, error: head })
      // 清掉失败时可能已创建的不完整产物目录，避免半截 output 干扰
      if (outRoot && fs.existsSync(outRoot)) {
        fs.rmSync(outRoot, { recursive: true, force: true })
      }
      console.error(`${tag} FAIL  ${head}`)
    }
  }
  currentFile = ''

  // 失败列表写日志（便于在 100+ 文件里定位要修的 JSON；*.log 已 gitignore）
  if (failures.length) {
    const lines = failures.map(f => `${f.file}\t${f.error}`)
    fs.writeFileSync(failuresLog, lines.join('\n') + '\n', 'utf-8')
  } else if (fs.existsSync(failuresLog)) {
    // 全部成功则清掉旧日志
    fs.rmSync(failuresLog, { force: true })
  }

  console.log('')
  console.log(`[batch] 完成：成功 ${ok}，失败 ${failures.length}`)
  if (failures.length) {
    console.error(`[batch] 失败列表见 ${failuresLog}`)
    // 有失败时以非 0 退出，便于 CI / 脚本感知
    process.exit(1)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
