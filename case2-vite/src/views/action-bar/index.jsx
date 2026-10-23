import { useState } from "react";
import { IconPlusIcBpitFlag, IconPlusIcDigitalPowerDpApprove, IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicAlert, IconPlusIcPublicCopy, IconPlusIcPublicDisk, IconPlusIcPublicEllipsis, IconPlusIcPublicProhibitCircle, IconPlusIcPublicSend } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import TextArea from "@/shared/TextArea";
import Select from "@/shared/Select";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import DivMessage from "@nce/eview-react/DivMessage";
import StatusTag from "../../components/status-tag/index.jsx";
import { formatMoney } from "../../mock/casePool.js";
import "./index.css";

const REJECT_TARGETS = ["定损评估", "资料核验"];
const COUNTERSIGN_TARGETS = ["组长 · 郑楠", "资深专员 · 高翔", "人伤专家 · 孙倩"];

// ⑥ 底部操作栏：驳回（danger + 必填原因）/ 暂存（按钮态变化）/ 提交下一环节 / 更多操作
export default function ActionBar({
  claim,
  locked,
  lockStatus,
  savedAt,
  remainingText,
  remainingHot,
  urgent,
  transferred,
  onBeforeReject,
  onReject,
  onSave,
  onSubmit,
  onToggleUrgent,
  onTransfer,
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState("定损评估");
  const [reasonError, setReasonError] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferTo, setTransferTo] = useState(COUNTERSIGN_TARGETS[0]);
  const [transferNote, setTransferNote] = useState("");
  const [notice, setNotice] = useState(null);

  const openReject = () => {
    if (locked) return;
    // 驳回同样依赖必填的审批意见（驳回记录需归档审批意见）
    if (onBeforeReject && !onBeforeReject()) return;
    setRejectReason("");
    setReasonError("");
    setRejectTarget("定损评估");
    setRejectOpen(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      setReasonError("驳回原因为必填项，请填写后再确认");
      return;
    }
    setRejectOpen(false);
    onReject({ reason: rejectReason.trim(), target: rejectTarget });
  };

  const openTransfer = () => {
    if (locked) return;
    setTransferTo(COUNTERSIGN_TARGETS[0]);
    setTransferNote("");
    setTransferOpen(true);
  };

  const confirmTransfer = () => {
    setTransferOpen(false);
    onTransfer({ to: transferTo, note: transferNote.trim() });
  };

  const copyClaimNo = async () => {
    try {
      await navigator.clipboard.writeText(claim.claimNo);
      setNotice({ type: "success", text: "案件号已复制：" + claim.claimNo, key: Date.now() });
    } catch (e) {
      setNotice({ type: "default", text: "案件号：" + claim.claimNo, key: Date.now() });
    }
  };

  const handleMoreClick = (evt) => {
    const serialno = evt.value;
    if (serialno === "transfer") openTransfer();
    else if (serialno === "urgent") onToggleUrgent();
    else if (serialno === "copy") copyClaimNo();
  };

  const savedText = savedAt
    ? "已暂存 " + savedAt.toLocaleTimeString("zh-CN", { hour12: false })
    : "暂存";

  const moreOptions = [
    { id: "transfer", text: "转交组长会签", serialno: "transfer", iconUrl: <IconPlusIcDigitalPowerDpApprove iconSize="0.875rem" iconColor={['currentcolor']} />, disable: locked },
    { id: "urgent", text: urgent ? "取消加急" : "标记加急", serialno: "urgent", iconUrl: <IconPlusIcBpitFlag iconSize="0.875rem" iconColor={['currentcolor']} />, disable: locked },
    { id: "copy", text: "复制案件号", serialno: "copy", iconUrl: <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];

  return (
    <footer className="action-bar">
      <div className="ab-left">
        {locked ? (
          <>
            <StatusTag type={lockStatus.type} text={lockStatus.text} />
            <span className="ab-hint">{lockStatus.hint}</span>
          </>
        ) : (
          <>
            <StatusTag type="brand" text="审批中" />
            {urgent && <StatusTag type="critical" text="加急" dot={false} />}
            {transferred && <StatusTag type="info" text={"会签中 · " + transferred.to} dot={false} />}
            <span className={remainingHot ? "ab-hint ab-hint--hot" : "ab-hint"}>
              当前环节：审批决策 · 剩余处理时限 {remainingText}
            </span>
          </>
        )}
      </div>

      <div className="ab-right">
        <PopUpMenu options={moreOptions} onClick={handleMoreClick} direction="top">
          <Button leftIcon={<IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />} text="更多" />
        </PopUpMenu>
        <Button status="risk" leftIcon={<IconPlusIcPublicProhibitCircle iconSize="0.875rem" iconColor={['currentcolor']} />} disabled={locked} onClick={openReject} text="驳回" />
        <Button
          leftIcon={savedAt ? <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicDisk iconSize="0.875rem" iconColor={['currentcolor']} />}
          disabled={locked || !!savedAt}
          onClick={onSave}
          text={savedText}
        />
        <Button
          status="primary"
          leftIcon={<IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} />}
          disabled={locked}
          onClick={onSubmit}
          text="提交下一环节"
        />
      </div>

      {/* 驳回确认弹窗 */}
      <Dialog
        title="驳回确认"
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        size={[520, 'auto']}
        buttons={[
          { text: "取消", onClick: () => setRejectOpen(false) },
          { text: "确认驳回", status: "risk", onClick: confirmReject },
        ]}
      >
        <div className="reject-case-line">
          案件 {claim.claimNo} · 涉案金额 {formatMoney(claim.claimAmount)}
        </div>
        <div className="reject-warn">
          <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} className="reject-warn-icon" />
          <span>驳回后案件将退回所选环节重新处理，本次审批记录自动归档，处理人将收到整改通知。</span>
        </div>
        <div className="reject-form">
          <div className="form-field">
            <label className="form-label required" htmlFor="f-reject-reason">
              驳回原因
            </label>
            <div className="form-control">
              <TextArea
                id="f-reject-reason"
                rows={3}
                maxLength={200}
                value={rejectReason}
                onChange={(value) => {
                  setRejectReason(value);
                  if (reasonError) setReasonError("");
                  setNotice(null);
                }}
                placeholder="请说明驳回原因（将随通知发送给处理人）"
              />
              {reasonError && <div className="form-error">{reasonError}</div>}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label required" htmlFor="f-reject-target">
              驳回至环节
            </label>
            <div className="form-control">
              <Select
                id="f-reject-target"
                value={rejectTarget}
                onChange={(v) => { setRejectTarget(v); setNotice(null); }}
                style={{ width: "100%" }}
                options={REJECT_TARGETS.map((t) => ({ value: t, text: t }))}
              />
            </div>
          </div>
        </div>
      </Dialog>

      {/* 转交会签弹窗 */}
      <Dialog
        title="转交会签"
        isOpen={transferOpen}
        onClose={() => setTransferOpen(false)}
        size={[480, 'auto']}
        buttons={[
          { text: "取消", onClick: () => setTransferOpen(false) },
          { text: "确认转交", status: "primary", onClick: confirmTransfer },
        ]}
      >
        <div className="reject-case-line">
          案件 {claim.claimNo} · 涉案金额 {formatMoney(claim.claimAmount)}
        </div>
        <div className="reject-form">
          <div className="form-field">
            <label className="form-label required" htmlFor="f-transfer-to">
              会签人
            </label>
            <div className="form-control">
              <Select
                id="f-transfer-to"
                value={transferTo}
                onChange={(v) => { setTransferTo(v); setNotice(null); }}
                style={{ width: "100%" }}
                options={COUNTERSIGN_TARGETS.map((t) => ({ value: t, text: t }))}
              />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="f-transfer-note">
              转交备注
            </label>
            <div className="form-control">
              <TextArea
                id="f-transfer-note"
                rows={2}
                maxLength={100}
                value={transferNote}
                onChange={(value) => { setTransferNote(value); setNotice(null); }}
                placeholder="补充会签关注点（选填）"
              />
            </div>
          </div>
        </div>
      </Dialog>

      {notice && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
    </footer>
  );
}
