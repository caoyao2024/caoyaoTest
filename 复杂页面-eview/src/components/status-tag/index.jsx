import { FormattedMessage } from "react-intl";
import "./index.css";

// Layer 3: 通用状态标签 — 策略状态 / 触发级别复用同一套语义色
const TONES = ["success", "warning", "error", "info", "neutral"];

export default function StatusTag({ labelId, fallback, tone = "neutral", dot = true }) {
  const safeTone = TONES.includes(tone) ? tone : "neutral";
  return (
    <span className={`status-tag status-tag--${safeTone}`}>
      {dot ? <i className="status-tag__dot" aria-hidden="true" /> : null}
      <FormattedMessage id={labelId} defaultMessage={fallback || labelId} />
    </span>
  );
}
