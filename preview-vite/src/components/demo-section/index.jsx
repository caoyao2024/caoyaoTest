// 演示区块容器 — 标题 + 描述 + 内容
export default function DemoSection({ title, description, children }) {
  return (
    <section className="demo-section">
      <div className="demo-section-head">
        <h3 className="demo-section-title">{title}</h3>
        {description && <p className="demo-section-desc">{description}</p>}
      </div>
      <div className="demo-section-body">{children}</div>
    </section>
  );
}
