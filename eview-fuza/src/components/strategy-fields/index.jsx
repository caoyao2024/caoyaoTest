// Layer 3: 策略参数字段组 — 以纯函数返回 Form.Item 数组（直接作为 Form 的子级，itemCol 生效）。
// 调用方在 <Form> 内 {renderBasicFields(t)} 渲染；不持有 state，t / intl 由调用方传入。
// Form 2.0 托管：控件不传 value/onChange，Form 按 name 收集；Toggle 配 valuePropName="toggled" updateTrigger="onToggle"。

import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import { Icon } from "../../shared/icon.jsx";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";

function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

// 基础参数（strategy-form 与 strategy-modal 共用）
export function renderBasicFields(t) {
  return [
    <div className="strategy-fields__group" key="basic-group">
      <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
      <span className="strategy-fields__group-line" />
    </div>,
    <Form.Item label={t("form.name")} name="name" key="name" rules={[{ required: true }]}>
      <TextField placeholder={t("form.name.ph")} maxLength={40} />
    </Form.Item>,
    <Form.Item label={t("form.deviceType")} name="deviceType" key="deviceType" rules={[{ required: true }]}>
      <Select options={toOptions(deviceTypeOptions, t)} defaultLabel={t("form.deviceType.ph")} enableClear />
    </Form.Item>,
    // TODO(eview-react): Spinner 无 addonAfter，采集周期单位（秒）暂省略
    <Form.Item label={t("form.interval")} name="intervalSec" key="intervalSec" rules={[{ required: true }]}>
      <Spinner min={5} max={86400} step={5} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item label={t("form.level")} name="level" key="level">
      <Select options={toOptions(levelOptions, t)} />
    </Form.Item>,
    // TODO(eview-react): TimePicker.RangePicker 无对应组件，用 Spinner type="time" 近似（仅单时间点，区间语义丢失）
    <Form.Item label={t("form.timeRange")} name="timeRange" key="timeRange">
      <Spinner type="time" timeFormat="hh:mm" />
    </Form.Item>,
    <Form.Item label={t("form.desc2")} name="desc" key="desc" col={24}>
      <TextArea rows={3} maxLength={200} placeholder={t("form.desc2.ph")} />
    </Form.Item>,
  ];
}

// 高级参数面板（开关打开后渲染）
export function renderAdvancedFields(t, intl) {
  return [
    <div className="strategy-fields__group" key="adv-group">
      <span className="strategy-fields__group-title">{t("form.advancedTitle")}</span>
      <span className="strategy-fields__group-line" />
      <span className="strategy-fields__group-chip">
        <Icon name="sliders-horizontal" size={12} />
        {intl.formatMessage({ id: "form.advancedBadge" }, { count: 6 })}
      </span>
    </div>,
    <Form.Item label={t("form.threshold")} name="threshold" key="threshold">
      <Spinner min={0} max={100} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item label={t("form.retry")} name="retry" key="retry">
      <Spinner min={1} max={10} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <p className="strategy-fields__hint-line" key="flap-desc">{t("form.flapDesc")}</p>,
    <Form.Item
      label={t("form.flap")}
      name="flap"
      key="flap"
      valuePropName="toggled"
      updateTrigger="onToggle"
      col={24}
    >
      <Toggle data={[false, true]} />
    </Form.Item>,
    <Form.Item label={t("form.silent")} name="silent" key="silent">
      <Spinner type="time" timeFormat="hh:mm" />
    </Form.Item>,
    <Form.Item label={t("form.notify")} name="notify" key="notify" col={24}>
      <CheckboxGroup data={toOptions(notifyOptions, t)} />
    </Form.Item>,
    <Form.Item label={t("form.memo")} name="memo" key="memo" col={24}>
      <TextArea rows={2} maxLength={120} placeholder={t("form.memo.ph")} />
    </Form.Item>,
  ];
}
