import Table from "@nce/eview-react/Table";
import StatusTag from "../../components/status-tag/index.jsx";
import Panel from "../../components/panel/index.jsx";
import { useApp } from "../../context.jsx";
import { RESOURCE_POOLS, REGIONS, ORDER_STATUS } from "../../mock/packages.js";
import "./index.css";

// TODO(eview-react): Progress 未覆盖，当前手写最小可用版
function SimpleProgress({ percent, status = "normal" }) {
  const color = status === "error"
    ? "var(--error, #E02128)"
    : status === "success"
      ? "var(--success, #62B42E)"
      : "var(--primary, #0067D1)";
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        flex: 1, height: "8px",
        background: "var(--hover, rgba(0,0,0,0.05))",
        borderRadius: "4px",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${p}%`, height: "100%",
          background: color,
          transition: "width .2s",
        }} />
      </div>
      <span style={{
        color: "var(--on-surface-variant, #777)",
        minWidth: "40px", textAlign: "right",
      }}>{p}%</span>
    </div>
  );
}

export default function ResourcesView() {
  const { orders } = useApp();

  const total = RESOURCE_POOLS.reduce((s, r) => s + r.totalPorts, 0);
  const used = RESOURCE_POOLS.reduce((s, r) => s + r.usedPorts, 0);
  const available = total - used;
  const avg = Math.round((used / total) * 100);
  const running = orders.filter((o) => o.status === "processing").length;

  const stats = [
    { label: "总端口容量", value: total.toLocaleString(), unit: "口", icon: "server", tone: "brand" },
    { label: "已用端口", value: used.toLocaleString(), unit: "口", icon: "activity", tone: "normal" },
    { label: "可用端口", value: available.toLocaleString(), unit: "口", icon: "circle-check", tone: "success" },
    { label: "平均利用率", value: `${avg}%`, unit: "", icon: "gauge", tone: "warning" },
  ];

  const columns = [
    { title: "城市", key: "city", width: 120, allowSort: false },
    { title: "所属区域", key: "region", width: 130, allowSort: false },
    { title: "机房等级", key: "grade", width: 110, allowSort: false },
    { title: "总端口", key: "totalPorts", width: 100, align: "right", allowSort: true, render: (v) => v.toLocaleString() },
    { title: "已用端口", key: "usedPorts", width: 100, align: "right", allowSort: true, render: (v) => v.toLocaleString() },
    { title: "可用端口", key: "free", width: 100, align: "right", allowSort: false, render: (_v, _r, _o, row) => { const r = row?.rawData; return (r?.totalPorts - r?.usedPorts).toLocaleString(); } },
    {
      title: "利用率",
      key: "usage",
      width: 200,
      allowSort: true,
      render: (_v, _r, _o, row) => {
        const r = row?.rawData;
        if (!r) return null;
        const pct = Math.round((r.usedPorts / r.totalPorts) * 100);
        const progressStatus = pct >= 90 ? "error" : pct >= 75 ? "normal" : "success";
        return <SimpleProgress percent={pct} status={progressStatus} />;
      },
    },
    { title: "状态", key: "status", width: 110, allowSort: false, render: (v) => <StatusTag value={v} map={ORDER_STATUS} /> },
  ];

  return (
    <div className="res-view">
      <div className="res-stats">
        {stats.map((s) => (
          <div className={`res-stat res-stat-${s.tone}`} key={s.label}>
            <div className="res-stat-head">
              <span className="res-stat-label">{s.label}</span>
              <span className="res-stat-value">{s.value}{s.unit && <em className="res-stat-unit">{s.unit}</em>}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="res-note">
        当前有 <strong>{running}</strong> 个工单处于开通中，请关注高利用率区域的端口余量。
      </div>

      <Panel title="区域资源池明细" description="端口容量、利用率与状态">
        <Table columns={columns} dataset={RESOURCE_POOLS} />
      </Panel>
    </div>
  );
}
