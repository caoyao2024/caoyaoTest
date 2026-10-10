// Layer 3: 通用表单字段骨架（纯 H5 + antd 输入组件受控）
// 依据 references/component/Form.md：标签左对齐、必填星号悬挂不占位、校验文案绝对定位不顶开布局。
import "./index.css";

export default function FormField({
  label,
  required = false,
  error,
  htmlFor,
  orientation = "top",
  hint,
  className = "",
  children,
}) {
  const wrapCls = [
    "form-field-wrap",
    orientation === "left" ? "is-left" : "is-top",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapCls}>
      <label className={`form-label${required ? " required" : ""}`} htmlFor={htmlFor}>
        {label}
      </label>
      <div className="form-control">
        {children}
        {hint && !error ? <div className="form-hint">{hint}</div> : null}
        {error ? <div className="form-error">{error}</div> : null}
      </div>
    </div>
  );
}
