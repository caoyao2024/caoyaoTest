// Layer 4: 风险客户表格 — 12 行 / 状态页签（联动饼图与 KPI 下钻）/ 多选批量操作 / 行点击开详情抽屉 / 关键词搜索 / 排序筛选 / 分页
import { useEffect, useMemo, useState } from "react";
import { IconPlusIcPublicClipboard, IconPlusIcPublicEllipsis, IconPlusIcPublicEye, IconPlusIcPublicManage, IconPlusIcPublicSearch, IconPlusIcPublicSend } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Table from "@nce/eview-react/Table";
import DivMessage from "@nce/eview-react/DivMessage";
import TextField from "@/shared/TextField";
import dayjs from "dayjs";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { INDUSTRY_OPTIONS, TIME_RANGES, getRiskCustomers } from "../../mock/dashboard.jsx";
import "./index.css";

const STATUS_TABS = ["全部", "健康", "观察", "风险", "流失预警"];
const STATUS_ORDER = ["健康", "观察", "风险", "流失预警"];

const ROW_MENU_OPTIONS = [
  { id: "detail", text: "查看详情", serialno: "detail", iconUrl: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "change-owner", text: "修改负责人", serialno: "change-owner", iconUrl: <IconPlusIcPublicManage iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "watchlist", text: "加入观察名单", serialno: "watchlist", iconUrl: <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "transfer-csm", text: "转移 CSM", serialno: "transfer-csm", iconUrl: <IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// 健康分语义色：健康=success / 观察=critical（警示橙）/ 风险与流失预警=error
function healthTone(score) {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--critical)";
  return "var(--error)";
}

function SimpleProgress({ percent, strokeColor }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{
      width: "100%", height: "6px",
      background: "var(--hover, rgba(0,0,0,0.05))",
      borderRadius: "3px",
      overflow: "hidden",
    }}>
      <div style={{
        width: `${p}%`, height: "100%",
        background: strokeColor,
        transition: "width .2s",
      }} />
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginationState, setPaginationState] = useState({ current: 1, pageSize: 10 });
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

  // 筛选或页签变化后回到第 1 页，避免停留在越界页码
  useEffect(() => {
    setPaginationState((prev) => ({ ...prev, current: 1 }));
  }, [timeRange, industry, keyword, tableStatusFilter]);

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

  const handleBulkFollow = () => {
    notify("success", `已为选中的 ${selectedRowKeys.length} 家客户批量创建跟进任务`);
    setSelectedRowKeys([]);
  };

  const handleBulkTransfer = () => {
    openTransferModal({ customerId: null, customerName: `选中的 ${selectedRowKeys.length} 家客户` });
  };

  const columns = [
    {
      title: "公司名称",
      key: "companyName",
      allowSort: false,
      render: (cellValue, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <a className="table-link" onClick={(event) => handleRowAction("detail", record, event)}>{cellValue}</a>
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
      render: (cellValue) => (
        <div className="score-cell">
          <div className="score-cell-bar">
            <SimpleProgress
              percent={cellValue}
              strokeColor={healthTone(cellValue)}
            />
          </div>
          <span className="score-cell-num" style={{ color: healthTone(cellValue) }}>{cellValue}</span>
        </div>
      ),
    },
    {
      title: "CSM 负责人",
      key: "csm",
      width: 132,
      allowSort: false,
      render: (cellValue) => (
        <span className="csm-cell">
          <img className="csm-avatar" src="/uploads/user.png" alt={cellValue} />
          {cellValue}
        </span>
      ),
    },
    {
      title: "续约日期",
      key: "renewalDate",
      width: 128,
      render: (cellValue) => <span>{dayjs(cellValue).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "状态",
      key: "status",
      width: 116,
      allowSort: false,
      render: (cellValue) => <StatusTag status={cellValue} />,
    },
    {
      title: "操作",
      key: "actions",
      width: 188,
      allowSort: false,
      render: (cellValue, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="row-actions" onClick={(event) => event.stopPropagation()}>
            <a className="table-link" onClick={() => handleRowAction("follow", record)}>跟进</a>
            <a className="table-link" onClick={() => handleRowAction("transfer", record)}>转交</a>
            <PopUpMenu
              options={ROW_MENU_OPTIONS}
              width="180px"
              onClick={(evt) => {
                const serialno = evt.value;
                if (serialno !== undefined) handleRowAction(serialno, record);
              }}
            >
              <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} title="更多操作" className="row-more-icon" />
            </PopUpMenu>
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
            onChange={(value) => { setKeyword(value); setNotice(null); }}
            defaultLabel="搜索公司 / 负责人"
            suffix={<IconPlusIcPublicSearch iconSize="0.75rem" iconColor={['var(--text-placeholder)']} />}
          />
        }
      >
        <Tab
          selectedIndex={STATUS_TABS.indexOf(tableStatusFilter)}
          onClick={(index) => setTableStatusFilter(STATUS_TABS[index])}
          draggable={false}
          className="risk-table-tabs"
        >
          {STATUS_TABS.map((status) => (
            <TabItem
              key={status}
              title={
                <span className="status-tab">
                  {status}
                  <span className="status-tab-count">{statusCounts[status]}</span>
                </span>
              }
            />
          ))}
        </Tab>
        {selectedRowKeys.length > 0 ? (
          <div className="bulk-bar">
            <span className="bulk-bar-count">已选 {selectedRowKeys.length} 项</span>
            <Button size="small" text="批量跟进" onClick={handleBulkFollow} />
            <Button size="small" text="批量转交" onClick={handleBulkTransfer} />
            <a className="table-link" onClick={() => setSelectedRowKeys([])}>清空</a>
          </div>
        ) : null}
        <Table
          columns={columns}
          dataset={tableRows}
          enableCheckBox
          checkType="multi"
          checkedRows={selectedRowKeys}
          onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
          onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
          onRowClick={(row, event) => {
            const record = row?.rawData;
            if (record) openCustomerDrawer(record.id);
          }}
          enablePagination
          enableAutoPaging
          pagingProps={{
            pageSize: paginationState.pageSize,
            currentPage: paginationState.current,
            pageSizeOptions: [10, 12, 20],
            onPageSizeChange: (size) => setPaginationState((prev) => ({ ...prev, pageSize: size, current: 1 })),
          }}
          onPageChange={(currentPage) => setPaginationState((prev) => ({ ...prev, current: currentPage }))}
          enableZebraCrossing={false}
          width="unset"
          enableColumnCompareUpdate
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
