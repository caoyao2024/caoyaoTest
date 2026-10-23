// Layer 4: 顶部导航 — Logo / 5 项主导航（原生 nav，选中项品牌色 + 2px 下划线）/ 消息铃铛 / 用户头像下拉
import { useMemo, useState, useRef, useEffect } from "react";
import { IconPlusIcCarUser, IconPlusIcIctLogOut, IconPlusIcPublicBarChart, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicMoon, IconPlusIcPublicSun, IconPlusIcPublicTeams } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Accordion from "@nce/eview-react/Accordion";
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
  { key: "logout", label: "退出登录", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />, danger: true },
];

// TODO(eview-react): Dropdown 无对应组件，当前手写最小可用版
function SimpleDropdown({ trigger, children, placement }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isRight = placement === "bottomRight";

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open ? (
        <div style={{
          position: "absolute",
          top: "100%",
          [isRight ? "right" : "left"]: 0,
          marginTop: "4px",
          zIndex: 1050,
          background: "var(--surface-container-highest, #fff)",
          border: "1px solid var(--divider, #e0e0e0)",
          borderRadius: "var(--radius-container, 8px)",
          boxShadow: "var(--shadow-card, 0 1px 6px rgba(0,0,0,0.08))",
          overflow: "visible",
        }}>
          {typeof children === "function" ? children({ close: () => setOpen(false) }) : children}
        </div>
      ) : null}
    </div>
  );
}

// 通知下拉面板：系统 / 审批 / @我 三类页签，每类带未读计数，底部"查看全部"
function NotificationPanel({ notifications, onReadAll, onOpen, notify }) {
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
        draggable={false}
        onClick={(index) => setActiveCategory(NOTIFICATION_CATEGORIES[index].key)}
        headStyle={{ marginBottom: "0.375rem" }}
        className="notice-tabs"
      >
        {NOTIFICATION_CATEGORIES.map((category) => (
          <TabItem
            key={category.key}
            title={category.label}
            titleExtraContent={unreadByCategory[category.key] > 0 ? (
              <span className="notice-tab-count">{unreadByCategory[category.key]}</span>
            ) : null}
          >
            <span />
          </TabItem>
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
        <a className="panel-link" onClick={() => notify("default", "已打开消息中心（演示）")}>查看全部</a>
      </div>
    </div>
  );
}

export default function TopNav() {
  const { isDark, toggleDark } = useApp();
  const [activeNav, setActiveNav] = useState("workbench");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [notice, setNotice] = useState(null);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    notify("success", "已将全部消息标记为已读");
  };

  const handleOpenNotification = (item) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === item.id ? { ...notification, unread: false } : notification
      )
    );
    notify("default", `已打开消息：${item.title}`);
  };

  const handleUserMenu = (key) => {
    if (key === "logout") {
      notify("default", "已退出登录（演示环境）");
      return;
    }
    const label = key === "profile" ? "个人设置" : "团队管理";
    notify("success", `已打开「${label}」（演示）`);
  };

  const USER_MENU_DATA = USER_MENU_ITEMS.map((item) => ({
    title: item.label,
    value: item.key,
    icon: item.icon,
  }));

  return (
    <>
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="brand">
            <span className="brand-mark">
              <IconPlusIcPublicBarChart iconSize="1rem" iconColor={['currentcolor']} />
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
            <SimpleDropdown
              trigger={
                <button type="button" className="nav-icon-btn" title="消息通知" aria-label="消息通知">
                  <Badge content={unreadCount}>
                    <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
                  </Badge>
                </button>
              }
              placement="bottomRight"
            >
              <NotificationPanel
                notifications={notifications}
                onReadAll={handleReadAll}
                onOpen={handleOpenNotification}
                notify={notify}
              />
            </SimpleDropdown>

            <SimpleDropdown
              trigger={
                <button type="button" className="user-chip" title="账号菜单" aria-label="账号菜单">
                  <img className="user-chip-avatar" src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                  <span className="user-chip-name">{CURRENT_USER.name}</span>
                  <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
                </button>
              }
              placement="bottomRight"
            >
              {({ close }) => (
                <div className="user-menu-panel">
                  <div className="user-menu-profile">
                    <img className="user-menu-avatar" src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                    <div className="user-menu-info">
                      <span className="user-menu-name">{CURRENT_USER.name}</span>
                      <span className="user-menu-role">{CURRENT_USER.role} · 团队 {CURRENT_USER.teamSize} 人</span>
                    </div>
                  </div>
                  <Accordion
                    data={USER_MENU_DATA}
                    onClick={(node) => { handleUserMenu(node.value); close(); }}
                    enableExpand={false}
                    hideTitleBar
                    hideIcons
                    className="user-menu"
                  />
                </div>
              )}
            </SimpleDropdown>
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
