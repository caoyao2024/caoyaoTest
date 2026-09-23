import { useState } from "react";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 侧边导航 — 一级模块 + 策略/设备/告警二级菜单，支持折叠
// TODO(eview-react): Menu 无对应组件，手写可折叠侧导航（含分组展开）
export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState("strategy-form");
  const [openKeys, setOpenKeys] = useState(() => new Set(["strategy", "device"]));
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const items = [
    { key: "overview", icon: "layout-dashboard", label: t("nav.overview") },
    {
      key: "strategy",
      icon: "scroll-text",
      label: t("nav.strategy"),
      children: [
        { key: "strategy-form", icon: "sliders-horizontal", label: t("nav.strategy.form") },
        { key: "strategy-list", icon: "list-checks", label: t("nav.strategy.list") },
        { key: "strategy-tpl", icon: "copy", label: t("nav.strategy.template") },
      ],
    },
    {
      key: "device",
      icon: "network",
      label: t("nav.device"),
      children: [
        { key: "device-list", icon: "router", label: t("nav.device.list") },
        { key: "device-group", icon: "users", label: t("nav.device.group") },
        { key: "device-firmware", icon: "hard-drive", label: t("nav.device.firmware") },
      ],
    },
    {
      key: "alarm",
      icon: "bell",
      label: t("nav.alarm"),
      children: [
        { key: "alarm-rule", icon: "triangle-alert", label: t("nav.alarm.rule") },
        { key: "alarm-history", icon: "activity", label: t("nav.alarm.history") },
      ],
    },
    { key: "report", icon: "chart-column", label: t("nav.report") },
    { key: "audit", icon: "shield-check", label: t("nav.audit") },
    { key: "settings", icon: "settings", label: t("nav.settings") },
  ];

  const toggleGroup = (key) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <nav className="side-nav__menu">
        {items.map((item) => {
          if (item.children) {
            const open = openKeys.has(item.key);
            return (
              <div className="side-nav__group" key={item.key}>
                <button
                  type="button"
                  className="side-nav__item side-nav__item--group"
                  onClick={() => toggleGroup(item.key)}
                  aria-expanded={open}
                >
                  <Icon name={item.icon} size={16} />
                  {collapsed ? null : (
                    <>
                      <span className="side-nav__label">{item.label}</span>
                      <Icon name={open ? "chevron-down" : "chevron-right"} size={12} />
                    </>
                  )}
                </button>
                {open && !collapsed ? (
                  <div className="side-nav__sub">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        className={`side-nav__sub-item${current === child.key ? " is-active" : ""}`}
                        onClick={() => setCurrent(child.key)}
                      >
                        <Icon name={child.icon} size={14} />
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }
          return (
            <button
              key={item.key}
              type="button"
              className={`side-nav__item${current === item.key ? " is-active" : ""}`}
              onClick={() => setCurrent(item.key)}
            >
              <Icon name={item.icon} size={16} />
              {collapsed ? null : <span className="side-nav__label">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="side-nav__footer">
        <Icon name="wifi" size={14} />
        {collapsed ? null : <span>{t("nav.version")}</span>}
      </div>
    </aside>
  );
}
