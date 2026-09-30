// Layer 4 — 侧边辅助信息（填写完成度 / 提示 / 最近工单）

import {
  IconPlusIcDigitalPowerDpTips,
  IconPlusIcDigitalPowerDpUserCluster,
  IconPlusIcIctServers,
  IconPlusIcPublicCheckmark,
  IconPlusIcPublicClipboard,
  IconPlusIcPublicClock,
  IconPlusIcPublicFiles,
  IconPlusIcPublicListBullet,
  IconPlusIcPublicPaperclip,
  IconPlusIcPublicSecurity,
  IconPlusIcPublicTelephone,
} from "@nce/icon-plus";
import StatusTag from "../../components/status-tag/index.jsx";
import { fillTips, recentOrders } from "../../mock/workOrder.js";
import "./index.css";

// 源项目用字符串图标名（Lucide），这里映射到 icon+ 静态组件。
// SECTIONS.icon 与 fillTips.icon 均为封闭字面量集合（静态数组字段），按 Icon.md recipe 解析。
const ICON_MAP = {
  "clipboard-list": IconPlusIcPublicClipboard,
  "server": IconPlusIcIctServers,
  "file-text": IconPlusIcPublicFiles,
  "users": IconPlusIcDigitalPowerDpUserCluster,
  "paperclip": IconPlusIcPublicPaperclip,
  "phone": IconPlusIcPublicTelephone,
  "lightbulb": IconPlusIcDigitalPowerDpTips,
  "clock": IconPlusIcPublicClock,
  "shield-check": IconPlusIcPublicSecurity,
  "circle-check": IconPlusIcPublicCheckmark,
};

const SECTIONS = [
  { key: "base", icon: "clipboard-list", label: "基本信息" },
  { key: "device", icon: "server", label: "设备与位置" },
  { key: "issue", icon: "file-text", label: "问题描述" },
  { key: "assign", icon: "users", label: "处理与指派" },
  { key: "attach", icon: "paperclip", label: "附件材料" },
  { key: "contact", icon: "phone", label: "联系与确认" },
];

// TODO(eview-react): Progress 无对应组件，当前手写最小可用版（见 handwrite-templates.md §9）
function SimpleProgress({ percent }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        flex: 1, height: "8px",
        background: "var(--hover, rgba(0,0,0,0.05))",
        borderRadius: "4px",
        overflow: "hidden",
      }}>
        <div style={{
          width: p + "%", height: "100%",
          background: "var(--primary, #0067D1)",
          transition: "width .2s",
        }} />
      </div>
    </div>
  );
}

export default function FormAside({ progress }) {
  const doneCount = Math.round((progress / 100) * SECTIONS.length);

  return (
    <div className="form-aside">
      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcPublicListBullet iconSize="1rem" iconColor={["currentcolor"]} className="aside-card__icon" />
            填写完成度
          </h3>
          <span className="aside-card__percent">{progress}%</span>
        </header>
        <SimpleProgress percent={progress} />
        <ul className="aside-checklist">
          {SECTIONS.map(function (s, i) {
            const done = i < doneCount;
            const Ic = done ? IconPlusIcPublicCheckmark : ICON_MAP[s.icon];
            return (
              <li className={"aside-checklist__item" + (done ? " aside-checklist__item--done" : "")} key={s.key}>
                {Ic ? <Ic iconSize="0.875rem" iconColor={["currentcolor"]} className="aside-checklist__icon" /> : null}
                <span>{s.label}</span>
                <span className="aside-checklist__state">{done ? "已填写" : "待填写"}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcDigitalPowerDpTips iconSize="1rem" iconColor={["currentcolor"]} className="aside-card__icon" />
            填写提示
          </h3>
        </header>
        <ul className="aside-tips">
          {fillTips.map(function (t, i) {
            const Ic = ICON_MAP[t.icon];
            return (
              <li className="aside-tips__item" key={i}>
                {Ic ? <Ic iconSize="0.875rem" iconColor={["currentcolor"]} className="aside-tips__icon" /> : null}
                <span>{t.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcPublicClock iconSize="1rem" iconColor={["currentcolor"]} className="aside-card__icon" />
            我的最近工单
          </h3>
          <a className="aside-card__link" href="#" onClick={function (e) { e.preventDefault(); }}>全部</a>
        </header>
        <ul className="aside-orders">
          {recentOrders.map(function (o) {
            return (
              <li className="aside-orders__item" key={o.id}>
                <div className="aside-orders__row">
                  <a className="aside-orders__title" href="#" onClick={function (e) { e.preventDefault(); }}>
                    {o.title}
                  </a>
                  <StatusTag status={o.status} />
                </div>
                <div className="aside-orders__meta">
                  <span>{o.id}</span>
                  <span>{o.time}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
