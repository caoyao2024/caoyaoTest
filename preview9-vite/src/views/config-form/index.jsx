import { useState, useEffect } from "react";
import { IconPlusIcPublicStar } from '@nce/icon-plus';
import Select from "@/shared/Select";
import TextField from "@/shared/TextField";
import TextArea from "@/shared/TextArea";
import Spinner from "@nce/eview-react/Spinner";
import RadioGroup from "@nce/eview-react/RadioGroup";
import Toggle from "@nce/eview-react/Toggle";
import DatePicker from "@nce/eview-react/DatePicker";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import dayjs from "dayjs";
import FormField from "../../components/form-field/index.jsx";
import { useApp } from "../../context.jsx";
import { CUSTOMERS, SCENES, BANDWIDTH_SPECS, REGIONS, PRIORITIES, STATIONS, TEMPLATES, labelOf, priceOf } from "../../mock/packages.js";
import "./index.css";

const EMPTY = {
  customer: undefined,
  scene: undefined,
  bandwidth: undefined,
  count: 1,
  region: undefined,
  station: undefined,
  cycle: "包月",
  priority: "mid",
  activeDates: null,
  dualRoute: true,
  remark: "",
};

function toOptions(list) {
  return list.map((i) => ({ value: i.value, text: i.label }));
}

let seq = 100400;

export default function ConfigForm() {
  const { configItems, setConfigItems, setPrefill, prefill } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  // 工单"复制再开通"带入的预填值（一次性消费）
  useEffect(() => {
    if (!prefill) return;
    setForm({
      ...EMPTY,
      ...prefill,
      activeDates: prefill.activeDates ? [dayjs(prefill.activeDates[0]), dayjs(prefill.activeDates[1])] : null,
    });
    setErrors({});
    setPrefill(null);
  }, [prefill, setPrefill]);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    setNotice(null);
  };

  const stationOptions = (form.region ? STATIONS[form.region] : []).map((s) => ({ value: s, text: s }));

  const onRegionChange = (value) => {
    setForm((f) => ({ ...f, region: value, station: undefined }));
    setErrors((e) => ({ ...e, region: undefined, station: undefined }));
    setNotice(null);
  };

  const applyTemplate = (tplId) => {
    const tpl = TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;
    setForm((f) => ({
      ...f,
      scene: SCENES.find((s) => s.label === tpl.scene)?.value ?? f.scene,
      bandwidth: tpl.bandwidth,
      priority: tpl.priority,
      cycle: tpl.cycle,
    }));
    setErrors({});
    notify("success", `已套用模板「${tpl.name}」`);
  };

  const validate = () => {
    const next = {};
    if (!form.customer) next.customer = "请选择客户名称";
    if (!form.scene) next.scene = "请选择业务场景";
    if (!form.bandwidth) next.bandwidth = "请选择带宽规格";
    if (!form.count || form.count < 1) next.count = "开通数量需为 1-50";
    if (!form.region) next.region = "请选择站点区域";
    if (!form.station) next.station = "请选择接入站点";
    if (!form.activeDates) next.activeDates = "请选择生效日期";
    return next;
  };

  const submit = () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      notify("warn", "请先完善必填项");
      return;
    }
    const regionLabel = labelOf(REGIONS, form.region);
    const stations = STATIONS[form.region];
    const base = priceOf(form.bandwidth);
    const price = form.cycle === "包年" ? Math.round(base * 0.9) : base;
    const customerLabel = labelOf(CUSTOMERS, form.customer);
    const created = [];
    for (let i = 0; i < form.count; i += 1) {
      seq += 1;
      created.push({
        id: `c-${seq}`,
        code: `DY-2026-${seq}`,
        customer: customerLabel,
        bandwidth: form.bandwidth,
        cycle: form.cycle,
        station: form.station || stations[i % stations.length],
        region: regionLabel,
        price,
        priority: form.priority,
        status: "pending",
      });
    }
    setConfigItems([...created, ...configItems]);
    notify("success", `已生成 ${form.count} 条电路配置，可在右侧清单中核对`);
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setNotice(null);
  };

  return (
    <div className="cfg-form">
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}

      <div className="cfg-form-toolbar">
        <span className="cfg-toolbar-label">快速套用模板</span>
        <Select
          className="cfg-template-select"
          enableClear
          defaultLabel="选择参数模板"
          options={TEMPLATES.map((t) => ({ value: t.id, text: `${t.name} · ${t.bandwidth}` }))}
          onChange={(v) => applyTemplate(v)}
        />
      </div>

      <div className="cfg-grid">
        <FormField label="客户名称" htmlFor="f-customer" required error={errors.customer}>
          <Select id="f-customer" style={{ width: "100%" }} defaultLabel="请选择客户" options={toOptions(CUSTOMERS)} value={form.customer} onChange={(v) => setField("customer", v)} />
        </FormField>

        <FormField label="业务场景" htmlFor="f-scene" required error={errors.scene}>
          <Select id="f-scene" style={{ width: "100%" }} defaultLabel="请选择业务场景" options={toOptions(SCENES)} value={form.scene} onChange={(v) => setField("scene", v)} />
        </FormField>

        <FormField label="带宽规格" htmlFor="f-bandwidth" required error={errors.bandwidth}>
          <Select id="f-bandwidth" style={{ width: "100%" }} defaultLabel="请选择带宽" options={BANDWIDTH_SPECS.map((b) => ({ value: b.value, text: b.label }))} value={form.bandwidth} onChange={(v) => setField("bandwidth", v)} />
        </FormField>

        <FormField label="开通数量" htmlFor="f-count" required error={errors.count} hint="单次最多 50 条">
          <Spinner id="f-count" style={{ width: "8rem" }} min={1} max={50} value={form.count} doNotFocusWhenValueUpdate onChange={(v) => setField("count", v)} />
        </FormField>

        <FormField label="站点区域" htmlFor="f-region" required error={errors.region}>
          <Select id="f-region" style={{ width: "100%" }} defaultLabel="请选择区域" options={toOptions(REGIONS)} value={form.region} onChange={onRegionChange} />
        </FormField>

        <FormField label="接入站点" htmlFor="f-station" required error={errors.station}>
          <Select id="f-station" style={{ width: "100%" }} defaultLabel={form.region ? "请选择站点" : "请先选择区域"} disabled={!form.region} options={stationOptions} value={form.station} onChange={(v) => setField("station", v)} />
        </FormField>

        <FormField label="计费周期">
          <RadioGroup
            isControlled
            data={[
              { text: "包月", value: "包月" },
              { text: "包年", value: "包年" },
            ]}
            value={form.cycle}
            onChange={(a, b) => {
              const next = a === form.cycle ? b : a;
              setField("cycle", next);
            }}
          />
        </FormField>

        <FormField label="业务优先级">
          <Select style={{ width: "8rem" }} options={toOptions(PRIORITIES)} value={form.priority} onChange={(v) => setField("priority", v)} />
        </FormField>

        <FormField label="生效日期" htmlFor="f-date" required error={errors.activeDates} full>
          <DatePicker
            id="f-date"
            style={{ width: "20rem" }}
            type="date"
            format="yyyy-MM-dd"
            range={form.activeDates ? form.activeDates.map((d) => (d ? dayjs(d).toDate() : null)).filter(Boolean) : []}
            onChange={(dateString, date, target) => {
              if (!date) return;
              if (target === "from") {
                const to = form.activeDates?.[1] || dayjs();
                setField("activeDates", [dayjs(date), to]);
              } else if (target === "to") {
                const from = form.activeDates?.[0] || dayjs();
                setField("activeDates", [from, dayjs(date)]);
              }
            }}
          />
        </FormField>

        <FormField label="双路由保护" full>
          <div className="cfg-switch-row">
            <Toggle data={[false, true]} toggled={form.dualRoute} onToggle={(v) => setField("dualRoute", v)} />
            <span className="cfg-switch-hint">开启后为每条电路分配主备两条路由，可靠性更高</span>
          </div>
        </FormField>

        <FormField label="备注说明" htmlFor="f-remark" full>
          <TextArea id="f-remark" maxLength={120} placeholder="补充开通需求、施工窗口等（选填）" value={form.remark} onChange={(v) => setField("remark", v)} />
        </FormField>
      </div>

      <div className="cfg-actions">
        <Button text="重置" onClick={reset} />
        <Button status="primary" text="生成配置清单" leftIcon={<IconPlusIcPublicStar iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={submit} />
      </div>
    </div>
  );
}
