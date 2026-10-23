// Layer 4: 转交负责人弹窗 — 支持单个客户（表格行 / 抽屉）与批量客户（表格多选）
import { useEffect, useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import DivMessage from "@nce/eview-react/DivMessage";
import TextField from "@/shared/TextField";
import TextArea from "@/shared/TextArea";
import Select from "@/shared/Select";
import { useApp } from "../../context.jsx";
import "../../components/form-sheet/index.css";
import { TEAM_MEMBERS, getCustomerDetail } from "../../mock/dashboard.jsx";
import "./index.css";

const INITIAL_FORM = { owner: null, reason: "", note: "" };

export default function TransferModal() {
  const { transferModal, closeTransferModal } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);

  // 当前负责人（单客户转交时从档案读取，避免转给自己）
  const currentCsm = transferModal.customerId
    ? (getCustomerDetail(transferModal.customerId) || {}).csm
    : null;

  const ownerOptions = TEAM_MEMBERS
    .filter((member) => member.name !== currentCsm)
    .map((member) => ({ value: member.name, text: `${member.name}（${member.role}）` }));

  useEffect(() => {
    if (transferModal.open) {
      setForm(INITIAL_FORM);
      setErrors({});
    }
  }, [transferModal]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!form.owner) nextErrors.owner = "请选择新负责人";
    if (!form.reason.trim()) nextErrors.reason = "请填写转交原因";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setNotice({ type: "success", text: `已将「${transferModal.customerName}」转交给 ${form.owner}（演示）`, key: Date.now() });
    closeTransferModal();
  };

  const handleClose = () => {
    closeTransferModal();
  };

  return (
    <>
      <Dialog
        isOpen={transferModal.open}
        title="转交负责人"
        onClose={handleClose}
        size={["30rem", "auto"]}
        buttons={[
          { text: "取消", onClick: handleClose },
          { text: "确认转交", status: "primary", onClick: handleSubmit },
        ]}
      >
        <form className="form-sheet" onSubmit={(event) => event.preventDefault()}>
          <div className="form-row">
            <span className="form-label">转交对象</span>
            <span className="form-static">
              {transferModal.customerName || "—"}
              {currentCsm ? <span className="transfer-current">当前负责人：{currentCsm}</span> : null}
            </span>
          </div>

          <div className="form-row">
            <label className="form-label required" htmlFor="tf-owner">新负责人</label>
            <div className="form-field">
              <Select
                id="tf-owner"
                defaultLabel="选择接手的 CSM"
                style={{ width: "100%" }}
                value={form.owner}
                onChange={(value) => setField("owner", value)}
                options={ownerOptions}
              />
              {errors.owner ? <div className="form-error">{errors.owner}</div> : null}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label required" htmlFor="tf-reason">转交原因</label>
            <div className="form-field">
              <TextField
                id="tf-reason"
                placeholder="如：客户所属行业调整 / 人员变动 / 负载均衡"
                style={{ width: "100%" }}
                maxLength={40}
                value={form.reason}
                onChange={(value) => setField("reason", value)}
              />
              {errors.reason ? <div className="form-error">{errors.reason}</div> : null}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="tf-note">交接备注</label>
            <div className="form-field">
              <TextArea
                id="tf-note"
                rows={3}
                placeholder="补充交接事项与背景（选填）"
                style={{ width: "100%" }}
                maxLength={200}
                value={form.note}
                onChange={(value) => setField("note", value)}
              />
            </div>
          </div>
        </form>
      </Dialog>
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
