import TextField from "@/shared/TextField";
import { IconPlusIcCarUser, IconPlusIcHuaweiCloudNetwork, IconPlusIcIctLogOut, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicMoon, IconPlusIcPublicSearch, IconPlusIcPublicSecurity, IconPlusIcPublicSun } from '@nce/icon-plus';
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV = [
  { key: "config", label: "业务开通" },
  { key: "resources", label: "资源管理" },
  { key: "billing", label: "账单结算" },
  { key: "insight", label: "数据洞察" },
  { key: "settings", label: "系统设置" },
];

export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  // 头部导航为自写 nav（不使用 antd Menu）；当前示例仅高亮"业务开通"
  const current = "config";

  return (
    <header className="hd-bar">
      <div className="hd-brand">
        <span className="hd-logo">
          <IconPlusIcHuaweiCloudNetwork iconSize="1.25rem" iconColor={['var(--on-primary-fixed)']} />
        </span>
        <span className="hd-brand-text">云网运营中心</span>
      </div>

      <nav className="hd-nav" aria-label="主导航">
        {NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`hd-nav-item${current === item.key ? " active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="hd-tools">
        <TextField
          className="hd-search"
          placeholder="搜索工单号、客户或电路编号"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
        />
        <TipBox
          trigger="click"
          direction="bottomRight"
          isMouseLeaveClose
          content={
            <div className="app-dropdown-menu">
              <div className="app-dropdown-item">工单 GD-2026-009820 已进入配置阶段</div>
              <div className="app-dropdown-item">华北资源池利用率已达 82%</div>
              <div className="app-dropdown-item">工单 GD-2026-009810 被驳回，请复核</div>
            </div>
          }
        >
          <button type="button" className="hd-icon-btn" title="通知">
            <Badge content={3} offset={[2, -2]}>
              <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['var(--on-surface)']} />
            </Badge>
          </button>
        </TipBox>
        <TipBox type="simple" content={isDark ? "切换浅色模式" : "切换深色模式"} direction="top">
          <button type="button" className="hd-icon-btn" onClick={toggleDark}>
            {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['var(--on-surface)']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['var(--on-surface)']} />}
          </button>
        </TipBox>
        <TipBox
          trigger="click"
          direction="bottomRight"
          isMouseLeaveClose
          content={
            <div className="app-dropdown-menu">
              <div className="app-dropdown-item">
                <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /> 个人中心
              </div>
              <div className="app-dropdown-item">
                <IconPlusIcPublicSecurity iconSize="0.875rem" iconColor={['currentcolor']} /> 组织与权限
              </div>
              <div className="app-dropdown-divider" />
              <div className="app-dropdown-item">
                <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} /> 退出登录
              </div>
            </div>
          }
        >
          <button type="button" className="hd-user">
            <img src="./assets/uploads/user.png" alt="" className="hd-avatar" />
            <span className="hd-user-name">王云峰</span>
            <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />
          </button>
        </TipBox>
      </div>
    </header>
  );
}
