import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@nce/eview-react/Select";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Switch from "@nce/eview-react/Switch";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

// Layer 3: 策略参数字段组 — 表单卡片与弹窗共用同一套字段，保证两处填写体验一致
// StrategyFields：基础参数（默认导出）；StrategyAdvanced：高级参数面板（开关打开后渲染）

// eview-react 选项格式：{ value, text }（不是 antd 的 { value, label }）
function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

// TODO(eview-react): Spinner 无 addonAfter，用包装组件显示单位后缀
function SpinnerWithUnit({ value, onChange, unit, ...rest }) {
  return (
    <div className="spinner-with-unit">
      <Spinner {...rest} value={value} onChange={onChange} className="spinner-with-unit__input" />
      {unit ? <span className="spinner-with-unit__text">{unit}</span> : null}
    </div>
  );
}

// TODO(eview-react): TimePicker.RangePicker 无直接对应，用两个原生 time 输入组合
function TimeRangePicker({ value = [], onChange, minuteStep = 1, ...rest }) {
  const [start, end] = Array.isArray(value) ? value : ["", ""];
  const step = minuteStep * 60;
  const handleChange = (newStart, newEnd) => {
    onChange?.([newStart, newEnd]);
  };
  return (
    <div className="time-range-picker">
      <input
        type="time"
        step={step}
        value={start}
        onChange={(e) => handleChange(e.target.value, end)}
        className="time-range-picker__input"
      />
      <span className="time-range-picker__sep">-</span>
      <input
        type="time"
        step={step}
        value={end}
        onChange={(e) => handleChange(start, e.target.value)}
        className="time-range-picker__input"
      />
    </div>
  );
}

export default function StrategyFields() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return (
    <div className="strategy-fields">
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
        <span className="strategy-fields__group-line" />
      </div>

      <Form.Item
        label={t("form.name")}
        name="name"
        rules={[{ required: true }]}
      >
        <TextField placeholder={t("form.name.ph")} maxLength={40} />
      </Form.Item>

      <Form.Item
        label={t("form.deviceType")}
        name="deviceType"
        rules={[{ required: true }]}
      >
        <Select
          defaultLabel={t("form.deviceType.ph")}
          options={toOptions(deviceTypeOptions, t)}
          enableClear
        />
      </Form.Item>

      <Form.Item
        label={t("form.interval")}
        name="intervalSec"
        rules={[{ required: true }]}
      >
        <SpinnerWithUnit
          min={5}
          max={86400}
          step={5}
          unit={t("form.interval.unit")}
        />
      </Form.Item>

      <Form.Item label={t("form.level")} name="level">
        <Select options={toOptions(levelOptions, t)} enableClear />
      </Form.Item>

      <Form.Item label={t("form.timeRange")} name="timeRange">
        <TimeRangePicker minuteStep={15} />
      </Form.Item>

      <Form.Item label={t("form.desc2")} name="desc" col={24}>
        <TextArea rows={3} maxLength={200} placeholder={t("form.desc2.ph")} />
      </Form.Item>
    </div>
  );
}

export function StrategyAdvanced() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return (
    <div className="strategy-fields__advanced">
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.advancedTitle")}</span>
        <span className="strategy-fields__group-line" />
        <span className="strategy-fields__group-chip">
          <Icon name="sliders-horizontal" size={12} />
          {intl.formatMessage({ id: "form.advancedBadge" }, { count: 6 })}
        </span>
      </div>

      <Form.Item label={t("form.threshold")} name="threshold">
        <SpinnerWithUnit
          min={0}
          max={100}
          unit={t("form.threshold.unit")}
        />
      </Form.Item>

      <Form.Item label={t("form.retry")} name="retry">
        <SpinnerWithUnit
          min={1}
          max={10}
          unit={t("form.retry.unit")}
        />
      </Form.Item>

      <div className="switch-row switch-row--inset">
        <div className="switch-row__text">
          <span className="switch-row__label">{t("form.flap")}</span>
          <span className="switch-row__desc">{t("form.flapDesc")}</span>
        </div>
        <Form.Item name="flap" valuePropName="toggled" updateTrigger="onToggle" noStyle>
          <Switch data={[false, true]} />
        </Form.Item>
      </div>

      <Form.Item label={t("form.silent")} name="silent">
        <TimeRangePicker minuteStep={30} />
      </Form.Item>

      <Form.Item label={t("form.notify")} name="notify" col={24}>
        <CheckboxGroup
          data={toOptions(notifyOptions, t)}
          className="strategy-fields__checks"
        />
      </Form.Item>

      <Form.Item label={t("form.memo")} name="memo" col={24}>
        <TextArea rows={2} maxLength={120} placeholder={t("form.memo.ph")} />
      </Form.Item>
    </div>
  );
}
