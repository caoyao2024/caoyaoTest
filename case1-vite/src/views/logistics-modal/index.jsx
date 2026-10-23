// Layer 4: 物流轨迹弹窗 — 点击物流状态查看时间轴流转（含异常拦截说明）
import { useState } from "react";
import { IconPlusIcPublicCopy } from '@hui/icon-plus';
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import Dialog from "@nce/eview-react/Dialog";
import Timeline from "@/shared/Timeline";
import { useNotice } from "@/shared/Notice";
import "./index.css";

const waybillOf = (order) => `SF${order.orderNo.replace(/[^0-9]/g, "").slice(-10)}`;

function buildTracking(order) {
  const base = dayjs(order.createdAt);
  const t = (d, h, m) =>
    base.add(d, "day").hour(h).minute(m).format("MM-DD HH:mm");
  const paid = order.status !== "pendingPayment";
  const shipped = ["shipped", "completed", "aftersale"].includes(order.status);
  const signed = order.logistics === "已签收";
  const abnormal = order.logistics === "异常";
  const delivering = order.logistics === "派送中";

  const items = [
    {
      key: "created",
      color: "green",
      title: "订单已提交，商家已接单",
      time: order.createdAt,
      desc: `支付方式：${order.payMethod}`,
    },
  ];

  if (paid) {
    items.push({
      key: "paid",
      color: "green",
      title: "支付成功，款项已到账",
      time: base.add(5, "minute").format("MM-DD HH:mm"),
    });
  } else {
    items.push({ key: "paid", color: "gray", title: "等待买家付款", time: "—" });
  }

  if (shipped) {
    items.push({
      key: "picked",
      color: "green",
      title: "商家已发货，顺丰速运揽收",
      time: t(1, 9, 30),
      desc: `运单号 ${waybillOf(order)}`,
    });
    if (abnormal) {
      items.push({
        key: "transit",
        color: "green",
        title: "运输中 · 到达杭州转运中心",
        time: t(1, 18, 0),
      });
      items.push({
        key: "error",
        color: "red",
        title: "物流异常：安检发现包裹破损，已拦截退回",
        time: t(2, 8, 5),
        desc: "客服已介入，将与买家协商补发或退款",
      });
    } else {
      items.push({
        key: "transit",
        color: signed ? "green" : "blue",
        title: "运输中 · 离开杭州转运中心",
        time: t(1, 18, 0),
      });
    }
  } else {
    items.push({ key: "picked", color: "gray", title: "待发货", time: "—" });
  }

  if (delivering || signed) {
    items.push({
      key: "deliver",
      color: signed ? "green" : "blue",
      title: "派送中 · 快递员张伟 138****5678",
      time: t(2, 8, 15),
    });
  }
  if (signed) {
    items.push({
      key: "sign",
      color: "green",
      title: "已签收 · 本人签收",
      time: t(2, 12, 30),
    });
  }
  return items;
}

export default function LogisticsModal({ order, onClose }) {
  const [copied, setCopied] = useState(false);
  const [notify, noticeEl] = useNotice();

  const copyWaybill = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(waybillOf(order));
    } catch (e) {
      // file:// 下剪贴板 API 可能不可用，静默降级为提示
    }
    setCopied(true);
    notify("success", `运单号 ${waybillOf(order)} 已复制`);
  };

  return (
    <Dialog
      isOpen={!!order}
      title={order ? `物流轨迹 · ${order.orderNo}` : ""}
      size={[560, "auto"]}
      onClose={onClose}
      buttons={[
        { text: "关闭", status: "primary", onClick: onClose },
      ]}
    >
      {noticeEl}
      {order && (
        <div className="lm">
          <div className="lm-head">
            <div className="lm-head-row">
              <span className="lm-k">物流公司</span>
              <span>顺丰速运</span>
            </div>
            <div className="lm-head-row">
              <span className="lm-k">运单号</span>
              <span className="lm-waybill">
                {waybillOf(order)}
                <IconPlusIcPublicCopy iconSize="0.75rem" iconColor={['currentcolor']} className={copied ? "lm-copy lm-copied" : "lm-copy"} />
              </span>
            </div>
            <div className="lm-head-row">
              <span className="lm-k">当前状态</span>
              <span className={order.logistics === "异常" ? "lm-status-error" : ""}>
                {order.logistics}
              </span>
            </div>
            <div className="lm-head-row">
              <span className="lm-k">预约配送</span>
              <span>
                {order.deliverySlot[0]} - {order.deliverySlot[1]}
              </span>
            </div>
          </div>
          <Timeline
            className="lm-tl"
            items={buildTracking(order).map((it) => ({
              key: it.key,
              color: it.color,
              children: (
                <div className="lm-item">
                  <div className="lm-item-head">
                    <span className="lm-item-title">{it.title}</span>
                    <span className="lm-item-time">{it.time}</span>
                  </div>
                  {it.desc && <div className="lm-item-desc">{it.desc}</div>}
                </div>
              ),
            }))}
          />
        </div>
      )}
    </Dialog>
  );
}
