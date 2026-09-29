import { useState } from "react";
import { IconPlusIcCarUser, IconPlusIcHuaweiCloudNetwork, IconPlusIcIctTriangle, IconPlusIcPublicBellClock, IconPlusIcPublicChart, IconPlusIcPublicCopy, IconPlusIcPublicDashboard, IconPlusIcPublicSetting, IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicWifi } from '@nce/icon-plus';
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState("strategy-form");
  const [openKeys, setOpenKeys] = useState(new Set(["strategy", "device"]));
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const items = [
    { key: "overview", icon: <IconPlusIcPublicDashboard iconSize={16} iconColor={['currentcolor']} />, label: t("nav.overview") },
    {
      key: "strategy",
      icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />,
      label: t("nav.strategy"),
      children: [
        { key: "strategy-form", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />, label: t("nav.strategy.form") },
        { key: "strategy-list", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />, label: t("nav.strategy.list") },
        { key: "strategy-tpl", icon: <IconPlusIcPublicCopy iconSize={16} iconColor={['currentcolor']} />, label: t("nav.strategy.template") },
      ],
    },
    {
      key: "device",
      icon: <IconPlusIcHuaweiCloudNetwork iconSize={16} iconColor={['currentcolor']} />,
      label: t("nav.device"),
      children: [
        { key: "device-list", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />, label: t("nav.device.list") },
        { key: "device-group", icon: <IconPlusIcCarUser iconSize={16} iconColor={['currentcolor']} />, label: t("nav.device.group") },
        { key: "device-firmware", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />, label: t("nav.device.firmware") },
      ],
    },
    {
      key: "alarm",
      icon: <IconPlusIcPublicBellClock iconSize={16} iconColor={['currentcolor']} />,
      label: t("nav.alarm"),
      children: [
        { key: "alarm-rule", icon: <IconPlusIcIctTriangle iconSize={16} iconColor={['currentcolor']} />, label: t("nav.alarm.rule") },
        { key: "alarm-history", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />, label: t("nav.alarm.history") },
      ],
    },
    { key: "report", icon: <IconPlusIcPublicChart iconSize={16} iconColor={['currentcolor']} />, label: t("nav.report") },
    { key: "audit", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />, label: t("nav.audit") },
    { key: "settings", icon: <IconPlusIcPublicSetting iconSize={16} iconColor={['currentcolor']} />, label: t("nav.settings") },
  ];

  const toggleSubMenu = (key) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const renderItem = (item) => {
    const hasChildren = item.children && item.children.length;
    const isOpen = openKeys.has(item.key);
    const isActive = current === item.key;

    return (
      <div key={item.key} className="side-nav__item-group">
        <button
          type="button"
          className={`side-nav__item${isActive ? " active" : ""}`}
          title={collapsed ? item.label : undefined}
          onClick={() => (hasChildren ? toggleSubMenu(item.key) : setCurrent(item.key))}
        >
          <span className="side-nav__item-icon">{item.icon}</span>
          {collapsed ? null : <span className="side-nav__item-label">{item.label}</span>}
          {collapsed || !hasChildren ? null : (
            <span className="side-nav__item-arrow">
              <Icon name={isOpen ? "chevron-down" : "chevron-right"} size={12} />
            </span>
          )}
        </button>
        {collapsed || !hasChildren || !isOpen ? null : (
          <div className="side-nav__sub">
            {item.children.map((child) => (
              <button
                key={child.key}
                type="button"
                className={`side-nav__sub-item${current === child.key ? " active" : ""}`}
                onClick={() => setCurrent(child.key)}
              >
                <span className="side-nav__sub-icon">{child.icon}</span>
                <span className="side-nav__sub-label">{child.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <nav className="side-nav__menu">
        {items.map(renderItem)}
      </nav>
      <div className="side-nav__footer">
        <IconPlusIcPublicWifi iconSize={14} iconColor={['currentcolor']} />
        {collapsed ? null : <span>{t("nav.version")}</span>}
      </div>
    </aside>
  );
}
