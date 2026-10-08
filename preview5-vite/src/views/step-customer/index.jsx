// Layer 4: 步骤一 — 客户资料（实名信息 / 联系方式）
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';
import RadioGroup from '@nce/eview-react/RadioGroup';
import { IconPlusIcPublicIdcard } from '@nce/icon-plus';
import FormField from "../../components/form-field/index.jsx";
import { certTypes } from "../../mock/order.jsx";
import "./index.css";

export default function StepCustomer({ data, setField, errors }) {
  return (
    <div className="step-customer">
      <div className="step-intro">
        <span className="step-intro-icon">
          <IconPlusIcPublicIdcard iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <div>
          <h2 className="step-intro-title">客户资料</h2>
          <p className="step-intro-desc">请按证件原件如实填写实名信息，用于入网登记与合同签署。</p>
        </div>
      </div>

      <div className="form-block">
        <div className="form-block-title">
          <span className="form-block-bar" />
          客户类型
        </div>
        <RadioGroup
          isControlled
          value={data.customerType}
          data={[
            { value: "personal", text: "个人客户" },
            { value: "enterprise", text: "政企客户" },
          ]}
          onChange={(a, b) => {
            const next = a === data.customerType ? b : a;
            setField("customerType", next);
          }}
        />
      </div>

      <div className="form-block">
        <div className="form-block-title">
          <span className="form-block-bar" />
          实名信息
        </div>
        <div className="form-grid">
          {data.customerType === "enterprise" ? (
            <>
              <FormField label="单位名称" required error={errors.enterpriseName} htmlFor="f-enterprise">
                <TextField
                  id="f-enterprise"
                  value={data.enterpriseName}
                  onChange={(value) => setField("enterpriseName", value)}
                  placeholder="请输入营业执照上的单位全称"
                />
              </FormField>
              <FormField label="联系人" htmlFor="f-contact">
                <TextField
                  id="f-contact"
                  value={data.contactPerson}
                  onChange={(value) => setField("contactPerson", value)}
                  placeholder="请输入经办人姓名"
                />
              </FormField>
            </>
          ) : null}

          <FormField
            label={data.customerType === "enterprise" ? "经办人姓名" : "客户姓名"}
            required
            error={errors.customerName}
            htmlFor="f-name"
          >
            <TextField
              id="f-name"
              value={data.customerName}
              onChange={(value) => setField("customerName", value)}
              placeholder="请输入客户真实姓名"
            />
          </FormField>

          <FormField label="证件类型" required htmlFor="f-cert-type">
            <Select
              id="f-cert-type"
              selectStyle={{ width: "100%" }}
              value={data.certType}
              onChange={(v) => setField("certType", v)}
              options={certTypes}
            />
          </FormField>

          <FormField label="证件号码" required error={errors.certNo} htmlFor="f-cert-no">
            <TextField
              id="f-cert-no"
              value={data.certNo}
              onChange={(value) => setField("certNo", value)}
              placeholder="请输入证件号码"
            />
          </FormField>

          <FormField label="联系电话" required error={errors.phone} htmlFor="f-phone">
            <TextField
              id="f-phone"
              value={data.phone}
              onChange={(value) => setField("phone", value)}
              placeholder="请输入 11 位手机号码"
              maxLength={11}
            />
          </FormField>

          <FormField label="电子邮箱" error={errors.email} hint="用于接收电子发票与业务通知" htmlFor="f-email">
            <TextField
              id="f-email"
              value={data.email}
              onChange={(value) => setField("email", value)}
              placeholder="请输入常用邮箱"
            />
          </FormField>
        </div>
      </div>

      <div className="form-block">
        <div className="form-block-title">
          <span className="form-block-bar" />
          联系地址
        </div>
        <FormField label="客户通信地址" htmlFor="f-address">
          <TextField
            id="f-address"
            value={data.address}
            onChange={(value) => setField("address", value)}
            placeholder="请输入客户日常通信地址（选填，可与装机地址不同）"
          />
        </FormField>
      </div>
    </div>
  );
}
