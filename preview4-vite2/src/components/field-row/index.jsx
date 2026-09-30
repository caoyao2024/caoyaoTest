import { IconPlusIcPublicAlert } from '@nce/icon-plus';
import "./index.css";

// Layer 3: 表单字段行 — 标签 + 控件 + 校验信息(纯 H5 骨架,不使用 Form/Form.Item)
export default function FieldRow({
  label,
  required,
  htmlFor,
  error,
  help,
  full,
  className = "",
  children,
}) {
  return (
    <div className={`field-row ${full ? "field-row--full" : ""} ${className}`}>
      <label className="field-row__label" htmlFor={htmlFor}>
        {required ? <span className="field-row__req" aria-hidden="true">*</span> : null}
        {label}
      </label>
      <div className="field-row__control">{children}</div>
      {error ? (
        <p className="field-row__error">
          <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>{error}</span>
        </p>
      ) : help ? (
        <p className="field-row__help">{help}</p>
      ) : null}
    </div>
  );
}
