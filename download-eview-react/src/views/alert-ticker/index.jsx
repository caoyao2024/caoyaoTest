// Layer 4: 实时风险告警轮播条 — 横向轮播 5 条最新风险事件（级别 Tag + 相对时间），支持暂停/上下切换，悬浮自动暂停
import { useEffect, useState } from "react";
import { IconPlusIcPublicAlarm, IconPlusIcPublicLeftArrow, IconPlusIcPublicPause, IconPlusIcPublicPlay, IconPlusIcPublicRightArrow } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";
import { RISK_ALERTS } from "../../mock/dashboard.jsx";
import "./index.css";

const LEVEL_COLORS = {
  紧急: "error",
  高: "orange",
  中: "warning",
};

const ROTATE_INTERVAL = 4000;

export default function AlertTicker() {
  const { openCustomerDrawer } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const total = RISK_ALERTS.length;

  useEffect(() => {
    if (isPaused || isHovered || total <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, isHovered, total]);

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % total);
  const togglePause = () => setIsPaused((paused) => !paused);

  const alert = RISK_ALERTS[currentIndex];

  return (
    <section
      className="alert-ticker"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="alert-ticker-head">
        <span className="alert-live-dot" />
        <IconPlusIcPublicAlarm iconSize="0.875rem" iconColor={['currentcolor']} />
        <span className="alert-ticker-title">实时风险告警</span>
      </div>
      <div className="alert-ticker-stage" key={alert.id}>
        <Tag color={LEVEL_COLORS[alert.level] || "warning"} className="alert-level-tag">
          {alert.level}
        </Tag>
        <span className="alert-event-type">{alert.eventType}</span>
        <span className="alert-title">{alert.title}</span>
        <span className="alert-time">{alert.timeAgo}</span>
        <a
          className="alert-action"
          title="打开客户详情并处理"
          onClick={() => openCustomerDrawer(alert.customerId)}
        >
          立即处理
        </a>
      </div>
      <div className="alert-ticker-controls">
        <span className="alert-index">{currentIndex + 1}/{total}</span>
        <IconPlusIcPublicLeftArrow iconSize="0.875rem" iconColor={['currentcolor']} title="上一条" className="alert-ctrl-icon" onClick={goPrev} />
        {isPaused ? <IconPlusIcPublicPlay iconSize="0.875rem" iconColor={['currentcolor']} title="继续轮播" className={`alert-ctrl-icon ${isPaused ? "is-paused" : ""}`} onClick={togglePause} /> : <IconPlusIcPublicPause iconSize="0.875rem" iconColor={['currentcolor']} title="暂停轮播" className={`alert-ctrl-icon ${isPaused ? "is-paused" : ""}`} onClick={togglePause} />}
        <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} title="下一条" className="alert-ctrl-icon" onClick={goNext} />
      </div>
    </section>
  );
}
