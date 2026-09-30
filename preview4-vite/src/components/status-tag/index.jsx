import "./index.css";

// Layer 3: 语义状态标签(纯 H5 + token,不使用 Badge)
export default function StatusTag({ tone = "neutral", label, icon, size = "medium" }) {
  return (
    <span className={`status-tag status-tag--${tone} status-tag--${size}`}>
      {icon ? <span className="status-tag__dot" /> : null}
      {label}
    </span>
  );
}
