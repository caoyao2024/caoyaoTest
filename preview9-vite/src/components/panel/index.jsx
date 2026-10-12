import "./index.css";

// Layer 3: 通用内容面板 —— 布局容器(非 antd Card)
export default function Panel({ title, description, extra, toolbar, children, className = "", bodyClassName = "" }) {
  return (
    <section className={`panel ${className}`}>
      {(title || extra) && (
        <header className="panel-head">
          <div className="panel-head-main">
            <h2 className="panel-title">{title}</h2>
            {description && <p className="panel-desc">{description}</p>}
          </div>
          {extra && <div className="panel-extra">{extra}</div>}
        </header>
      )}
      {toolbar && <div className="panel-toolbar">{toolbar}</div>}
      <div className={`panel-body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
