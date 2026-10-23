import { useState } from "react";
import { IconPlusIcPublicDownload, IconPlusIcPublicEye } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import DivMessage from "@nce/eview-react/DivMessage";
import StatusTag from "../../components/status-tag/index.jsx";
import { formatMoney, conclusionTagMap } from "../../mock/casePool.js";
import "./index.css";

// ⑤ 底部关联案件表格：同被保险人历史案件
// 增强：出险统计条、关键词搜索、类型筛选、导出清单、行点击详情
export default function HistoryTable({ data, insuredName, note }) {
  const [detail, setDetail] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [notice, setNotice] = useState(null);

  const kw = keyword.trim();
  const filtered = data.filter(
    (c) => !kw || c.claimNo.indexOf(kw) > -1 || c.claimType.indexOf(kw) > -1
  );

  const typeFilters = data
    .map((c) => c.claimType)
    .filter((t, idx, arr) => arr.indexOf(t) === idx);

  const openDetail = (record) => setDetail(record);

  const totalClaim = data.reduce((sum, c) => sum + c.claimAmount, 0);
  const totalPaid = data.reduce((sum, c) => sum + c.paidAmount, 0);
  const rejectedCount = data.filter((c) => c.conclusion === "免责拒赔").length;

  const handleExport = () => {
    setNotice({ type: "success", text: "关联案件清单已生成（CSV），请前往下载中心查收", key: Date.now() });
  };

  const columns = [
    {
      title: "案件号",
      key: "claimNo",
      allowSort: false,
      render: (v, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <a className="cell-link" onClick={() => openDetail(record)}>
            {v}
          </a>
        );
      },
    },
    {
      title: "出险时间",
      key: "incidentTime",
    },
    {
      title: "案件类型",
      key: "claimType",
      allowSort: false,
    },
    {
      title: "涉案金额",
      key: "claimAmount",
      align: "right",
      render: (v) => <span className="fee-amount">{formatMoney(v)}</span>,
    },
    {
      title: "结案结论",
      key: "conclusion",
      allowSort: false,
      render: (v) => <StatusTag type={conclusionTagMap[v] || "neutral"} text={v} small />,
    },
    {
      title: "查看",
      key: "action",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} onClick={() => openDetail(record)} className="op-icon" title="查看案件详情" />
        );
      },
    },
  ];

  return (
    <section className="section-card history-table">
      <div className="card-head">
        <h3 className="card-title">关联案件</h3>
        <span className="card-sub">
          同被保险人（{insuredName}）近 24 个月 · {data.length} 起
        </span>
        <div className="card-head-action">
          <TextField
            value={keyword}
            onChange={(value) => { setKeyword(value); setNotice(null); }}
            placeholder="搜索案件号 / 类型"
            className="history-search"
          />
          <a className="export-link" onClick={handleExport}>
            <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />
            导出清单
          </a>
        </div>
      </div>

      <div className="history-stats">
        <div className="hs-item">
          <span className="hs-label">出险次数</span>
          <span className="hs-value">{data.length} 起</span>
        </div>
        <div className="hs-item">
          <span className="hs-label">累计涉案金额</span>
          <span className="hs-value">{formatMoney(totalClaim)}</span>
        </div>
        <div className="hs-item">
          <span className="hs-label">累计已赔付</span>
          <span className="hs-value hs-value--hl">{formatMoney(totalPaid)}</span>
        </div>
        <div className="hs-item">
          <span className="hs-label">拒赔案件</span>
          <span className="hs-value">{rejectedCount} 起</span>
        </div>
      </div>

      <Table
        columns={columns}
        dataset={filtered}
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
        onRowClick={(row) => openDetail(row?.rawData)}
      />

      <div className="history-note">关联提示：{note}</div>

      <Dialog
        title={detail ? "案件详情 · " + detail.claimNo : "案件详情"}
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        size={[560, 'auto']}
        buttons={[
          { text: "关闭", status: "primary", onClick: () => setDetail(null) },
        ]}
      >
        {detail && (
          <div className="detail-grid">
            <div className="d-item">
              <span className="d-label">案件类型</span>
              <span className="d-value">{detail.claimType}</span>
            </div>
            <div className="d-item">
              <span className="d-label">结案结论</span>
              <StatusTag type={conclusionTagMap[detail.conclusion] || "neutral"} text={detail.conclusion} />
            </div>
            <div className="d-item">
              <span className="d-label">出险时间</span>
              <span className="d-value">{detail.incidentTime}</span>
            </div>
            <div className="d-item">
              <span className="d-label">结案时间</span>
              <span className="d-value">{detail.closedTime}</span>
            </div>
            <div className="d-item">
              <span className="d-label">涉案金额</span>
              <span className="d-value">{formatMoney(detail.claimAmount)}</span>
            </div>
            <div className="d-item">
              <span className="d-label">已赔付金额</span>
              <span className="d-value d-value--hl">{formatMoney(detail.paidAmount)}</span>
            </div>
            <div className="d-item">
              <span className="d-label">免赔额</span>
              <span className="d-value">{detail.deductible > 0 ? formatMoney(detail.deductible) : "—"}</span>
            </div>
            <div className="d-item">
              <span className="d-label">处理专员</span>
              <span className="d-value">{detail.handler}</span>
            </div>
            <div className="d-item d-item--full">
              <span className="d-label">出险地点</span>
              <span className="d-value">{detail.incidentLocation}</span>
            </div>
            <div className="d-item d-item--full">
              <span className="d-label">案件描述</span>
              <span className="d-desc">{detail.description}</span>
            </div>
          </div>
        )}
      </Dialog>

      {notice && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
    </section>
  );
}
