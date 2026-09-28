// Layer 4: 指标列表（工具区 + 批量操作条 + 表格 + 分页）
import { useState } from 'react';
import Button from '@nce/eview-react/Button';
import Table from '@nce/eview-react/Table';
import TipBox from '@nce/eview-react/TipBox';
import IconButton from '@nce/eview-react/IconButton';
import MessageDialog from '@nce/eview-react/MessageDialog';
import {
  IconPlusIcPublicCheckmark,
  IconPlusIcPublicProhibitCircle,
  IconPlusIcPublicTransverseRectangleTemplate,
  IconPlusIcPublicTrash,
  IconPlusIcPublicCopy,
  IconPlusIcPublicEllipsis,
  IconPlusIcPublicUpload,
  IconPlusIcPublicRefreshClockwise,
  IconPlusIcPublicDownload,
} from '@nce/icon-plus';
import { useApp } from '../../context.jsx';
import { formatMetricValue, isBreach } from '../../mock/metrics.js';
import { PanelCard } from '../../components/panel-card/index.jsx';
import { StatusTag } from '../../components/status-tag/index.jsx';
import { CategoryChip } from '../../components/category-chip/index.jsx';
import { RatioValue } from '../../components/ratio-value/index.jsx';

function MetricTable() {
  const {
    metrics,
    filteredMetrics,
    checkedIndexes,
    setCheckedIndexes,
    openCreate,
    openEdit,
    duplicateMetric,
    updateStatus,
    removeMetric,
    notify,
  } = useApp();

  const [deleteRecord, setDeleteRecord] = useState(null);
  const [menuRecordId, setMenuRecordId] = useState(null);

  const selectedCount = checkedIndexes.length;
  const selectedIds = checkedIndexes.map((i) => filteredMetrics[i]?.id).filter(Boolean);

  const handleRowAction = (key, record) => {
    setMenuRecordId(null);
    if (key === "enable") {
      updateStatus([record.id], "online");
      notify("success", "已启用「" + record.name + "」");
    } else if (key === "disable") {
      updateStatus([record.id], "offline");
      notify("success", "已停用「" + record.name + "」");
    } else if (key === "export") {
      notify("success", "「" + record.name + "」已加入导出队列");
    } else if (key === "remove") {
      setDeleteRecord(record);
    }
  };

  const moreItems = (record) => {
    const isOffline = record.status === "offline";
    return [
      { key: isOffline ? "enable" : "disable", icon: isOffline ? IconPlusIcPublicCheckmark : IconPlusIcPublicProhibitCircle, label: isOffline ? "启用指标" : "停用指标" },
      { key: "export", icon: IconPlusIcPublicTransverseRectangleTemplate, label: "导出指标数据" },
      { key: "remove", icon: IconPlusIcPublicTrash, label: "删除指标", danger: true },
    ];
  };

  const columns = [
    {
      title: "指标名称",
      key: "name",
      width: 260,
      freezeCol: true,
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return (
          <div className="metric-table__name">
            <Button status="text" className="metric-table__name-link" onClick={() => openEdit(r)}>
              {r?.name}
            </Button>
            <span className="metric-table__code">{r?.code}</span>
          </div>
        );
      },
    },
    {
      title: "指标分类",
      key: "category",
      width: 110,
      render: (cell) => <CategoryChip category={cell} />,
    },
    {
      title: "统计周期",
      key: "cycle",
      width: 96,
    },
    {
      title: "统计维度",
      key: "dimension",
      width: 104,
      render: (value) => <span className="metric-table__muted">{value}</span>,
    },
    {
      title: "目标值",
      key: "target",
      width: 104,
      align: "right",
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return <span className="metric-table__num">{formatMetricValue(cell, r?.unit)}</span>;
      },
    },
    {
      title: "当前值",
      key: "current",
      width: 116,
      align: "right",
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return (
          <span className={"metric-table__num" + (isBreach(r) ? " metric-table__num--alert" : "")}>
            {formatMetricValue(cell, r?.unit)}
          </span>
        );
      },
    },
    {
      title: "达成率",
      key: "ratio",
      width: 128,
      align: "right",
      allowSort: true,
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return <RatioValue ratio={cell} trend={r?.trend} polarity={r?.polarity} />;
      },
    },
    {
      title: "指标状态",
      key: "status",
      width: 108,
      allowSort: false,
      render: (value) => <StatusTag status={value} />,
    },
    {
      title: "责任人",
      key: "owner",
      width: 96,
    },
    {
      title: "数据来源",
      key: "source",
      width: 116,
      render: (value) => <span className="metric-table__muted">{value}</span>,
    },
    {
      title: "更新时间",
      key: "updatedAt",
      width: 150,
      allowSort: true,
      render: (value) => <span className="metric-table__muted">{value}</span>,
    },
    {
      title: "操作",
      key: "actions",
      width: 132,
      freezeCol: true,
      align: "right",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        if (!r) return null;
        const items = moreItems(r);
        return (
          <div className="metric-table__actions">
            <TipBox type="simple" content="编辑指标" direction="top">
              <IconButton
                iconName={<IconPlusIcPublicTransverseRectangleTemplate iconSize={15} iconColor={['currentcolor']} />}
                onClick={() => openEdit(r)}
              />
            </TipBox>
            <TipBox type="simple" content="复制指标定义" direction="top">
              <IconButton
                iconName={<IconPlusIcPublicCopy iconSize={15} iconColor={['currentcolor']} />}
                onClick={() => {
                  duplicateMetric(r.id);
                  notify("success", "已复制「" + r.name + "」的定义");
                }}
              />
            </TipBox>
            <div className="metric-table__dropdown">
              <IconButton
                iconName={<IconPlusIcPublicEllipsis iconSize={15} iconColor={['currentcolor']} />}
                onClick={() => setMenuRecordId(menuRecordId === r.id ? null : r.id)}
              />
              {menuRecordId === r.id ? (
                <div className="metric-table__dropdown-menu" onMouseLeave={() => setMenuRecordId(null)}>
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key}>
                        {item.key === "remove" ? (
                          <div className="metric-table__dropdown-divider" />
                        ) : null}
                        <div
                          className={"metric-table__dropdown-item" + (item.key === "remove" ? " metric-table__dropdown-item--danger" : "")}
                          onClick={() => handleRowAction(item.key, r)}
                        >
                          <Icon iconSize={14} iconColor={['currentcolor']} />
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
              </div>
          </div>
        );
      },
    },
  ];

  return (
    <PanelCard
      className="metric-table"
      title="指标列表"
      subtitle={"已收录 " + metrics.length + " 个指标 / 当前结果 " + filteredMetrics.length + " 条"}
      extra={
        <>
          <Button leftIcon={<IconPlusIcPublicUpload iconSize={14} iconColor={['currentcolor']} />}>
            批量导入
          </Button>
          <TipBox type="simple" content="刷新数据" direction="bottom">
            <IconButton
              iconName={<IconPlusIcPublicRefreshClockwise iconSize={15} iconColor={['currentcolor']} />}
              onClick={() => notify("success", "指标数据已刷新")}
            />
          </TipBox>
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
            leftIcon={<IconPlusIcPublicCheckmark iconSize={14} iconColor={['currentcolor']} />}
            onClick={() => {
              updateStatus(selectedIds, "online");
              notify("success", "已批量启用 " + selectedCount + " 个指标");
            }}
          >
            批量启用
          </Button>
          <Button
            leftIcon={<IconPlusIcPublicProhibitCircle iconSize={14} iconColor={['currentcolor']} />}
            onClick={() => {
              updateStatus(selectedIds, "offline");
              notify("success", "已批量停用 " + selectedCount + " 个指标");
            }}
          >
            批量停用
          </Button>
          <Button
            leftIcon={<IconPlusIcPublicDownload iconSize={14} iconColor={['currentcolor']} />}
            onClick={() => notify("success", "已导出 " + selectedCount + " 个指标的明细")}
          >
            导出所选
          </Button>
          <Button status="text" onClick={() => setCheckedIndexes([])}>
            取消选择
          </Button>
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={filteredMetrics}
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
        emptyTableMsg="暂无指标数据"
      />

      <MessageDialog
        type="confirm"
        isOpen={!!deleteRecord}
        iconLocation="title"
        content={"删除指标「" + (deleteRecord?.name || "") + "」？"}
        detail="删除后该指标的历史填报记录将同时失效，操作不可撤销。"
        onClose={() => setDeleteRecord(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setDeleteRecord(null) },
          ok: {
            text: "删除",
            onClick: () => {
              if (deleteRecord) {
                removeMetric(deleteRecord.id);
                notify("success", "已删除「" + deleteRecord.name + "」");
              }
              setDeleteRecord(null);
            },
          },
        }}
      />
    </PanelCard>
  );
}

export { MetricTable };
