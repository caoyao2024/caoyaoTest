// Layer 4: 风险客户表格 — 12 行 / 状态页签（联动饼图与 KPI 下钻）/ 多选批量操作 / 行点击开详情抽屉 / 关键词搜索 / 排序筛选 / 分页
import { useMemo, useState, useRef, useEffect } from "react";
import { IconPlusIcPublicClipboard, IconPlusIcPublicEllipsis, IconPlusIcPublicEye, IconPlusIcPublicManagement, IconPlusIcPublicSend } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Table from "@nce/eview-react/Table";
import DivMessage from "@nce/eview-react/DivMessage";
import TextField from "@/shared/TextField";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { INDUSTRY_OPTIONS, TIME_RANGES, getRiskCustomers } from "../../mock/dashboard.jsx";
import "./index.css";

const STATUS_TABS = ["全部", "健康", "观察", "风险", "流失预警"];
const STATUS_ORDER = ["健康", "观察", "风险", "流失预警"];

const ROW_MENU_ITEMS = [
  { key: "detail", label: "查看详情", icon: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "change-owner", label: "修改负责人", icon: <IconPlusIcPublicManagement iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "watchlist", label: "加入观察名单", icon: <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "transfer-csm", label: "转移 CSM", icon: <IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// 健康分语义色：健康=success / 观察=critical（警示橙）/ 风险与流失预警=error
function healthTone(score) {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--critical)";
  return "var(--error)";
}

// TODO(eview-react): Progress 未覆盖，当前手写最小可用版
function SimpleProgress({ percent, color, style }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ flex: 1, height: "8px", background: "var(--hover, rgba(0,0,0,0.05))", borderRadius: "4px", overflow: "hidden", ...style }}>
      <div style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }} />
    </div>
  );
}

// TODO(eview-react): Dropdown 无对应组件，当前手写最小可用版
function SimpleDropdown({ trigger, children, placement }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isRight = placement === "bottomRight";

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open ? (
        <div style={{
          position: "absolute",
          top: "100%",
          [isRight ? "right" : "left"]: 0,
          marginTop: "4px",
          zIndex: 1050,
          background: "var(--surface-container-highest, #fff)",
          border: "1px solid var(--divider, #e0e0e0)",
          borderRadius: "var(--radius-container, 8px)",
          boxShadow: "var(--shadow-card, 0 1px 6px rgba(0,0,0,0.08))",
          overflow: "hidden",
          minWidth: "10rem",
        }}>
          {typeof children === "function" ? children({ close: () => setOpen(false) }) : children}
        </div>
      ) : null}
    </div>
  );
}

export default function RiskTable() {
  const {
    timeRange,
    industry,
    keyword,
    setKeyword,
    tableStatusFilter,
    setTableStatusFilter,
    openCustomerDrawer,
    openFollowUpModal,
    openTransferModal,
  } = useApp();

  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const activeRange = TIME_RANGES.find((range) => range.key === timeRange);
  const rangeLabel = activeRange ? activeRange.label : "近30天";

  const filteredRows = useMemo(
    () => getRiskCustomers(timeRange, industry, keyword),
    [timeRange, industry, keyword]
  );

  const statusCounts = useMemo(() => {
    const counts = { 全部: filteredRows.length };
    STATUS_ORDER.forEach((status) => {
      counts[status] = filteredRows.filter((row) => row.status === status).length;
    });
    return counts;
  }, [filteredRows]);

  const tableRows = useMemo(
    () => (tableStatusFilter === "全部" ? filteredRows : filteredRows.filter((row) => row.status === tableStatusFilter)),
    [tableStatusFilter, filteredRows]
  );

  const handleRowAction = (action, record, event) => {
    if (event) event.stopPropagation();
    if (action === "follow") {
      openFollowUpModal({ mode: "follow", customerId: record.id });
      return;
    }
    if (action === "transfer") {
      openTransferModal({ customerId: record.id, customerName: record.companyName });
      return;
    }
    if (action === "detail") {
      openCustomerDrawer(record.id);
      return;
    }
    if (action === "change-owner" || action === "transfer-csm") {
      openTransferModal({ customerId: record.id, customerName: record.companyName });
      return;
    }
    if (action === "watchlist") {
      notify("success", `已将「${record.companyName}」加入观察名单`);
    }
  };

  const handleRowClick = (row, event) => {
    const record = row?.rawData;
    if (record) openCustomerDrawer(record.id);
  };

  const handleBulkFollow = () => {
    notify("success", `已为选中的 ${checkedIndexes.length} 家客户批量创建跟进任务`);
    setCheckedIndexes([]);
  };

  const handleBulkTransfer = () => {
    openTransferModal({ customerId: null, customerName: `选中的 ${checkedIndexes.length} 家客户` });
  };

  const columns = [
    {
      title: "公司名称",
      key: "companyName",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <a className="table-link" onClick={(event) => handleRowAction("detail", record, event)}>{cell}</a>
        );
      },
    },
    {
      title: "行业",
      key: "industry",
      width: 104,
      allowSort: false,
    },
    {
      title: "健康分",
      key: "healthScore",
      width: 148,
      align: "right",
      render: (score) => (
        <div className="score-cell">
          <div className="score-cell-bar">
            <SimpleProgress percent={score} color={healthTone(score)} />
          </div>
          <span className="score-cell-num" style={{ color: healthTone(score) }}>{score}</span>
        </div>
      ),
    },
    {
      title: "CSM 负责人",
      key: "csm",
      width: 132,
      allowSort: false,
      render: (name) => (
        <span className="csm-cell">
          <img className="csm-avatar" src="/uploads/user.png" alt={name} />
          {name}
        </span>
      ),
    },
    {
      title: "续约日期",
      key: "renewalDate",
      width: 128,
      render: (date) => <span>{date}</span>,
    },
    {
      title: "状态",
      key: "status",
      width: 116,
      allowSort: false,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "操作",
      key: "actions",
      width: 188,
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="row-actions" onClick={(event) => event.stopPropagation()}>
            <a className="table-link" onClick={() => handleRowAction("follow", record)}>跟进</a>
            <a className="table-link" onClick={() => handleRowAction("transfer", record)}>转交</a>
            <SimpleDropdown
              trigger={
                <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} className="row-more-icon" />
              }
              placement="bottomRight"
            >
              {({ close }) => (
                <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
                  {ROW_MENU_ITEMS.map((item) => (
                    <li
                      key={item.key}
                      style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "8px 16px", cursor: "pointer",
                        color: "var(--on-surface, #191919)",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover, rgba(0,0,0,0.05))"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                      onClick={() => { handleRowAction(item.key, record); close(); }}
                    >
                      {item.icon}
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </SimpleDropdown>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <SectionCard
        className="risk-table-card"
        title="风险客户跟进"
        subtitle={`数据范围：${rangeLabel} · ${industry}${keyword ? ` · 关键词「${keyword}」` : ""} · 共 ${filteredRows.length} 条 · 点击行查看详情`}
        actions={
          <TextField
            className="risk-table-search"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            placeholder="搜索公司 / 负责人"
          />
        }
      >
        <Tab
          selectedIndex={STATUS_TABS.indexOf(tableStatusFilter)}
          draggable={false}
          onClick={(index) => setTableStatusFilter(STATUS_TABS[index])}
          className="risk-table-tabs"
        >
          {STATUS_TABS.map((status) => (
            <TabItem
              key={status}
              title={status}
              titleExtraContent={<span className="status-tab-count">{statusCounts[status]}</span>}
            >
              <span />
            </TabItem>
          ))}
        </Tab>
        {checkedIndexes.length > 0 ? (
          <div className="bulk-bar">
            <span className="bulk-bar-count">已选 {checkedIndexes.length} 项</span>
            <Button text="批量跟进" onClick={handleBulkFollow} />
            <Button text="批量转交" onClick={handleBulkTransfer} />
            <a className="table-link" onClick={() => setCheckedIndexes([])}>清空</a>
          </div>
        ) : null}
        <Table
          columns={columns}
          dataset={tableRows}
          enableCheckBox
          checkType="multi"
          checkedRows={checkedIndexes}
          onRowCheck={(row, checkedRows) => setCheckedIndexes(checkedRows)}
          onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
          onRowClick={handleRowClick}
          enableZebraCrossing={false}
          enableColumnCompareUpdate
          width="unset"
          enablePagination
          enableAutoPaging
          pageSizeOptions={[10, 12, 20]}
          emptyTableMsg="暂无风险客户"
        />
      </SectionCard>
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </>
  );
}
