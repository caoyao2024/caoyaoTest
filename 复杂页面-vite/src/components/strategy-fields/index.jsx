import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@nce/eview-react/Select";
import Switch from "@nce/eview-react/Switch";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import { IconPlusIcPublicTransverseRectangleTemplate } from "@nce/icon-plus";
import { useIntl } from "react-intl";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

// Layer 3: 策略参数字段组 — 表单卡片与弹窗共用同一套字段，保证两处填写体验一致
// StrategyFields：基础参数（默认导出）；StrategyAdvanced：高级参数面板（开关打开后渲染）
// Form 内不用 div 做栅格：用 Form.Item.col 单项覆盖 Form 级 itemCol（24 栅格制）
// 注：Form 级 itemCol 由父组件（strategy-form / strategy-modal）设置，这里只控制单项 col

function toOptions(list, t) {
  // eview-react Select/CheckboxGroup 的 options 用 text（不是 label）
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

function Icon12() {
  return <IconPlusIcPublicTransverseRectangleTemplate iconSize={12} iconColor={["currentcolor"]} />;
}

export default function StrategyFields() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return (
    <>
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
        <span className="strategy-fields__group-line" />
      </div>

      <Form.Item
        label={t("form.name")}
        name="name"
        rules={[{ required: true }]}
        col={12}
      >
        <TextField placeholder={t("form.name.ph")} maxLength={40} />
      </Form.Item>

      <Form.Item
        label={t("form.deviceType")}
        name="deviceType"
        rules={[{ required: true }]}
        col={12}
      >
        <Select
          defaultLabel={t("form.deviceType.ph")}
          options={toOptions(deviceTypeOptions, t)}
          enableClear
        />
      </Form.Item>

      <Form.Item
        label={`${t("form.interval")} (${t("form.interval.unit")})`}
        name="intervalSec"
        rules={[{ required: true }]}
        col={12}
      >
        <Spinner
          min={5}
          max={86400}
          step={5}
        />
      </Form.Item>

      <Form.Item label={t("form.level")} name="level" col={12}>
        <Select options={toOptions(levelOptions, t)} enableClear />
      </Form.Item>

      <Form.Item label={t("form.timeRange")} name="timeRangeStart" col={6}>
        <Spinner type="time" timeFormat="hh:mm" />
      </Form.Item>

      <Form.Item label="—" name="timeRangeEnd" col={6}>
        <Spinner type="time" timeFormat="hh:mm" />
      </Form.Item>

      <Form.Item label={t("form.desc2")} name="desc" col={24}>
        <TextArea rows={3} maxLength={200} placeholder={t("form.desc2.ph")} />
      </Form.Item>
    </>
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
          <Icon12 />
          {intl.formatMessage({ id: "form.advancedBadge" }, { count: 6 })}
        </span>
      </div>

      <Form.Item label={`${t("form.threshold")} (${t("form.threshold.unit")})`} name="threshold" col={12}>
        <Spinner
          min={0}
          max={100}
        />
      </Form.Item>

      <Form.Item label={`${t("form.retry")} (${t("form.retry.unit")})`} name="retry" col={12}>
        <Spinner
          min={1}
          max={10}
        />
      </Form.Item>

      <div className="switch-row switch-row--inset">
        <div className="switch-row__text">
          <span className="switch-row__label">{t("form.flap")}</span>
          <span className="switch-row__desc">{t("form.flapDesc")}</span>
        </div>
        <Form.Item
          name="flap"
          valuePropName="toggled"
          updateTrigger="onToggle"
          noStyle
        >
          <Switch data={[false, true]} />
        </Form.Item>
      </div>

      <Form.Item label={t("form.silent")} name="silentStart" col={12}>
        <Spinner type="time" timeFormat="hh:mm" />
      </Form.Item>

      <Form.Item label="—" name="silentEnd" col={12}>
        <Spinner type="time" timeFormat="hh:mm" />
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
