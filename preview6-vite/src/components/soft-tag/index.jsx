// Layer 3: 通用软色标签（状态 / 属性标记）
import "./index.css";

export default function SoftTag({ tone, icon, children }) {
  return (
    <span className={`soft-tag soft-tag--${tone || "neutral"}`}>
      {icon ? icon : null}
      <span>{children}</span>
    </span>
  );
}
