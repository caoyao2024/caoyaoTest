import { useState } from 'react';
import Button from '@nce/eview-react/Button';
import Table from '@nce/eview-react/Table';
import TipBox from '@nce/eview-react/TipBox';
import IconButton from '@nce/eview-react/IconButton';
import MessageDialog from '@nce/eview-react/MessageDialog';
import { Icon } from '../../shared/icon.jsx';
import { useApp } from '../../context.jsx';
import { useMessage } from '../../message.jsx';
import { formatMetricValue, isBreach } from '../../mock/metrics.js';
import PanelCard from '../../components/panel-card/index.jsx';
import StatusTag from '../../components/status-tag/index.jsx';
import CategoryChip from '../../components/category-chip/index.jsx';
import RatioValue from '../../components/ratio-value/index.jsx';
import MoreActions from '../../components/more-actions/index.jsx';

function MetricTable() {
  const {
    metrics,
    filteredMetrics,
    selectedRowKeys,
    setSelectedRowKeys,
    openCreate,
    openEdit,
    duplicateMetric,
    updateStatus,
    removeMetric,
  } = useApp();
  const { message } = useMessage();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const selectedCount = selectedRowKeys.length;

  const handleRowAction = (key, record) => {
    if (key === "enable") {
      updateStatus([record.id], "online");
      message.success("已启用「" + record.name + "」");
    } else if (key === "disable") {
      updateStatus([record.id], "offline");
      message.success("已停用「" + record.name + "」");
    } else if (key === "export") {
      message.success("「" + record.name + "」已加入导出队列");
    } else if (key === "remove") {
      setConfirmDelete(record);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      removeMetric(confirmDelete.id);
      message.success("已删除「" + confirmDelete.name + "」");
    }
    setConfirmDelete(null);
  };

  const moreItems = (record) => [
    record.status === "offline"
      ? { key: "enable", icon: <Icon name="circle-check" size={14} />, label: "启用指标" }
      : { key: "disable", icon: <Icon name="circle-slash" size={14} />, label: "停用指标" },
    { key: "export", icon: <Icon name="file-spreadsheet" size={14} />, label: "导出指标数据" },
    { type: "divider" },
    { key: "remove", icon: <Icon name="trash-2" size={14} />, label: "删除指标", danger: true },
  ];

  const columns = [
    { title: "ID", key: "id", display: false },
    {
      title: "指标名称",
      key: "name",
      width: 260,
      render: (cell, rowData, options, row) => (
        <div className="metric-table__name">
          <Button status="text" text={row.name} className="metric-table__name-link" onClick={() => openEdit(row)} />
          <span className="metric-table__code">{row.code}</span>
        </div>
      ),
    },
    {
      title: "指标分类",
      key: "category",
      width: 110,
      render: (cell) => <CategoryChip category={cell} />,
    },
    { title: "统计周期", key: "cycle", width: 96 },
    {
      title: "统计维度",
      key: "dimension",
      width: 104,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: "目标值",
      key: "target",
      width: 104,
      align: "right",
      render: (cell, rowData, options, row) => (
        <span className="metric-table__num">{formatMetricValue(cell, row.unit)}</span>
      ),
    },
    {
      title: "当前值",
      key: "current",
      width: 116,
      align: "right",
      render: (cell, rowData, options, row) => (
        <span className={"metric-table__num" + (isBreach(row) ? " metric-table__num--alert" : "")}>
          {formatMetricValue(cell, row.unit)}
        </span>
      ),
    },
    {
      title: "达成率",
      key: "ratio",
      width: 128,
      align: "right",
      render: (cell, rowData, options, row) => (
        <RatioValue ratio={cell} trend={row.trend} polarity={row.polarity} />
      ),
    },
    {
      title: "指标状态",
      key: "status",
      width: 108,
      render: (cell) => <StatusTag status={cell} />,
    },
    { title: "责任人", key: "owner", width: 96 },
    {
      title: "数据来源",
      key: "source",
      width: 116,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: "更新时间",
      key: "updatedAt",
      width: 150,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: "操作",
      key: "op",
      width: 132,
      align: "right",
      render: (cell, rowData, options, row) => (
        <div className="metric-table__actions">
          <IconButton
            iconName={<Icon name="square-pen" size={15} />}
            tipText="编辑指标"
            onClick={() => openEdit(row)}
          />
          <IconButton
            iconName={<Icon name="copy" size={15} />}
            tipText="复制指标定义"
            onClick={() => {
              duplicateMetric(row.id);
              message.success("已复制「" + row.name + "」的定义");
            }}
          />
          <MoreActions
            items={moreItems(row)}
            onSelect={(key) => handleRowAction(key, row)}
          />
        </div>
      ),
    },
  ];

  const offlineIds = filteredMetrics
    .filter((m) => m.status === "offline")
    .map((m) => m.id);

  return (
    <PanelCard
      className="metric-table"
      title="指标列表"
      subtitle={"已收录 " + metrics.length + " 个指标 / 当前结果 " + filteredMetrics.length + " 条"}
      extra={
        <>
          <Button leftIcon={<Icon name="upload" size={14} />} text="批量导入" />
          <IconButton
            iconName={<Icon name="refresh-cw" size={15} />}
            tipText="刷新数据"
            onClick={() => message.success("指标数据已刷新")}
          />
        </>
      }
      bodyClassName="metric-table__body"
    >
      {selectedCount ? (
        <div className="metric-table__bulk">
          <span className="metric-table__bulk-text">
            已选择 <b>{selectedCount}</b> 项指标
          </span>
          <Button
            leftIcon={<Icon name="circle-check" size={14} />}
            text="批量启用"
            onClick={() => {
              updateStatus(selectedRowKeys, "online");
              message.success("已批量启用 " + selectedCount + " 个指标");
            }}
          />
          <Button
            leftIcon={<Icon name="circle-slash" size={14} />}
            text="批量停用"
            onClick={() => {
              updateStatus(selectedRowKeys, "offline");
              message.success("已批量停用 " + selectedCount + " 个指标");
            }}
          />
          <Button
            leftIcon={<Icon name="download" size={14} />}
            text="导出所选"
            onClick={() => message.success("已导出 " + selectedCount + " 个指标的明细")}
          />
          <Button
            status="text"
            text="取消选择"
            className="metric-table__bulk-clear"
            onClick={() => setSelectedRowKeys([])}
          />
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={filteredMetrics}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        disableCheckboxIds={offlineIds}
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        emptyTableMsg="暂无数据"
      />

      <div className="metric-table__footer">
        <span>指标口径以《数据指标管理规范》为准，异常指标同步至值班告警群。</span>
        <Button status="text" text="新增指标定义" onClick={openCreate} />
      </div>

      <MessageDialog
        type="confirm"
        isOpen={!!confirmDelete}
        title={confirmDelete ? "删除指标「" + confirmDelete.name + "」？" : ""}
        content="删除后该指标的历史填报记录将同时失效，操作不可撤销。"
        buttons={{
          ok: { text: "删除", status: "risk", onClick: handleConfirmDelete },
          cancel: { text: "取消", onClick: () => setConfirmDelete(null) },
        }}
      />
    </PanelCard>
  );
}

export default MetricTable;
