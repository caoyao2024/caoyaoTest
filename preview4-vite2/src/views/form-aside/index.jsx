import TipBox from "@nce/eview-react/TipBox";
import { IconPlusIcPublicAlert, IconPlusIcPublicCheckmark, IconPlusIcPublicRightArrow, IconPlusIcPublicAlarmlight, IconPlusIcPublicInfo, IconPlusIcPublicClock, IconPlusIcPublicSecurity } from '@nce/icon-plus';
import PanelCard from "../../components/panel-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import {
  guidelines,
  recentOrders,
  orderStatusMeta,
  priorityMeta,
  approvalNodes,
  metaOf,
} from "../../mock/workorder.jsx";
import "./index.css";

// TODO(eview-react): Progress 无导出，手写环形进度条（SVG stroke-dasharray）
function CircularProgress({ percent, size = 88, strokeColor = "var(--primary)" }) {
  const p = Math.min(100, Math.max(0, percent));
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const dash = (p / 100) * c;
  return (
    <svg width={size} height={size} className="circular-progress" viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--surface-variant)"
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={strokeColor}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.3s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="circular-progress__num"
      >
        {p}%
      </text>
    </svg>
  );
}

// TODO(eview-react): Timeline 无 Reference，手写时间线（节点 + 连线）
function AppTimeline({ items }) {
  return (
    <ol className="app-timeline">
      {items.map((it, i) => (
        <li className="app-timeline__item" key={i}>
          <span className="app-timeline__dot" style={{ background: it.color }} />
          {i < items.length - 1 ? <span className="app-timeline__line" /> : null}
          <div className="app-timeline__content">{it.children}</div>
        </li>
      ))}
    </ol>
  );
}

// Layer 4: 表单右侧辅助区 — 校验进度 / 填报指引 / 最近工单 / 审批流程
export default function FormAside({ checks, onJump, onOpenOrder }) {
  const doneCount = checks.filter((c) => c.ok).length;
  const percent = Math.round((doneCount / checks.length) * 100);
  const pending = checks.filter((c) => !c.ok);

  const timelineItems = approvalNodes.map((node, i) => ({
    color: i === 0 ? "var(--primary)" : "var(--outline)",
    children: (
      <div className="apv-node">
        <span className={`apv-node__title ${i === 0 ? "is-current" : ""}`}>{node.title}</span>
        <span className="apv-node__desc">{node.desc}</span>
        <span className="apv-node__time">{node.time}</span>
      </div>
    ),
  }));

  return (
    <aside className="form-aside">
      <PanelCard
        icon={<IconPlusIcPublicCheckmark iconSize="1rem" iconColor={['currentcolor']} />}
        title="填报校验"
        subtitle={`已通过 ${doneCount} / ${checks.length} 项`}
      >
        <div className="check-progress">
          <CircularProgress
            percent={percent}
            size={88}
            strokeColor={percent === 100 ? "var(--success)" : "var(--primary)"}
          />
          <p className="check-progress__tip">
            {percent === 100
              ? "校验全部通过，可提交工单"
              : `还有 ${pending.length} 项需要完善后才能提交`}
          </p>
        </div>

        <ul className="check-list">
          {checks.map((c) => (
            <li className={`check-item ${c.ok ? "is-ok" : ""}`} key={c.key}>
              <button type="button" className="check-item__btn" onClick={() => onJump(c.target)}>
                {c.ok ? <IconPlusIcPublicCheckmark iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} />}
                <span className="check-item__main">
                  <span className="check-item__label">{c.label}</span>
                  <span className="check-item__hint">{c.hint}</span>
                </span>
                <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />
              </button>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard icon={<IconPlusIcPublicInfo iconSize="1rem" iconColor={['currentcolor']} />} title="填报指引" subtitle="来自《机房巡检作业规范 v3.2》">
        <ol className="guide-list">
          {guidelines.map((g, i) => (
            <li className="guide-item" key={g}>
              <span className="guide-item__no">{i + 1}</span>
              <span className="guide-item__text">{g}</span>
            </li>
          ))}
        </ol>
        <a className="aside-link">
          查看完整规范
          <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />
        </a>
      </PanelCard>

      <PanelCard
        icon={<IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} />}
        title="最近工单"
        subtitle="我参与的近 12 条工单"
        extra={<a className="aside-link aside-link--sm">全部</a>}
      >
        <ul className="order-list">
          {recentOrders.map((o) => (
            <li className="order-item" key={o.id}>
              <button type="button" className="order-item__btn" onClick={() => onOpenOrder(o.id)}>
                <span className="order-item__top">
                  <span className="order-item__title">{o.title}</span>
                  <StatusTag
                    tone={metaOf(orderStatusMeta, o.status).tone}
                    label={metaOf(orderStatusMeta, o.status).label}
                    size="small"
                  />
                </span>
                <span className="order-item__meta">
                  <span className="order-item__id">{o.id}</span>
                  <span className="order-item__dot" />
                  <span>{o.station}</span>
                  <span className="order-item__dot" />
                  <span>{o.time}</span>
                  <span className="order-item__dot" />
                  <span className={`order-item__prio is-${o.priority}`}>
                    {metaOf(priorityMeta, o.priority).label}优先级
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard icon={<IconPlusIcPublicSecurity iconSize="1rem" iconColor={['currentcolor']} />} title="审批流程" subtitle="提交后自动流转">
        <AppTimeline items={timelineItems} />
        <div className="aside-note">
          <TipBox type="simple" content="如需加急，请在提交后联系值班经理" direction="top">
            <span className="aside-note__text">
              <IconPlusIcPublicAlarmlight iconSize="0.875rem" iconColor={['currentcolor']} />
              紧急工单可申请绿色通道，30 分钟内响应
            </span>
          </TipBox>
        </div>
      </PanelCard>
    </aside>
  );
}
