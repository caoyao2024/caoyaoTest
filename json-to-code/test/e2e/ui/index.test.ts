import { describe, it, expect } from 'vitest'
import { downloadHuiCode } from '../../../api/index'
import { loadPage, serializeFiles, PAGES } from '../helpers'

/**
 * e2e 快照测试 —— eview-ui 目标库。
 *
 * 日常只改 eview-react 映射时不必跑这个（跑 test:e2e:react 即可）；
 * 动 eview-ui bespoke 映射（DatePicker/Switch→Toggle/TextArea/Button 等）
 * 或共享核心（access-path/state-builder 等）时跑 `npm run test:e2e:ui`。
 *
 * fetch 已在 test/setup.ts 全局 stub → icon 全部走占位图标，快照确定。
 *
 * 页名列表在 ../helpers.ts 的 PAGES（加/删/换页只改那一处）。
 */

describe.each(PAGES)('e2e eview-ui: %s', (page) => {
  it('产物快照', async () => {
    const result = await downloadHuiCode([loadPage(page)], { targetLib: 'eview-ui' })
    const snapshot = serializeFiles(result.files)
    await expect(snapshot).toMatchFileSnapshot(`./__snapshots__/${page}.snap`)
  })
})
