import { useState } from "react";
import Accordion from "@nce/eview-react/Accordion";
import TipBox from "@nce/eview-react/TipBox";
import { IconPlusIcPublicDashboard, IconPlusIcPublicHeadphones, IconPlusIcPublicMenuCollapse, IconPlusIcPublicMenuExpansion } from "@nce/icon-plus";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { sideMenu } from "../../mock/workorder.js";
import "./index.css";

// TODO(eview-react): Progress 未覆盖，当前手写线性进度条
function SimpleProgress({ percent, color = "var(--primary)" }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ height: "6px", background: "var(--hover, rgba(0,0,0,0.05))", borderRadius: "3px", overflow: "hidden" }}>
      <div style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }} />
    </div>
  );
}

// Layer 4: 侧边导航 — 使用 Accordion 组件承载多级导航
export default function SideNav() {
  const { navCollapsed, toggleNav, activeSideKey, setActiveSideKey } = useApp();

  const menuData = sideMenu.map((group) => {
    const item = {
      title: group.label,
      value: group.key,
      icon: <Icon name={group.icon} size="1rem" />,
    };
    if (!group.children) return item;
    return {
      ...item,
      children: group.children.map((child) => ({ title: child.label, value: child.key })),
    };
  });

  const handleMenuClick = (node) => {
    if (node.value && (!node.children || node.children.length === 0)) {
      setActiveSideKey(node.value);
    }
  };

  return (
    <aside className={`side-nav ${navCollapsed ? "side-nav--collapsed" : ""}`}>
      <div className="side-nav__top">
        {navCollapsed ? null : (
          <span className="side-nav__caption">
            <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} />
            工作台导航
          </span>
        )}
        <TipBox type="simple" content={navCollapsed ? "展开导航" : "收起导航"} direction="right">
          <button type="button" className="side-nav__toggle" onClick={toggleNav}>
            {navCollapsed ? (
              <IconPlusIcPublicMenuExpansion iconSize="1rem" iconColor={['currentcolor']} />
            ) : (
              <IconPlusIcPublicMenuCollapse iconSize="1rem" iconColor={['currentcolor']} />
            )}
          </button>
        </TipBox>
      </div>

      <div className="side-nav__menu">
        <Accordion
          data={menuData}
          selectedValue={activeSideKey}
          onClick={handleMenuClick}
          enableMultiOpen
          expanded={navCollapsed}
          onExpand={() => toggleNav()}
          hideTitleBar
          style={{ height: "100%" }}
        />
      </div>

      {navCollapsed ? null : (
        <div className="side-nav__foot">
          <div className="quota">
            <div className="quota__head">
              <span className="quota__title">本月巡检额度</span>
              <span className="quota__value">86%</span>
            </div>
            <SimpleProgress percent={86} color="var(--primary)" />
            <p className="quota__desc">已完成 172 / 200 次巡检，剩余 5 天</p>
          </div>
          <a className="side-nav__help">
            <IconPlusIcPublicHeadphones iconSize="0.875rem" iconColor={['currentcolor']} />
            运维值班热线 400-820-1120
          </a>
        </div>
      )}
    </aside>
  );
}
