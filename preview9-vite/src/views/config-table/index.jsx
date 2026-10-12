import { useState } from "react";
import { IconPlusIcIctExcelFile, IconPlusIcIctTopoEdit, IconPlusIcPublicDownload, IconPlusIcPublicGenericFile, IconPlusIcPublicSearch, IconPlusIcPublicSend, IconPlusIcPublicSetting, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import TextField from "@/shared/TextField";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import StatusTag from "../../components/status-tag/index.jsx";
import BatchModal from "../../components/batch-modal/index.jsx";
import EditModal from "../../components/edit-modal/index.jsx";
import SubmitModal from "../../components/submit-modal/index.jsx";
import { useApp } from "../../context.jsx";
import { ITEM_STATUS } from "../../mock/packages.js";
import "./index.css";

const PRIORITY_TAG = {
  high: { text: "高", type: "error" },
  mid: { text: "中", type: "processing" },
  low: { text: "低", type: "default" },
};

function mbps(bandwidth) {
  if (!bandwidth) return 0;
  if (bandwidth.endsWith("G")) return parseFloat(bandwidth) * 1000;
  return parseFloat(bandwidth);
}

export default function ConfigTable() {
  const { configItems, setConfigItems, setOrders, orders, setActiveTab } = useApp();
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [batchOpen, setBatchOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const filtered = keyword
    ? configItems.filter((i) => `${i.code}${i.customer}${i.station}`.toLowerCase().includes(keyword.toLowerCase()))
    : configItems;

  const totalBandwidth = configItems.reduce((s, i) => s + mbps(i.bandwidth), 0);
  const totalFee = configItems.reduce((s, i) => s + (i.price || 0), 0);

  const openEdit = (row) => {
    setEditItem(row);
    setEditOpen(true);
  };

  const saveEdit = (next) => {
    setConfigItems(configItems.map((i) => (i.id === next.id ? next : i)));
    setEditOpen(false);
    notify("success", `电路 ${next.code} 已更新`);
  };

  const removeItem = (id) => {
    setConfigItems(configItems.filter((i) => i.id !== id));
    notify("success", "已移出配置清单");
  };

  const applyBatch = ({ status, priority }) => {
    const selectedIds = checkedIndexes.map((idx) => filtered[idx]?.id).filter(Boolean);
    setConfigItems(configItems.map((i) => (selectedIds.includes(i.id) ? { ...i, status: status || i.status, priority: priority || i.priority } : i)));
    setBatchOpen(false);
    setCheckedIndexes([]);
    notify("success", "批量配置已下发");
  };

  const doSubmit = () => {
    const order = {
      id: `o-${Date.now()}`,
      orderNo: `GD-2026-${String(100000 + Math.floor(Math.random() * 9000))}`,
      customer: configItems.length ? configItems[0].customer : "—",
      scene: configItems[0]?.scene || "云专线接入",
      bandwidth: configItems[0]?.bandwidth || "—",
      stations: configItems.length,
      amount: totalFee,
      status: "review",
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      eta: "待评估",
    };
    setOrders([order, ...orders]);
    setConfigItems([]);
    setSubmitOpen(false);
    setCheckedIndexes([]);
    notify("success", `工单 ${order.orderNo} 已提交，正在跳转工单列表`);
    setActiveTab("orders");
  };

  const columns = [
    {
      title: "电路编号",
      key: "code",
      width: 168,
      allowSort: false,
      render: (v, _r, _o, row) => (
        <a className="cell-link" onClick={() => openEdit(row?.rawData)}>{v}</a>
      ),
    },
    { title: "客户名称", key: "customer", width: 200, ellipsis: true, allowSort: false },
    { title: "带宽", key: "bandwidth", width: 100, allowSort: true },
    { title: "计费周期", key: "cycle", width: 108, allowSort: false },
    { title: "接入站点", key: "station", width: 210, ellipsis: true, allowSort: false },
    { title: "区域", key: "region", width: 110, allowSort: false },
    {
      title: "优先级",
      key: "priority",
      width: 96,
      allowSort: false,
      render: (v) => <StatusTag value={v} map={PRIORITY_TAG} />,
    },
    {
      title: "月费 (元)",
      key: "price",
      width: 116,
      align: "right",
      allowSort: true,
      render: (v) => v.toLocaleString(),
    },
    {
      title: "状态",
      key: "status",
      width: 110,
      allowSort: false,
      render: (v) => <StatusTag value={v} map={ITEM_STATUS} />,
    },
    {
      title: "操作",
      key: "action",
      width: 88,
      align: "left",
      allowSort: false,
      render: (_v, _r, _o, row) => {
        const r = row?.rawData;
        return (
          <div className="row-actions">
            <IconPlusIcIctTopoEdit iconSize="0.875rem" iconColor={['currentcolor']} title="编辑" className="row-action" onClick={() => openEdit(r)} />
            <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} title="移出清单" className="row-action row-action-danger" onClick={() => removeItem(r?.id)} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="cfg-table">
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

      <div className="cfg-table-toolbar">
        {checkedIndexes.length > 0 ? (
          <div className="cfg-selected">
            <span>已选 <strong>{checkedIndexes.length}</strong> 条</span>
            <Button text="批量配置" leftIcon={<IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={() => setBatchOpen(true)} />
          </div>
        ) : (
          <span className="cfg-toolbar-hint">配置清单随左侧表单生成，可逐条核对与调整</span>
        )}
        <div className="cfg-table-tools">
          <TextField
            style={{ width: "14rem" }}
            placeholder="搜索电路编号 / 客户 / 站点"
            value={keyword}
            onChange={(v) => { setKeyword(v); setNotice(null); }}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
          />
          <TipBox
            trigger="click"
            direction="bottomRight"
            isMouseLeaveClose
            content={
              <div className="app-dropdown-menu">
                <div className="app-dropdown-item" onClick={() => notify("default", "导出 CSV（示例）")}>
                  <IconPlusIcPublicGenericFile iconSize="0.875rem" iconColor={['currentcolor']} /> 导出 CSV
                </div>
                <div className="app-dropdown-item" onClick={() => notify("default", "导出 Excel（示例）")}>
                  <IconPlusIcIctExcelFile iconSize="0.875rem" iconColor={['currentcolor']} /> 导出 Excel
                </div>
              </div>
            }
          >
            <Button text="导出" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
          </TipBox>
        </div>
      </div>

      <Table
        columns={columns}
        dataset={filtered}
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={6}
      />

      <div className="cfg-summary">
        <div className="cfg-summary-item"><span className="cfg-summary-label">合计电路</span><span className="cfg-summary-value">{configItems.length} 条</span></div>
        <div className="cfg-summary-item"><span className="cfg-summary-label">总带宽</span><span className="cfg-summary-value">{totalBandwidth.toLocaleString()} Mbps</span></div>
        <div className="cfg-summary-item"><span className="cfg-summary-label">预估月费</span><span className="cfg-summary-value">¥ {totalFee.toLocaleString()}</span></div>
        <div className="cfg-summary-actions">
          <Button status="primary" text="提交工单" disabled={!configItems.length} leftIcon={<IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={() => setSubmitOpen(true)} />
        </div>
      </div>

      <BatchModal open={batchOpen} count={checkedIndexes.length} onCancel={() => setBatchOpen(false)} onOk={applyBatch} />
      <EditModal open={editOpen} item={editItem} onCancel={() => setEditOpen(false)} onSave={saveEdit} />
      <SubmitModal open={submitOpen} items={configItems} totalBandwidth={totalBandwidth} totalFee={totalFee} onCancel={() => setSubmitOpen(false)} onConfirm={doSubmit} />
    </div>
  );
}
