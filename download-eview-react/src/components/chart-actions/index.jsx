// Layer 3: 图表卡右上角操作组 — 刷新 | 分隔线 | 设置 + 更多（Icon 组）
import { useState } from "react";
import { IconPlusIcPublicEllipsis, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSetting } from '@hui/icon-plus';
import DivMessage from "@nce/eview-react/DivMessage";
import "./index.css";

export default function ChartActions({ refreshText = "图表数据已刷新" }) {
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const handleRefresh = () => {
    notify("success", refreshText);
  };

  return (
    <>
      <div className="chart-actions">
        <IconPlusIcPublicRefreshClockwise iconSize="1rem" iconColor={['currentcolor']} title="刷新数据" className="chart-action-icon" onClick={handleRefresh} />
        <span className="chart-actions-divider" />
        <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} title="图表设置" className="chart-action-icon" onClick={() => notify("default", "已打开图表设置（演示）")} />
        <IconPlusIcPublicEllipsis iconSize="1rem" iconColor={['currentcolor']} title="更多操作" className="chart-action-icon" onClick={() => notify("default", "已打开更多图表操作（演示）")} />
      </div>
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
