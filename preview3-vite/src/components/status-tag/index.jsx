// Layer 3 — 状态标签（跨视图复用）

const STATUS_MAP = {
  processing: { label: "处理中", tone: "info" },
  pending: { label: "待受理", tone: "critical" },
  done: { label: "已完成", tone: "success" },
  closed: { label: "已关闭", tone: "muted" },
  rejected: { label: "已驳回", tone: "error" },
};

export default function StatusTag({ status }) {
  const meta = STATUS_MAP[status] || STATUS_MAP.pending;
  return <span className={"status-tag status-tag--" + meta.tone}>{meta.label}</span>;
}
