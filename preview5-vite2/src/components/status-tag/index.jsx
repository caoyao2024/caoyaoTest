// Layer 3: 工单/业务状态标签 — 统一状态色语义映射
import Tag from "@/shared/tag";
import { orderStatusMap } from "../../mock/order.jsx";
import "./index.css";

export default function StatusTag({ status, showIcon = true }) {
  const conf = orderStatusMap[status] || orderStatusMap.draft;
  return (
    <Tag color={conf.color} className="status-tag">
      {showIcon ? conf.icon : null}
      <span>{conf.text}</span>
    </Tag>
  );
}
