// Layer 4: 团队负载 — 底部卡片：5 名 CSM 纵向成员行（头像 / 待办在跟 / 容量进度），按负载分色
import { useState } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import SectionCard from "../../components/section-card/index.jsx";
import { TEAM_WORKLOAD } from "../../mock/dashboard.jsx";
import "./index.css";

function capacityTone(capacity) {
  if (capacity >= 90) return { color: "var(--error)", tone: "is-heavy" };
  if (capacity >= 75) return { color: "var(--critical)", tone: "is-medium" };
  return { color: "var(--success)", tone: "is-light" };
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

export default function TeamWorkload() {
  const [notice, setNotice] = useState(null);

  return (
    <>
      <SectionCard className="team-card" title="团队负载" subtitle="今日在办任务与容量占用">
        <ul className="team-list">
          {TEAM_WORKLOAD.map((member) => {
            const tone = capacityTone(member.capacity);
            return (
              <li
                key={member.name}
                className="team-member"
                onClick={() => setNotice({ type: "default", text: `已打开 ${member.name} 的任务视图（演示）`, key: Date.now() })}
              >
                <span className="team-member-id">
                  <img className="team-member-avatar" src="/uploads/user.png" alt={member.name} />
                  <span className="team-member-text">
                    <span className="team-member-name">{member.name}</span>
                    <span className="team-member-role">{member.role}</span>
                  </span>
                </span>
                <span className="team-member-tasks">
                  待办 {member.pendingTasks} · 在跟 {member.activeCustomers}
                </span>
                <span className="team-member-bar">
                  <SimpleProgress percent={member.capacity} color={tone.color} />
                  <span className={`team-member-capacity ${tone.tone}`}>{member.capacity}%</span>
                </span>
              </li>
            );
          })}
        </ul>
      </SectionCard>
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
