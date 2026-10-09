// Layer 4: 采集规则表单（纵向单列 + 开关驱动子表单）
import { useState } from "react";
import { IconPlusIcDigitalPowerDpArchive, IconPlusIcIctApiCall, IconPlusIcPublicBellClock, IconPlusIcPublicDisk, IconPlusIcPublicEnvelope, IconPlusIcPublicFilter, IconPlusIcPublicLink, IconPlusIcPublicMenuCollapse, IconPlusIcPublicMessageBubble, IconPlusIcPublicResetting, IconPlusIcPublicSetting } from '@nce/icon-plus';
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import MultipleSelect from "@nce/eview-react/MultipleSelect";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";
import SelectCard from "@nce/eview-react/SelectCard";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import {
  dataSourceOptions,
  frequencyOptions,
  formatOptions,
  pointOptions,
  storageOptions,
} from "../../mock/rules.js";
import "./index.css";

const DEFAULT_FORM = {
  name: "",
  source: undefined,
  endpoint: "",
  frequency: "30s",
  points: [],
  format: "json",
  alarmEnabled: true,
  alarmThreshold: 85,
  notifyChannel: "email",
  receivers: "",
  webhookUrl: "",
  advancedEnabled: false,
  timeout: 3000,
  retries: 2,
  compress: false,
  backupEndpoint: "",
  archiveEnabled: true,
  retentionDays: 90,
  storage: "oss",
};

function ToggleRow({ icon, title, desc, checked, onChange }) {
  return (
    <div className="tf-toggle">
      <span className="tf-toggle__icon">
        {icon}
      </span>
      <div className="tf-toggle__text">
        <span className="tf-toggle__title">{title}</span>
        <span className="tf-toggle__desc">{desc}</span>
      </div>
      <Toggle data={[false, true]} toggled={checked} onToggle={onChange} />
    </div>
  );
}

export default function RuleForm({ onCreate }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setNotice(null);
  };

  const notify = (type, text) =>
    setNotice({ type, text, key: Date.now(), persistent: type === "error" });

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "请输入规则名称";
    if (!form.source) next.source = "请选择数据源类型";
    if (!form.endpoint.trim()) next.endpoint = "请输入连接地址";
    if (form.alarmEnabled) {
      if (!form.receivers.trim()) next.receivers = "请至少填写一位接收人";
      if (form.notifyChannel === "webhook" && !form.webhookUrl.trim()) {
        next.webhookUrl = "请输入 Webhook 回调地址";
      }
    }
    if (form.archiveEnabled && !(form.retentionDays > 0)) {
      next.retentionDays = "保留天数需大于 0";
    }
    return next;
  };

  const handleSubmit = (event) => {
    if (event && event.preventDefault) event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      notify("error", "请先修正表单中的校验项");
      return;
    }
    const freqLabel =
      (frequencyOptions.find((item) => item.value === form.frequency) || {}).text || "自定义";
    onCreate({
      id: `RULE-${Math.floor(1000 + Math.random() * 8999)}`,
      name: form.name.trim(),
      source: form.source,
      frequency: form.frequency,
      frequencyLabel: freqLabel,
      points: form.points.length ? form.points.length * 6 : 12,
      alarm: form.alarmEnabled ? "on" : "off",
      status: "stopped",
      updatedAt: "刚刚",
    });
    notify("success", `规则「${form.name.trim()}」已保存`);
    setForm(DEFAULT_FORM);
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setErrors({});
    setNotice(null);
  };

  return (
    <section className="tf-card">
      {notice && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
          }}
        >
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            enableDisposeTimeOut={!notice.persistent}
            onClose={() => setNotice(null)}
          />
        </div>
      )}

      <header className="tf-card__head">
        <span className="tf-card__icon">
          <IconPlusIcPublicFilter iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <div>
          <h2 className="tf-card__title">新建采集规则</h2>
          <p className="tf-card__subtitle">配置数据源、采集策略与扩展能力，保存后即刻下发</p>
        </div>
      </header>

      <form className="tf-form" noValidate>
        <div className="tf-body">
          <div className="tf-group tf-group--fields">
            <h3 className="tf-group__title">基础信息</h3>

            <div className="tf-field">
              <label className="tf-label tf-label--required" htmlFor="tf-name">
                规则名称
              </label>
              <div className="tf-control">
                <TextField
                  id="tf-name"
                  placeholder="例如：1# 锅炉温度监控"
                  value={form.name}
                  onChange={(value) => setField("name", value)}
                />
                {errors.name && <span className="tf-error">{errors.name}</span>}
              </div>
            </div>

            <div className="tf-field">
              <label className="tf-label tf-label--required" htmlFor="tf-source">
                数据源类型
              </label>
              <div className="tf-control">
                <Select
                  id="tf-source"
                  defaultLabel="请选择数据源"
                  selectStyle={{ width: "100%" }}
                  value={form.source}
                  options={dataSourceOptions}
                  onChange={(value) => setField("source", value)}
                />
                {errors.source && <span className="tf-error">{errors.source}</span>}
              </div>
            </div>

            <div className="tf-field">
              <label className="tf-label tf-label--required" htmlFor="tf-endpoint">
                连接地址
              </label>
              <div className="tf-control">
                <TextField
                  id="tf-endpoint"
                  placeholder="mqtt://10.20.31.7:1883 或 /dev/ttyS0"
                  suffix={<IconPlusIcPublicLink iconSize="0.875rem" iconColor={['currentcolor']} />}
                  value={form.endpoint}
                  onChange={(value) => setField("endpoint", value)}
                />
                {errors.endpoint && <span className="tf-error">{errors.endpoint}</span>}
              </div>
            </div>
          </div>

          <div className="tf-group tf-group--fields">
            <h3 className="tf-group__title">采集策略</h3>

            <div className="tf-field">
              <label className="tf-label" htmlFor="tf-frequency">
                采集频率
              </label>
              <div className="tf-control">
                <Select
                  id="tf-frequency"
                  selectStyle={{ width: "100%" }}
                  value={form.frequency}
                  options={frequencyOptions}
                  onChange={(value) => setField("frequency", value)}
                />
              </div>
            </div>

            <div className="tf-field">
              <label className="tf-label" htmlFor="tf-points">
                采集点位
              </label>
              <div className="tf-control">
                <MultipleSelect
                  id="tf-points"
                  enableClear
                  placeholder="选择需要采集的物理量"
                  selectStyle={{ width: "100%" }}
                  value={form.points}
                  options={pointOptions}
                  onChange={(value) => setField("points", value)}
                />
              </div>
            </div>

            <div className="tf-field">
              <label className="tf-label" htmlFor="tf-format">
                数据格式
              </label>
              <div className="tf-control">
                <Select
                  id="tf-format"
                  selectStyle={{ width: "100%" }}
                  value={form.format}
                  options={formatOptions}
                  onChange={(value) => setField("format", value)}
                />
              </div>
            </div>
          </div>

          <div className="tf-group">
            <h3 className="tf-group__title">扩展能力</h3>

            <ToggleRow
              icon={<IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />}
              title="启用告警通知"
              desc="数值越界时按所选渠道实时推送"
              checked={form.alarmEnabled}
              onChange={(v) => setField("alarmEnabled", v)}
            />
            {form.alarmEnabled && (
              <div className="tf-subpanel">
                <div className="tf-field">
                  <label className="tf-label" htmlFor="tf-threshold">
                    告警阈值
                  </label>
                  <div className="tf-control">
                    <Spinner
                      id="tf-threshold"
                      min={0}
                      max={9999}
                      style={{ width: "100%" }}
                      value={form.alarmThreshold}
                      doNotFocusWhenValueUpdate
                      onChange={(value) => setField("alarmThreshold", value)}
                    />
                  </div>
                </div>

                <div className="tf-field">
                  <span className="tf-label">通知方式</span>
                  <div className="tf-control">
                    <SelectCard
                      value={form.notifyChannel}
                      onChange={(value) => setField("notifyChannel", value)}
                      data={[
                        { text: "邮件", value: "email", icon: <IconPlusIcPublicEnvelope iconSize="0.875rem" iconColor={['currentcolor']} /> },
                        { text: "短信", value: "sms", icon: <IconPlusIcPublicMessageBubble iconSize="0.875rem" iconColor={['currentcolor']} /> },
                        { text: "Webhook", value: "webhook", icon: <IconPlusIcIctApiCall iconSize="0.875rem" iconColor={['currentcolor']} /> },
                      ]}
                    />
                  </div>
                </div>

                <div className="tf-field">
                  <label className="tf-label tf-label--required" htmlFor="tf-receivers">
                    接收人
                  </label>
                  <div className="tf-control">
                    <TextField
                      id="tf-receivers"
                      placeholder="多个邮箱/手机号用逗号分隔"
                      value={form.receivers}
                      onChange={(value) => setField("receivers", value)}
                    />
                    {errors.receivers && <span className="tf-error">{errors.receivers}</span>}
                  </div>
                </div>

                {form.notifyChannel === "webhook" && (
                  <div className="tf-field tf-field--reveal">
                    <label className="tf-label tf-label--required" htmlFor="tf-webhook">
                      回调地址
                    </label>
                    <div className="tf-control">
                      <TextField
                        id="tf-webhook"
                        placeholder="https://alert.example.com/hook/iot"
                        suffix={<IconPlusIcIctApiCall iconSize="0.875rem" iconColor={['currentcolor']} />}
                        value={form.webhookUrl}
                        onChange={(value) => setField("webhookUrl", value)}
                      />
                      {errors.webhookUrl && <span className="tf-error">{errors.webhookUrl}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            <ToggleRow
              icon={<IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} />}
              title="开启高级采集模式"
              desc="自定义超时、重试与传输压缩策略"
              checked={form.advancedEnabled}
              onChange={(v) => setField("advancedEnabled", v)}
            />
            {form.advancedEnabled && (
              <div className="tf-subpanel">
                <div className="tf-field">
                  <label className="tf-label" htmlFor="tf-timeout">
                    请求超时
                  </label>
                  <div className="tf-control">
                    <Spinner
                      id="tf-timeout"
                      min={100}
                      max={60000}
                      step={100}
                      style={{ width: "100%" }}
                      value={form.timeout}
                      doNotFocusWhenValueUpdate
                      onChange={(value) => setField("timeout", value)}
                    />
                  </div>
                </div>

                <div className="tf-field">
                  <label className="tf-label" htmlFor="tf-retries">
                    重试次数
                  </label>
                  <div className="tf-control">
                    <Spinner
                      id="tf-retries"
                      min={0}
                      max={10}
                      style={{ width: "100%" }}
                      value={form.retries}
                      doNotFocusWhenValueUpdate
                      onChange={(value) => setField("retries", value)}
                    />
                  </div>
                </div>

                <div className="tf-toggle tf-toggle--inner">
                  <span className="tf-toggle__icon">
                    <IconPlusIcPublicMenuCollapse iconSize="1rem" iconColor={['currentcolor']} />
                  </span>
                  <div className="tf-toggle__text">
                    <span className="tf-toggle__title">启用传输压缩</span>
                    <span className="tf-toggle__desc">降低带宽占用，适合高频大数据量场景</span>
                  </div>
                  <Toggle
                    data={[false, true]}
                    toggled={form.compress}
                    onToggle={(v) => setField("compress", v)}
                  />
                </div>

                {form.compress && (
                  <div className="tf-field tf-field--reveal">
                    <label className="tf-label" htmlFor="tf-backup">
                      备用地址
                    </label>
                    <div className="tf-control">
                      <TextField
                        id="tf-backup"
                        placeholder="主链路异常时自动切换"
                        value={form.backupEndpoint}
                        onChange={(value) => setField("backupEndpoint", value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <ToggleRow
              icon={<IconPlusIcDigitalPowerDpArchive iconSize="1rem" iconColor={['currentcolor']} />}
              title="自动归档历史数据"
              desc="按保留周期转入冷存储，释放在线库压力"
              checked={form.archiveEnabled}
              onChange={(v) => setField("archiveEnabled", v)}
            />
            {form.archiveEnabled && (
              <div className="tf-subpanel">
                <div className="tf-field">
                  <label className="tf-label tf-label--required" htmlFor="tf-retention">
                    保留天数
                  </label>
                  <div className="tf-control">
                    <Spinner
                      id="tf-retention"
                      min={1}
                      max={3650}
                      style={{ width: "100%" }}
                      value={form.retentionDays}
                      doNotFocusWhenValueUpdate
                      onChange={(value) => setField("retentionDays", value)}
                    />
                    {errors.retentionDays && <span className="tf-error">{errors.retentionDays}</span>}
                  </div>
                </div>

                <div className="tf-field">
                  <label className="tf-label" htmlFor="tf-storage">
                    存储位置
                  </label>
                  <div className="tf-control">
                    <Select
                      id="tf-storage"
                      selectStyle={{ width: "100%" }}
                      value={form.storage}
                      options={storageOptions}
                      onChange={(value) => setField("storage", value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tf-actions">
          <Button
            leftIcon={<IconPlusIcPublicResetting iconSize="0.875rem" iconColor={['currentcolor']} />}
            text="重置"
            onClick={handleReset}
          />
          <Button
            status="primary"
            leftIcon={<IconPlusIcPublicDisk iconSize="0.875rem" iconColor={['currentcolor']} />}
            text="保存规则"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </section>
  );
}
