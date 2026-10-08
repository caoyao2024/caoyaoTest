// Layer 4: 多步受理表单 — 步骤编排 / 受控数据 / 分步校验 / 底部操作栏
import { useState } from "react";
import Steps from '@nce/eview-react/Steps';
import Button from '@nce/eview-react/Button';
import Dialog from '@nce/eview-react/Dialog';
import DivMessage from '@nce/eview-react/DivMessage';
import {
  IconPlusIcPublicCheckmark,
  IconPlusIcPublicCloud,
  IconPlusIcPublicInfo,
  IconPlusIcPublicRightArrow,
  IconPlusIcPublicDownload,
  IconPlusIcPublicLeftArrow,
} from '@nce/icon-plus';
import {
  stepItems,
  plans,
  addons,
  INSTALL_FEE,
  TAX_RATE,
} from "../../mock/order.jsx";
import StepCustomer from "../step-customer/index.jsx";
import StepProduct from "../step-product/index.jsx";
import StepInstall from "../step-install/index.jsx";
import StepFee from "../step-fee/index.jsx";
import StepConfirm from "../step-confirm/index.jsx";
import OrderAside from "../order-aside/index.jsx";
import "./index.css";

const INITIAL_DATA = {
  // step 1
  customerType: "personal",
  customerName: "",
  certType: "idcard",
  certNo: "",
  phone: "",
  email: "",
  address: "",
  enterpriseName: "",
  contactPerson: "",
  // step 2
  productType: "fusion",
  planId: "",
  contractPeriod: "24",
  subCards: 1,
  addons: [],
  // step 3
  installAddress: "",
  installTime: null,
  accessType: "ftth",
  opticalModem: "hn8145xr",
  installMode: "onsite",
  // step 4
  payMethod: "alipay",
  invoiceType: "personal",
  coupon: "",
  // step 5
  remark: "",
  agree: false,
};

function validateStep(step, data) {
  const e = {};
  if (step === 0) {
    if (data.customerType === "enterprise" && !data.enterpriseName.trim()) {
      e.enterpriseName = "请输入单位名称";
    }
    if (!data.customerName.trim()) e.customerName = "请输入客户姓名";
    if (!data.certNo.trim()) e.certNo = "请输入证件号码";
    else if (data.certType === "idcard" && !/^\d{17}[\dXx]$/.test(data.certNo.trim())) {
      e.certNo = "身份证号应为 18 位";
    }
    if (!data.phone.trim()) e.phone = "请输入联系电话";
    else if (!/^1[3-9]\d{9}$/.test(data.phone.trim())) e.phone = "手机号格式不正确";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      e.email = "邮箱格式不正确";
    }
  }
  if (step === 1) {
    if (!data.planId) e.planId = "请选择要订购的套餐";
  }
  if (step === 2) {
    if (!data.installAddress.trim()) e.installAddress = "请输入装机地址";
    if (!data.installTime) e.installTime = "请选择预约上门时间";
  }
  if (step === 3) {
    if (!data.payMethod) e.payMethod = "请选择支付方式";
  }
  if (step === 4) {
    if (!data.agree) e.agree = "请阅读并勾选业务办理协议";
  }
  return e;
}

const SUB_CARD_FEE = 10;

function computeFee(data) {
  const plan = plans.find((p) => p.id === data.planId) || null;
  const addonList = addons.filter((a) => data.addons.includes(a.id));
  const base = plan ? plan.price : 0;
  const addonSum = addonList.reduce((s, a) => s + a.price, 0);
  const subCardFee = (data.subCards || 0) * SUB_CARD_FEE;
  const monthly = base + addonSum + subCardFee;
  const installFee = plan && plan.type !== "mobile" ? INSTALL_FEE : 0;
  const tax = Math.round(monthly * TAX_RATE * 100) / 100;
  const save = plan ? plan.original - plan.price : 0;
  const firstMonth = monthly + installFee;
  return { plan, addonList, base, addonSum, subCardFee, monthly, installFee, tax, save, firstMonth };
}

export default function OrderForm() {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [notice, setNotice] = useState(null);

  const fee = computeFee(data);

  function setField(key, value) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    setNotice(null);
  }

  function notify(type, text) {
    setNotice({ type, text, key: Date.now() });
  }

  function goNext() {
    const e = validateStep(current, data);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setCurrent((c) => Math.min(c + 1, stepItems.length - 1));
  }

  function goPrev() {
    setErrors({});
    setCurrent((c) => Math.max(c - 1, 0));
  }

  function saveDraft() {
    notify("success", "草稿已保存，可稍后继续受理");
  }

  function submit() {
    for (let s = 0; s < stepItems.length; s += 1) {
      const e = validateStep(s, data);
      if (Object.keys(e).length) {
        setCurrent(s);
        setErrors(e);
        notify("error", "请完善必填信息后再提交");
        return;
      }
    }
    setOrderNo(`GD20261008-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setSubmitted(true);
  }

  function resetAll() {
    setData(INITIAL_DATA);
    setErrors({});
    setCurrent(0);
    setSubmitted(false);
  }

  const stepProps = { data, setField, errors };

  return (
    <div className="order-page">
      <div className="order-head">
        <div className="order-head-text">
          <h1 className="order-title">融合业务受理</h1>
          <p className="order-sub">新建工单 · 客户入网与产品开通一站式办理</p>
        </div>
        <div className="order-head-meta">
          <span className="order-no">
            工单号：<b>{orderNo || "DRAFT-20261008-0042"}</b>
          </span>
          <span className="order-save">
            <IconPlusIcPublicCloud iconSize="0.875rem" iconColor={['currentcolor']} />
            草稿自动保存
          </span>
        </div>
      </div>

      <div className="order-layout">
        <div className="order-main">
          <section className="order-card steps-card">
            <Steps data={stepItems} currentStep={stepItems[current].value} />
          </section>

          <section className="order-card form-card">
            {current === 0 ? <StepCustomer {...stepProps} /> : null}
            {current === 1 ? <StepProduct {...stepProps} /> : null}
            {current === 2 ? <StepInstall {...stepProps} /> : null}
            {current === 3 ? <StepFee {...stepProps} fee={fee} /> : null}
            {current === 4 ? <StepConfirm {...stepProps} fee={fee} /> : null}
          </section>

          <div className="order-footer">
            <div className="order-footer-hint">
              <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} />
              提交后系统将自动核验资源并进入装维派单流程
            </div>
            <div className="order-footer-actions">
              <Button
                text="保存草稿"
                leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />}
                onClick={saveDraft}
              />
              <Button
                text="上一步"
                disabled={current === 0}
                leftIcon={<IconPlusIcPublicLeftArrow iconSize="0.875rem" iconColor={['currentcolor']} />}
                onClick={goPrev}
              />
              {current < stepItems.length - 1 ? (
                <Button
                  status="primary"
                  text="下一步"
                  rightIcon={<IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />}
                  onClick={goNext}
                />
              ) : (
                <Button
                  status="primary"
                  text="提交工单"
                  leftIcon={<IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={['currentcolor']} />}
                  onClick={submit}
                />
              )}
            </div>
          </div>
        </div>

        <OrderAside current={current} data={data} fee={fee} />
      </div>

      <Dialog
        isOpen={submitted}
        title="工单提交成功"
        onClose={() => setSubmitted(false)}
        size={[480, "auto"]}
        buttons={[
          { text: "查看工单详情", onClick: () => setSubmitted(false) },
          { text: "继续受理新工单", status: "primary", onClick: resetAll },
        ]}
      >
        <div className="order-success">
          <span className="order-success-icon">
            <IconPlusIcPublicCheckmark iconSize="2rem" iconColor={['currentcolor']} />
          </span>
          <div className="order-success-body">
            <p className="order-success-title">
              工单号 <b>{orderNo}</b> 已创建
            </p>
            <p className="order-success-desc">
              客户 {data.customerName || "—"} 的
              {fee.plan ? `「${fee.plan.name}」` : "所选套餐"} 开通申请已受理，
              系统将进行资源核验并在 4 小时内安排装维上门。
            </p>
            <p className="order-success-desc">
              首月应付 <b>¥{fee.firstMonth.toFixed(2)}</b>，次月起 ¥{fee.monthly.toFixed(2)}/月。
            </p>
          </div>
        </div>
      </Dialog>

      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            enableDisposeTimeOut={notice.type !== "error"}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </div>
  );
}
