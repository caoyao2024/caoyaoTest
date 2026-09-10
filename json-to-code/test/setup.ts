import { beforeAll, vi } from 'vitest'

/**
 * 全局测试 setup。
 *
 * icon-collection.ts 的 resolveAll 会真实 fetch 华为内部 icon API
 * (https://octo.hdesign.huawei.com/...)。API 失败时其 try/catch 会把所有
 * 收集到的 icon 名映射到占位图标 PLACEHOLDER_ICON，使产物确定。
 *
 * 这里 stub globalThis.fetch 使其恒 reject，强制走占位分支 —— 这样无论测试机
 * 是否能访问华为内网，icon 解析结果都一致，e2e 快照稳定。
 *
 * tailwind 转换器（lib/convertTailwindToCSS）只用 readFileSync 加载本地
 * index.css，不走 fetch，因此本 stub 对样式转换无影响。
 */
beforeAll(() => {
  vi.stubGlobal('fetch', () => Promise.reject(new Error('network disabled in tests')))
})
