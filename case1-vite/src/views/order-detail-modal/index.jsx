// Layer 4: 订单详情弹窗 — 主表格 / 售后队列共用入口（含订单进度时间轴）
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import Dialog from "@nce/eview-react/Dialog";
import Timeline from "@/shared/Timeline";
import { CATEGORY_STYLE, fmtMoney, maskPhone, waitingMinutesToText } from "../../mock/order.jsx";
import { OrderStatusTag } from "../../components/status-tag/index.jsx";
import "./index.css";

// 订单进度时间轴（依据状态推导流转节点）
function buildOrderFlow(order) {
  const base = dayjs(order.createdAt);
  const t = (d, h, m) => base.add(d, "day").hour(h).minute(m).format("MM-DD HH:mm");
  const paid = order.status !== "pendingPayment";
  const shipped = ["shipped", "completed", "aftersale"].includes(order.status);
  const signed = order.status === "completed" || order.status === "aftersale";
  const items = [
    {
      key: "created",
      color: "green",
      title: "订单创建",
      time: order.createdAt,
      desc: `买家提交订单 · ${order.payMethod}`,
    },
  ];
  if (paid) {
    items.push({
      key: "paid",
      color: "green",
      title: "支付成功",
      time: base.add(5, "minute").format("MM-DD HH:mm"),
      desc: `实付 ¥${fmtMoney(order.paidAmount)}`,
    });
  } else {
    items.push({ key: "paid", color: "gray", title: "待付款", time: "—" });
  }
  if (shipped) {
    items.push({ key: "shipped", color: "green", title: "商家已发货", time: t(1, 9, 30) });
  } else {
    items.push({ key: "shipped", color: "gray", title: "待发货", time: "—" });
  }
  if (signed) {
    items.push({ key: "signed", color: "green", title: "已签收", time: t(2, 12, 30) });
  } else if (shipped) {
    items.push({
      key: "signed",
      color: "blue",
      title: `物流进行中（${order.logistics}）`,
      time: "—",
    });
  } else {
    items.push({ key: "signed", color: "gray", title: "待签收", time: "—" });
  }
  return items;
}

export default function OrderDetailModal({ order, onClose }) {
  const totalQty = order ? order.items.reduce((s, x) => s + x.qty, 0) : 0;

  return (
    <Dialog
      isOpen={!!order}
      title={order ? `订单详情 · ${order.orderNo}` : ""}
      size={[640, "auto"]}
      onClose={onClose}
      buttons={[
        { text: "关闭", status: "primary", onClick: onClose },
      ]}
    >
      {order && (
        <div className="odm">
          <div className="odm-grid">
            <div className="odm-cell">
              <span className="odm-k">订单状态</span>
              <OrderStatusTag status={order.status} timeout={order.shippingTimeout} />
            </div>
            <div className="odm-cell">
              <span className="odm-k">实付金额</span>
              <span className="odm-amount">¥{fmtMoney(order.paidAmount)}</span>
            </div>
            <div className="odm-cell">
              <span className="odm-k">下单时间</span>
              <span>{order.createdAt}</span>
            </div>
            <div className="odm-cell">
              <span className="odm-k">支付方式</span>
              <span>{order.payMethod}</span>
            </div>
            <div className="odm-cell">
              <span className="odm-k">物流状态</span>
              <span className={order.logistics === "异常" ? "odm-logi-error" : ""}>
                {order.logistics}
              </span>
            </div>
            <div className="odm-cell">
              <span className="odm-k">预约配送</span>
              <span>
                {order.deliverySlot[0]} - {order.deliverySlot[1]}
              </span>
            </div>
            <div className="odm-cell">
              <span className="odm-k">收货人</span>
              <span>
                {order.receiver}（{maskPhone(order.phone)}）
              </span>
            </div>
            <div className="odm-cell odm-cell-wide">
              <span className="odm-k">收货地址</span>
              <span>{order.address}</span>
            </div>
            {order.remark && (
              <div className="odm-cell odm-cell-wide">
                <span className="odm-k">订单备注</span>
                <span>{order.remark}</span>
              </div>
            )}
          </div>

          {order.aftersale && (
            <div className="odm-aftersale">
              <span className="odm-k">售后申请</span>
              <span>
                {order.aftersale.type} · {order.aftersale.reason} · 已等待{" "}
                {waitingMinutesToText(order.aftersale.waitingMinutes)}
              </span>
            </div>
          )}

          <div className="odm-flow">
            <div className="odm-goods-title">订单进度</div>
            <Timeline
              className="odm-tl"
              items={buildOrderFlow(order).map((it) => ({
                key: it.key,
                color: it.color,
                children: (
                  <div className="odm-tl-item">
                    <div className="odm-tl-head">
                      <span className="odm-tl-title">{it.title}</span>
                      <span className="odm-tl-time">{it.time}</span>
                    </div>
                    {it.desc && <div className="odm-tl-desc">{it.desc}</div>}
                  </div>
                ),
              }))}
            />
          </div>

          <div className="odm-goods">
            <div className="odm-goods-title">
              商品清单（{order.items.length} 种 / 共 {totalQty} 件）
            </div>
            {order.items.map((x) => {
              const cat = CATEGORY_STYLE[x.cat];
              return (
                <div className="odm-goods-row" key={x.name}>
                  <span className="odm-thumb" style={{ background: cat.bg, color: cat.text }}>
                    {cat.icon}
                  </span>
                  <span className="odm-goods-info">
                    <span className="odm-goods-name">{x.name}</span>
                    <span className="odm-goods-spec">
                      {x.spec} · ¥{fmtMoney(x.price)}/件
                    </span>
                  </span>
                  <span className="odm-goods-qty">×{x.qty}</span>
                  <span className="odm-goods-sum">¥{fmtMoney(x.price * x.qty)}</span>
                </div>
              );
            })}
            <div className="odm-goods-total">
              <span>商品总额</span>
              <span className="odm-amount">¥{fmtMoney(order.paidAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
