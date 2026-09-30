import { useState } from "react";
import { IconPlusIcCarLayers, IconPlusIcIctLogOut, IconPlusIcPublicAlert, IconPlusIcPublicChevronDown, IconPlusIcPublicChevronUp, IconPlusIcPublicMoon, IconPlusIcPublicSun, IconPlusIcCarUser, IconPlusIcPublicSetting, IconPlusIcPublicSecurity, IconPlusIcPublicBellClock } from '@nce/icon-plus';
import TextField from "@nce/eview-react/TextField";
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";
import { topNavItems, notifications } from "../../mock/workorder.jsx";
import "./index.css";

const TONE_ICON_BG = {
  error: "var(--error-container)",
  success: "var(--success-container)",
  info: "var(--info-container)",
  warning: "var(--warning-container)",
  neutral: "var(--surface-variant)",
};

const TONE_ICON_FG = {
  error: "var(--error)",
  success: "var(--success)",
  info: "var(--info)",
  warning: "var(--on-warning-container)",
  neutral: "var(--on-surface-variant)",
};

const toneBg = (tone) => TONE_ICON_BG[tone] || TONE_ICON_BG.neutral;
const toneFg = (tone) => TONE_ICON_FG[tone] || TONE_ICON_FG.neutral;

// Layer 4: 顶部菜单栏 — 全部使用 JSX 手写(不使用 Menu 组件)
export default function TopBar() {
  const { isDark, toggleDark, activeTopNav, setActiveTopNav } = useApp();
  const [openKey, setOpenKey] = useState(null);

  const notifyPanel = (
    <div className="notify-panel">
      <div className="notify-panel__head">
        <span className="notify-panel__title">通知中心</span>
        <a className="notify-panel__more">全部标为已读</a>
      </div>
      <ul className="notify-panel__list">
        {notifications.map((n) => (
          <li className="notify-item" key={n.id}>
            <span
              className="notify-item__icon"
              style={{ background: toneBg(n.tone), color: toneFg(n.tone) }}
            >
              {n.icon}
            </span>
            <span className="notify-item__main">
              <span className="notify-item__title">{n.title}</span>
              <span className="notify-item__time">{n.time}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const userPanel = (
    <div className="user-panel">
      <div className="user-panel__profile">
        <img className="user-panel__avatar" src="./assets/uploads/user.png" alt="用户头像" />
        <div>
          <p className="user-panel__name">陈亦然</p>
          <p className="user-panel__role">网络运维一组 · 组长</p>
        </div>
      </div>
      <div className="user-panel__links">
        <a className="user-panel__link"><IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />个人中心</a>
        <a className="user-panel__link"><IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} />账号设置</a>
        <a className="user-panel__link"><IconPlusIcPublicSecurity iconSize="0.875rem" iconColor={['currentcolor']} />权限申请</a>
        <a className="user-panel__link user-panel__link--danger"><IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />退出登录</a>
      </div>
    </div>
  );

  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <span className="top-bar__logo">
          <IconPlusIcCarLayers iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <span className="top-bar__brand-text">
          <strong className="top-bar__brand-name">星云运维平台</strong>
          <span className="top-bar__brand-sub">CloudOps Console</span>
        </span>
      </div>

      <nav className="top-bar__nav" onMouseLeave={() => setOpenKey(null)}>
        {topNavItems.map((item) => {
          const active = activeTopNav === item.key;
          const hasChildren = !!item.children;
          return (
            <div
              className={`top-nav-item ${active ? "is-active" : ""} ${
                openKey === item.key ? "is-open" : ""
              }`}
              key={item.key}
              onMouseEnter={() => setOpenKey(hasChildren ? item.key : null)}
            >
              <button
                type="button"
                className="top-nav-item__trigger"
                onClick={() => {
                  setActiveTopNav(item.key);
                  setOpenKey(hasChildren && openKey !== item.key ? item.key : null);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {hasChildren ? (
                  {openKey === item.key ? <IconPlusIcPublicChevronUp iconSize="0.75rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['currentcolor']} />}
                ) : null}
              </button>

              {hasChildren && openKey === item.key ? (
                <div className="top-nav-item__panel">
                  {item.children.map((child) => (
                    <button
                      type="button"
                      className="top-nav-child"
                      key={child.key}
                      onClick={() => {
                        setActiveTopNav(item.key);
                        setOpenKey(null);
                      }}
                    >
                      <span className="top-nav-child__label">{child.label}</span>
                      <span className="top-nav-child__desc">{child.desc}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="top-bar__tools">
        <TextField
          className="top-bar__search"
          size="small"
          placeholder="搜索工单号、设备编号或站点"
          onChange={(value) => {}}
        />

        <TipBox type="simple" content="帮助文档" direction="bottom">
          <button type="button" className="icon-btn">
            <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} />
          </button>
        </TipBox>

        <TipBox
          type="simple"
          content={notifyPanel}
          trigger="click"
          direction="bottomRight"
          arrowDirection="none"
          isMouseLeaveClose={false}
        >
          <button type="button" className="icon-btn">
            <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
            <span className="icon-btn__dot" />
          </button>
        </TipBox>

        <TipBox type="simple" content={isDark ? "切换浅色模式" : "切换深色模式"} direction="bottom">
          <button type="button" className="icon-btn" onClick={toggleDark}>
            {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
          </button>
        </TipBox>

        <span className="top-bar__divider" />

        <TipBox
          type="simple"
          content={userPanel}
          trigger="click"
          direction="bottomRight"
          arrowDirection="none"
          isMouseLeaveClose={false}
        >
          <button type="button" className="user-chip">
            <img className="user-chip__avatar" src="./assets/uploads/user.png" alt="陈亦然" />
            <span className="user-chip__text">
              <span className="user-chip__name">陈亦然</span>
              <span className="user-chip__role">网络运维一组</span>
            </span>
            <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['currentcolor']} />
          </button>
        </TipBox>
      </div>
    </header>
  );
}
