// Layer 3: 内容卡片容器（Level 1 悬浮面：标题 + 工具区 + 内容体）—— 纯 H5，无 antd 依赖
export default function PanelCard({ title, subtitle, extra, children, className, bodyClassName }) {
  const rootClass = className ? 'panel-card ' + className : 'panel-card';
  const bodyClass = bodyClassName ? 'panel-card__body ' + bodyClassName : 'panel-card__body';
  return (
    <section className={rootClass}>
      {title || extra ? (
        <header className="panel-card__header">
          <div className="panel-card__titles">
            <h2 className="panel-card__title">{title}</h2>
            {subtitle ? <span className="panel-card__subtitle">{subtitle}</span> : null}
          </div>
          {extra ? <div className="panel-card__extra">{extra}</div> : null}
        </header>
      ) : null}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}
