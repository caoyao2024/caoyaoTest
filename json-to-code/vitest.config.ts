import { defineConfig } from 'vitest/config'

/**
 * Vitest 配置。
 *
 * - 端到端跑全管线 + tailwind design system（lib/convertTailwindToCSS 顶层
 *   `__unstable__loadDesignSystem` 异步初始化），首次加载较慢，故设 60s timeout。
 * - setupFiles 注入 test/setup.ts：全局 stub fetch 使 icon API 恒失败 →
 *   resolveAll 把所有 icon 名映射到占位图标，e2e 快照确定（与测试机能否访问
 *   华为内网无关）。tailwind 转换器只用 readFileSync（本地），不受影响。
 */
export default defineConfig({
  test: {
    testTimeout: 60000,
    hookTimeout: 60000,
    setupFiles: ['test/setup.ts'],
    include: ['test/**/*.test.ts'],
  },
})
