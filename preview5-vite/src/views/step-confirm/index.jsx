// Layer 4: 步骤五 — 提交审核（信息核对 / 备注 / 协议确认）
import TextArea from '@nce/eview-react/TextArea';
import Checkbox from '@nce/eview-react/Checkbox';
import {
  IconPlusIcPublicIdcard,
  IconPlusIcIctNodeResourcePackage,
  IconPlusIcPublicMappinOnMap,
  IconPlusIcPublicMoneyCircle,
  IconPlusIcPublicCheckmark,
} from '@nce/icon-plus';
import {
  certTypes,
  productTypes,
  accessTypes,
  opticalModems,
  installModes,
  payMethods,
  invoiceTypes,
  contractPeriods,
} from "../../mock/order.jsx";
import "./index.css";

function pick(list, value) {
  const hit = list.find((x) => x.value === value);
  return hit ? hit.text : "—";
}

function fmtDateTime(d) {
  if (!d) return "—";
  const dt = new Date(d);
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

export default function StepConfirm({ data, setField, errors, fee }) {
  const money = (n) => `¥${Number(n || 0).toFixed(2)}`;
  const addonNames = fee.addonList.map((a) => a.name).join("、");

  const sections = [
    {
      icon: <IconPlusIcPublicIdcard iconSize="1rem" iconColor={['currentcolor']} />,
      title: "客户资料",
      items: [
        ["客户类型", data.customerType === "enterprise" ? "政企客户" : "个人客户"],
        data.customerType === "enterprise" ? ["单位名称", data.enterpriseName || "—"] : null,
        ["客户姓名", data.customerName || "—"],
        ["证件类型", pick(certTypes, data.certType)],
        ["证件号码", data.certNo || "—"],
        ["联系电话", data.phone || "—"],
        ["电子邮箱", data.email || "—"],
        ["通信地址", data.address || "—"],
      ].filter(Boolean),
    },
    {
      icon: <IconPlusIcIctNodeResourcePackage iconSize="1rem" iconColor={['currentcolor']} />,
      title: "产品订购",
      items: [
        ["产品类型", pick(productTypes, data.productType)],
        ["主套餐", fee.plan ? fee.plan.name : "—"],
        ["合约期", pick(contractPeriods, data.contractPeriod)],
        ["副卡数量", `${data.subCards} 张`],
        ["增值服务", addonNames || "未选择"],
      ],
    },
    {
      icon: <IconPlusIcPublicMappinOnMap iconSize="1rem" iconColor={['currentcolor']} />,
      title: "安装信息",
      items: [
        ["装机地址", data.installAddress || "—"],
        ["预约时间", fmtDateTime(data.installTime)],
        ["接入方式", pick(accessTypes, data.accessType)],
        ["光猫设备", pick(opticalModems, data.opticalModem)],
        ["安装方式", pick(installModes, data.installMode)],
      ],
    },
    {
      icon: <IconPlusIcPublicMoneyCircle iconSize="1rem" iconColor={['currentcolor']} />,
      title: "费用与支付",
      items: [
        ["首月应付", money(fee.firstMonth)],
        ["次月起月费", `${money(fee.monthly)} / 月`],
        ["支付方式", pick(payMethods, data.payMethod)],
        ["发票类型", pick(invoiceTypes, data.invoiceType)],
      ],
    },
  ];

  return (
    <div className="step-confirm">
      <div className="step-intro">
        <span className="step-intro-icon">
          <IconPlusIcPublicCheckmark iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <div>
          <h2 className="step-intro-title">提交审核</h2>
          <p className="step-intro-desc">请仔细核对以下信息，确认无误后提交工单，系统将自动进行资源核验。</p>
        </div>
      </div>

      {sections.map((sec) => (
        <div className="review-section" key={sec.title}>
          <div className="review-section-title">
            {sec.icon}
            {sec.title}
          </div>
          <div className="review-grid">
            {sec.items.map(([label, value]) => (
              <div className="review-item" key={label}>
                <span className="review-label">{label}</span>
                <span className="review-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="form-block">
        <div className="confirm-remark">
          <TextArea
            value={data.remark}
            onChange={(targetValue) => setField("remark", targetValue)}
            placeholder="补充说明（选填）：如门禁方式、联系人偏好时段等"
            rows={3}
            maxLength={200}
          />
        </div>
      </div>

      <div className={`confirm-agree${data.agree ? " checked" : ""}${errors.agree ? " has-error" : ""}`}>
        <Checkbox
          value="agree"
          checked={data.agree}
          onChange={(_, checked) => setField("agree", checked)}
        />
        <span className="confirm-agree-text">
          我已阅读并同意
          <a className="confirm-link">《电信业务入网服务协议》</a>
          与
          <a className="confirm-link">《个人信息处理规则》</a>
          ，确认以上信息真实有效。
        </span>
      </div>
      {errors.agree ? <div className="confirm-agree-error">{errors.agree}</div> : null}
    </div>
  );
}
