import { describe, it, expect } from 'vitest'
import { createTableMapping } from '../../../api/config/mappings/eview-react/Table'
import { Value } from '../../../api/src/core/value-factory'
import { fakeCtx, absBinding } from './fake-ctx'

// ═══════════════════════════════════════════════════════════════════
// Table 映射
// ═══════════════════════════════════════════════════════════════════

describe('Table mapping', () => {
  const mapping = createTableMapping('@nce/eview-react')
  const DS = () => absBinding('rows')

  /** 构造最小 Table A2UI node：单列单 cell，可注入额外 props/行内 props */
  function makeTable(nodeProps: Record<string, any> = {}, tableRowProps: Record<string, any> = {}) {
    const ds = DS()
    return {
      props: {
        columns: [{ title: '名称', dataIndex: 'name', sort: true }],
        dataSource: ds,
        rowKey: 'id',
        ...nodeProps,
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

  it('无 loop children → 返回 null', () => {
    expect(transform({ props: { columns: [] }, children: null })).toBeNull()
    expect(transform({ props: {}, children: { __node: true, kind: 'component' } })).toBeNull()
  })

  it('基础：dataset(ComputedValue) / columns 字面量数组 / rowKey / enablePagination / recordCount', () => {
    const r = transform(makeTable())
    const p = r!.props as any
    expect(p.dataset.type).toBe('computed')
    expect(p.dataset.path).toBe('/rows')
    expect(p.dataset.accessPath).toBe('rows')
    // cells 无 relative CV → containsJSX=false
    expect(p.dataset.containsJSX).toBe(false)

    expect(Array.isArray(p.columns)).toBe(true)
    expect(p.columns).toHaveLength(1)
    expect(p.columns[0]).toMatchObject({ key: 'name', title: '名称', allowSort: true })
    expect(p.columns[0].render.type).toBe('renderFn')

    expect(p.rowKey).toBe('id')
    expect(p.enablePagination).toBe(true)
    // containsJSX=false → stateRef('rows')='rows' → recordCount='rows.length'
    expect(p.recordCount).toEqual(Value.rawExpr({ value: 'rows.length' }))

    expect(r!.propRoute.columns).toBe('module-top')
    expect(r!.children).toBeNull()
  })

  it('pagination:false → enablePagination:false，无 recordCount', () => {
    const r = transform(makeTable({ pagination: false }))
    expect(r!.props!.enablePagination).toBe(false)
    expect('recordCount' in r!.props!).toBe(false)
  })

  it('columns DataBinding → ComputedValue containsJSX:true，不走 propRoute.columns', () => {
    const colsBinding = absBinding('cols')
    const r = transform(makeTable({ columns: colsBinding }))
    const p = r!.props as any
    expect(p.columns.type).toBe('computed')
    expect(p.columns.containsJSX).toBe(true)
    expect(p.columns.path).toBe('/cols')
    expect('columns' in (r!.propRoute ?? {})).toBe(false)
  })

  it('rowSelection:checkbox 字面量 selectedRowKeys → checkType:multi + checkedRows useState(onRowCheck)', () => {
    const r = transform(makeTable({ rowSelection: { type: 'checkbox', selectedRowKeys: [1, 2] } }))
    const p = r!.props as any
    expect(p.checkType).toBe('multi')
    expect(p.enableCheckBox).toBe(true)
    expect(p.checkedRows.type).toBe('literal')
    expect(p.checkedRows.value).toEqual([1, 2])
    expect(p.checkedRows.useState.event).toBe('onRowCheck')
    expect(r!.propRoute.checkedRows).toBe('component-internal')
  })

  it('rowSelection:radio → checkType:single', () => {
    const r = transform(makeTable({ rowSelection: { type: 'radio', selectedRowKeys: [] } }))
    expect(r!.props!.checkType).toBe('single')
  })

  it('expandable 字面量 expandedRowKeys → enableRowExpand + expandedRowKeys useState(onRowExpendClick，extractor 占位)', () => {
    const r = transform(makeTable({ expandable: { expandedRowKeys: [1, 2] } }))
    const p = r!.props as any
    expect(p.enableRowExpand).toBe(true)
    expect(p.enableMulitiExpand).toBe(true)
    expect(p.expandedRowKeys.type).toBe('literal')
    expect(p.expandedRowKeys.value).toEqual([1, 2])
    expect(p.expandedRowKeys.useState.event).toBe('onRowExpendClick')
    // extractor 占位 (row)=>{}（onRowExpendClick 签名无新值）
    expect(p.expandedRowKeys.useState.extractor()).toBe('(row) => {}')
    expect(r!.propRoute.expandedRowKeys).toBe('component-internal')
  })

  it('expandedRowRender(slot) → onRowExpend buildRenderFn + propRoute.onRowExpend module-top', () => {
    const subNode = { __node: true, kind: 'component', component: 'SubTable', id: 'sub', props: {}, children: [] }
    const r = transform(makeTable({}, { expandedRowRender: Value.slotNode({ node: subNode as any }) }))
    const p = r!.props as any
    expect(p.onRowExpend.type).toBe('renderFn')
    expect(r!.propRoute.onRowExpend).toBe('module-top')
  })
})
