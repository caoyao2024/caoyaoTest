// Layer 4: ⑦ 右侧售后队列 — 待处理售后（同意 / 拒绝需填原因）
import { useState } from "react";
import { IconPlusIcBpitHelpful, IconPlusIcPublicClock } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Empty from "@nce/eview-react/Empty";
import Dialog from "@nce/eview-react/Dialog";
import MessageDialog from "@nce/eview-react/MessageDialog";
import TextArea from "@/shared/TextArea";
import { useNotice } from "@/shared/Notice";
import { fmtMoney, waitingMinutesToText } from "../../mock/order.js";
import { AftersaleTypeTag } from "../../components/status-tag/index.jsx";
import "./index.css";

export default function AftersaleQueue({ items, onResolve, onViewOrder }) {
  const [notify, noticeEl] = useNotice();
  // 拒绝弹窗（H5 表单：原因必填）
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  // 类型筛选
  const [typeFilter, setTypeFilter] = useState("all");
  // 确认弹窗
  const [confirmState, setConfirmState] = useState(null);

  const refundOnly = items.filter((a) => a.type === "仅退款").length;
  const refundReturn = items.length - refundOnly;
  const visibleItems = typeFilter === "all" ? items : items.filter((a) => a.type === typeFilter);

  const approve = (a) => {
    setConfirmState({
      type: "confirm",
      content: `同意「${a.type}」申请？`,
      detail: `订单 ${a.orderNo}（${a.receiver}）将原路退回 ¥${fmtMoney(a.amount)}，同意后售后单自动完结，订单恢复「已完成」。`,
      okText: "同意退款",
      onOk: () => {
        onResolve(a.orderNo, true, "");
        notify("success", `已同意 ${a.orderNo} 售后申请，退款原路退回`);
      },
    });
  };

  const openReject = (a) => {
    setRejectTarget(a);
    setRejectReason("");
    setRejectError("");
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      setRejectError("请填写拒绝原因，将同步通知买家");
      return;
    }
    onResolve(rejectTarget.orderNo, false, rejectReason.trim());
    notify("success", `已拒绝 ${rejectTarget.orderNo} 售后申请，原因已通知买家`);
    setRejectTarget(null);
  };

  return (
    <aside className="afq">
      {noticeEl}
      <div className="afq-head">
        <span className="afq-title">
          <IconPlusIcBpitHelpful iconSize="1rem" iconColor={['currentcolor']} />
          售后处理队列
        </span>
        <span className="afq-count">{items.length}</span>
      </div>
      <div className="afq-filters">
        {[
          { key: "all", label: `全部 ${items.length}` },
          { key: "仅退款", label: `仅退款 ${refundOnly}` },
          { key: "退货退款", label: `退货退款 ${refundReturn}` },
        ].map((f) => (
          <a
            key={f.key}
            className={typeFilter === f.key ? "afq-chip afq-chip-on" : "afq-chip"}
            onClick={() => setTypeFilter(f.key)}
          >
            {f.label}
          </a>
        ))}
      </div>
      <div className="afq-tip">超 24 小时未处理将自动升级至组长</div>
      {visibleItems.length === 0 ? (
        <Empty
          className="afq-empty"
          type="success"
          description={typeFilter === "all" ? "售后已全部处理完毕" : "该类型暂无待处理售后"}
        />
      ) : (
        <div className="afq-list">
          {visibleItems.map((a) => (
            <div className="afq-item" key={a.orderNo}>
              <div className="afq-line">
                <a className="afq-no" onClick={() => onViewOrder(a.orderNo)}>
                  {a.orderNo}
                </a>
                <AftersaleTypeTag type={a.type} />
              </div>
              <div className="afq-line afq-meta">
                <span className="afq-amount">¥{fmtMoney(a.amount)}</span>
                <span className={a.urgent ? "afq-wait afq-urgent" : "afq-wait"}>
                  <IconPlusIcPublicClock iconSize="0.75rem" iconColor={['currentcolor']} />
                  已等待 {waitingMinutesToText(a.waitingMinutes)}
                </span>
              </div>
              <div className="afq-reason" title={a.reason}>
                {a.reason}
              </div>
              <div className="afq-actions">
                <Button status="primary" text="同意" onClick={() => approve(a)} />
                <Button text="拒绝" onClick={() => openReject(a)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 确认弹窗 */}
      <MessageDialog
        type={confirmState?.type || "confirm"}
        isOpen={!!confirmState}
        content={confirmState?.content}
        detail={confirmState?.detail}
        onClose={() => setConfirmState(null)}
        buttons={{
          cancel: { text: "再想想", onClick: () => setConfirmState(null) },
          ok: {
            text: confirmState?.okText || "确认",
            focused: true,
            onClick: () => {
              if (confirmState?.onOk) confirmState.onOk();
              setConfirmState(null);
            },
          },
        }}
      />

      {/* 拒绝原因弹窗 — H5 表单骨架 */}
      <Dialog
        isOpen={!!rejectTarget}
        title={rejectTarget ? `拒绝售后申请 · ${rejectTarget.orderNo}` : ""}
        onClose={() => setRejectTarget(null)}
        size={[560, "auto"]}
        buttons={[
          { text: "取消", onClick: () => setRejectTarget(null) },
          { text: "确认拒绝", status: "risk", onClick: submitReject },
        ]}
      >
        <form
          className="fm"
          onSubmit={(e) => {
            e.preventDefault();
            submitReject();
          }}
        >
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="reject-reason">
              拒绝原因
            </label>
            <TextArea
              id="reject-reason"
              maxLength={80}
              value={rejectReason}
              className={rejectError ? "fm-input-error" : undefined}
              defaultLabel="请填写拒绝原因，将同步通知买家"
              onChange={(val) => {
                setRejectReason(val);
                if (rejectError) setRejectError("");
              }}
            />
            {rejectError && <div className="fm-error">{rejectError}</div>}
          </div>
        </form>
      </Dialog>
    </aside>
  );
}
