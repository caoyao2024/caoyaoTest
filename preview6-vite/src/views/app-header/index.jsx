// Layer 4: 顶部导航栏（品牌 + 原生 nav + 主题切换）
import { useState } from "react";
import { IconPlusIcPublicMoon, IconPlusIcPublicRadiowave, IconPlusIcPublicSun } from '@nce/icon-plus';
import { useApp } from "../../context.jsx";
import "./index.css";

const TOP_NAV = [
  { key: "overview", label: "总览" },
  { key: "acquisition", label: "数据采集" },
  { key: "alarm", label: "告警中心" },
  { key: "ops", label: "运维管理" },
  { key: "system", label: "系统设置" },
];

export default function AppHeader() {
  const { isDark, toggleDark } = useApp();
  const [active, setActive] = useState("acquisition");

  return (
    <header className="app-header">
      <div className="app-header__left">
        <div className="app-header__brand">
          <span className="app-header__logo">
            <IconPlusIcPublicRadiowave iconSize="1.25rem" iconColor={['currentcolor']} />
          </span>
          <span className="app-header__title">物联网数据采集平台</span>
        </div>

        <nav className="topnav">
          {TOP_NAV.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className={`topnav__item${active === item.key ? " is-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActive(item.key);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="app-header__tools">
        <button
          type="button"
          className="app-header__icon-btn"
          onClick={toggleDark}
          title={isDark ? "切换到浅色模式" : "切换到深色模式"}
        >
          {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
        </button>
        <span className="app-header__divider" />
        <div className="app-header__user">
          <img className="app-header__avatar" src="./assets/uploads/user.png" alt="用户头像" />
          <span className="app-header__username">王工</span>
        </div>
      </div>
    </header>
  );
}
