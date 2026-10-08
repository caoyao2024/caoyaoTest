// Layer 4: 步骤二 — 产品订购（产品类型 / 套餐 / 合约 / 增值服务）
import Select from '@nce/eview-react/Select';
import Radio from '@nce/eview-react/Radio';
import Checkbox from '@nce/eview-react/Checkbox';
import Spinner from '@nce/eview-react/Spinner';
import Tag from '@nce/eview-react/Tag';
import {
  IconPlusIcPublicWifi,
  IconPlusIcIctNodeResourcePackage,
  IconPlusIcPublicMobilephone,
  IconPlusIcPublicPhoneGear,
} from '@nce/icon-plus';
import FormField from "../../components/form-field/index.jsx";
import {
  productTypes,
  plans,
  addons,
  contractPeriods,
} from "../../mock/order.jsx";
import "./index.css";

export default function StepProduct({ data, setField, errors }) {
  const typePlans = plans.filter((p) => p.type === data.productType);

  function changeType(v) {
    setField("productType", v);
    setField("planId", "");
  }

  return (
    <div className="step-product">
      <div className="step-intro">
        <span className="step-intro-icon">
          <IconPlusIcIctNodeResourcePackage iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <div>
          <h2 className="step-intro-title">产品订购</h2>
          <p className="step-intro-desc">选择产品类型与主套餐，可叠加增值服务，合约期越长优惠力度越大。</p>
        </div>
      </div>

      <div className="form-block">
        <div className="form-block-title">
          <span className="form-block-bar" />
          产品类型
        </div>
        <div className="type-cards">
          {productTypes.map((t) => (
            <label key={t.value} className={`type-card${data.productType === t.value ? " selected" : ""}`}>
              <Radio
                value={t.value}
                checked={data.productType === t.value}
                isControlled
                onChange={(value) => changeType(value)}
              />
              <div className="type-card-body">
                <div className="type-card-name">{t.text}</div>
                <div className="type-card-desc">{t.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="form-block">
        <FormField label="选择主套餐" required error={errors.planId}>
          <div className="plan-grid">
            {typePlans.map((p) => (
              <label key={p.id} className={`plan-card${data.planId === p.id ? " selected" : ""}`}>
                <Radio
                  value={p.id}
                  checked={data.planId === p.id}
                  isControlled
                  className="plan-radio"
                  onChange={(value) => setField("planId", value)}
                />
                <div className="plan-head">
                  <span className="plan-name">{p.name}</span>
                  {p.tags.map((t) => (
                    <Tag key={t} color="primary" className="plan-tag">
                      {t}
                    </Tag>
                  ))}
                </div>
                <div className="plan-price">
                  <span className="plan-cur">¥</span>
                  <span className="plan-num">{p.price}</span>
                  <span className="plan-unit">/月</span>
                  <span className="plan-origin">¥{p.original}</span>
                </div>
                <div className="plan-specs">
                  <span className="plan-spec">
                    <IconPlusIcPublicMobilephone iconSize="0.875rem" iconColor={['currentcolor']} />
                    流量 {p.data}
                  </span>
                  <span className="plan-spec">
                    <IconPlusIcPublicPhoneGear iconSize="0.875rem" iconColor={['currentcolor']} />
                    语音 {p.voice}
                  </span>
                  <span className="plan-spec">
                    <IconPlusIcPublicWifi iconSize="0.875rem" iconColor={['currentcolor']} />
                    宽带 {p.broadband}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </FormField>
      </div>

      <div className="form-block">
        <div className="form-block-title">
          <span className="form-block-bar" />
          订购参数
        </div>
        <div className="form-grid cols-3">
          <FormField label="合约期" htmlFor="f-contract">
            <Select
              id="f-contract"
              selectStyle={{ width: "100%" }}
              value={data.contractPeriod}
              onChange={(v) => setField("contractPeriod", v)}
              options={contractPeriods}
            />
          </FormField>
          <FormField label="副卡数量" hint="每张副卡 ¥10/月" htmlFor="f-sub">
            <Spinner
              id="f-sub"
              min={0}
              max={4}
              value={data.subCards}
              doNotFocusWhenValueUpdate
              onChange={(value) => setField("subCards", value === null ? 0 : value)}
              style={{ width: "100%" }}
            />
          </FormField>
        </div>
      </div>

      <div className="form-block">
        <div className="form-block-title">
          <span className="form-block-bar" />
          增值服务
          <span className="form-block-desc">可多选，按月计入账单</span>
        </div>
        <div className="addon-group">
          <div className="addon-grid">
            {addons.map((a) => (
              <label key={a.id} className={`addon-card${data.addons.includes(a.id) ? " selected" : ""}`}>
                <Checkbox
                  value={a.id}
                  checked={data.addons.includes(a.id)}
                  onChange={(value, checked) => {
                    if (checked) {
                      setField("addons", [...data.addons, a.id]);
                    } else {
                      setField("addons", data.addons.filter((x) => x !== a.id));
                    }
                  }}
                />
                <div className="addon-body">
                  <div className="addon-name">{a.name}</div>
                  <div className="addon-desc">{a.desc}</div>
                </div>
                <span className="addon-price">+¥{a.price}/月</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
