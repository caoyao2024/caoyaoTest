// Layer 3: 指标状态软标签（文字 + 语义点，不使用 Badge / Tag）
import { STATUS_MAP } from '../../mock/metrics.js';

export default function StatusTag({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.draft;
  return (
    <span className={'status-tag status-tag--' + config.tone}>
      <span className="status-tag__dot" />
      {config.label}
    </span>
  );
}
