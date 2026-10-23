// Layer 4: 右侧栏 — 快捷操作 4 入口：新建跟进 / 发起回访唤起全局跟进弹窗，提交工单 / 拉群为本地表单弹窗
import { useEffect, useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import DivMessage from "@nce/eview-react/DivMessage";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import RadioGroup from "@nce/eview-react/RadioGroup";
import TextField from "@/shared/TextField";
import TextArea from "@/shared/TextArea";
import Select from "@/shared/Select";
import SectionCard from "../../components/section-card/index.jsx";
import { useApp } from "../../context.jsx";
import "../../components/form-sheet/index.css";
import {
  QUICK_ACTIONS,
  TEAM_MEMBERS,
  TICKET_PRIORITIES,
  getAllCustomerOptions,
  getCustomerName,
} from "../../mock/dashboard.jsx";
import "./index.css";

const INITIAL_TICKET_FORM = { customerId: null, priority: "medium", title: "", description: "" };
const INITIAL_GROUP_FORM = { customerId: null, members: ["林晚晴"], groupName: "" };

// 提交工单弹窗（本地表单）
function TicketModal({ open, onClose, notify }) {
  const [form, setForm] = useState(INITIAL_TICKET_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(INITIAL_TICKET_FORM);
      setErrors({});
    }
  }, [open]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!form.customerId) nextErrors.customerId = "请选择关联客户";
    if (!form.title.trim()) nextErrors.title = "请填写工单标题";
    if (!form.description.trim()) nextErrors.description = "请描述问题";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const ticketNo = 4810 + (form.title.length % 80);
    notify("success", `工单已提交（编号 #${ticketNo}），已同步至支持团队（演示）`);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      isOpen={open}
      title="提交工单"
      onClose={handleClose}
      size={["30rem", "auto"]}
      buttons={[
        { text: "取消", onClick: handleClose },
        { text: "提交", status: "primary", onClick: handleSubmit },
      ]}
    >
      <form className="form-sheet" onSubmit={(event) => event.preventDefault()}>
        <div className="form-row">
          <label className="form-label required" htmlFor="tk-customer">关联客户</label>
          <div className="form-field">
            <Select
              id="tk-customer"
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
          <span className="form-label required">优先级</span>
          <div className="form-field">
            <RadioGroup
              isControlled
              data={TICKET_PRIORITIES.map((p) => ({ text: p.label, value: p.value }))}
              value={form.priority}
              onChange={(a, b) => setField("priority", a === form.priority ? b : a)}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label required" htmlFor="tk-title">工单标题</label>
          <div className="form-field">
            <TextField
              id="tk-title"
              placeholder="一句话概括问题"
              style={{ width: "100%" }}
              maxLength={40}
              value={form.title}
              onChange={(value) => setField("title", value)}
            />
            {errors.title ? <div className="form-error">{errors.title}</div> : null}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label required" htmlFor="tk-desc">问题描述</label>
          <div className="form-field">
            <TextArea
              id="tk-desc"
              rows={3}
              placeholder="补充问题现象、影响范围与期望"
              style={{ width: "100%" }}
              maxLength={200}
              value={form.description}
              onChange={(value) => setField("description", value)}
            />
            {errors.description ? <div className="form-error">{errors.description}</div> : null}
          </div>
        </div>
      </form>
    </Dialog>
  );
}

// 拉群弹窗（本地表单）
function GroupModal({ open, onClose, notify }) {
  const [form, setForm] = useState(INITIAL_GROUP_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(INITIAL_GROUP_FORM);
      setErrors({});
    }
  }, [open]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // 选择客户后自动带入群名称
  const handleCustomerChange = (value) => {
    setForm((prev) => ({
      ...prev,
      customerId: value,
      groupName: prev.groupName || `${getCustomerName(value)}-服务群`,
    }));
    setErrors((prev) => ({ ...prev, customerId: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!form.customerId) nextErrors.customerId = "请选择拉群客户";
    if (form.members.length === 0) nextErrors.members = "请至少选择一位群成员";
    if (!form.groupName.trim()) nextErrors.groupName = "请填写群名称";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    notify("success", `群「${form.groupName}」已创建，含客户对接人与 ${form.members.length} 名内部成员（演示）`);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      isOpen={open}
      title="发起客户群"
      onClose={handleClose}
      size={["30rem", "auto"]}
      buttons={[
        { text: "取消", onClick: handleClose },
        { text: "创建群聊", status: "primary", onClick: handleSubmit },
      ]}
    >
      <form className="form-sheet" onSubmit={(event) => event.preventDefault()}>
        <div className="form-row">
          <label className="form-label required" htmlFor="gp-customer">拉群客户</label>
          <div className="form-field">
            <Select
              id="gp-customer"
              defaultLabel="搜索并选择客户"
              style={{ width: "100%" }}
              value={form.customerId}
              onChange={handleCustomerChange}
              options={getAllCustomerOptions().map((opt) => ({ value: opt.value, text: opt.label }))}
            />
            {errors.customerId ? <div className="form-error">{errors.customerId}</div> : null}
          </div>
        </div>

        <div className="form-row">
          <span className="form-label required">内部成员</span>
          <div className="form-field">
            <CheckboxGroup
              data={TEAM_MEMBERS.map((member) => ({ text: member.name, value: member.name }))}
              value={form.members}
              onChange={(value) => setField("members", value)}
            />
            {errors.members ? <div className="form-error">{errors.members}</div> : null}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label required" htmlFor="gp-name">群名称</label>
          <div className="form-field">
            <TextField
              id="gp-name"
              placeholder="如：xx科技-服务保障群"
              style={{ width: "100%" }}
              maxLength={30}
              value={form.groupName}
              onChange={(value) => setField("groupName", value)}
            />
            {errors.groupName ? <div className="form-error">{errors.groupName}</div> : null}
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default function QuickActions() {
  const { openFollowUpModal } = useApp();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const handleQuickAction = (action) => {
    if (action.key === "new-follow-up") {
      openFollowUpModal({ mode: "follow" });
      return;
    }
    if (action.key === "call-back") {
      openFollowUpModal({ mode: "callback" });
      return;
    }
    if (action.key === "submit-ticket") {
      setTicketModalOpen(true);
      return;
    }
    setGroupModalOpen(true);
  };

  return (
    <>
      <SectionCard className="quick-card" title="快捷操作" subtitle="高频动作一键发起">
        <div className="quick-grid">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.key}
              type="button"
              className="quick-item"
              onClick={() => handleQuickAction(action)}
            >
              <span className="quick-icon">
                {action.icon}
              </span>
              <span className="quick-label">{action.label}</span>
            </button>
          ))}
        </div>
      </SectionCard>
      <TicketModal open={ticketModalOpen} onClose={() => setTicketModalOpen(false)} notify={notify} />
      <GroupModal open={groupModalOpen} onClose={() => setGroupModalOpen(false)} notify={notify} />
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
