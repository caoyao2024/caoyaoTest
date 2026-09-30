import Accordion from "@nce/eview-react/Accordion";
import { IconPlusIcPublicHeadphones, IconPlusIcDigitalPowerDpMenu, IconPlusIcPublicMenuExpansion, IconPlusIcPublicMenuCollapse } from '@nce/icon-plus';
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";
import { sideMenu } from "../../mock/workorder.jsx";
import "./index.css";

// TODO(eview-react): Progress 无导出，手写线性进度条
function SimpleProgress({ percent, strokeColor }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="simple-progress">
      <div className="simple-progress__track">
        <div
          className="simple-progress__fill"
          style={{ width: `${p}%`, background: strokeColor }}
        />
      </div>
    </div>
  );
}

// Layer 4: 侧边导航 — 使用 Accordion 组件承载多级导航
export default function SideNav() {
  const { navCollapsed, toggleNav, activeSideKey, setActiveSideKey } = useApp();

  const data = sideMenu.map((group) => {
    const base = {
      value: group.key,
      title: group.label,
      icon: {group.icon},
    };
    if (!group.children) return base;
    return {
      ...base,
      children: group.children.map((child) => ({ value: child.key, title: child.label })),
    };
  });

  const handleMenuClick = (node) => {
    const item = node;
    if (item && item.value && (!item.children || item.children.length === 0)) {
      setActiveSideKey(item.value);
    }
  };

  return (
    <aside className={`side-nav ${navCollapsed ? "side-nav--collapsed" : ""}`}>
      <div className="side-nav__top">
        {navCollapsed ? null : (
          <span className="side-nav__caption">
            <IconPlusIcDigitalPowerDpMenu iconSize="0.875rem" iconColor={['currentcolor']} />
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
          data={data}
          selectedValue={activeSideKey}
          onClick={handleMenuClick}
          enableExpand
          expanded={navCollapsed}
          onExpand={(flag) => {
            if (flag !== navCollapsed) toggleNav();
          }}
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
            <SimpleProgress percent={86} strokeColor="var(--primary)" />
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
