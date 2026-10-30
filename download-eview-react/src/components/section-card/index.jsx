// Layer 3: 通用卡片容器 — 统一 B 端卡片外观（标题 / 副标题 / 右侧操作区）
import "./index.css";

export default function SectionCard({ title, subtitle, actions, children, className = "" }) {
  return (
    <section className={`section-card ${className}`}>
      <div className="section-card-header">
        <div className="section-card-heading">
          <h3 className="section-card-title">{title}</h3>
          {subtitle ? <p className="section-card-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="section-card-actions">{actions}</div> : null}
      </div>
      <div className="section-card-body">{children}</div>
    </section>
  );
}
