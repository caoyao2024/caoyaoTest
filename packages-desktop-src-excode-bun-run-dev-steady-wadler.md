# 修复 "ReferenceError: require is not defined" 错误

## Context

用户将 excode 的 `tailwind-converter.ts` 引用目标从 `tailwind-to-css.ts` 改为 `tailwind-to-css-excode.ts` 后，执行 `bun run dev:desktop` 在 design 模块下打开页面报错 `Read error: ReferenceError: require is not defined`。

## 根因

### 静态导入链导致第二条 `tailwindcss` 初始化路径

```
ipc.ts (line 36)
  → import { downloadHuiCode } from "../excode/index"    ← 静态导入，启动时即加载
    → excode/index.ts → FileGenerator → style-converter → tailwind-converter.ts
      → import from '../../../main/tailwind-to-css-excode'  ← 第二条 tailwindcss 路径
        → import { __unstable__loadDesignSystem } from "tailwindcss"
        → 顶层 await __unstable__loadDesignSystem(...)
```

`tailwind-to-css-excode.ts` 是独立于 `tailwind-to-css.ts` 的第二个文件，有自己的 `tailwindcss` import 和顶层 `await` 初始化。`tailwindcss` 内部依赖 `@tailwindcss/oxide`（Rust 原生模块，用 `require()` 加载）。electron-vite 对第一条路径（`ipc.ts → tailwind-to-css.ts`）能正确外置 `tailwindcss`，但通过 excode 链的第二条路径可能导致 bundler 将 `tailwindcss` 内联打包，其内部 `require()` 在 ESM 上下文不可用，因此报错。

## 修复方案（仅修改 excode 内文件）

### 核心思路：init 预加载模式

将 `tailwind-converter.ts` 中对 `tailwind-to-css-excode.ts` 的**静态 `import`** 替换为**动态 `import()`**。函数签名保持同步不变，通过 `initTailwindConverter()` 在管线入口预加载模块。

**为什么不用全 async**：`convertTailwindToCSS` 被 `splitWidthToStyle` / `extractIconSizeFromClassName` 同步调用，而这些函数又被 7+ 个组件映射文件（DatePicker、Input、Icon、Select、Slider、TimePicker、TextArea 等）同步调用，全链路改 async 代价过大。init 预加载模式只改 2 个文件，零侵入下游消费者。

---

### 1. 修改 `excode/src/codegen/tailwind-converter.ts`

将整个文件替换为以下内容（保留原有的 Electron/CLI 模式切换注释）：

```typescript
/**
 * tailwind-converter — tailwind → CSS/LESS 转换器的统一导入入口
 *
 * 为什么集中到本文件：style-converter 及其它消费方都需要
 * convertTailwindToLessRule / generateLessContent / convertTailwindToCSS / LessRule。
 * 若每个文件各自从 lib/convertTailwindToCSS 或 main/tailwind-to-css 导入，
 * CLI/Electron 切换要在多处手动改，易漏且不同步。
 * 统一从本文件 re-export，只在下方两块之间切换，所有消费方自动跟随。
 *
 * ⚠ 动态加载说明：
 * 采用 initTailwindConverter() + 动态 import() 替代静态 import，
 * 避免 ipc.ts 静态导入 excode 时把 tailwindcss（含 @tailwindcss/oxide 原生模块）
 * 拉进启动时模块图，导致 ESM 上下文中 require is not defined 报错。
 * 调用方需在管线入口 await initTailwindConverter() 后再使用转换函数。
 *
 * ─── 手动切换 ───
 * 默认启用 Electron 模式（本库主要嵌入 Electron 应用，main/tailwind-to-css 由宿主提供）。
 * 注释/取消注释下方两个 init 块之一：
 *   - Electron 模式（默认）：init 加载 main/tailwind-to-css-excode（Electron 主进程实现，与 excode 同步）
 *   - CLI 模式：init 加载 lib/convertTailwindToCSS
 *       （tailwindcss v4 __unstable__loadDesignSystem 本地实现，
 *        含响应式 variant——伪类/@media/dark/rtl 由 convertTailwindToLessRule 统一产出）
 *
 * 本仓库独立调试（cli.ts / jsonTest/run-batch.ts）时需手动切到 CLI 块：
 * 取消注释 CLI 块、注释 Electron 块。main/tailwind-to-css 在本仓库不存在，
 * 留在 Electron 默认会因模块找不到而无法在独立环境下运行。
 * 两个源是单文件同接口镜像，切换时只改本文件，勿在各消费方再各自切换。
 */

// ─── 类型导入（不触发模块加载）────────────────────────────
export type LessRule = import('../../../main/tailwind-to-css-excode').LessRule

type ExcodeModule = typeof import('../../../main/tailwind-to-css-excode')

let _mod: ExcodeModule | null = null

// ─── Electron 模式（默认启用）────────────────────────────────
/**
 * 预加载 tailwind 转换模块（Electron 模式：加载 main/tailwind-to-css-excode）。
 * 必须在调用任何转换函数之前 await（在 downloadHuiCode 入口处调用）。
 */
export async function initTailwindConverter(): Promise<void> {
  if (!_mod) {
    _mod = await import('../../../main/tailwind-to-css-excode')
  }
}

// ─── CLI 模式（本仓库独立调试时手动切换：取消注释下方块、注释上方 Electron 块）──
// export async function initTailwindConverter(): Promise<void> {
//   if (!_mod) {
//     _mod = await import('../../../lib/convertTailwindToCSS')
//   }
// }

function mod(): ExcodeModule {
  if (!_mod) throw new Error('[tailwind-converter] 未初始化，请先调用 await initTailwindConverter()')
  return _mod
}

export function convertTailwindToCSS(className: string, useVar?: boolean): Record<string, string> {
  return mod().convertTailwindToCSS(className, useVar)
}

export function convertTailwindToLessRule(
  className: string,
  baseSelector: string,
  opts?: { useVar?: boolean; importantSizing?: boolean },
) {
  return mod().convertTailwindToLessRule(className, baseSelector, opts)
}

export function generateLessContent(rules: LessRule[]): string {
  return mod().generateLessContent(rules)
}
```

---

### 2. 修改 `excode/index.ts` — 在管线入口处 init

**顶部新增 import**（在现有 import 区域末尾加）：
```typescript
import { initTailwindConverter } from './src/codegen/tailwind-converter'
```

**在 `downloadHuiCode` 函数体最开头**（第 148 行现有 `if` 检查之前）加：
```typescript
// 预加载 tailwind 转换模块（避免启动时静态加载 tailwindcss 导致 require 报错）
await initTailwindConverter()
```

完整函数头部变为：
```typescript
export async function downloadHuiCode(
  input: HuiCodeInput[],
  options: HuiCodeOptions = {}
): Promise<DownloadHuiCodeResult> {
  // 预加载 tailwind 转换模块（避免启动时静态加载 tailwindcss 导致 require 报错）
  await initTailwindConverter()

  if (!Array.isArray(input) || input.length === 0) {
    throw new Error('[downloadHuiCode] input 必须为非空数组')
  }
  // ... 后续代码不变
}
```

---

### 原理

- 动态 `import()` 不会在模块加载时执行，只在 `await import()` 运行时才加载目标模块
- `ipc.ts` 启动时加载 `excode/index.ts` → `tailwind-converter.ts`，但 `tailwind-converter.ts` 中不再有对 `tailwind-to-css-excode.ts` 的静态 import，**模块链在此断裂**
- `tailwindcss`（含 `@tailwindcss/oxide`）只在用户点击下载、`downloadHuiCode()` 被调用并执行 `await initTailwindConverter()` 时才加载
- 届时由 Node.js 正常 CJS 互操作加载，`require` 在 CJS 作用域内可用
- `style-converter.ts`、`split-width-style.ts` 及所有组件映射文件**无需任何修改**

## 需要修改的文件

| 文件 | 修改内容 |
|------|---------|
| `excode/src/codegen/tailwind-converter.ts` | 静态 import → 动态 `import()` + `initTailwindConverter()` + `mod()` 代理；保留 Electron/CLI 模式切换注释 |
| `excode/index.ts` | 顶部加 `import { initTailwindConverter }`；`downloadHuiCode` 函数体开头加 `await initTailwindConverter()` |

## 验证步骤

1. 修改后运行 `bun run dev:desktop`
2. 在 design 模块下打开页面，确认页面正常渲染、无 `require` 报错
3. 点击下载按钮，确认 excode 管线正常执行、生成代码文件
4. 观察主进程启动日志，确认启动时不再输出 `[tailwind-to-css] v4 design system init` 相关日志（证明 tailwindcss 延迟到下载时才加载）
