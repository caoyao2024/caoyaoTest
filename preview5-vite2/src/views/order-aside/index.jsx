// Layer 4: 受理侧栏 — 进度 / 资费预估 / 办理须知 / 最近工单
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcIctActivate, IconPlusIcPublicAlarmlight, IconPlusIcPublicBriefcase, IconPlusIcPublicClipboard } from '@nce/icon-plus';
import StatusTag from "../../components/status-tag/index.jsx";
import { orderNotices, recentOrders, stepItems } from "../../mock/order.jsx";
import "./index.css";

export default function OrderAside({ current, data, fee }) {
  const money = (n) => `¥${Number(n || 0).toFixed(2)}`;
  const percent = Math.round(((current + 1) / stepItems.length) * 100);

  return (
    <aside className="order-aside">
      <section className="aside-card">
        <div className="aside-card-head">
          <span className="aside-card-title">
            <IconPlusIcIctActivate iconSize="1rem" iconColor={['currentcolor']} />
            办理进度
          </span>
          <span className="aside-progress-num">{percent}%</span>
        </div>
        <div className="aside-progress">
          <div className="aside-progress-track">
            <div className="aside-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <ul className="progress-steps">
          {stepItems.map((s, i) => (
            <li
              key={s.title}
              className={`progress-step${i < current ? " done" : ""}${i === current ? " active" : ""}`}
            >
              <span className="progress-step-dot">
                {i < current ? <IconPlusIcDigitalPowerDpCheck iconSize="0.625rem" iconColor={['currentcolor']} /> : i + 1}
              </span>
              <span className="progress-step-text">{s.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="aside-card">
        <div className="aside-card-head">
          <span className="aside-card-title">
            <IconPlusIcPublicBriefcase iconSize="1rem" iconColor={['currentcolor']} />
            资费预估
          </span>
        </div>
        <div className="aside-fee">
          <div className="aside-fee-main">
            <span className="aside-fee-num">{money(fee.monthly)}</span>
            <span className="aside-fee-unit">/ 月</span>
          </div>
          <div className="aside-fee-rows">
            <div className="aside-fee-row">
              <span>首月应付</span>
              <b>{money(fee.firstMonth)}</b>
            </div>
            <div className="aside-fee-row">
              <span>增值服务</span>
              <b>{money(fee.addonSum)}</b>
            </div>
            <div className="aside-fee-row">
              <span>安装调测费</span>
              <b>{money(fee.installFee)}</b>
            </div>
          </div>
        </div>
      </section>

      <section className="aside-card">
        <div className="aside-card-head">
          <span className="aside-card-title">
            <IconPlusIcPublicAlarmlight iconSize="1rem" iconColor={['currentcolor']} />
            办理须知
          </span>
        </div>
        <ul className="notice-list">
          {orderNotices.map((n) => (
            <li className="notice-item" key={n.text}>
              {n.icon}
              <span>{n.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="aside-card">
        <div className="aside-card-head">
          <span className="aside-card-title">
            <IconPlusIcPublicClipboard iconSize="1rem" iconColor={['currentcolor']} />
            最近受理工单
          </span>
          <a className="aside-more">全部</a>
        </div>
        <ul className="recent-list">
          {recentOrders.map((o) => (
            <li className="recent-item" key={o.id}>
              <div className="recent-top">
                <span className="recent-customer">{o.customer}</span>
                <StatusTag status={o.status} showIcon={false} />
              </div>
              <div className="recent-product">{o.product}</div>
              <div className="recent-meta">
                <span className="recent-id">{o.id}</span>
                <span className="recent-time">{o.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
