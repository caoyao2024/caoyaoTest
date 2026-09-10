import { describe, it, expect } from 'vitest'
import { createCollapseMapping } from '../../../../api/config/mappings/eview-ui/Collapse'
import { fakeCtx, comp, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Collapse 映射（本地工厂副本）
//
// 与 eview-react/Collapse.ts 的差异（仅一处）：
//   eview-react 的 Panel 是 default 导出 → 工厂 import 为字符串（= default）。
//   eview-ui 的 Panel 是 named 导出（无 default）→ 此处 import 改为
//   `{ source: `${pkg}/Panel`, named: true }`，与 CollapseItem（复用 eview-react
//   工厂，本就 named、同源）合并成 `import { Panel, PanelItem } from '@cloudsop/eview-ui/Panel'`。
//
// transform 逻辑与 eview-react 完全一致（Panel API 相同，由 react 侧
// Collapse.test.ts 覆盖 + e2e:ui 兜底），此处只断言 import 差异 + transform 烟雾测。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Collapse mapping', () => {
  const mapping = createCollapseMapping(UI_PKG)
  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag=Panel；import 为 named（与 eview-react 的 default 字符串不同）', () => {
    expect(mapping.tag).toBe('Panel')
    // eview-ui Panel 是 named 导出：import 形态为 { source, named: true }
    expect(mapping.import).toEqual({ source: `${UI_PKG}/Panel`, named: true })
    // 而非 eview-react 的 default 字符串形态
    expect(typeof mapping.import).toBe('object')
  })

  it('transform 烟雾测：accordion:false → enableMultiExpand:true', () => {
    const r = transform({
      props: { accordion: false },
      children: [comp('PanelItem', { key: 'k1' })],
    })
    expect(r!.props!.enableMultiExpand).toBe(true)
  })
})
