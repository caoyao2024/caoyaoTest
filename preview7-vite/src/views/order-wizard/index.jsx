import { useState } from "react";
import { IconPlusIcDigitalPowerDpFile, IconPlusIcPublicClipboard, IconPlusIcPublicDisk, IconPlusIcPublicLeftArrow, IconPlusIcPublicPlus, IconPlusIcPublicRightArrow, IconPlusIcPublicScopeDot, IconPlusIcPublicSend, IconPlusIcPublicSuccess, IconPlusIcPublicVoiceCall } from '@nce/icon-plus';
import Steps from "@nce/eview-react/Steps";
import Button from "@nce/eview-react/Button";
import dayjs from "dayjs";
import StepCustomer from "./step-customer.jsx";
import StepService from "./step-service.jsx";
import StepAccess from "./step-access.jsx";
import StepConfirm from "./step-confirm.jsx";
import {
  serviceTypeOptions,
  productOptions,
  provinceOptions,
  getCities,
  labelOf,
  draftOrders,
} from "../../mock/order.js";
import "./index.css";

// TODO(eview-react): ProgressBar 未覆盖，当前手写最小可用版
function SimpleProgress({ percent }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ height: "8px", background: "var(--hover, rgba(0,0,0,0.05))", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ width: `${p}%`, height: "100%", background: "var(--primary, #0067D1)", transition: "width .2s" }} />
    </div>
  );
}

const STEPS_DATA = [
  { text: "客户信息", value: 0, description: "主体与联系人" },
  { text: "业务信息", value: 1, description: "产品与规格" },
  { text: "接入信息", value: 2, description: "地址与预约" },
  { text: "确认提交", value: 3, description: "信息与协议" },
];

const REQUIRED = {
  0: [
    ["custName", "请输入客户名称"],
    ["custType", "请选择客户类型"],
    ["certType", "请选择证件类型"],
    ["certNo", "请输入证件号码"],
    ["contactName", "请输入联系人姓名"],
    ["contactPhone", "请输入联系电话"],
  ],
  1: [
    ["product", "请选择产品套餐"],
    ["bandwidth", "请选择带宽规格"],
    ["accessMode", "请选择接入方式"],
    ["contract", "请选择合约期限"],
    ["quantity", "请输入申请数量"],
  ],
  2: [
    ["province", "请选择所属省份"],
    ["city", "请选择所属城市"],
    ["address", "请输入安装地址"],
    ["appointDate", "请选择预约安装日期"],
    ["siteName", "请输入现场联系人"],
    ["sitePhone", "请输入现场联系电话"],
  ],
  3: [
    ["invoiceTitle", "请输入发票抬头"],
    ["taxNo", "请输入纳税人识别号"],
  ],
};

const PHONE_RE = /^1[3-9]\d{9}$/;

const initialForm = {
  // 客户信息
  custName: "",
  custType: undefined,
  certType: "uscc",
  certNo: "",
  industry: undefined,
  manager: undefined,
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  custRemark: "",
  // 业务信息
  serviceType: "leased",
  product: undefined,
  bandwidth: undefined,
  accessMode: undefined,
  contract: undefined,
  quantity: 1,
  sla: "standard",
  needStaticIp: false,
  staticIpCount: 1,
  annualFee: undefined,
  serviceDesc: "",
  // 接入信息
  province: undefined,
  city: undefined,
  address: "",
  room: undefined,
  survey: "need",
  appointDate: null,
  appointSlot: undefined,
  siteName: "",
  sitePhone: "",
  buildRemark: "",
  // 确认提交
  invoiceType: "special",
  invoiceTitle: "",
  taxNo: "",
  extraDemand: "",
  agree: false,
};

const PROGRESS_KEYS = [
  "custName",
  "custType",
  "certNo",
  "contactName",
  "contactPhone",
  "product",
  "bandwidth",
  "accessMode",
  "contract",
  "province",
  "city",
  "address",
  "appointDate",
  "siteName",
  "sitePhone",
];

function validateStep(idx, form) {
  const errs = {};
  REQUIRED[idx].forEach(([key, msg]) => {
    const v = form[key];
    if (v === undefined || v === null || v === "" || (typeof v === "string" && !v.trim())) {
      errs[key] = msg;
    }
  });
  if (idx === 0 && form.contactPhone && !PHONE_RE.test(form.contactPhone)) {
    errs.contactPhone = "请输入有效的 11 位手机号";
  }
  if (idx === 2 && form.sitePhone && !PHONE_RE.test(form.sitePhone)) {
    errs.sitePhone = "请输入有效的 11 位手机号";
  }
  if (idx === 1 && form.needStaticIp && (!form.staticIpCount || form.staticIpCount < 1)) {
    errs.staticIpCount = "固定 IP 数量至少为 1";
  }
  if (idx === 3 && !form.agree) {
    errs.agree = "请阅读并同意服务协议后再提交";
  }
  return errs;
}

export default function OrderWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [savedAt, setSavedAt] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderNo, setOrderNo] = useState("");

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const goNext = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS_DATA.length - 1));
  };

  const goPrev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = () => {
    const errs = validateStep(3, form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setOrderNo("EB" + dayjs().format("YYYYMMDDHHmmss"));
    setSubmitted(true);
  };

  const saveDraft = () => {
    setSavedAt(dayjs().format("HH:mm:ss"));
  };

  const reset = () => {
    setForm(initialForm);
    setErrors({});
    setStep(0);
    setSubmitted(false);
    setSavedAt("");
  };

  if (submitted) {
    const addressText = [
      labelOf(provinceOptions, form.province),
      labelOf(getCities(form.province), form.city),
      form.address,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div className="wizard">
        <section className="card success-card">
          <span className="success-icon">
            <IconPlusIcPublicSuccess iconSize="3rem" iconColor={['var(--success)']} />
          </span>
          <h1 className="success-title">申请提交成功</h1>
          <p className="success-desc">
            工单号 <strong>{orderNo}</strong>，受理人员将在 1 个工作日内与您联系，请保持电话畅通。
          </p>
          <dl className="success-list">
            <div className="success-row">
              <dt>客户名称</dt>
              <dd>{form.custName || "—"}</dd>
            </div>
            <div className="success-row">
              <dt>产品套餐</dt>
              <dd>{labelOf(productOptions, form.product) || "—"}</dd>
            </div>
            <div className="success-row">
              <dt>安装地址</dt>
              <dd>{addressText || "—"}</dd>
            </div>
            <div className="success-row">
              <dt>预约时间</dt>
              <dd>{form.appointDate ? form.appointDate.format("YYYY-MM-DD") : "—"}</dd>
            </div>
          </dl>
          <div className="success-actions">
            <Button status="primary" text="查看订单进度" />
            <Button text="返回业务受理列表" />
            <a className="link" href="#again" onClick={(e) => e.preventDefault()}>
              <IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} /> 再提交一单
            </a>
          </div>
        </section>
      </div>
    );
  }

  const filled = PROGRESS_KEYS.filter((k) => {
    const v = form[k];
    return v !== undefined && v !== null && v !== "";
  }).length;
  const percent = Math.round((filled / PROGRESS_KEYS.length) * 100);

  const sideSummary = [
    { label: "客户名称", value: form.custName },
    { label: "业务类型", value: labelOf(serviceTypeOptions, form.serviceType) },
    { label: "产品套餐", value: labelOf(productOptions, form.product) },
    { label: "带宽规格", value: form.bandwidth },
    {
      label: "安装地址",
      value: [labelOf(provinceOptions, form.province), labelOf(getCities(form.province), form.city)]
        .filter(Boolean)
        .join(" "),
    },
    { label: "预约时间", value: form.appointDate ? form.appointDate.format("YYYY-MM-DD") : "" },
  ];

  return (
    <div className="wizard">
      <div className="wizard-head">
        <div className="wizard-head-main">
          <div className="wizard-crumb">
            <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={['currentcolor']} />
            业务受理 / 企业专线开通
          </div>
          <h1 className="wizard-title">企业专线业务开通申请</h1>
          <p className="wizard-sub">按步骤填写客户、业务与接入信息，提交后由装维团队安排勘查与安装。</p>
        </div>
        <span className="draft-badge">
          <IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} />
          {savedAt ? `草稿已保存 ${savedAt}` : "草稿自动保存"}
        </span>
      </div>

      <div className="wizard-body">
        <section className="card wizard-main">
          <div className="wizard-steps">
            <Steps data={STEPS_DATA} currentStep={STEPS_DATA[step]?.value} />
          </div>

          <div className="wizard-panel">
            {step === 0 ? <StepCustomer form={form} update={update} errors={errors} /> : null}
            {step === 1 ? <StepService form={form} update={update} errors={errors} /> : null}
            {step === 2 ? <StepAccess form={form} update={update} errors={errors} /> : null}
            {step === 3 ? <StepConfirm form={form} update={update} errors={errors} /> : null}
          </div>

          <div className="wizard-actions">
            <a className="link" href="#draft" onClick={(e) => { e.preventDefault(); saveDraft(); }}>
              <IconPlusIcPublicDisk iconSize="0.875rem" iconColor={['currentcolor']} /> 保存草稿
            </a>
            <div className="wizard-actions-right">
              {step > 0 ? (
                <Button leftIcon={<IconPlusIcPublicLeftArrow iconSize="0.875rem" iconColor={['currentcolor']} />} text="上一步" onClick={goPrev} />
              ) : null}
              {step < STEPS_DATA.length - 1 ? (
                <Button status="primary" text="下一步" rightIcon={<IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={goNext} />
              ) : (
                <Button status="primary" leftIcon={<IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} />} text="提交申请" onClick={submit} />
              )}
            </div>
          </div>
        </section>

        <aside className="wizard-side">
          <section className="card side-card">
            <div className="side-head">
              <h3 className="side-title">申请进度</h3>
              <span className="side-percent">{percent}%</span>
            </div>
            <SimpleProgress percent={percent} />
            <dl className="summary-list">
              {sideSummary.map((row) => (
                <div className="summary-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd className={row.value ? "" : "is-empty"}>{row.value || "待填写"}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card side-card">
            <h3 className="side-title">办理须知</h3>
            <ul className="notice-list">
              <li>
                <IconPlusIcPublicScopeDot iconSize="0.75rem" iconColor={['currentcolor']} />
                企业客户需提供加盖公章的营业执照复印件及经办人身份证明。
              </li>
              <li>
                <IconPlusIcPublicScopeDot iconSize="0.75rem" iconColor={['currentcolor']} />
                专线开通涉及现场施工，需提前 2 个工作日预约上门时间。
              </li>
              <li>
                <IconPlusIcPublicScopeDot iconSize="0.75rem" iconColor={['currentcolor']} />
                合约期内提前退订需按规定支付违约金，详情见服务协议。
              </li>
            </ul>
            <div className="hotline">
              <IconPlusIcPublicVoiceCall iconSize="1rem" iconColor={['var(--primary)']} />
              <div>
                <div className="hotline-label">政企服务热线</div>
                <div className="hotline-num">10010 转 3</div>
              </div>
            </div>
          </section>

          <section className="card side-card">
            <div className="side-head">
              <h3 className="side-title">最近草稿</h3>
              <a className="link" href="#all" onClick={(e) => e.preventDefault()}>全部</a>
            </div>
            <ul className="draft-list">
              {draftOrders.map((d) => (
                <li className="draft-item" key={d.id}>
                  <div className="draft-main">
                    <span className="draft-name">{d.name}</span>
                    <span className="draft-product">{d.product}</span>
                  </div>
                  <div className="draft-meta">
                    <span className={"pill pill-" + d.status}>{d.statusLabel}</span>
                    <span className="draft-time">{d.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
