// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → context.jsx         (AppProvider: global state + dark mode toggle)
//           form state    → use-form.js        (轻量表单状态：值/校验/必填，不依赖 antd Form)
//   Layer 2 mock data     → mock/              (per-domain files, e.g. device.js / alarm.js)
//   Layer 3 reusable      → components/{name}/ (cross-view, e.g. status-tag / form-field)
//   Layer 4 views         → views/{name}/      (one per tab/section, e.g. work-order-form)
//   Layer 5 layout        → app.jsx            (root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.
// Provider 体系（ConfigProvider + IntlProvider）在 main.jsx，AppProvider 在 main.jsx 包裹。

import { useEffect, useRef, useState } from "react";
import { IconPlusIcPublicAlert } from "@nce/icon-plus";
import Dialog from "@nce/eview-react/Dialog";
import DivMessage from "@nce/eview-react/DivMessage";
import dayjs from "dayjs";
import { useForm } from "./use-form.js";
import PageHeader from "./views/page-header/index.jsx";
import WorkOrderForm from "./views/work-order-form/index.jsx";
import FormAside from "./views/form-aside/index.jsx";
import { orderSchema, orderInitialValues } from "./views/work-order-form/schema.js";
import {
  sampleValues,
  requiredKeys,
  workOrderTypes,
  priorities,
  teams,
  assignees,
  devices,
} from "./mock/workOrder.js";
import "./styles/app.css";

function computeProgress(values) {
  const filled = requiredKeys.filter(function (key) {
    const v = values[key];
    if (v === undefined || v === null || v === "" || v === false) return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }).length;
  return Math.round((filled / requiredKeys.length) * 100);
}

function labelOf(list, value) {
  const hit = list.find(function (item) { return item.value === value; });
  return hit ? hit.text : "—";
}

export default function App() {
  const form = useForm(orderSchema, orderInitialValues);
  const [progress, setProgress] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [summary, setSummary] = useState({});
  const startNewRef = useRef(false);
  const [toast, setToast] = useState({ key: 0, display: false, type: "success", text: "" });

  useEffect(function () {
    setProgress(computeProgress(form.values));
  }, [form.values]);

  function notify(type, text) {
    setToast({ key: toast.key + 1, display: true, type: type, text: text });
  }

  function handleFill() {
    form.setValues(
      Object.assign({}, sampleValues, { dueTime: dayjs().add(1, "day").hour(18).minute(0).second(0).toDate() })
    );
    notify("success", "已填充示例数据，请按实际情况调整后提交");
  }

  function handleSaveDraft() {
    notify("success", "草稿已保存，可在“我的工单 - 草稿箱”中继续填写");
  }

  function handleCancel() {
    form.reset();
    notify("default", "已清空表单内容");
  }

  function focusField(name) {
    const el = document.getElementById(name);
    if (!el) return;
    if (el.scrollIntoView) el.scrollIntoView({ block: "center", behavior: "smooth" });
    try {
      el.focus({ preventScroll: true });
    } catch (e) {
      /* 部分控件不支持 focus，忽略 */
    }
  }

  function submit(startNew) {
    const result = form.validate();
    if (!result.ok) {
      notify("error", "表单存在未填写或格式有误的必填项，请检查标红字段");
      focusField(result.firstError);
      return;
    }
    setSummary(result.values);
    startNewRef.current = !!startNew;
    setConfirmOpen(true);
  }

  function handleConfirmed() {
    setConfirmOpen(false);
    if (startNewRef.current) {
      form.reset();
      notify("success", "工单已提交，已为你打开新的空白工单");
    } else {
      notify("success", "工单已提交，处理进展将通过短信与邮件通知");
    }
  }

  const summaryRows = [
    { label: "工单标题", value: summary.title || "—", full: true },
    { label: "工单类型", value: labelOf(workOrderTypes, summary.type) },
    { label: "优先级", value: labelOf(priorities, summary.priority) },
    { label: "期望完成时间", value: summary.dueTime ? dayjs(summary.dueTime).format("YYYY-MM-DD HH:mm") : "—" },
    { label: "计划工时", value: summary.planHours ? summary.planHours + " 小时" : "—" },
    { label: "关联设备", value: labelOf(devices, summary.device) },
    { label: "指派团队", value: labelOf(teams, summary.team) },
    { label: "处理人", value: labelOf(assignees, summary.assignee) },
    {
      label: "联系人",
      value: summary.contactName ? summary.contactName + " · " + (summary.contactPhone || "") : "—",
    },
  ];

  return (
    <div className="page-shell">
      <DivMessage key={toast.key} display={toast.display} type={toast.type}>
        {toast.text}
      </DivMessage>

      <PageHeader
        onFill={handleFill}
        onReset={handleCancel}
        onSave={handleSaveDraft}
        onSubmit={function () { submit(false); }}
        onSubmitAndNew={function () { submit(true); }}
      />

      <div className="page-body">
        <main className="page-form-card">
          <WorkOrderForm
            form={form}
            onCancel={handleCancel}
            onSaveDraft={handleSaveDraft}
            onSubmit={submit}
          />
        </main>

        <aside className="page-aside">
          <FormAside progress={progress} />
        </aside>
      </div>

      <Dialog
        isOpen={confirmOpen}
        title="提交工单确认"
        size={[620, "auto"]}
        onClose={function () { setConfirmOpen(false); }}
        buttons={[
          { text: "再检查一下", onClick: function () { setConfirmOpen(false); } },
          { text: "确认提交", status: "primary", onClick: handleConfirmed },
        ]}
      >
        <p className="confirm-lead">
          <IconPlusIcPublicAlert iconSize="1rem" iconColor={["currentcolor"]} />
          提交后工单将进入审批流，标题、优先级与关联设备不可直接修改。
        </p>
        <div className="confirm-grid">
          {summaryRows.map(function (row) {
            return (
              <div className={"confirm-grid__row" + (row.full ? " confirm-grid__row--full" : "")} key={row.label}>
                <span className="confirm-grid__label">{row.label}</span>
                <span className="confirm-grid__value">{row.value}</span>
              </div>
            );
          })}
        </div>
      </Dialog>
    </div>
  );
}
