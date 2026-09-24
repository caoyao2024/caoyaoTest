import { useState } from "react";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 侧边导航 — 一级模块 + 策略/设备二级菜单，支持折叠
// TODO(eview-react): Menu 无对应，手写垂直折叠导航（含二级子菜单）
export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState("strategy-form");
  const [openKeys, setOpenKeys] = useState(["strategy", "device"]);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const items = [
    { key: "overview", icon: <Icon name="layout-dashboard" size={16} />, label: t("nav.overview") },
    {
      key: "strategy",
      icon: <Icon name="scroll-text" size={16} />,
      label: t("nav.strategy"),
      children: [
        { key: "strategy-form", icon: <Icon name="sliders-horizontal" size={16} />, label: t("nav.strategy.form") },
        { key: "strategy-list", icon: <Icon name="list-checks" size={16} />, label: t("nav.strategy.list") },
        { key: "strategy-tpl", icon: <Icon name="copy" size={16} />, label: t("nav.strategy.template") },
      ],
    },
    {
      key: "device",
      icon: <Icon name="network" size={16} />,
      label: t("nav.device"),
      children: [
        { key: "device-list", icon: <Icon name="router" size={16} />, label: t("nav.device.list") },
        { key: "device-group", icon: <Icon name="users" size={16} />, label: t("nav.device.group") },
        { key: "device-firmware", icon: <Icon name="hard-drive" size={16} />, label: t("nav.device.firmware") },
      ],
    },
    {
      key: "alarm",
      icon: <Icon name="bell" size={16} />,
      label: t("nav.alarm"),
      children: [
        { key: "alarm-rule", icon: <Icon name="triangle-alert" size={16} />, label: t("nav.alarm.rule") },
        { key: "alarm-history", icon: <Icon name="activity" size={16} />, label: t("nav.alarm.history") },
      ],
    },
    { key: "report", icon: <Icon name="chart-column" size={16} />, label: t("nav.report") },
    { key: "audit", icon: <Icon name="shield-check" size={16} />, label: t("nav.audit") },
    { key: "settings", icon: <Icon name="settings" size={16} />, label: t("nav.settings") },
  ];

  const toggleSubmenu = (key) => {
    if (collapsed) return;
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <nav className="side-nav__menu">
        {items.map((item) => {
          if (item.children) {
            const isOpen = !collapsed && openKeys.includes(item.key);
            return (
              <div key={item.key} className="side-nav__group">
                <button
                  type="button"
                  className={`side-nav__group-header${isOpen ? " is-open" : ""}`}
                  onClick={() => toggleSubmenu(item.key)}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed ? <span className="side-nav__label">{item.label}</span> : null}
                  {!collapsed ? (
                    <Icon
                      name={isOpen ? "chevron-down" : "chevron-right"}
                      size={14}
                      className="side-nav__arrow"
                    />
                  ) : null}
                </button>
                {isOpen ? (
                  <div className="side-nav__submenu">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        className={`side-nav__item${current === child.key ? " is-active" : ""}`}
                        onClick={() => setCurrent(child.key)}
                      >
                        {child.icon}
                        <span className="side-nav__label">{child.label}</span>
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
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed ? <span className="side-nav__label">{item.label}</span> : null}
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
