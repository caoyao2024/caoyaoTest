// Layer 3: 状态标签 — 订单状态 5 种语义色 + Tag 内嵌图标 + 售后类型标签（antd Tag + 语义色 token）
// 超时未发货的「待发货」Tag 内部图标切换为警示钟，提示内嵌不外挂
import Tag from "@/shared/Tag";
import { IconPlusIcBpitHelpful, IconPlusIcCarShipping, IconPlusIcPublicAlarmClock, IconPlusIcPublicBox, IconPlusIcPublicCheckmark, IconPlusIcPublicClock } from '@hui/icon-plus';
import "./index.css";

export const ORDER_STATUS_META = {
  pendingPayment: { label: "待付款", kind: "warning", icon: <IconPlusIcPublicClock iconSize="0.75rem" iconColor={['currentcolor']} className="st-icon" /> },
  pendingShipment: { label: "待发货", kind: "alert", icon: <IconPlusIcPublicBox iconSize="0.75rem" iconColor={['currentcolor']} className="st-icon" /> },
  shipped: { label: "已发货", kind: "info", icon: <IconPlusIcCarShipping iconSize="0.75rem" iconColor={['currentcolor']} className="st-icon" /> },
  completed: { label: "已完成", kind: "success", icon: <IconPlusIcPublicCheckmark iconSize="0.75rem" iconColor={['currentcolor']} className="st-icon" /> },
  aftersale: { label: "售后中", kind: "error", icon: <IconPlusIcBpitHelpful iconSize="0.75rem" iconColor={['currentcolor']} className="st-icon" /> },
};

export function OrderStatusTag({ status, timeout }) {
  const meta = ORDER_STATUS_META[status];
  if (!meta) return <Tag className="st">未知</Tag>;
  const isTimeout = !!timeout && status === "pendingShipment";
  return (
    <Tag
      className={`st st-${meta.kind}`}
      title={isTimeout ? "超时未发货，请优先处理" : undefined}
    >
      {isTimeout ? <IconPlusIcPublicAlarmClock iconSize="0.75rem" iconColor={['currentcolor']} className="st-icon" /> : meta.icon}
      {meta.label}
    </Tag>
  );
}

export function AftersaleTypeTag({ type }) {
  return <Tag className={`st ${type === "仅退款" ? "st-purple" : "st-cyan"}`}>{type}</Tag>;
}
