// Layer 4: 步骤四 — 费用确认（资费明细 / 支付方式 / 发票 / 优惠）
import TextField from "@/shared/TextField";
import { IconPlusIcPublicBriefcase, IconPlusIcPublicGift, IconPlusIcPublicInvoice, IconPlusIcPublicPlus } from '@nce/icon-plus';
import Radio, { RadioGroup } from "@nce/eview-react/Radio";
import FormField from "../../components/form-field/index.jsx";
import { payMethods, invoiceTypes } from "../../mock/order.jsx";
import "./index.css";

export default function StepFee({ data, setField, errors, fee }) {
  const money = (n) => `¥${Number(n || 0).toFixed(2)}`;

  return (
    <div className="step-fee">
      <div className="step-intro">
        <span className="step-intro-icon">
          <IconPlusIcPublicBriefcase iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <div>
          <h2 className="step-intro-title">费用确认</h2>
          <p className="step-intro-desc">核对资费明细与首月应付金额，选择支付方式与发票类型。</p>
        </div>
      </div>

      <div className="fee-panel">
        <div className="fee-panel-head">
          <span className="fee-panel-title">
            <IconPlusIcPublicInvoice iconSize="1rem" iconColor={['currentcolor']} />
            资费明细
          </span>
          <span className="fee-panel-sub">价格含税 · 以实际出账为准</span>
        </div>

        <div className="fee-list">
          <div className="fee-row">
            <span className="fee-label">
              主套餐月费
              {fee.plan ? <em className="fee-note">（{fee.plan.name}）</em> : null}
            </span>
            <span className="fee-value">{money(fee.base)}</span>
          </div>

          {fee.addonList.map((a) => (
            <div className="fee-row" key={a.id}>
              <span className="fee-label fee-sub">
                <IconPlusIcPublicPlus iconSize="0.75rem" iconColor={['currentcolor']} />
                {a.name}
              </span>
              <span className="fee-value">{money(a.price)}</span>
            </div>
          ))}

          {fee.subCardFee > 0 ? (
            <div className="fee-row">
              <span className="fee-label">
                副卡费用
                <em className="fee-note">（{data.subCards} 张 × ¥10）</em>
              </span>
              <span className="fee-value">{money(fee.subCardFee)}</span>
            </div>
          ) : null}

          <div className="fee-row fee-row-total">
            <span className="fee-label">月度费用小计</span>
            <span className="fee-value">{money(fee.monthly)} / 月</span>
          </div>

          <div className="fee-row">
            <span className="fee-label">一次性安装调测费</span>
            <span className="fee-value">{money(fee.installFee)}</span>
          </div>

          <div className="fee-row">
            <span className="fee-label">
              其中增值税
              <em className="fee-note">（税率 6%）</em>
            </span>
            <span className="fee-value fee-value-muted">{money(fee.tax)}</span>
          </div>

          <div className="fee-row fee-row-final">
            <span className="fee-label">首月应付合计</span>
            <span className="fee-value fee-value-strong">{money(fee.firstMonth)}</span>
          </div>
        </div>

        {fee.save > 0 ? (
          <div className="fee-save">
            <IconPlusIcPublicGift iconSize="0.875rem" iconColor={['currentcolor']} />
            本单套餐优惠 {money(fee.save)}/月，合约期内累计可省 {money(fee.save * 24)}
          </div>
        ) : null}
      </div>

      <div className="form-block">
        <FormField label="支付方式" required error={errors.payMethod}>
          <div className="pay-cards">
            {payMethods.map((p) => (
              <label key={p.value} className={`pay-card${data.payMethod === p.value ? " selected" : ""}`}>
                <Radio
                  value={p.value}
                  checked={data.payMethod === p.value}
                  isControlled
                  label={p.label}
                  onChange={(value) => setField("payMethod", value)}
                />
              </label>
            ))}
          </div>
        </FormField>
      </div>

      <div className="form-block">
        <div className="form-grid">
          <FormField label="发票类型" htmlFor="f-invoice">
            <RadioGroup
              isControlled
              data={invoiceTypes.map((t) => ({ text: t.label, value: t.value }))}
              value={data.invoiceType}
              onChange={(a, b) => {
                const next = a === data.invoiceType ? b : a;
                setField("invoiceType", next);
              }}
            />
          </FormField>

          <FormField label="优惠码" hint="如有活动优惠码可在此核销" htmlFor="f-coupon">
            <TextField
              id="f-coupon"
              value={data.coupon}
              onChange={(value) => setField("coupon", value)}
              placeholder="请输入优惠码（选填）"
              suffix={
                <a className="coupon-apply" onClick={() => {}}>
                  核销
                </a>
              }
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
