// Layer 3: 客户健康状态标签 — 按级别分色（健康=success / 观察=warning / 风险=error / 流失预警=volcano）
import Tag from "@/shared/Tag";
import { IconPlusIcPublicAlert } from '@hui/icon-plus';
import "./index.css";

const STATUS_CONFIG = {
  健康: { color: "success" },
  观察: { color: "warning" },
  风险: { color: "error" },
  流失预警: { color: "volcano", icon: <IconPlusIcPublicAlert iconSize="0.75rem" iconColor={['currentcolor']} /> },
};

export default function StatusTag({ status }) {
  const config = STATUS_CONFIG[status] || { color: "default" };
  return (
    <Tag color={config.color} className="status-tag">
      {config.icon ? config.icon : null}
      {status}
    </Tag>
  );
}
