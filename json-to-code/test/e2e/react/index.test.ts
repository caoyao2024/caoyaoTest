import { describe, it, expect } from 'vitest'
import { downloadHuiCode } from '../../../api/index'
import { loadPage, serializeFiles, PAGES } from '../helpers'

/**
 * e2e 快照测试 —— eview-react 目标库。
 *
 * 日常只改 eview-react 映射时跑 `npm run test:e2e:react` 即可，
 * 无需跑 eview-ui（test:e2e:ui）。
 *
 * fetch 已在 test/setup.ts 全局 stub → icon 全部走占位图标，
 * 快照确定（与测试机能否访问华为内网无关）。
 *
 * 快照含 id 属性（api/index.ts 的 config.id 当前为 true，CLI 约定）。
 * 若 config.id 翻为 false，跑 `npx vitest -u test/e2e/react` 更新。
 *
 * 页名列表在 ../helpers.ts 的 PAGES（加/删/换页只改那一处）。
 */

describe.each(PAGES)('e2e eview-react: %s', (page) => {
  it('产物快照', async () => {
    const result = await downloadHuiCode([loadPage(page)], { targetLib: 'eview-react' })
    const snapshot = serializeFiles(result.files)
    await expect(snapshot).toMatchFileSnapshot(`./__snapshots__/${page}.snap`)
  })
})
