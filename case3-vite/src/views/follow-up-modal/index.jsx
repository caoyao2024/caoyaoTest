// Layer 4: 新建跟进 / 发起回访弹窗 — H5 表单骨架 + antd 受控控件（Form.md 校验模式）
import { useEffect, useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import DivMessage from "@nce/eview-react/DivMessage";
import DatePicker from "@/shared/DatePicker";
import TextField from "@/shared/TextField";
import TextArea from "@/shared/TextArea";
import Select from "@/shared/Select";
import { useApp } from "../../context.jsx";
import "../../components/form-sheet/index.css";
import { FOLLOW_UP_WAYS, getAllCustomerOptions, getCustomerName } from "../../mock/dashboard.jsx";
import "./index.css";

const INITIAL_FORM = { customerId: null, way: null, subject: "", nextDate: null, note: "" };

export default function FollowUpModal() {
  const { followUpModal, closeFollowUpModal } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);

  const isCallback = followUpModal.mode === "callback";

  // 打开时按入参初始化：回访默认电话，跟进默认视频会议；带入来源客户
  useEffect(() => {
    if (followUpModal.open) {
      setForm({
        ...INITIAL_FORM,
        customerId: followUpModal.customerId,
        way: isCallback ? "电话回访" : "视频会议",
      });
      setErrors({});
    }
  }, [followUpModal, isCallback]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!form.customerId) nextErrors.customerId = "请选择客户";
    if (!form.way) nextErrors.way = "请选择跟进方式";
    if (!form.subject.trim()) nextErrors.subject = "请填写跟进主题";
    if (!form.nextDate) nextErrors.nextDate = "请选择下次跟进日期";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const actionName = isCallback ? "回访" : "跟进";
    setNotice({ type: "success", text: `已创建对「${getCustomerName(form.customerId)}」的${actionName}任务，方式：${form.way}`, key: Date.now() });
    closeFollowUpModal();
  };

  const handleClose = () => {
    closeFollowUpModal();
  };

  return (
    <>
      <Dialog
        isOpen={followUpModal.open}
        title={isCallback ? "发起回访" : "新建跟进"}
        onClose={handleClose}
        size={["30rem", "auto"]}
        buttons={[
          { text: "取消", onClick: handleClose },
          { text: "提交", status: "primary", onClick: handleSubmit },
        ]}
      >
        <form className="form-sheet" onSubmit={(event) => event.preventDefault()}>
          <div className="form-row">
            <label className="form-label required" htmlFor="fu-customer">客户</label>
            <div className="form-field">
              <Select
                id="fu-customer"
                defaultLabel="搜索并选择客户"
                style={{ width: "100%" }}
                value={form.customerId}
                onChange={(value) => setField("customerId", value)}
                options={getAllCustomerOptions().map((opt) => ({ value: opt.value, text: opt.label }))}
              />
              {errors.customerId ? <div className="form-error">{errors.customerId}</div> : null}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label required" htmlFor="fu-way">跟进方式</label>
            <div className="form-field">
              <Select
                id="fu-way"
                defaultLabel="选择跟进方式"
                style={{ width: "100%" }}
                value={form.way}
                onChange={(value) => setField("way", value)}
                options={FOLLOW_UP_WAYS.map((way) => ({ value: way, text: way }))}
              />
              {errors.way ? <div className="form-error">{errors.way}</div> : null}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label required" htmlFor="fu-subject">跟进主题</label>
            <div className="form-field">
              <TextField
                id="fu-subject"
                placeholder="一句话概括本次跟进目标"
                style={{ width: "100%" }}
                maxLength={40}
                value={form.subject}
                onChange={(value) => setField("subject", value)}
              />
              {errors.subject ? <div className="form-error">{errors.subject}</div> : null}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label required" htmlFor="fu-date">下次跟进日期</label>
            <div className="form-field">
              <DatePicker
                id="fu-date"
                placeholder="选择日期"
                style={{ width: "14rem" }}
                value={form.nextDate}
                onChange={(date) => setField("nextDate", date)}
              />
              {errors.nextDate ? <div className="form-error">{errors.nextDate}</div> : null}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="fu-note">备注</label>
            <div className="form-field">
              <TextArea
                id="fu-note"
                rows={3}
                placeholder="补充客户诉求、待办事项等（选填）"
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
