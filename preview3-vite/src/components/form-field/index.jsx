// Layer 3 — H5 表单字段容器（替代 antd Form.Item）
// 结构：label + 控件 + 辅助说明 / 错误信息，全部为自绘 H5，间距由本组件自己控制
import { IconPlusIcPublicAlert } from '@nce/icon-plus';
import "./index.css";

export default function FormField({ name, label, required, error, hint, full, children }) {
  const cls = "form-field" + (full ? " field-grid__full" : "") + (error ? " form-field--error" : "");

  return (
    <div className={cls}>
      <label className={"form-field__label" + (required ? " form-field__label--required" : "")} htmlFor={name}>
        {label}
      </label>
      <div className="form-field__control">{children}</div>
      {error ? (
        <p className="form-field__error" role="alert">
          <IconPlusIcPublicAlert iconSize="0.75rem" iconColor={['currentcolor']} />
          {error}
        </p>
      ) : hint ? (
        <p className="form-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
