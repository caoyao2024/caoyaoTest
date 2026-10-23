import "./index.css";

// Layer 3: 语义状态标签（token 驱动，深浅色自适应）
// type: success | error | critical | info | neutral | brand
export default function StatusTag({ type = "neutral", text, small = false, dot = true, className = "" }) {
  const cls = [
    "status-tag",
    "status-tag--" + type,
    small ? "status-tag--sm" : "",
    dot ? "" : "status-tag--no-dot",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={cls}>{text}</span>;
}
