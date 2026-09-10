import { describe, it, expect } from 'vitest'
import { createTableMapping } from '../../../../api/config/mappings/eview-ui/Table'
import { fakeCtx, absBinding, UI_PKG } from '../fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// eview-ui Table 映射（本地工厂副本）
//
// 与 eview-react/Table.ts 的两处差异：
//  1. render / onRowExpend 的 buildRenderFn 末参 `dataField` 由 'rawData' 改为 '_org'
//     （解构源 row._org）。
//  2. expandable.expandedRowKeys → `expandedRow`（eview-ui prop 名；eview-react 为
//     expandedRowKeys）。
// 其余逻辑与 eview-react 一致（由 eview-react 侧 Table.test.ts 覆盖 + e2e:ui 兜底），
// 此处只断言差异点。
// ═══════════════════════════════════════════════════════════════════

describe('eview-ui Table mapping', () => {
  const mapping = createTableMapping(UI_PKG)
  const DS = () => absBinding('rows')

  /** 构造最小 Table A2UI node：单列单 cell，可注入额外 tableRow props + table-level props */
  function makeTable(tableRowProps: Record<string, any> = {}, extraTableProps: Record<string, any> = {}) {
    const ds = DS()
    return {
      props: {
        columns: [{ title: '名称', dataIndex: 'name', sort: true }],
        dataSource: ds,
        rowKey: 'id',
        ...extraTableProps,
      },
      children: {
        __node: true,
        kind: 'loop',
        data: ds,
        template: {
          __node: true,
          kind: 'extract',
          componentName: 'TableRow',
          purpose: 'module',
          body: [
            {
              __node: true,
              kind: 'component',
              component: 'TableRow',
              id: 'row1',
              props: tableRowProps,
              children: [
                { __node: true, kind: 'component', component: 'TableCell', id: 'cell-name', props: {}, children: [] },
              ],
            },
          ],
        },
      },
    } as any
  }

  const transform = (node: any, ctx = fakeCtx()) => mapping.transform!(node, ctx)

  it('tag/import 用 eview-ui 包名', () => {
    expect(mapping.tag).toBe('Table')
    expect(mapping.import).toBe(`${UI_PKG}/Table`)
  })

  it('column render fn 末参 dataField="_org"（eview-react 为 rawData）', () => {
    const r = transform(makeTable())
    const p = r!.props as any
    expect(Array.isArray(p.columns)).toBe(true)
    const renderFn = p.columns[0].render
    expect(renderFn.type).toBe('renderFn')
    // 末参 row：dataSource 建立作用域，dataField='_org' → 解构源 row._org
    const rowParam = renderFn.params[renderFn.params.length - 1]
    expect(rowParam.name).toBe('row')
    expect(rowParam.dataField).toBe('_org')
  })

  it('expandedRowRender(slot) → onRowExpend render fn 末参 dataField="_org"', () => {
    const subNode = { __node: true, kind: 'component', component: 'SubTable', id: 'sub', props: {}, children: [] }
    const r = transform(makeTable({ expandedRowRender: { __node: true, type: 'slotNode', node: subNode } as any }))
    const p = r!.props as any
    expect(p.onRowExpend.type).toBe('renderFn')
    const rowParam = p.onRowExpend.params[p.onRowExpend.params.length - 1]
    expect(rowParam.name).toBe('row')
    expect(rowParam.dataField).toBe('_org')
    expect(r!.propRoute.onRowExpend).toBe('module-top')
  })

  // ─── eview-ui 差异点 2：expandedRowKeys → expandedRow（非 react 的 expandedRowKeys） ───
  it('expandable.expandedRowKeys（字面量）→ expandedRow useState（非 react 的 expandedRowKeys）', () => {
    const r = transform(makeTable({}, { expandable: { expandedRowKeys: [1, 2] } }))
    const p = r!.props as any
    // eview-ui prop 名为 expandedRow（eview-react 为 expandedRowKeys）
    expect(p.expandedRow).toBeDefined()
    expect(p.expandedRow.type).toBe('literal')
    expect(p.expandedRow.value).toEqual([1, 2])
    expect(p.expandedRow.useState.event).toBe('onRowExpendClick')
    expect(p.expandedRow.useState.extractor()).toBe('(row) => {}')
    // 不出现 react 的 expandedRowKeys prop
    expect('expandedRowKeys' in p).toBe(false)
    // enableRowExpand + enableMulitiExpand
    expect(p.enableRowExpand).toBe(true)
    expect(p.enableMulitiExpand).toBe(true)
    // propRoute：expandedRow → component-internal
    expect(r!.propRoute.expandedRow).toBe('component-internal')
    expect('expandedRowKeys' in (r!.propRoute as any)).toBe(false)
  })

  it('expandable.expandedRowKeys（DataBinding）→ expandedRow ComputedValue.useState', () => {
    const r = transform(makeTable({}, { expandable: { expandedRowKeys: absBinding('expandedRows') } }))
    const p = r!.props as any
    expect(p.expandedRow.type).toBe('computed')
    expect(p.expandedRow.useState.event).toBe('onRowExpendClick')
    expect('expandedRowKeys' in p).toBe(false)
    expect(r!.propRoute.expandedRow).toBe('component-internal')
  })
})
