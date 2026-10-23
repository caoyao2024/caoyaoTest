// Layer 4: ③ 状态页签 — eview-react Tab + 数量角标（切换联动、当前页签高亮）
import Tab, { TabItem } from "@nce/eview-react/Tab";
import "./index.css";

export default function StatusTabs({ tabs, active, onChange }) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.key === active)
  );

  return (
    <div className="status-tabs">
      <Tab
        selectedIndex={activeIndex}
        draggable={false}
        onClick={(index) => {
          const t = tabs[index];
          if (t) onChange(t.key);
        }}
      >
        {tabs.map((t) => (
          <TabItem
            key={t.key}
            title={
              <span className="stab">
                {t.label}
                <span className="stab-count">{t.count}</span>
              </span>
            }
          />
        ))}
      </Tab>
    </div>
  );
}
