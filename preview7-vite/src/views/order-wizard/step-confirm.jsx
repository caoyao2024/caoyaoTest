import TextField from "@/shared/TextField";
import { IconPlusIcPublicBox, IconPlusIcPublicInvoice, IconPlusIcPublicLocation, IconPlusIcPublicPerson } from '@nce/icon-plus';
import TextArea from "@nce/eview-react/TextArea";
import RadioGroup from "@nce/eview-react/RadioGroup";
import Checkbox from "@nce/eview-react/Checkbox";
import FormField from "../../components/form-field/index.jsx";
import {
  customerTypeOptions,
  industryOptions,
  certTypeOptions,
  serviceTypeOptions,
  productOptions,
  bandwidthOptions,
  accessModeOptions,
  contractOptions,
  slaOptions,
  surveyOptions,
  appointSlotOptions,
  invoiceTypeOptions,
  provinceOptions,
  getCities,
  roomOptions,
  labelOf,
} from "../../mock/order.js";

function SummaryGroup({ icon, title, rows }) {
  return (
    <div className="confirm-group">
      <h4 className="confirm-title">
        {icon}
        {title}
      </h4>
      <dl className="confirm-list">
        {rows.map((row) => (
          <div className="confirm-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd className={row.value ? "" : "is-empty"}>{row.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// 步骤四 — 确认提交
export default function StepConfirm({ form, update, errors }) {
  const val = (v) => (v === undefined || v === null || v === "" ? "" : v);

  const address = [labelOf(provinceOptions, form.province), labelOf(getCities(form.province), form.city), form.address]
    .filter(Boolean)
    .join(" ");

  const customerRows = [
    { label: "客户名称", value: val(form.custName) },
    { label: "客户类型", value: labelOf(customerTypeOptions, form.custType) },
    { label: "证件类型", value: labelOf(certTypeOptions, form.certType) },
    { label: "证件号码", value: val(form.certNo) },
    { label: "所属行业", value: labelOf(industryOptions, form.industry) },
    { label: "联系人", value: val(form.contactName) },
    { label: "联系电话", value: val(form.contactPhone) },
    { label: "电子邮箱", value: val(form.contactEmail) },
  ];

  const serviceRows = [
    { label: "业务类型", value: labelOf(serviceTypeOptions, form.serviceType) },
    { label: "产品套餐", value: labelOf(productOptions, form.product) },
    { label: "带宽规格", value: labelOf(bandwidthOptions, form.bandwidth) },
    { label: "接入方式", value: labelOf(accessModeOptions, form.accessMode) },
    { label: "申请数量", value: form.quantity ? `${form.quantity} 条` : "" },
    { label: "合约期限", value: labelOf(contractOptions, form.contract) },
    { label: "服务等级", value: labelOf(slaOptions, form.sla) },
    { label: "固定 IP", value: form.needStaticIp ? `${form.staticIpCount} 个` : "动态分配" },
    { label: "预计年费", value: form.annualFee ? `¥ ${form.annualFee}` : "" },
  ];

  const accessRows = [
    { label: "安装地址", value: address },
    { label: "接入机房", value: labelOf(roomOptions, form.room) },
    {
      label: "预约时间",
      value: form.appointDate
        ? `${form.appointDate.format("YYYY-MM-DD")} ${labelOf(appointSlotOptions, form.appointSlot)}`
        : "",
    },
    { label: "现场联系人", value: val(form.siteName) },
    { label: "现场联系电话", value: val(form.sitePhone) },
    { label: "现场勘查", value: labelOf(surveyOptions, form.survey) },
  ];

  return (
    <div className="confirm-wrap">
      <SummaryGroup icon={<IconPlusIcPublicPerson iconSize="1rem" iconColor={['currentcolor']} />} title="客户信息" rows={customerRows} />
      <SummaryGroup icon={<IconPlusIcPublicBox iconSize="1rem" iconColor={['currentcolor']} />} title="业务信息" rows={serviceRows} />
      <SummaryGroup icon={<IconPlusIcPublicLocation iconSize="1rem" iconColor={['currentcolor']} />} title="接入信息" rows={accessRows} />

      <div className="confirm-group">
        <h4 className="confirm-title">
          <IconPlusIcPublicInvoice iconSize="1rem" iconColor={['currentcolor']} />
          发票与附加信息
        </h4>
        <div className="form-grid confirm-form">
          <FormField label="发票类型" required htmlFor="invoiceType">
            <RadioGroup
              id="invoiceType"
              isControlled
              data={invoiceTypeOptions}
              value={form.invoiceType}
              onChange={(a, b) => { const next = a === form.invoiceType ? b : a; update("invoiceType", next); }}
            />
          </FormField>

          <FormField label="发票抬头" required htmlFor="invoiceTitle" error={errors.invoiceTitle}>
            <TextField
              id="invoiceTitle"
              value={form.invoiceTitle}
              placeholder="请输入发票抬头（须与客户名称一致）"
              onChange={(value) => update("invoiceTitle", value)}
              style={{ width: "100%" }}
            />
          </FormField>

          <FormField label="纳税人识别号" required htmlFor="taxNo" error={errors.taxNo}>
            <TextField
              id="taxNo"
              value={form.taxNo}
              placeholder="请输入纳税人识别号"
              onChange={(value) => update("taxNo", value)}
              style={{ width: "100%" }}
            />
          </FormField>

          <FormField label="附加需求" htmlFor="extraDemand" full>
            <TextArea
              id="extraDemand"
              value={form.extraDemand}
              rows={3}
              maxLength={200}
              placeholder="如发票寄送地址、合同编号关联等信息"
              onChange={(value) => update("extraDemand", value)}
            />
          </FormField>
        </div>

        <div className="agree-block">
          <Checkbox
            value="agree"
            checked={form.agree}
            onChange={(_value, checked) => update("agree", checked)}
            label={<>我已阅读并同意<a className="link" href="#agreement" onClick={(e) => e.preventDefault()}>《政企业务服务协议》</a>与<a className="link" href="#security" onClick={(e) => e.preventDefault()}>《网络信息安全承诺书》</a></>}
          />
          {errors.agree ? <div className="field-error agree-error">{errors.agree}</div> : null}
        </div>
      </div>
    </div>
  );
}
