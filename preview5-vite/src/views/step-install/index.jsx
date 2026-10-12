// Layer 4: 步骤三 — 安装信息（装机地址 / 预约时间 / 接入方式与设备）
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import { RadioGroup } from "@nce/eview-react/Radio";
import DatePicker from "@nce/eview-react/DatePicker";
import { IconPlusIcDigitalPowerDpTips, IconPlusIcPublicMappinOnMap } from '@nce/icon-plus';
import FormField from "../../components/form-field/index.jsx";
import {
  accessTypes,
  opticalModems,
  installModes,
} from "../../mock/order.jsx";
import "./index.css";

export default function StepInstall({ data, setField, errors }) {
  return (
    <div className="step-install">
      <div className="step-intro">
        <span className="step-intro-icon">
          <IconPlusIcPublicMappinOnMap iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <div>
          <h2 className="step-intro-title">安装信息</h2>
          <p className="step-intro-desc">填写实际装机地址并预约上门时间，系统将自动核验光纤覆盖情况。</p>
        </div>
      </div>

      <div className="form-block">
        <div className="form-block-title">
          <span className="form-block-bar" />
          装机地址
        </div>
        <FormField
          label="详细装机地址"
          required
          error={errors.installAddress}
          hint="格式：省 / 市 / 区 / 街道 / 门牌号"
          htmlFor="f-install-addr"
        >
          <TextField
            value={data.installAddress}
            onChange={(value) => setField("installAddress", value)}
            placeholder="请输入详细装机地址，例如：广东省深圳市南山区科技园路 1 号 3 栋 502"
          />
        </FormField>
      </div>

      <div className="form-block">
        <div className="form-block-title">
          <span className="form-block-bar" />
          预约与接入
        </div>
        <div className="form-grid">
          <FormField label="预约上门时间" required error={errors.installTime} htmlFor="f-install-time">
            <DatePicker
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              timeEmbedded
              timeFormat="hh:mm"
              value={data.installTime || undefined}
              dateRange={{ dateFrom: new Date(new Date().setHours(0, 0, 0, 0)), dateTo: new Date(2099, 11, 31) }}
              placeholder="请选择日期与时间"
              onChange={(dateString, date) => {
                if (date) setField("installTime", date);
              }}
            />
          </FormField>

          <FormField label="接入方式" htmlFor="f-access">
            <Select
              value={data.accessType}
              onChange={(v) => setField("accessType", v)}
              options={accessTypes.map((a) => ({ text: a.label, value: a.value }))}
            />
          </FormField>

          <FormField label="光猫设备" htmlFor="f-modem">
            <Select
              value={data.opticalModem}
              onChange={(v) => setField("opticalModem", v)}
              options={opticalModems.map((m) => ({ text: m.label, value: m.value }))}
            />
          </FormField>

          <FormField label="安装方式" htmlFor="f-install-mode">
            <RadioGroup
              isControlled
              value={data.installMode}
              onChange={(a, b) => setField("installMode", a === data.installMode ? b : a)}
              data={installModes.map((m) => ({ text: m.label, value: m.value }))}
            />
          </FormField>
        </div>
      </div>

      <div className="install-tip">
        <IconPlusIcDigitalPowerDpTips iconSize="1rem" iconColor={['currentcolor']} />
        <span>提示：如所在楼宇暂未覆盖光纤，提交后系统会推荐就近的无线接入方案。</span>
      </div>
    </div>
  );
}
