import "./index.css";

// Layer 3 — 表单字段壳：标签（必填星号）+ 控件槽 + 校验文案
// 纯 H5 骨架，不使用 antd Form / Form.Item
export default function FormField({ label, required, htmlFor, error, hint, full, children }) {
  return (
    <div className={"field" + (full ? " field-full" : "")}>
      <label className={"field-label" + (required ? " is-required" : "")} htmlFor={htmlFor}>
        {label}
      </label>
      <div className="field-control">
        {children}
        {hint && !error ? <div className="field-hint">{hint}</div> : null}
        {error ? <div className="field-error">{error}</div> : null}
      </div>
    </div>
  );
}
