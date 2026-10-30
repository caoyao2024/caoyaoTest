// Layer 4: 顶部导航 — Logo / 5 项主导航（原生 nav，选中项品牌色 + 2px 下划线）/ 消息铃铛 / 用户头像下拉
import { useEffect, useMemo, useRef, useState } from "react";
import { IconPlusIcCarUser, IconPlusIcIctLogOut, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicDataStatistics, IconPlusIcPublicMoon, IconPlusIcPublicSun, IconPlusIcPublicTeams } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import DivMessage from "@nce/eview-react/DivMessage";
import { CURRENT_USER, MAIN_NAV, NOTIFICATION_CATEGORIES, NOTIFICATIONS } from "../../mock/dashboard.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const TONE_CLASS = {
  error: "is-error",
  critical: "is-critical",
  success: "is-success",
  info: "is-info",
};

const USER_MENU_ITEMS = [
  { key: "profile", label: "个人设置", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "team", label: "团队管理", icon: <IconPlusIcPublicTeams iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { type: "divider" },
  { key: "logout", label: "退出登录", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />, danger: true },
];

function UserMenu({ items, onSelect }) {
  return (
    <div className="user-menu">
      {items.map((item, index) => {
        if (item.type === "divider") {
          return <div key={`divider-${index}`} className="user-menu-divider" />;
        }
        return (
          <button
            key={item.key}
            type="button"
            className={`user-menu-item ${item.danger ? "is-danger" : ""}`}
            onClick={() => onSelect(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// 通知下拉面板：系统 / 审批 / @我 三类页签，每类带未读计数，底部"查看全部"
function NotificationPanel({ notifications, onReadAll, onOpen }) {
  const [activeCategory, setActiveCategory] = useState("system");

  const unreadByCategory = useMemo(() => {
    const counts = {};
    NOTIFICATION_CATEGORIES.forEach((category) => {
      counts[category.key] = notifications.filter(
        (item) => item.category === category.key && item.unread
      ).length;
    });
    return counts;
  }, [notifications]);

  const activeItems = notifications.filter((item) => item.category === activeCategory);

  return (
    <div className="notice-panel">
      <div className="notice-panel-head">
        <span className="notice-panel-title">消息通知</span>
        <a className="panel-link" onClick={onReadAll}>全部已读</a>
      </div>
      <Tab
        selectedIndex={NOTIFICATION_CATEGORIES.findIndex((c) => c.key === activeCategory)}
        onClick={(index) => setActiveCategory(NOTIFICATION_CATEGORIES[index].key)}
        draggable={false}
        headStyle={{ marginBottom: "0.375rem" }}
        className="notice-tabs"
      >
        {NOTIFICATION_CATEGORIES.map((category) => (
          <TabItem
            key={category.key}
            title={
              <span className="notice-tab">
                {category.label}
                {unreadByCategory[category.key] > 0 ? (
                  <span className="notice-tab-count">{unreadByCategory[category.key]}</span>
                ) : null}
              </span>
            }
          />
        ))}
      </Tab>
      <ul className="notice-list">
        {activeItems.map((item) => (
          <li
            key={item.id}
            className={`notice-item ${item.unread ? "is-unread" : ""}`}
            onClick={() => onOpen(item)}
          >
            <span className={`notice-item-icon ${TONE_CLASS[item.tone] || "is-info"}`}>
              {item.icon}
            </span>
            <div className="notice-item-body">
              <p className="notice-item-title">{item.title}</p>
              <span className="notice-item-time">{item.time}</span>
            </div>
            {item.unread ? <span className="notice-dot" /> : null}
          </li>
        ))}
      </ul>
      <div className="notice-panel-foot">
        <a className="panel-link" onClick={() => onOpen({ title: "消息中心" })}>查看全部</a>
      </div>
    </div>
  );
}

export default function TopNav() {
  const { isDark, toggleDark } = useApp();
  const [activeNav, setActiveNav] = useState("workbench");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [notice, setNotice] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });
  const unreadCount = notifications.filter((item) => item.unread).length;

  useEffect(() => {
    if (!notifOpen && !userMenuOpen) return;
    const handleClickOutside = (event) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen, userMenuOpen]);

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    notify("success", "已将全部消息标记为已读");
  };

  const handleOpenNotification = (item) => {
    if (item.id) {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === item.id ? { ...notification, unread: false } : notification
        )
      );
    }
    notify("default", `已打开消息：${item.title}`);
  };

  const handleUserMenu = (key) => {
    setUserMenuOpen(false);
    if (key === "logout") {
      notify("default", "已退出登录（演示环境）");
      return;
    }
    const label = key === "profile" ? "个人设置" : "团队管理";
    notify("success", `已打开「${label}」（演示）`);
  };

  return (
    <>
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="brand">
            <span className="brand-mark">
              <IconPlusIcPublicDataStatistics iconSize="1rem" iconColor={['currentcolor']} />
            </span>
            <span className="brand-text">
              <span className="brand-name">客成云</span>
              <span className="brand-sub">Customer Success</span>
            </span>
          </div>

          <nav className="main-nav">
            {MAIN_NAV.map((item) => (
              <a
                key={item.key}
                className={`main-nav-item ${activeNav === item.key ? "is-active" : ""}`}
                onClick={() => setActiveNav(item.key)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="top-nav-actions">
            <button
              type="button"
              className="nav-icon-btn"
              title={isDark ? "切换为亮色模式" : "切换为暗色模式"}
              aria-label="主题切换"
              onClick={toggleDark}
            >
              {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
            </button>
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                type="button"
                className="nav-icon-btn"
                title="消息通知"
                aria-label="消息通知"
                onClick={() => setNotifOpen((prev) => !prev)}
              >
                <Badge content={unreadCount}>
                  <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
                </Badge>
              </button>
              {notifOpen ? (
                <div className="notice-dropdown" style={{ position: "absolute", top: "100%", right: 0, zIndex: 1000 }}>
                  <NotificationPanel
                    notifications={notifications}
                    onReadAll={handleReadAll}
                    onOpen={handleOpenNotification}
                  />
                </div>
              ) : null}
            </div>

            <div ref={userMenuRef} style={{ position: "relative" }}>
              <button
                type="button"
                className="user-chip"
                title="账号菜单"
                aria-label="账号菜单"
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                <img className="user-chip-avatar" src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                <span className="user-chip-name">{CURRENT_USER.name}</span>
                <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
              </button>
              {userMenuOpen ? (
                <div className="user-menu-panel" style={{ position: "absolute", top: "100%", right: 0, zIndex: 1000 }}>
                  <div className="user-menu-profile">
                    <img className="user-menu-avatar" src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                    <div className="user-menu-info">
                      <span className="user-menu-name">{CURRENT_USER.name}</span>
                      <span className="user-menu-role">{CURRENT_USER.role} · 团队 {CURRENT_USER.teamSize} 人</span>
                    </div>
                  </div>
                  <UserMenu items={USER_MENU_ITEMS} onSelect={handleUserMenu} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </>
  );
}
