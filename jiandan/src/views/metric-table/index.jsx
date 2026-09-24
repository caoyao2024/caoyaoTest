import { useState, useEffect, useRef } from "react";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { formatMetricValue, isBreach } from "../../mock/metrics.js";
import PanelCard from "../../components/panel-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import CategoryChip from "../../components/category-chip/index.jsx";
import RatioValue from "../../components/ratio-value/index.jsx";

function ActionMenu({ items, onAction, trigger }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="app-dropdown" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open ? (
        <div className="app-dropdown-menu">
          {items.map((item, i) =>
            item.type === "divider" ? (
              <div key={i} className="app-dropdown-divider" />
            ) : (
              <button
                key={item.key}
                type="button"
                className={"app-dropdown-item" + (item.danger ? " app-dropdown-item--danger" : "")}
                onClick={() => { onAction(item.key); setOpen(false); }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}

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
    showToast,
    showConfirm,
  } = useApp();

  const selectedCount = selectedRowKeys.length;
  const disableCheckboxIds = filteredMetrics
    .filter((m) => m.status === "offline")
    .map((m) => m.id);

  const handleRowAction = (key, record) => {
    if (key === "enable") {
      updateStatus([record.id], "online");
      showToast("已启用「" + record.name + "」");
    } else if (key === "disable") {
      updateStatus([record.id], "offline");
      showToast("已停用「" + record.name + "」");
    } else if (key === "export") {
      showToast("「" + record.name + "」已加入导出队列");
    } else if (key === "remove") {
      showConfirm({
        title: "删除指标「" + record.name + "」？",
        content: "删除后该指标的历史填报记录将同时失效，操作不可撤销。",
        okText: "删除",
        danger: true,
        onOk: () => {
          removeMetric(record.id);
          showToast("已删除「" + record.name + "」");
        },
      });
    }
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
      freezeCol: true,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="metric-table__name">
            <Button status="text" className="metric-table__name-link" onClick={() => openEdit(record)}>
              {record?.name}
            </Button>
            <span className="metric-table__code">{record?.code}</span>
          </div>
        );
      },
    },
    {
      title: "指标分类",
      key: "category",
      width: 110,
      allowSort: false,
      render: (cell) => <CategoryChip category={cell} />,
    },
    {
      title: "统计周期",
      key: "cycle",
      width: 96,
      allowSort: false,
    },
    {
      title: "统计维度",
      key: "dimension",
      width: 104,
      allowSort: false,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: "目标值",
      key: "target",
      width: 104,
      align: "right",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return <span className="metric-table__num">{formatMetricValue(cell, record?.unit)}</span>;
      },
    },
    {
      title: "当前值",
      key: "current",
      width: 116,
      align: "right",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <span className={"metric-table__num" + (isBreach(record) ? " metric-table__num--alert" : "")}>
            {formatMetricValue(cell, record?.unit)}
          </span>
        );
      },
    },
    {
      title: "达成率",
      key: "ratio",
      width: 128,
      align: "right",
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return <RatioValue ratio={cell} trend={record?.trend} polarity={record?.polarity} />;
      },
    },
    {
      title: "指标状态",
      key: "status",
      width: 108,
      allowSort: false,
      render: (cell) => <StatusTag status={cell} />,
    },
    {
      title: "责任人",
      key: "owner",
      width: 96,
      allowSort: false,
    },
    {
      title: "数据来源",
      key: "source",
      width: 116,
      allowSort: false,
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
      key: "actions",
      width: 132,
      align: "right",
      freezeCol: true,
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="metric-table__actions">
            <TipBox content="编辑指标">
              <Button status="text" onClick={() => openEdit(record)}>
                <Icon name="square-pen" size={15} />
              </Button>
            </TipBox>
            <TipBox content="复制指标定义">
              <Button
                status="text"
                onClick={() => {
                  duplicateMetric(record.id);
                  showToast("已复制「" + record.name + "」的定义");
                }}
              >
                <Icon name="copy" size={15} />
              </Button>
            </TipBox>
            <ActionMenu
              items={moreItems(record)}
              onAction={(key) => handleRowAction(key, record)}
              trigger={
                <Button status="text">
                  <Icon name="ellipsis" size={15} />
                </Button>
              }
            />
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
          <Button leftIcon={<Icon name="upload" size={14} />}>批量导入</Button>
          <TipBox content="刷新数据">
            <Button
              status="text"
              onClick={() => showToast("指标数据已刷新")}
            >
              <Icon name="refresh-cw" size={15} />
            </Button>
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
            leftIcon={<Icon name="circle-check" size={14} />}
            onClick={() => {
              updateStatus(selectedRowKeys, "online");
              showToast("已批量启用 " + selectedCount + " 个指标");
            }}
          >
            批量启用
          </Button>
          <Button
            leftIcon={<Icon name="circle-slash" size={14} />}
            onClick={() => {
              updateStatus(selectedRowKeys, "offline");
              showToast("已批量停用 " + selectedCount + " 个指标");
            }}
          >
            批量停用
          </Button>
          <Button
            leftIcon={<Icon name="download" size={14} />}
            onClick={() => showToast("已导出 " + selectedCount + " 个指标的明细")}
          >
            导出所选
          </Button>
          <Button status="text" className="metric-table__bulk-clear" onClick={() => setSelectedRowKeys([])}>
            取消选择
          </Button>
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={filteredMetrics}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        disableCheckboxIds={disableCheckboxIds}
        onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
        freezeColPosition="right"
        emptyTableMsg="暂无指标数据"
      />

      <div className="metric-table__footer">
        <span>指标口径以《数据指标管理规范》为准，异常指标同步至值班告警群。</span>
        <Button status="text" onClick={openCreate}>新增指标定义</Button>
      </div>
    </PanelCard>
  );
}

export default MetricTable;
