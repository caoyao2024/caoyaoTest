// Layer 4: 客户详情抽屉 — 健康分趋势 / 基本信息网格 / 跟进动态时间轴 / 底部转交与跟进操作
import { useState } from "react";
import { IconPlusIcPublicSortDown, IconPlusIcPublicSortUp } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Drawer from "@nce/eview-react/Drawer";
import DivMessage from "@nce/eview-react/DivMessage";
import Chart from "@nce/eview-react/Chart";
import dayjs from "dayjs";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { HEALTH_TREND_LABELS, getCustomerDetail } from "../../mock/dashboard.jsx";
import "./index.css";

function healthTone(score) {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--critical)";
  return "var(--error)";
}

function daysToneClass(daysLeft) {
  if (daysLeft <= 7) return "is-urgent";
  if (daysLeft <= 15) return "is-soon";
  return "is-normal";
}

// TODO(eview-react): Progress 未覆盖，当前手写最小可用版
function SimpleProgress({ percent, color }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ flex: 1, height: "8px", background: "var(--hover, rgba(0,0,0,0.05))", borderRadius: "4px", overflow: "hidden", margin: 0 }}>
      <div style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }} />
    </div>
  );
}

// TODO(eview-react): Timeline 未覆盖，当前手写最小可用版
function SimpleTimeline({ items }) {
  return (
    <ul className="drawer-timeline" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item, index) => (
        <li key={index} className="drawer-timeline-entry" style={{ position: "relative", paddingLeft: "1.5rem", paddingBottom: index < items.length - 1 ? "1rem" : 0 }}>
          <span
            className="drawer-timeline-dot"
            style={{
              position: "absolute", left: 0, top: "0.25rem",
              width: "8px", height: "8px", borderRadius: "50%",
              background: item.color === "red" ? "var(--error)" : item.color === "blue" ? "var(--primary)" : item.color === "green" ? "var(--success)" : "var(--on-surface-variant, #999)",
            }}
          />
          {index < items.length - 1 ? (
            <span style={{ position: "absolute", left: "3px", top: "1rem", bottom: 0, width: "2px", background: "var(--divider, #e0e0e0)" }} />
          ) : null}
          {item.children}
        </li>
      ))}
    </ul>
  );
}

export default function CustomerDrawer() {
  const { drawerCustomerId, closeCustomerDrawer, openFollowUpModal, openTransferModal, isDark } = useApp();
  const [notice, setNotice] = useState(null);
  const detail = drawerCustomerId ? getCustomerDetail(drawerCustomerId) : null;

  const trendRows = detail
    ? HEALTH_TREND_LABELS.map((label, index) => ({ 日期: label, 健康分: detail.healthTrend[index] }))
    : [];

  const infoItems = detail
    ? [
        { label: "CSM 负责人", value: detail.csm, isCsm: true },
        { label: "续约日期", value: dayjs(detail.renewalDate).format("YYYY-MM-DD") },
        { label: "剩余天数", value: `剩 ${detail.daysLeft} 天`, toneClass: daysToneClass(detail.daysLeft) },
        { label: "合同金额", value: `¥${detail.amount.toFixed(1)}万` },
        { label: "活跃账号", value: `${detail.activeAccounts} 个` },
        { label: "最近登录", value: detail.lastLogin },
      ]
    : [];

  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  const handleTransfer = () => {
    if (!detail) return;
    openTransferModal({ customerId: detail.id, customerName: detail.companyName });
    closeCustomerDrawer();
  };

  const handleFollowUp = () => {
    if (!detail) return;
    openFollowUpModal({ mode: "follow", customerId: detail.id });
    closeCustomerDrawer();
  };

  return (
    <>
      <Drawer
        visible={Boolean(drawerCustomerId)}
        onClose={closeCustomerDrawer}
        placement="right"
        width="30rem"
        className="customer-drawer"
        title={
          detail ? (
            <div className="drawer-title">
              <span className="drawer-title-name">{detail.companyName}</span>
              <StatusTag status={detail.status} />
              <span className="drawer-title-industry">{detail.industry}</span>
            </div>
          ) : (
            "客户详情"
          )
        }
      >
        {detail ? (
          <div className="drawer-body">
            <section className="drawer-section">
              <h4 className="drawer-section-title">健康分</h4>
              <div className="drawer-score-row">
                <span className="drawer-score" style={{ color: healthTone(detail.healthScore) }}>
                  {detail.healthScore}
                </span>
                <div className="drawer-score-meta">
                  <span className={`drawer-score-delta ${detail.scoreDelta >= 0 ? "is-up" : "is-down"}`}>
                    {detail.scoreDelta >= 0 ? <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />}
                    较上期 {detail.scoreDelta >= 0 ? "+" : ""}
                    {detail.scoreDelta}
                  </span>
                  <span className="drawer-score-note">健康线 60 分 · 风险线 40 分</span>
                </div>
              </div>
              <SimpleProgress
                percent={detail.healthScore}
                color={healthTone(detail.healthScore)}
              />
              <div className="drawer-chart">
                <Chart
                  name="LineChart"
                  option={{
                    ...chartBase,
                    data: trendRows,
                    xAxis: { data: "日期" },
                    yAxisTitle: "健康分",
                    smooth: true,
                    markLine: { bottom: 60 },
                  }}
                  style={{ height: "10rem" }}
                />
              </div>
            </section>

            <section className="drawer-section">
              <h4 className="drawer-section-title">基本信息</h4>
              <div className="drawer-info-grid">
                {infoItems.map((item) => (
                  <div key={item.label} className="drawer-info-item">
                    <span className="drawer-info-label">{item.label}</span>
                    {item.isCsm ? (
                      <span className="drawer-info-csm">
                        <img className="drawer-info-avatar" src="/uploads/user.png" alt={item.value} />
                        {item.value}
                      </span>
                    ) : (
                      <span className={`drawer-info-value ${item.toneClass || ""}`}>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="drawer-section">
              <h4 className="drawer-section-title">跟进动态</h4>
              <SimpleTimeline
                items={detail.activities.map((activity) => ({
                  color: activity.color,
                  children: (
                    <div className="drawer-timeline-item">
                      <div className="drawer-timeline-head">
                        <span className="drawer-timeline-title">{activity.title}</span>
                        <span className="drawer-timeline-time">{activity.timeText}</span>
                      </div>
                      <p className="drawer-timeline-detail">{activity.detail}</p>
                    </div>
                  ),
                }))}
              />
            </section>

            <div className="drawer-footer">
              <Button text="转交负责人" onClick={handleTransfer} />
              <Button text="创建跟进" status="primary" onClick={handleFollowUp} />
            </div>
          </div>
        ) : null}
      </Drawer>
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </>
  );
}
