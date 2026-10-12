import Dialog from "@nce/eview-react/Dialog";
import "./index.css";

// 提交工单确认弹窗：汇总待提交电路，确认后生成工单
export default function SubmitModal({ open, items, totalBandwidth, totalFee, onCancel, onConfirm }) {
  return (
    <Dialog
      title="提交开通工单"
      isOpen={open}
      onClose={onCancel}
      size={[560, "auto"]}
      destroyOnClose
      buttons={[
        { text: "取消", onClick: onCancel },
        { text: "确认提交", status: "primary", onClick: onConfirm },
      ]}
    >
      <div className="modal-note">
        提交后将对以下 <strong>{items.length}</strong> 条电路生成开通工单，进入运营商配置流程。
      </div>
      <div className="modal-summary">
        <div className="modal-summary-item">
          <div className="modal-summary-label">电路条数</div>
          <div className="modal-summary-value">{items.length}</div>
        </div>
        <div className="modal-summary-item">
          <div className="modal-summary-label">总带宽 (Mbps)</div>
          <div className="modal-summary-value">{totalBandwidth}</div>
        </div>
        <div className="modal-summary-item">
          <div className="modal-summary-label">预估月费 (元)</div>
          <div className="modal-summary-value">{totalFee.toLocaleString()}</div>
        </div>
      </div>
      <div className="modal-list">
        {items.map((it) => (
          <div className="modal-list-row" key={it.id}>
            <span className="modal-list-code">{it.code}</span>
            <span className="modal-list-meta">{it.customer}</span>
            <span className="modal-list-meta">{it.bandwidth} · {it.station}</span>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
