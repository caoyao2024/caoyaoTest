// Layer 4: 操作动态 — 团队今日操作流水（随页面动作实时追加）
import Icon from "@/shared/Icon";
import { IconPlusIcPublicListBullet } from '@hui/icon-plus';
import "./index.css";

const TONE_CLASS = {
  info: "al-i info",
  success: "al-i success",
  error: "al-i error",
  none: "al-i",
};

export default function ActivityLog({ items }) {
  return (
    <div className="al">
      <div className="al-head">
        <span className="al-title">
          <IconPlusIcPublicListBullet iconSize="1rem" iconColor={['currentcolor']} />
          今日操作动态
        </span>
        <span className="al-count">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="al-empty">今日暂无操作记录</div>
      ) : (
        <div className="al-list">
          {items.map((a) => (
            <div className="al-item" key={a.id}>
              <span className={TONE_CLASS[a.tone] || TONE_CLASS.none}>
                <Icon name={a.icon} size="0.75rem" />
              </span>
              <span className="al-text">{a.text}</span>
              <span className="al-time">{a.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
