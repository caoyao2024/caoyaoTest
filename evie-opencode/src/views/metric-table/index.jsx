import { useRef, useState } from 'react';
import Table from '@nce/eview-react/Table';
import Button from '@nce/eview-react/Button';
import IconButton from '@nce/eview-react/IconButton';
import TipBox from '@nce/eview-react/TipBox';
import MessageDialog from '@nce/eview-react/MessageDialog';
import { IconPlusIcPublicUpload, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicBrush, IconPlusIcPublicCopy, IconPlusIcPublicEllipsis, IconPlusIcPublicSuccess, IconPlusIcPublicProhibitCircle, IconPlusIcIctExcelFile, IconPlusIcPublicTrash } from '@nce/icon-plus';
import { useApp } from '../../context.jsx';
import { formatMetricValue, isBreach } from '../../mock/metrics.js';
import PanelCard from '../../components/panel-card/index.jsx';
import StatusTag from '../../components/status-tag/index.jsx';
import CategoryChip from '../../components/category-chip/index.jsx';
import RatioValue from '../../components/ratio-value/index.jsx';

const MENU_STYLE = { minWidth: 160, padding: '4px', display: 'flex', flexDirection: 'column', gap: 0 };

function MoreMenu({ record, onAction }) {
  const items = [
    record.status === 'offline'
      ? { key: 'enable', icon: <IconPlusIcPublicSuccess iconSize={14} />, label: '启用指标', danger: false }
      : { key: 'disable', icon: <IconPlusIcPublicProhibitCircle iconSize={14} />, label: '停用指标', danger: false },
    { key: 'export', icon: <IconPlusIcIctExcelFile iconSize={14} />, label: '导出指标数据', danger: false },
    { key: 'remove', icon: <IconPlusIcPublicTrash iconSize={14} />, label: '删除指标', danger: true },
  ];
  return (
    <div style={MENU_STYLE}>
      {items.map((item, idx) => (
        <span key={item.key}>
          {idx === 2 ? <span style={{ display: 'block', height: 1, background: 'var(--divider)', margin: '4px 0' }} /> : null}
          <button
            type="button"
            className="metric-table__menu-item"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '6px 8px', border: 0, background: 'transparent', cursor: 'pointer',
              color: item.danger ? 'var(--error)' : 'var(--on-surface)', font: 'var(--font-body-m)', borderRadius: 'var(--radius-base)',
            }}
            onClick={() => onAction(item.key, record)}
          >
            {item.icon}
            {item.label}
          </button>
        </span>
      ))}
    </div>
  );
}

export default function MetricTable() {
  const {
    metrics, filteredMetrics, selectedRowKeys, setSelectedRowKeys,
    openCreate, openEdit, duplicateMetric, updateStatus, removeMetric, notify,
  } = useApp();
  const tableRef = useRef(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const selectedCount = selectedRowKeys.length;
  const checkedRows = filteredMetrics
    .map((m, i) => (selectedRowKeys.indexOf(m.id) !== -1 ? i : -1))
    .filter((i) => i >= 0);
  const disableCheckboxIds = filteredMetrics
    .filter((m) => m.status === 'offline')
    .map((m) => m.id);

  const syncSelection = (checkedIndexes) => {
    const ids = checkedIndexes.map((i) => filteredMetrics[i]?.id).filter(Boolean);
    setSelectedRowKeys(ids);
  };

  const handleRowAction = (key, record) => {
    if (key === 'enable') {
      updateStatus([record.id], 'online');
      notify('已启用「' + record.name + '」');
    } else if (key === 'disable') {
      updateStatus([record.id], 'offline');
      notify('已停用「' + record.name + '」');
    } else if (key === 'export') {
      notify('「' + record.name + '」已加入导出队列');
    } else if (key === 'remove') {
      setPendingDelete(record);
    }
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    removeMetric(pendingDelete.id);
    notify('已删除「' + pendingDelete.name + '」');
    setPendingDelete(null);
  };

  const columns = [
    { title: '指标名称', key: 'name', width: 260, allowSort: false, render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="metric-table__name">
            <Button status="text" text={record?.name} className="metric-table__name-link" onClick={() => openEdit(record)} />
            <span className="metric-table__code">{record?.code}</span>
          </div>
        );
      } },
    { title: '编码', key: 'code', display: false },
    { title: '指标分类', key: 'category', width: 110, allowSort: false, render: (value) => <CategoryChip category={value} /> },
    { title: '统计周期', key: 'cycle', width: 96, allowSort: false },
    { title: '统计维度', key: 'dimension', width: 104, allowSort: false, render: (value) => <span className="metric-table__muted">{value}</span> },
    { title: '目标值', key: 'target', width: 104, align: 'right', allowSort: false, render: (value, rowData, options, row) => {
        const record = row?.rawData;
        return <span className="metric-table__num">{formatMetricValue(value, record?.unit)}</span>;
      } },
    { title: '当前值', key: 'current', width: 116, align: 'right', allowSort: false, render: (value, rowData, options, row) => {
        const record = row?.rawData;
        return <span className={'metric-table__num' + (isBreach(record) ? ' metric-table__num--alert' : '')}>{formatMetricValue(value, record?.unit)}</span>;
      } },
    { title: '达成率', key: 'ratio', width: 128, align: 'right', render: (value, rowData, options, row) => {
        const record = row?.rawData;
        return <RatioValue ratio={value} trend={record?.trend} polarity={record?.polarity} />;
      } },
    { title: '指标状态', key: 'status', width: 108, allowSort: false, render: (value) => <StatusTag status={value} /> },
    { title: '责任人', key: 'owner', width: 96, allowSort: false },
    { title: '数据来源', key: 'source', width: 116, allowSort: false, render: (value) => <span className="metric-table__muted">{value}</span> },
    { title: '更新时间', key: 'updatedAt', width: 150, render: (value) => <span className="metric-table__muted">{value}</span> },
    { title: '操作', key: 'actions', width: 132, align: 'right', allowSort: false, render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="metric-table__actions">
            <IconButton size="small" iconName={<IconPlusIcPublicBrush iconSize={16} />} tipText="编辑指标" onClick={() => openEdit(record)} />
            <IconButton size="small" iconName={<IconPlusIcPublicCopy iconSize={16} />} tipText="复制指标定义" onClick={() => { duplicateMetric(record.id); notify('已复制「' + record.name + '」的定义'); }} />
            <TipBox trigger="click" direction="bottomRight" type="simple" content={<MoreMenu record={record} onAction={handleRowAction} />}>
              <IconButton size="small" iconName={<IconPlusIcPublicEllipsis iconSize={16} />} tipText="更多操作" />
            </TipBox>
          </div>
        );
      } },
  ];

  return (
    <PanelCard
      className="metric-table"
      title="指标列表"
      subtitle={'已收录 ' + metrics.length + ' 个指标 / 当前结果 ' + filteredMetrics.length + ' 条'}
      extra={
        <>
          <Button size="small" text="批量导入" leftIcon={<IconPlusIcPublicUpload iconSize={14} />} onClick={() => notify('批量导入模板已下载')} />
          <IconButton size="small" iconName={<IconPlusIcPublicRefreshClockwise iconSize={16} />} tipText="刷新数据" onClick={() => notify('指标数据已刷新')} />
        </>
      }
      bodyClassName="metric-table__body"
    >
      {selectedCount ? (
        <div className="metric-table__bulk">
          <span className="metric-table__bulk-text">
            已选择 <b>{selectedCount}</b> 项指标
          </span>
          <Button size="small" text="批量启用" leftIcon={<IconPlusIcPublicSuccess iconSize={14} />} onClick={() => { updateStatus(selectedRowKeys, 'online'); notify('已批量启用 ' + selectedCount + ' 个指标'); }} />
          <Button size="small" text="批量停用" leftIcon={<IconPlusIcPublicProhibitCircle iconSize={14} />} onClick={() => { updateStatus(selectedRowKeys, 'offline'); notify('已批量停用 ' + selectedCount + ' 个指标'); }} />
          <Button size="small" text="导出所选" leftIcon={<IconPlusIcPublicUpload iconSize={14} />} onClick={() => notify('已导出 ' + selectedCount + ' 个指标的明细')} />
          <Button status="text" size="small" text="取消选择" className="metric-table__bulk-clear" onClick={() => setSelectedRowKeys([])} />
        </div>
      ) : null}

      <Table
        ref={tableRef}
        columns={columns}
        dataset={filteredMetrics}
        emptyTableMsg="暂无指标数据"
        enableCheckBox
        checkType="multi"
        checkedRows={checkedRows}
        disableCheckboxIds={disableCheckboxIds}
        onRowCheck={(row, checkedRowsArr) => syncSelection(checkedRowsArr)}
        onHeaderCheck={(checkedRowsArr) => syncSelection(checkedRowsArr)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
      />

      <div className="metric-table__footer">
        <span>指标口径以《数据指标管理规范》为准，异常指标同步至值班告警群。</span>
        <Button status="text" size="small" text="新增指标定义" onClick={openCreate} />
      </div>

      <MessageDialog
        type="confirm"
        isOpen={!!pendingDelete}
        iconLocation="title"
        content={pendingDelete ? '删除指标「' + pendingDelete.name + '」？' : ''}
        detail="删除后该指标的历史填报记录将同时失效，操作不可撤销。"
        onClose={() => setPendingDelete(null)}
        buttons={{
          cancel: { text: '取消', onClick: () => setPendingDelete(null) },
          ok: { text: '删除', focused: true, onClick: confirmDelete },
        }}
      />
    </PanelCard>
  );
}
