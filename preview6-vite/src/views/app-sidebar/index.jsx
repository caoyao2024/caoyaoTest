// Layer 4: 侧边导航栏（Accordion）
import { useState } from "react";
import { IconPlusIcHuaweiCloudDatabase, IconPlusIcIctCpu, IconPlusIcPublicBellClock, IconPlusIcPublicSetting } from '@nce/icon-plus';
import Accordion from "@nce/eview-react/Accordion";
import "./index.css";

const MENU_ITEMS = [
  {
    value: "acquisition",
    icon: <IconPlusIcHuaweiCloudDatabase iconSize="1rem" iconColor={['currentcolor']} />,
    title: "数据采集",
    isExpand: true,
    children: [
      { value: "rule-config", title: "采集规则配置" },
      { value: "source-manage", title: "数据源管理" },
      { value: "point-dict", title: "点位字典" },
      { value: "task-monitor", title: "采集任务监控" },
    ],
  },
  {
    value: "alarm",
    icon: <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />,
    title: "告警中心",
    isExpand: true,
    children: [
      { value: "alarm-rule", title: "告警规则" },
      { value: "notify-channel", title: "通知渠道" },
    ],
  },
  {
    value: "asset",
    icon: <IconPlusIcIctCpu iconSize="1rem" iconColor={['currentcolor']} />,
    title: "设备资产",
    children: [
      { value: "device-ledger", title: "设备台账" },
      { value: "gateway", title: "网关管理" },
    ],
  },
  {
    value: "system",
    icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} />,
    title: "系统设置",
    children: [
      { value: "user-role", title: "用户与权限" },
      { value: "op-log", title: "操作日志" },
    ],
  },
];

const isLeaf = (node) => !node.children || node.children.length === 0;

export default function AppSidebar() {
  const [selectedValue, setSelectedValue] = useState("rule-config");

  const handleMenuClick = (node) => {
    if (isLeaf(node) && node.value) {
      setSelectedValue(node.value);
    }
  };

  return (
    <aside className="app-sider">
      <Accordion
        data={MENU_ITEMS}
        selectedValue={selectedValue}
        onClick={handleMenuClick}
        enableExpand={false}
        hideIcons
        enableMultiOpen
        style={{ borderInlineEnd: "none", background: "transparent" }}
      />
    </aside>
  );
}
