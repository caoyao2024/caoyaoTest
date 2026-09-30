import { Icon } from "../../shared/icon.jsx";
import "./index.css";

// Layer 3: 内容卡片容器(div + token,不使用 Card/Elevation 组合以外的样式)
export default function PanelCard({
  title,
  subtitle,
  icon,
  extra,
  children,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section className={`panel-card ${className}`}>
      {title ? (
        <header className="panel-card__head">
          <div className="panel-card__head-main">
            {icon ? (
              <span className="panel-card__icon">
                <Icon name={icon} size="1rem" />
              </span>
            ) : null}
            <div className="panel-card__titles">
              <h3 className="panel-card__title">{title}</h3>
              {subtitle ? <p className="panel-card__subtitle">{subtitle}</p> : null}
            </div>
          </div>
          {extra ? <div className="panel-card__extra">{extra}</div> : null}
        </header>
      ) : null}
      <div className={`panel-card__body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
