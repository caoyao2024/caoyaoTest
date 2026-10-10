// Layer 4: 顶部导航栏 — 品牌 / 主主导航（原生 nav）/ 全局工具
// 顶部导航不使用 antd Menu（见 references/component/Menu.md）：选中项品牌色文字 + 2px 下划线。
import { useState } from "react";
import { IconPlusIcIctBaseStation, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicMenuCollapse, IconPlusIcPublicMenuExpansion, IconPlusIcPublicMoon, IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@nce/icon-plus';
import TextField from "@/shared/TextField";
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";
import { topNavItems } from "../../mock/order.jsx";
import "./index.css";

export default function TopBar({ collapsed, onToggleCollapsed }) {
  const { isDark, toggleDark } = useApp();
  const [activeNav, setActiveNav] = useState("order");
  const [keyword, setKeyword] = useState("");

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo">
          <IconPlusIcIctBaseStation iconSize="1rem" iconColor={['currentcolor']} />
        </span>
        <span className="topbar-title">运营商业务受理平台</span>
        <span className="topbar-ver">V3.2</span>
      </div>

      <button
        type="button"
        className="topbar-collapse"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "展开导航" : "收起导航"}
      >
        {collapsed ? <IconPlusIcPublicMenuExpansion iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMenuCollapse iconSize="1rem" iconColor={['currentcolor']} />}
      </button>

      <nav className="topbar-nav">
        {topNavItems.map((item) => (
          <button
            type="button"
            key={item.key}
            className={`topbar-nav-item${activeNav === item.key ? " active" : ""}`}
            onClick={() => setActiveNav(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <span className="topbar-spacer" />

      <div className="topbar-tools">
        <TextField
          className="topbar-search"
          value={keyword}
          onChange={(value) => setKeyword(value)}
          placeholder="搜索工单号 / 客户 / 号码"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
        />

        <TipBox type="simple" content="待办工单" direction="bottom">
          <button type="button" className="topbar-icon-btn" aria-label="待办工单">
            <Badge content={12} offset={[2, -2]}>
              <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
            </Badge>
          </button>
        </TipBox>

        <TipBox type="simple" content={isDark ? "切换浅色模式" : "切换深色模式"} direction="bottom">
          <button type="button" className="topbar-icon-btn" onClick={toggleDark} aria-label="切换主题">
            {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
          </button>
        </TipBox>

        <div className="topbar-user">
          <img src="/assets/uploads/user.png" alt="当前用户" />
          <div className="topbar-user-meta">
            <span className="topbar-user-name">周晓东</span>
            <span className="topbar-user-role">受理专员 · 华南大区</span>
          </div>
          <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['currentcolor']} className="topbar-user-caret" />
        </div>
      </div>
    </header>
  );
}
