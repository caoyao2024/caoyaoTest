// Layer 4 — 侧边辅助信息（填写完成度 / 提示 / 最近工单）
// TODO(eview-react): ProgressBar 未覆盖，当前手写最小可用版

import {
  IconPlusIcPublicCheckmark,
  IconPlusIcPublicClipboard,
  IconPlusIcPublicClock,
  IconPlusIcPublicFiles,
  IconPlusIcPublicInfo,
  IconPlusIcPublicListBullet,
  IconPlusIcPublicPaperclip,
  IconPlusIcPublicTelephone,
  IconPlusIcPublicTeams,
  IconPlusIcIctServers,
} from '@nce/icon-plus';
import StatusTag from "../../components/status-tag/index.jsx";
import { recentOrders } from "../../mock/workOrder.js";
import "./index.css";

const SECTIONS = [
  { key: "base", icon: IconPlusIcPublicClipboard, label: "基本信息" },
  { key: "device", icon: IconPlusIcIctServers, label: "设备与位置" },
  { key: "issue", icon: IconPlusIcPublicFiles, label: "问题描述" },
  { key: "assign", icon: IconPlusIcPublicTeams, label: "处理与指派" },
  { key: "attach", icon: IconPlusIcPublicPaperclip, label: "附件材料" },
  { key: "contact", icon: IconPlusIcPublicTelephone, label: "联系与确认" },
];

const FILL_TIPS = [
  { icon: IconPlusIcPublicInfo, text: "工单标题请包含设备编号与故障现象，便于检索与分派。" },
  { icon: IconPlusIcPublicClock, text: "紧急优先级会触发值班短信通知，请确认影响范围后再选择。" },
  { icon: IconPlusIcPublicPaperclip, text: "建议上传设备告警截图或日志文件，单个文件不超过 20MB。" },
  { icon: IconPlusIcPublicCheckmark, text: "涉及生产变更的工单需同步抄送业务负责人。" },
];

function SimpleProgress({ percent }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="aside-progress">
      <div className="aside-progress__track">
        <div className="aside-progress__fill" style={{ width: p + "%" }} />
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
            <IconPlusIcPublicListBullet iconSize="1rem" iconColor={['currentcolor']} className="aside-card__icon" />
            填写完成度
          </h3>
          <span className="aside-card__percent">{progress}%</span>
        </header>
        <SimpleProgress percent={progress} />
        <ul className="aside-checklist">
          {SECTIONS.map(function (s, i) {
            const done = i < doneCount;
            const IconComp = done ? IconPlusIcPublicCheckmark : s.icon;
            return (
              <li className={"aside-checklist__item" + (done ? " aside-checklist__item--done" : "")} key={s.key}>
                <IconComp iconSize="0.875rem" iconColor={['currentcolor']} className="aside-checklist__icon" />
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
            <IconPlusIcPublicInfo iconSize="1rem" iconColor={['currentcolor']} className="aside-card__icon" />
            填写提示
          </h3>
        </header>
        <ul className="aside-tips">
          {FILL_TIPS.map(function (t, i) {
            const IconComp = t.icon;
            return (
              <li className="aside-tips__item" key={i}>
                <IconComp iconSize="0.875rem" iconColor={['currentcolor']} className="aside-tips__icon" />
                <span>{t.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} className="aside-card__icon" />
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
