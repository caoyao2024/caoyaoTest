// Layer 4: 受理侧栏 — 进度 / 资费预估 / 办理须知 / 最近工单
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicChart, IconPlusIcPublicMoneyCircle, IconPlusIcDigitalPowerDpTips, IconPlusIcPublicClipboard } from '@nce/icon-plus';
import StatusTag from "../../components/status-tag/index.jsx";
import { orderNotices, recentOrders, stepItems } from "../../mock/order.jsx";
import "./index.css";

// TODO(eview-react): ProgressBar 未覆盖，当前手写最小可用版
function SimpleProgress({ percent }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="simple-progress">
      <div className="simple-progress-track">
        <div className="simple-progress-fill" style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

export default function OrderAside({ current, data, fee }) {
  const money = (n) => `¥${Number(n || 0).toFixed(2)}`;
  const percent = Math.round(((current + 1) / stepItems.length) * 100);

  return (
    <aside className="order-aside">
      <section className="aside-card">
        <div className="aside-card-head">
          <span className="aside-card-title">
            <IconPlusIcPublicChart iconSize="1rem" iconColor={['currentcolor']} />
            办理进度
          </span>
          <span className="aside-progress-num">{percent}%</span>
        </div>
        <SimpleProgress percent={percent} />
        <ul className="progress-steps">
          {stepItems.map((s, i) => (
            <li
              key={s.text}
              className={`progress-step${i < current ? " done" : ""}${i === current ? " active" : ""}`}
            >
              <span className="progress-step-dot">
                {i < current ? <IconPlusIcDigitalPowerDpCheck iconSize="0.625rem" iconColor={['currentcolor']} /> : i + 1}
              </span>
              <span className="progress-step-text">{s.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="aside-card">
        <div className="aside-card-head">
          <span className="aside-card-title">
            <IconPlusIcPublicMoneyCircle iconSize="1rem" iconColor={['currentcolor']} />
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
            <IconPlusIcDigitalPowerDpTips iconSize="1rem" iconColor={['currentcolor']} />
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
