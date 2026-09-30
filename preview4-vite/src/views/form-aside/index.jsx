import { IconPlusIcPublicAlert, IconPlusIcPublicCheckmark, IconPlusIcPublicRightArrow, IconPlusIcPublicWarning } from "@nce/icon-plus";
import TipBox from "@nce/eview-react/TipBox";
import PanelCard from "../../components/panel-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import {
  guidelines,
  recentOrders,
  orderStatusMeta,
  priorityMeta,
  approvalNodes,
  metaOf,
} from "../../mock/workorder.js";
import "./index.css";

// TODO(eview-react): Progress 未覆盖，当前手写圆形进度条
function CircleProgress({ percent, size = 88, color = "var(--primary)" }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const p = Math.min(100, Math.max(0, percent));
  const offset = circumference - (p / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--hover, rgba(0,0,0,0.05))" strokeWidth="8" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .3s" }}
      />
      <text
        x={size / 2}
        y={size / 2 + 6}
        textAnchor="middle"
        style={{ fontSize: "1.1rem", fontWeight: 600, fill: "var(--on-surface, #191919)" }}
      >
        {p}%
      </text>
    </svg>
  );
}

// TODO(eview-react): Timeline 未覆盖，当前手写时间轴
function AppTimeline({ nodes }) {
  return (
    <ol className="apv-timeline">
      {nodes.map((node, i) => (
        <li className={`apv-timeline__item ${i === 0 ? "is-current" : ""}`} key={i}>
          <span
            className="apv-timeline__dot"
            style={{ background: i === 0 ? "var(--primary)" : "var(--outline)" }}
          />
          <div className="apv-node">
            <span className={`apv-node__title ${i === 0 ? "is-current" : ""}`}>{node.title}</span>
            <span className="apv-node__desc">{node.desc}</span>
            <span className="apv-node__time">{node.time}</span>
          </div>
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

  return (
    <aside className="form-aside">
      <PanelCard
        icon="badge-check"
        title="填报校验"
        subtitle={`已通过 ${doneCount} / ${checks.length} 项`}
      >
        <div className="check-progress">
          <CircleProgress
            percent={percent}
            color={percent === 100 ? "var(--success)" : "var(--primary)"}
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

      <PanelCard icon="info" title="填报指引" subtitle="来自《机房巡检作业规范 v3.2》">
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
        icon="clock"
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

      <PanelCard icon="shield-check" title="审批流程" subtitle="提交后自动流转">
        <AppTimeline nodes={approvalNodes} />
        <div className="aside-note">
          <TipBox type="simple" content="如需加急，请在提交后联系值班经理" direction="top">
            <span className="aside-note__text">
              <IconPlusIcPublicWarning iconSize="0.875rem" iconColor={['currentcolor']} />
              紧急工单可申请绿色通道，30 分钟内响应
            </span>
          </TipBox>
        </div>
      </PanelCard>
    </aside>
  );
}
