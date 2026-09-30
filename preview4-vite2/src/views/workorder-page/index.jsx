import { useMemo, useState } from "react";
import { IconPlusIcHuaweiCloudNetwork, IconPlusIcPublicCheckmark, IconPlusIcPublicRightArrow, IconPlusIcDigitalPowerTemperature, IconPlusIcPublicFlash } from '@nce/icon-plus';
import Steps from "@nce/eview-react/Steps";
import Dialog from "@nce/eview-react/Dialog";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import dayjs from "dayjs";
import PageHeader from "../page-header/index.jsx";
import WorkorderForm from "../workorder-form/index.jsx";
import FormAside from "../form-aside/index.jsx";
import InspectEntryModal from "../inspect-entry-modal/index.jsx";
import { runValidation, hasErrors, firstErrorId, computeChecks } from "./validate.js";
import { filePool, stationOptions, ownerOptions, orderTypes, priorityOptions } from "../../mock/workorder.jsx";
import "./index.css";

const SECTION_TARGETS = ["wo-section-basic", "wo-items", "wo-acks"];

const STEP_DATA = [
  { text: "基础信息", value: "0", description: "" },
  { text: "巡检明细", value: "1", description: "" },
  { text: "确认提交", value: "2", description: "" },
];

const TEMPLATES = [
  {
    key: "tpl-cooling",
    name: "精密空调例行巡检",
    desc: "温度 / 供电 / 风扇 / 防尘网 4 项，适用于季度巡检",
    icon: <IconPlusIcDigitalPowerTemperature iconSize="1.25rem" iconColor={['currentcolor']} />,
    patch: {
      type: "routine",
      priority: "medium",
      duration: 2,
      description:
        "按季度巡检计划对机房精密空调执行例行检查，重点记录回风温度、供电电流与防尘网清洁度，发现偏差即时记录并上报。",
      items: [
        { device: "DEV-AC-0209", item: "temp", result: "normal", value: 24.5, unit: "℃", note: "回风温度稳定" },
        { device: "DEV-AC-0209", item: "power", result: "normal", value: 18.4, unit: "A", note: "" },
        { device: "DEV-AC-0209", item: "fan", result: "normal", value: 920, unit: "rpm", note: "" },
        { device: "DEV-AC-0209", item: "dust", result: "pending", value: 60, unit: "%", note: "需在下次巡检前更换防尘网" },
      ],
    },
  },
  {
    key: "tpl-power",
    name: "UPS 电源专项检查",
    desc: "电池组容量 / 输出电流 / 告警面板，适用于月度专项",
    icon: <IconPlusIcPublicFlash iconSize="1.25rem" iconColor={['currentcolor']} />,
    patch: {
      type: "fault",
      priority: "high",
      duration: 4,
      description:
        "UPS 电池组容量测试出现容量衰减告警，需现场核查电池组单体电压、连接端子温升，并同步核对告警面板记录。",
      items: [
        { device: "DEV-UPS-0064", item: "power", result: "abnormal", value: 386, unit: "A", note: "输出电流波动 ±12%，需复测" },
        { device: "DEV-UPS-0064", item: "led", result: "pending", value: 1, unit: "℃", note: "告警面板存在历史告警未清除" },
      ],
    },
  },
  {
    key: "tpl-network",
    name: "核心交换机端口巡检",
    desc: "端口误码 / 光功率 / 固件版本，适用于网络变更后验证",
    icon: <IconPlusIcHuaweiCloudNetwork iconSize="1.25rem" iconColor={['currentcolor']} />,
    patch: {
      type: "change",
      priority: "urgent",
      duration: 1.5,
      description:
        "完成核心交换机上行端口扩容割接后的验证巡检，需确认端口误码率、光功率与固件版本一致性，异常端口立即回退。",
      items: [
        { device: "DEV-SW-0231", item: "port", result: "normal", value: -6.4, unit: "dBm", note: "光功率在正常区间" },
        { device: "DEV-SW-0417", item: "port", result: "abnormal", value: -18.2, unit: "dBm", note: "光功率偏低，已更换跳线送测" },
        { device: "DEV-SW-0231", item: "firmware", result: "normal", value: 1, unit: "%", note: "" },
      ],
    },
  },
];

const KIND_BY_EXT = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  xlsx: "sheet",
  xls: "sheet",
  csv: "sheet",
  log: "log",
  pdf: "doc",
  docx: "doc",
};

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function guessKind(name) {
  const ext = String(name).split(".").pop().toLowerCase();
  return KIND_BY_EXT[ext] || "doc";
}

let itemSeq = 3;

function makeInitialForm() {
  return {
    title: "",
    type: "routine",
    priority: "high",
    station: "hz-idc-03",
    owner: "u-1024",
    phone: "",
    ccPersons: ["u-1120", "u-1206"],
    range: null,
    duration: 2.5,
    needCustomerAck: true,
    items: [
      { id: 1, device: "DEV-AC-0209", item: "temp", result: "abnormal", value: 33.6, unit: "℃", note: "" },
      { id: 2, device: "DEV-UPS-0064", item: "power", result: "normal", value: 386, unit: "A", note: "运行平稳" },
    ],
    description: "",
    attachments: [{ name: "现场照片_机柜正面.jpg", size: "2.4 MB", kind: "image" }],
    acks: [],
  };
}

// Layer 4: 工单填报页面 — 状态编排 + 表单 + 校验 + 侧栏
export default function WorkorderPage() {
  const [form, setForm] = useState(makeInitialForm);
  const [errors, setErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [notice, setNotice] = useState(null);

  const checks = useMemo(() => computeChecks(form), [form]);
  const doneCount = checks.filter((c) => c.ok).length;

  const stepFlags = useMemo(() => {
    const ok = (keys) => keys.every((k) => checks.find((c) => c.key === k).ok);
    const g0 = ok(["basic", "schedule"]);
    const g1 = ok(["items", "desc", "attach"]);
    return { g0, g1, g2: ok(["ack"]) };
  }, [checks]);

  const currentStep = !stepFlags.g0 ? 0 : !stepFlags.g1 ? 1 : 2;

  const stationLabel = (stationOptions.find((s) => s.value === form.station) || {}).text;
  const ownerLabel = (ownerOptions.find((o) => o.value === form.owner) || {}).text;
  const typeLabel = (orderTypes.find((t) => t.value === form.type) || {}).text;
  const priorityLabel = (priorityOptions.find((p) => p.value === form.priority) || {}).text;

  const notify = (type, text) => {
    setNotice({ key: Date.now(), type, text });
  };

  const clearKey = (key, prev) => {
    if (!prev[key]) return prev;
    const next = { ...prev };
    delete next[key];
    return next;
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => clearKey(key, prev));
    setDraftSaved(false);
  };

  const setItem = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
    setErrors((prev) => {
      const row = prev.itemErrors ? prev.itemErrors[index] : null;
      if (!row || !row[field]) return prev;
      const itemErrors = prev.itemErrors.map((e, i) => (i === index ? { ...e, [field]: undefined } : e));
      const next = { ...prev, itemErrors };
      if (!itemErrors.some((e) => e && Object.keys(e).some((k) => !!e[k]))) delete next.items;
      return next;
    });
    setDraftSaved(false);
  };

  const addItem = () => {
    itemSeq += 1;
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: itemSeq, device: undefined, item: undefined, result: undefined, value: null, unit: "℃", note: "" },
      ],
    }));
    setErrors({});
    setDraftSaved(false);
  };

  // 弹窗「登记巡检明细」提交的单条记录,追加到明细列表
  const addItemFromModal = (row) => {
    itemSeq += 1;
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...row, id: itemSeq }] }));
    setErrors({});
    setDraftSaved(false);
    setEntryOpen(false);
    notify(
      "success",
      `已登记 1 条巡检明细（${row.result === "abnormal" ? "异常" : row.result === "pending" ? "待复核" : "正常"}），列表已更新`
    );
  };

  const removeItem = (index) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((row, i) => i !== index) }));
    setErrors({});
    setDraftSaved(false);
    notify("default", "已删除该条巡检明细");
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const mapped = files.map((f) => ({
      name: f.name,
      size: formatSize(f.size),
      kind: guessKind(f.name),
    }));
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, ...mapped].slice(0, 5) }));
    setErrors((prev) => clearKey("attachments", prev));
    setDraftSaved(false);
    notify("success", `已添加 ${mapped.length} 个附件`);
  };

  const addSampleFile = () => {
    const sample = filePool[form.attachments.length % filePool.length];
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, sample].slice(0, 5) }));
    setErrors((prev) => clearKey("attachments", prev));
    setDraftSaved(false);
  };

  const removeFile = (index) => {
    setForm((prev) => ({ ...prev, attachments: prev.attachments.filter((f, i) => i !== index) }));
    setDraftSaved(false);
  };

  const toggleAck = (values) => {
    setForm((prev) => ({ ...prev, acks: values }));
    setErrors((prev) => clearKey("acks", prev));
    setDraftSaved(false);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const input = el.matches("input, textarea") ? el : el.querySelector("input, textarea");
    if (input) setTimeout(() => input.focus({ preventScroll: true }), 340);
  };

  const handleSubmit = () => {
    const nextErrors = runValidation(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const flatCount = Object.keys(nextErrors).filter((k) => k !== "itemErrors" && nextErrors[k]).length;
      const rowCount = nextErrors.itemErrors
        ? nextErrors.itemErrors.filter((e) => e && Object.keys(e).some((k) => !!e[k])).length
        : 0;
      notify("error", `校验未通过：${flatCount + rowCount} 处字段需要修正，请检查标红位置`);
      const targetId = firstErrorId(nextErrors);
      if (targetId) setTimeout(() => scrollTo(targetId), 80);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOrderNo(`WO-${dayjs().format("YYYYMMDD")}-${Math.floor(Math.random() * 900) + 100}`);
      setSuccessOpen(true);
      setDraftSaved(true);
    }, 900);
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    notify("success", "草稿已保存，可在「工单中心 - 工单列表 - 草稿」中继续编辑");
  };

  const handleReset = () => {
    setForm(makeInitialForm());
    setErrors({});
    setDraftSaved(false);
    notify("default", "表单已重置为初始状态");
  };

  const applyTemplate = (tpl) => {
    itemSeq += tpl.patch.items.length;
    setForm((prev) => ({
      ...prev,
      ...tpl.patch,
      items: tpl.patch.items.map((row, i) => ({ ...row, id: itemSeq - tpl.patch.items.length + i + 1 })),
    }));
    setErrors({});
    setTemplateOpen(false);
    setDraftSaved(false);
    notify("success", `已套用模板「${tpl.name}」，请核对后补充标题与联系电话`);
  };

  const stepDescriptions = useMemo(() => {
    return STEP_DATA.map((s, i) => ({
      ...s,
      description: i === 0 ? (stepFlags.g0 ? "已完成" : "待完善") : i === 1 ? (stepFlags.g1 ? "已完成" : "待完善") : (stepFlags.g2 ? "已完成" : "待完善"),
    }));
  }, [stepFlags]);

  return (
    <div className="wo-page">
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          enableDisposeTimeOut={notice.type === "error" ? false : true}
          onClose={() => setNotice(null)}
        />
      ) : null}

      <PageHeader
        draftSaved={draftSaved}
        onSaveDraft={handleSaveDraft}
        onOpenTemplate={() => setTemplateOpen(true)}
        onSubmit={handleSubmit}
      />

      <div className="wo-page__steps">
        <Steps
          data={stepDescriptions}
          currentStep={String(currentStep)}
          onClick={(index) => {
            if (index <= currentStep) scrollTo(SECTION_TARGETS[index]);
          }}
        />
      </div>

      <div className="wo-page__body">
        <WorkorderForm
          form={form}
          errors={errors}
          checks={checks}
          setField={setField}
          setItem={setItem}
          addItem={addItem}
          removeItem={removeItem}
          onOpenEntry={() => setEntryOpen(true)}
          addFiles={addFiles}
          addSampleFile={addSampleFile}
          removeFile={removeFile}
          toggleAck={toggleAck}
          scrollTo={scrollTo}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          onReset={handleReset}
        />

        <FormAside
          checks={checks}
          onJump={scrollTo}
          onOpenOrder={(id) => notify("default", `已打开工单 ${id} 的详情抽屉`)}
        />
      </div>

      <Dialog
        isOpen={successOpen}
        title="工单已提交"
        size={[480, "auto"]}
        onClose={() => setSuccessOpen(false)}
        buttons={[
          { text: "继续填报下一张", onClick: () => { setSuccessOpen(false); setForm(makeInitialForm()); setErrors({}); setDraftSaved(false); } },
          { text: "查看工单详情", status: "primary", onClick: () => setSuccessOpen(false) },
        ]}
      >
        <div className="submit-result">
          <span className="submit-result__icon">
            <IconPlusIcPublicCheckmark iconSize="2rem" iconColor={['currentcolor']} />
          </span>
          <p className="submit-result__title">工单 {orderNo} 已进入审批流程</p>
          <ul className="submit-result__list">
            <li>
              <span>工单标题</span>
              <strong>{form.title}</strong>
            </li>
            <li>
              <span>工单类型 / 优先级</span>
              <strong>
                {typeLabel} · {priorityLabel}
              </strong>
            </li>
            <li>
              <span>所属站点</span>
              <strong>{stationLabel}</strong>
            </li>
            <li>
              <span>现场责任人</span>
              <strong>{ownerLabel}</strong>
            </li>
            <li>
              <span>巡检明细 / 附件</span>
              <strong>
                {form.items.length} 条记录 · {form.attachments.length} 个附件
              </strong>
            </li>
            <li>
              <span>预计下发时间</span>
              <strong>班组审核通过后 30 分钟内</strong>
            </li>
          </ul>
        </div>
      </Dialog>

      <InspectEntryModal
        open={entryOpen}
        onCancel={() => setEntryOpen(false)}
        onSubmit={addItemFromModal}
      />

      <Dialog
        isOpen={templateOpen}
        title="套用填报模板"
        size={[560, "auto"]}
        onClose={() => setTemplateOpen(false)}
      >
        <p className="tpl-tip">选择模板后将覆盖巡检明细与描述内容，已填写的基础信息会保留。</p>
        <ul className="tpl-list">
          {TEMPLATES.map((tpl) => (
            <li className="tpl-item" key={tpl.key}>
              <button type="button" className="tpl-item__btn" onClick={() => applyTemplate(tpl)}>
                <span className="tpl-item__icon">
                  {tpl.icon}
                </span>
                <span className="tpl-item__main">
                  <span className="tpl-item__name">{tpl.name}</span>
                  <span className="tpl-item__desc">{tpl.desc}</span>
                </span>
                <IconPlusIcPublicRightArrow iconSize="1rem" iconColor={['currentcolor']} />
              </button>
            </li>
          ))}
        </ul>
      </Dialog>
    </div>
  );
}
