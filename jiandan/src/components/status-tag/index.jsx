import { STATUS_MAP } from "../../mock/metrics.js";

function StatusTag({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.draft;
  return (
    <span className={"status-tag status-tag--" + config.tone}>
      <span className="status-tag__dot" />
      {config.label}
    </span>
  );
}

export default StatusTag;
