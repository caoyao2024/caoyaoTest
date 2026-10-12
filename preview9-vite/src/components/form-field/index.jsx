import "./index.css";

// Layer 3: 表单字段容器 —— 纯 H5 骨架 + 必填星号 + 绝对定位校验文案
export default function FormField({ label, htmlFor, required, error, hint, full, children }) {
  return (
    <div className={`form-field${full ? " form-field-full" : ""}`}>
      <label className={`form-label${required ? " required" : ""}`} htmlFor={htmlFor}>
        {label}
      </label>
      <div className="form-control">
        {children}
        {error && <div className="form-error">{error}</div>}
        {!error && hint && <div className="form-hint">{hint}</div>}
      </div>
    </div>
  );
}
