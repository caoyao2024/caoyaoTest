// Layer 4: ① 顶部导航 — 平台 Logo / 主导航 / 快捷创建下拉 / 通知中心 / 用户区
// 顶部导航按规范用原生 nav 自写：选中项品牌色 + 2px 底部下划线，未选中透明下划线占位
import { useState } from "react";
import { IconPlusIcBpitTicket, IconPlusIcIctLogOut, IconPlusIcIctNewFile, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicMoon, IconPlusIcPublicPerson, IconPlusIcPublicPlus, IconPlusIcPublicSetting, IconPlusIcPublicShoppingBag, IconPlusIcPublicSun } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Dropdown from "@/shared/Dropdown";
import { useNotice } from "@/shared/Notice";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV_ITEMS = ["首页", "订单", "商品", "营销", "会员", "设置"];

export default function TopNav({ onQuickCreate }) {
  const { isDark, toggleDark } = useApp();
  const [navActive, setNavActive] = useState("订单");
  const [notify, noticeEl] = useNotice();
  // 通知中心
  const [notifs, setNotifs] = useState([
    { key: "n1", title: "3 个订单超时未发货，请及时处理", time: "17:30", unread: true },
    { key: "n2", title: "SO20261019-0377 的售后申请已等待 43 小时", time: "16:20", unread: true },
    { key: "n3", title: "系统将于今晚 02:00 - 04:00 例行维护", time: "14:00", unread: false },
  ]);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const createMenu = {
    items: [
      { key: "order", icon: <IconPlusIcIctNewFile iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建订单" },
      { key: "coupon", icon: <IconPlusIcBpitTicket iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建优惠" },
      { key: "product", icon: <IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建商品" },
    ],
    onClick: ({ key }) => {
      if (onQuickCreate) onQuickCreate(key);
    },
  };

  const notifMenu = {
    items: [
      ...notifs.map((n) => ({
        key: n.key,
        label: (
          <div className={n.unread ? "tn-notif tn-notif-unread" : "tn-notif"}>
            <span className="tn-notif-title">{n.title}</span>
            <span className="tn-notif-time">{n.time}</span>
          </div>
        ),
      })),
      { type: "divider" },
      { key: "read-all", label: "全部已读" },
    ],
    onClick: ({ key }) => {
      if (key === "read-all") {
        setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
        notify("success", "通知已全部标记为已读");
      }
    },
  };

  const userMenu = {
    items: [
      { key: "profile", icon: <IconPlusIcPublicPerson iconSize="0.875rem" iconColor={['currentcolor']} />, label: "个人中心" },
      { key: "settings", icon: <IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} />, label: "账号设置" },
      { type: "divider" },
      { key: "logout", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />, label: "退出登录" },
    ],
    onClick: ({ key }) => {
      if (key === "logout") notify("success", "已安全退出当前账号（演示）");
      else notify("success", `已打开「${key === "profile" ? "个人中心" : "账号设置"}」（演示入口）`);
    },
  };

  return (
    <header className="top-nav">
      {noticeEl}
      <div className="tn-left">
        <span className="tn-logo" title="云驰电商运营台">
          <IconPlusIcPublicShoppingBag iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <span className="tn-brand">云驰电商运营台</span>
        <nav className="tn-nav">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              className={navActive === item ? "active" : ""}
              onClick={() => setNavActive(item)}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
      <div className="tn-right">
        <Dropdown menu={createMenu} trigger={["click"]}>
          <Button status="primary" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} text="快捷创建" />
        </Dropdown>
        <span
          className="tn-icon-btn"
          title={isDark ? "切换为亮色模式" : "切换为暗色模式"}
          onClick={toggleDark}
        >
          {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
        </span>
        <Dropdown menu={notifMenu} trigger={["click"]}>
          <span className="tn-icon-btn" title="系统通知">
            <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
            {unreadCount > 0 && <i className="tn-dot" />}
          </span>
        </Dropdown>
        <Dropdown menu={userMenu} trigger={["click"]}>
          <span className="tn-user">
            <img src="/uploads/user.png" alt="用户头像" />
            <span className="tn-user-info">
              <span className="tn-user-name">林晓</span>
              <span className="tn-user-role">运营组长</span>
            </span>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
          </span>
        </Dropdown>
      </div>
    </header>
  );
}
