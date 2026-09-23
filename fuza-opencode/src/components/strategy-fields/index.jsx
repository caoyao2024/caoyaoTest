import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import TextArea from '@nce/eview-react/TextArea';
import Select from '@nce/eview-react/Select';
import Spinner from '@nce/eview-react/Spinner';
import Toggle from '@nce/eview-react/Toggle';
import CheckboxGroup from '@nce/eview-react/CheckboxGroup';
import { Icon } from '../../shared/icon.jsx';
import { deviceTypeOptions, levelOptions, notifyOptions } from '../../mock/strategy.js';
import './index.css';

// Layer 3: 策略参数字段组 — 表单卡片与弹窗共用同一套字段
// 返回 Form.Item 数组（直接作为 <Form> 子级内联渲染，配合 Form itemCol={12} + Form.Item.col 做两列布局）。
// ⚠️ eview-react Form.Item 必须是 Form 的直接子节点，不能用 <div> 包裹做栅格（否则 ev_label 宽度塌缩），
//    故源项目的 .strategy-fields__grid div 包裹已移除，改用 Form 级 itemCol + 单项 col。

function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

// 基础参数（form 与 modal 共用）
export function basicFieldItems(intl) {
  const t = (id, fb) => intl.formatMessage({ id, defaultMessage: fb || id });
  return [
    <div className="strategy-fields__group" key="basic-group">
      <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
      <span className="strategy-fields__group-line" />
    </div>,
    <Form.Item key="name" label={t("form.name")} name="name" col={12} rules={[{ required: true }]}>
      <TextField placeholder={t("form.name.ph")} maxLength={40} />
    </Form.Item>,
    <Form.Item key="deviceType" label={t("form.deviceType")} name="deviceType" col={12} rules={[{ required: true }]}>
      <Select options={toOptions(deviceTypeOptions, t)} defaultLabel={t("form.deviceType.ph")} enableClear />
    </Form.Item>,
    <Form.Item key="intervalSec" label={`${t("form.interval")}（${t("form.interval.unit")}）`} name="intervalSec" col={12} rules={[{ required: true }]}>
      <Spinner min={5} max={86400} step={5} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item key="level" label={t("form.level")} name="level" col={12}>
      <Select options={toOptions(levelOptions, t)} />
    </Form.Item>,
    // TODO(eview-react): TimePicker.RangePicker 无对应，降级为 TextField（时段字符串）
    <Form.Item key="timeRange" label={t("form.timeRange")} name="timeRange" col={24}>
      <TextField placeholder="00:00 - 23:59" />
    </Form.Item>,
    <Form.Item key="desc" label={t("form.desc2")} name="desc" col={24}>
      <TextArea rows={3} maxLength={200} placeholder={t("form.desc2.ph")} />
    </Form.Item>,
  ];
}

// 高级参数（开关打开后渲染）；flap 为受控 Toggle（React state），不入 Form
export function advancedFieldItems(intl, flap, setFlap) {
  const t = (id, fb) => intl.formatMessage({ id, defaultMessage: fb || id });
  return [
    <div className="strategy-fields__group" key="adv-group">
      <span className="strategy-fields__group-title">{t("form.advancedTitle")}</span>
      <span className="strategy-fields__group-line" />
      <span className="strategy-fields__group-chip">
        <Icon name="sliders-horizontal" size={12} />
        {intl.formatMessage({ id: "form.advancedBadge" }, { count: 6 })}
      </span>
    </div>,
    <Form.Item key="threshold" label={`${t("form.threshold")}（${t("form.threshold.unit")}）`} name="threshold" col={12}>
      <Spinner min={0} max={100} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item key="retry" label={`${t("form.retry")}（${t("form.retry.unit")}）`} name="retry" col={12}>
      <Spinner min={1} max={10} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <div className="switch-row switch-row--inset" key="flap-row">
      <div className="switch-row__text">
        <span className="switch-row__label">{t("form.flap")}</span>
        <span className="switch-row__desc">{t("form.flapDesc")}</span>
      </div>
      <Toggle data={[false, true]} toggled={flap} onToggle={setFlap} />
    </div>,
    // TODO(eview-react): TimePicker.RangePicker 无对应，降级为 TextField
    <Form.Item key="silent" label={t("form.silent")} name="silent" col={24}>
      <TextField placeholder="22:00 - 06:00" />
    </Form.Item>,
    <Form.Item key="notify" label={t("form.notify")} name="notify" col={24}>
      <CheckboxGroup data={toOptions(notifyOptions, t)} />
    </Form.Item>,
    <Form.Item key="memo" label={t("form.memo")} name="memo" col={24}>
      <TextArea rows={2} maxLength={120} placeholder={t("form.memo.ph")} />
    </Form.Item>,
  ];
}
