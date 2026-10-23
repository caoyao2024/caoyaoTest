// Layer 4: ② 今日概览 — 4 张指标小卡（环比箭头 + 语义色，与订单数据实时联动，可点击跳转对应页签）
import Icon from "@/shared/Icon";
import { IconPlusIcPublicSortDown, IconPlusIcPublicSortUp } from '@hui/icon-plus';
import "./index.css";

export default function OverviewCards({ cards, onCardClick }) {
  return (
    <div className="ov-grid">
      {cards.map((c) => (
        <div
          className={onCardClick ? "ov-card ov-click" : "ov-card"}
          key={c.key}
          onClick={onCardClick ? () => onCardClick(c.key) : undefined}
          title="点击查看对应订单"
        >
          <div className="ov-head">
            <span className={`ov-icon ov-${c.tone}`}>
              <Icon name={c.icon} size="1rem" />
            </span>
            <span className="ov-title">{c.title}</span>
          </div>
          <div className="ov-value">{c.value}</div>
          <div className={`ov-trend ${c.trendGood ? "ov-good" : "ov-bad"}`}>
            {c.trendUp ? <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />}
            <span className="ov-pct">{c.trendText}</span>
            <span className="ov-vs">较昨日</span>
          </div>
        </div>
      ))}
    </div>
  );
}
