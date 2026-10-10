import TextArea from "@nce/eview-react/TextArea";
import Select from "@/shared/Select";
import RadioGroup from "@nce/eview-react/RadioGroup";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";
import FormField from "../../components/form-field/index.jsx";
import {
  serviceTypeOptions,
  productOptions,
  bandwidthOptions,
  accessModeOptions,
  contractOptions,
  slaOptions,
} from "../../mock/order.js";

// 步骤二 — 业务信息
export default function StepService({ form, update, errors }) {
  return (
    <div className="form-grid">
      <FormField label="业务类型" required error={errors.serviceType} full>
        <RadioGroup
          isControlled
          data={serviceTypeOptions}
          value={form.serviceType}
          onChange={(a, b) => { const next = a === form.serviceType ? b : a; update("serviceType", next); }}
        />
      </FormField>

      <FormField label="产品套餐" required htmlFor="product" error={errors.product}>
        <Select
          id="product"
          value={form.product}
          defaultLabel="请选择产品套餐"
          options={productOptions}
          onChange={(v) => update("product", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="带宽规格" required htmlFor="bandwidth" error={errors.bandwidth}>
        <Select
          id="bandwidth"
          value={form.bandwidth}
          defaultLabel="请选择带宽规格"
          options={bandwidthOptions}
          onChange={(v) => update("bandwidth", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="接入方式" required htmlFor="accessMode" error={errors.accessMode}>
        <Select
          id="accessMode"
          value={form.accessMode}
          defaultLabel="请选择接入方式"
          options={accessModeOptions}
          onChange={(v) => update("accessMode", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="合约期限" required htmlFor="contract" error={errors.contract}>
        <Select
          id="contract"
          value={form.contract}
          defaultLabel="请选择合约期限"
          options={contractOptions}
          onChange={(v) => update("contract", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="申请数量" required htmlFor="quantity" error={errors.quantity}>
        <Spinner
          id="quantity"
          min={1}
          max={50}
          value={form.quantity}
          doNotFocusWhenValueUpdate
          onChange={(v) => update("quantity", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="服务等级 SLA" htmlFor="sla">
        <Select
          id="sla"
          value={form.sla}
          defaultLabel="请选择服务等级"
          options={slaOptions}
          onChange={(v) => update("sla", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="分配固定 IP" htmlFor="needStaticIp">
        <div className="field-inline">
          <Toggle
            id="needStaticIp"
            data={[false, true]}
            toggled={form.needStaticIp}
            onToggle={(v) => update("needStaticIp", v)}
          />
          <span className="field-note">{form.needStaticIp ? "已开启固定 IP 分配" : "默认分配动态 IP"}</span>
        </div>
      </FormField>

      {form.needStaticIp ? (
        <FormField label="固定 IP 数量" required htmlFor="staticIpCount" error={errors.staticIpCount}>
          <Spinner
            id="staticIpCount"
            min={1}
            max={256}
            value={form.staticIpCount}
            doNotFocusWhenValueUpdate
            onChange={(v) => update("staticIpCount", v)}
            style={{ width: "100%" }}
          />
        </FormField>
      ) : null}

      <FormField label="预计年费" htmlFor="annualFee">
        <div className="field-inline">
          <div className="field-grow">
            <Spinner
              id="annualFee"
              min={0}
              step={1000}
              value={form.annualFee}
              doNotFocusWhenValueUpdate
              onChange={(v) => update("annualFee", v)}
              style={{ width: "100%" }}
            />
          </div>
          <span className="field-note">元 / 年</span>
        </div>
      </FormField>

      <FormField label="业务描述" htmlFor="serviceDesc" full>
        <TextArea
          id="serviceDesc"
          value={form.serviceDesc}
          rows={3}
          maxLength={200}
          placeholder="请简要说明业务使用场景、对时延或上下行带宽的要求等"
          onChange={(value) => update("serviceDesc", value)}
        />
      </FormField>
    </div>
  );
}
