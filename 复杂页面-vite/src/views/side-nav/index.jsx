import { useState } from "react";
import { useIntl } from "react-intl";
import {
  IconPlusIcPublicTransverseRectangleTemplate,
  IconPlusIcPublicWifi,
} from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 侧边导航 — 一级模块 + 策略/设备二级菜单，支持折叠
// Menu 无对应组件，手写为 nav + 可折叠子项（见 handwrite-templates §5）
// TODO(eview-react): Menu 未覆盖，当前手写侧导航
export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState("strategy-form");
  const [openKeys, setOpenKeys] = useState({ strategy: true, device: true });
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const items = [
    { key: "overview", label: t("nav.overview"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
    {
      key: "strategy",
      label: t("nav.strategy"),
      icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} />,
      children: [
        { key: "strategy-form", label: t("nav.strategy.form"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
        { key: "strategy-list", label: t("nav.strategy.list"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
        { key: "strategy-tpl", label: t("nav.strategy.template"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
      ],
    },
    {
      key: "device",
      label: t("nav.device"),
      icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} />,
      children: [
        { key: "device-list", label: t("nav.device.list"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
        { key: "device-group", label: t("nav.device.group"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
        { key: "device-firmware", label: t("nav.device.firmware"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
      ],
    },
    {
      key: "alarm",
      label: t("nav.alarm"),
      icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} />,
      children: [
        { key: "alarm-rule", label: t("nav.alarm.rule"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
        { key: "alarm-history", label: t("nav.alarm.history"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
      ],
    },
    { key: "report", label: t("nav.report"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
    { key: "audit", label: t("nav.audit"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
    { key: "settings", label: t("nav.settings"), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} /> },
  ];

  const toggleGroup = (key) => {
    if (collapsed) return;
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <nav className="side-nav__menu">
        {items.map((item) => (
          <div key={item.key} className="side-nav__group">
            <button
              type="button"
              className={`side-nav__item${current === item.key ? " active" : ""}`}
              onClick={() => item.children ? toggleGroup(item.key) : setCurrent(item.key)}
            >
              <span className="side-nav__item-icon">{item.icon}</span>
              {!collapsed ? <span className="side-nav__item-label">{item.label}</span> : null}
              {item.children && !collapsed ? (
                <span className={`side-nav__item-arrow${openKeys[item.key] ? " open" : ""}`}>▾</span>
              ) : null}
            </button>
            {item.children && openKeys[item.key] && !collapsed ? (
              <div className="side-nav__sub">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    type="button"
                    className={`side-nav__sub-item${current === child.key ? " active" : ""}`}
                    onClick={() => setCurrent(child.key)}
                  >
                    <span className="side-nav__item-icon">{child.icon}</span>
                    <span className="side-nav__item-label">{child.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
      <div className="side-nav__footer">
        <IconPlusIcPublicWifi iconSize={14} iconColor={["currentcolor"]} />
        {collapsed ? null : <span>{t("nav.version")}</span>}
      </div>
    </aside>
  );
}
