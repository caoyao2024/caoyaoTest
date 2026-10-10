import TextField from "@/shared/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@/shared/Select";
import FormField from "../../components/form-field/index.jsx";
import { customerTypeOptions, industryOptions, certTypeOptions, managerOptions } from "../../mock/order.js";

// 步骤一 — 客户信息
export default function StepCustomer({ form, update, errors }) {
  return (
    <div className="form-grid">
      <FormField label="客户名称" required htmlFor="custName" error={errors.custName}>
        <TextField
          id="custName"
          value={form.custName}
          placeholder="请输入客户全称，如：深圳市智联科技有限公司"
          onChange={(value) => update("custName", value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="客户类型" required htmlFor="custType" error={errors.custType}>
        <Select
          id="custType"
          value={form.custType}
          defaultLabel="请选择客户类型"
          options={customerTypeOptions}
          onChange={(v) => update("custType", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="证件类型" required htmlFor="certType" error={errors.certType}>
        <Select
          id="certType"
          value={form.certType}
          options={certTypeOptions}
          onChange={(v) => update("certType", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="证件号码" required htmlFor="certNo" error={errors.certNo}>
        <TextField
          id="certNo"
          value={form.certNo}
          placeholder="请输入统一社会信用代码或证件号码"
          onChange={(value) => update("certNo", value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="所属行业" htmlFor="industry">
        <Select
          id="industry"
          value={form.industry}
          defaultLabel="请选择所属行业"
          options={industryOptions}
          onChange={(v) => update("industry", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="客户经理" htmlFor="manager" hint="负责该客户对接与售后服务的专属经理">
        <Select
          id="manager"
          value={form.manager}
          defaultLabel="请选择客户经理"
          options={managerOptions}
          onChange={(v) => update("manager", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="联系人姓名" required htmlFor="contactName" error={errors.contactName}>
        <TextField
          id="contactName"
          value={form.contactName}
          placeholder="请输入业务联系人姓名"
          onChange={(value) => update("contactName", value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="联系电话" required htmlFor="contactPhone" error={errors.contactPhone}>
        <TextField
          id="contactPhone"
          value={form.contactPhone}
          maxLength={11}
          placeholder="请输入 11 位手机号"
          onChange={(value) => update("contactPhone", value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="电子邮箱" htmlFor="contactEmail" hint="用于接收受理进度与电子发票通知" full>
        <TextField
          id="contactEmail"
          value={form.contactEmail}
          placeholder="name@company.com"
          onChange={(value) => update("contactEmail", value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="备注说明" htmlFor="custRemark" full>
        <TextArea
          id="custRemark"
          value={form.custRemark}
          rows={3}
          maxLength={200}
          placeholder="如有特殊资质、集团客户归属或其他需要说明的信息，请在此填写"
          onChange={(value) => update("custRemark", value)}
        />
      </FormField>
    </div>
  );
}
