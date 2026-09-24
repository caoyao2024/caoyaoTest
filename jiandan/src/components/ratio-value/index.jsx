import { Icon } from "../../shared/icon.jsx";

const RATIO_TONE = [
  { min: 100, tone: "success" },
  { min: 90, tone: "critical" },
];

function toneOf(ratio) {
  const hit = RATIO_TONE.find((item) => ratio >= item.min);
  return hit ? hit.tone : "error";
}

function RatioValue({ ratio, trend, polarity }) {
  const value = Number(ratio) || 0;
  const delta = Number(trend) || 0;
  const improving = polarity === "lower" ? delta < 0 : delta > 0;
  const trendIcon = delta === 0 ? "minus" : delta > 0 ? "trending-up" : "trending-down";
  const trendTone = delta === 0 ? "flat" : improving ? "good" : "bad";

  return (
    <div className="ratio-value">
      <span className={"ratio-value__pct ratio-value__pct--" + toneOf(value)}>
        {value.toFixed(1)}%
      </span>
      <span className={"ratio-value__trend ratio-value__trend--" + trendTone}>
        <Icon name={trendIcon} size={12} />
        {Math.abs(delta).toFixed(1)}%
      </span>
    </div>
  );
}

export default RatioValue;
