import "./Timeline.css";

const COLOR_MAP = {
  green: "var(--success, #62B42E)",
  gray: "var(--on-surface-variant, #999)",
  blue: "var(--primary, #0067D1)",
  red: "var(--error, #E02128)",
};

export default function Timeline({ items, className }) {
  return (
    <div className={`app-timeline ${className || ""}`}>
      {items.map((item, i) => (
        <div className="app-timeline-item" key={item.key || i}>
          <div className="app-timeline-axis">
            <span
              className="app-timeline-dot"
              style={{ background: COLOR_MAP[item.color] || COLOR_MAP.gray }}
            />
            {i < items.length - 1 && <span className="app-timeline-line" />}
          </div>
          <div className="app-timeline-content">{item.children}</div>
        </div>
      ))}
    </div>
  );
}
