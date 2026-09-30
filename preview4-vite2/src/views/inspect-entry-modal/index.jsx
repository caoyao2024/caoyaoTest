import { useState, useEffect } from "react";
import { IconPlusIcPublicInfo } from '@nce/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import Select from "@nce/eview-react/Select";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Spinner from "@nce/eview-react/Spinner";
import RadioGroup from "@nce/eview-react/RadioGroup";
import Toggle from "@nce/eview-react/Toggle";
import Button from "@nce/eview-react/Button";
import FieldRow from "../../components/field-row/index.jsx";
import {
  deviceOptions,
  inspectionItemOptions,
  resultOptions,
  unitOptions,
  ownerOptions,
} from "../../mock/workorder.jsx";
import "./index.css";

const EMPTY_DRAFT = {
  device: undefined,
  item: undefined,
  result: undefined,
  value: null,
  unit: "℃",
  level: "minor",
  note: "",
  owner: "u-1024",
  confirmed: false,
};

const LEVEL_OPTIONS = [
  { value: "minor", text: "一般 · 记录观察即可" },
  { value: "major", text: "较大 · 需当日处理" },
  { value: "critical", text: "严重 · 需立即处置" },
];

// Layer 4: 登记巡检明细弹窗 — 纵向排列的紧凑表单(标签在上方,单列)
export default function InspectEntryModal({ open, onCancel, onSubmit }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [errors, setErrors] = useState({});

  // 每次打开重置草稿与校验状态
  useEffect(() => {
    if (open) {
      setDraft(EMPTY_DRAFT);
      setErrors({});
    }
  }, [open]);

  const setField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleReset = () => {
    setDraft(EMPTY_DRAFT);
    setErrors({});
  };

  const handleSubmit = () => {
    const next = {};
    if (!draft.device) next.device = "请选择设备";
    if (!draft.item) next.item = "请选择巡检项";
    if (!draft.result) next.result = "请选择巡检结果";
    if (draft.value === null || draft.value === undefined || draft.value === "") {
      next.value = "请填写实测值";
    } else if (draft.value < 0 || draft.value > 10000) {
      next.value = "实测值需在 0 – 10000 之间";
    }
    if (draft.result === "abnormal") {
      if (!draft.level) next.level = "请选择异常等级";
      if (String(draft.note || "").trim().length < 5) next.note = "判定为异常时，处置说明至少 5 个字符";
    }
    if (!draft.owner) next.owner = "请选择复核责任人";

    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit(draft);
  };

  const isAbnormal = draft.result === "abnormal";

  return (
    <Dialog
      className="entry-modal"
      isOpen={open}
      title="登记巡检明细"
      size={[520, "auto"]}
      onClose={onCancel}
      buttons={[
        { text: "重置", onClick: handleReset },
        { text: "取消", onClick: onCancel },
        { text: "确定并添加", status: "primary", onClick: handleSubmit },
      ]}
    >
      <div className="entry-form">
        <p className="entry-form__tip">
          <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>此处登记的单条明细会追加到工单的巡检列表中，关闭弹窗不会丢失已保存内容。</span>
        </p>

        <FieldRow label="设备" required htmlFor="entry-device" error={errors.device}>
          <Select
            id="entry-device"
            value={draft.device}
            options={deviceOptions}
            enableClear
            defaultLabel="请选择本次巡检的设备"
            onChange={(v) => setField("device", v)}
          />
        </FieldRow>

        <FieldRow label="巡检项" required htmlFor="entry-item" error={errors.item}>
          <Select
            id="entry-item"
            value={draft.item}
            options={inspectionItemOptions}
            enableClear
            defaultLabel="请选择需要登记的巡检项"
            onChange={(v) => setField("item", v)}
          />
        </FieldRow>

        <FieldRow
          label="巡检结果"
          required
          htmlFor="entry-result"
          error={errors.result}
          help="选择「异常」后需要补充异常等级与处置说明"
        >
          <RadioGroup
            id="entry-result"
            isControlled
            data={resultOptions}
            value={draft.result}
            onChange={(a, b) => {
              const next = a === draft.result ? b : a;
              setField("result", next);
            }}
          />
        </FieldRow>

        <FieldRow label="实测值与单位" required htmlFor="entry-value" error={errors.value}>
          <div className="entry-form__pair">
            <Spinner
              id="entry-value"
              value={draft.value}
              min={0}
              max={10000}
              doNotFocusWhenValueUpdate
              onChange={(v) => setField("value", v)}
            />
            <Select
              value={draft.unit}
              options={unitOptions}
              onChange={(v) => setField("unit", v)}
            />
          </div>
        </FieldRow>

        {isAbnormal ? (
          <FieldRow label="异常等级" required htmlFor="entry-level" error={errors.level}>
            <Select
              id="entry-level"
              value={draft.level}
              options={LEVEL_OPTIONS}
              enableClear
              defaultLabel="请选择异常等级"
              onChange={(v) => setField("level", v)}
            />
          </FieldRow>
        ) : null}

        <FieldRow
          label="处置说明"
          required={isAbnormal}
          htmlFor="entry-note"
          error={errors.note}
          help={isAbnormal ? "异常项必填：说明已采取的动作与后续计划" : "可选：补充现场观察到的细节"}
        >
          <TextArea
            id="entry-note"
            value={draft.note}
            rows={3}
            maxLength={200}
            placeholder="例如：已更换跳线并送测，观察 30 分钟误码未增长。"
            onChange={(v) => setField("note", v)}
          />
        </FieldRow>

        <FieldRow label="复核责任人" required htmlFor="entry-owner" error={errors.owner}>
          <Select
            id="entry-owner"
            value={draft.owner}
            options={ownerOptions}
            enableClear
            defaultLabel="请选择复核责任人"
            onChange={(v) => setField("owner", v)}
          />
        </FieldRow>

        <FieldRow
          label="已现场确认并拍照留证"
          htmlFor="entry-confirm"
          help="开启后该明细会标记为已复核，审批环节优先通过"
        >
          <Toggle
            id="entry-confirm"
            data={[false, true]}
            toggled={draft.confirmed}
            taggledChildren="已确认"
            unTaggledChildren="未确认"
            onToggle={(v) => setField("confirmed", v)}
          />
        </FieldRow>
      </div>
    </Dialog>
  );
}
