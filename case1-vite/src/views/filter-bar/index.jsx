// Layer 4: ④ 筛选工具栏 — 关键词搜索 / 支付方式 / 下单日期范围 / 金额区间 / 预约配送时段（快捷预设）/ 重置
// 快捷键：任意位置按 "/" 聚焦搜索框
import { useEffect, useRef } from "react";
import { IconPlusIcPublicAlarmClock, IconPlusIcPublicClose, IconPlusIcPublicRestore, IconPlusIcPublicSearch, IconPlusIcPublicWarning } from '@hui/icon-plus';
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import TextField from "@/shared/TextField";
import Spinner from "@/shared/Spinner";
import Select from "@/shared/Select";
import DatePicker from "@/shared/DatePicker";
import { PAY_METHODS } from "../../mock/order.js";
import "./index.css";

const at = (h, m) => dayjs().hour(h).minute(m).second(0).millisecond(0);

// 预约配送快捷预设（时间段选择带快捷预设）
const SLOT_PRESETS = [
  { label: "上午", value: [at(9, 0), at(12, 0)] },
  { label: "下午", value: [at(14, 0), at(18, 0)] },
  { label: "晚间", value: [at(18, 0), at(22, 0)] },
  { label: "全天", value: [at(8, 0), at(22, 0)] },
];

export default function FilterBar({ value, onChange, onReset, exception, exceptionCount, onClearException }) {
  const isSlotActive = (preset) => {
    if (!value.deliveryRange || !value.deliveryRange[0] || !value.deliveryRange[1]) return false;
    return (
      value.deliveryRange[0].format("HH:mm") === preset.value[0].format("HH:mm") &&
      value.deliveryRange[1].format("HH:mm") === preset.value[1].format("HH:mm")
    );
  };

  const applySlot = (preset) => {
    if (isSlotActive(preset)) {
      onChange({ deliveryRange: null });
    } else {
      onChange({ deliveryRange: preset.value });
    }
  };

  const isTimeoutException = exception === "timeout";

  const searchRef = useRef(null);

  // "/" 快捷键聚焦搜索框（输入态下不拦截）
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "/") return;
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      if (searchRef.current) searchRef.current.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // 金额区间校验（min > max 视为无效，过滤时忽略并提示）
  const amountInvalid =
    value.amountMin != null &&
    value.amountMax != null &&
    value.amountMin > value.amountMax;

  // 日期范围：dayjs → "YYYY-MM-DD" 字符串互转（原生 date input）
  const startDateStr =
    value.dateRange && value.dateRange[0] ? value.dateRange[0].format("YYYY-MM-DD") : "";
  const endDateStr =
    value.dateRange && value.dateRange[1] ? value.dateRange[1].format("YYYY-MM-DD") : "";

  // 时间范围：dayjs → "HH:mm" 字符串互转（原生 time input）
  const startTimeStr =
    value.deliveryRange && value.deliveryRange[0] ? value.deliveryRange[0].format("HH:mm") : "";
  const endTimeStr =
    value.deliveryRange && value.deliveryRange[1] ? value.deliveryRange[1].format("HH:mm") : "";

  return (
    <div className="filter-bar">
      <div className="fb-row">
        <div className="fb-group">
          <span className="fb-label">搜索订单</span>
          <div className="fb-search-wrapper">
            <TextField
              ref={searchRef}
              className="fb-search"
              defaultLabel="订单号 / 收货人 / 手机号（按 / 聚焦）"
              value={value.keyword}
              onChange={(val) => onChange({ keyword: val })}
            />
            <span className="fb-search-suffix">
              <IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />
            </span>
          </div>
        </div>
        <div className="fb-group">
          <span className="fb-label">支付方式</span>
          <Select
            className="fb-select"
            style={{ width: "7.5rem" }}
            enableClear
            defaultLabel="全部方式"
            options={PAY_METHODS.map((m) => ({ value: m, text: m }))}
            value={value.payMethod}
            onChange={(v) => onChange({ payMethod: v })}
          />
        </div>
        <div className="fb-group">
          <span className="fb-label">下单日期</span>
          <div className="fb-date-range" style={{ width: "15rem" }}>
            <input
              type="date"
              className="fb-date-input"
              value={startDateStr}
              onChange={(e) => {
                const start = e.target.value ? dayjs(e.target.value) : null;
                onChange({ dateRange: [start, value.dateRange && value.dateRange[1] ? value.dateRange[1] : null] });
              }}
            />
            <span className="fb-dash">—</span>
            <input
              type="date"
              className="fb-date-input"
              value={endDateStr}
              onChange={(e) => {
                const end = e.target.value ? dayjs(e.target.value) : null;
                onChange({ dateRange: [value.dateRange && value.dateRange[0] ? value.dateRange[0] : null, end] });
              }}
            />
          </div>
        </div>
        <div className="fb-group">
          <span className="fb-label">金额区间</span>
          <div className="fb-amount">
            <Spinner
              className="fb-spinner"
              min={0}
              defaultLabel="最小"
              value={value.amountMin}
              onChange={(v) => onChange({ amountMin: v })}
            />
            <span className="fb-dash">—</span>
            <Spinner
              className="fb-spinner"
              min={0}
              defaultLabel="最大"
              value={value.amountMax}
              onChange={(v) => onChange({ amountMax: v })}
            />
          </div>
        </div>
        <div className="fb-group">
          <span className="fb-label">预约配送</span>
          <div className="fb-time-range" style={{ width: "10.5rem" }}>
            <input
              type="time"
              className="fb-time-input"
              step={1800}
              value={startTimeStr}
              onChange={(e) => {
                if (!e.target.value) {
                  onChange({ deliveryRange: null });
                  return;
                }
                const [h, m] = e.target.value.split(":").map(Number);
                const start = at(h, m);
                onChange({ deliveryRange: [start, value.deliveryRange && value.deliveryRange[1] ? value.deliveryRange[1] : start] });
              }}
            />
            <span className="fb-dash">—</span>
            <input
              type="time"
              className="fb-time-input"
              step={1800}
              value={endTimeStr}
              onChange={(e) => {
                if (!e.target.value) {
                  onChange({ deliveryRange: null });
                  return;
                }
                const [h, m] = e.target.value.split(":").map(Number);
                const end = at(h, m);
                onChange({ deliveryRange: [value.deliveryRange && value.deliveryRange[0] ? value.deliveryRange[0] : end, end] });
              }}
            />
          </div>
          <div className="fb-chips">
            {SLOT_PRESETS.map((p) => {
              const on = isSlotActive(p);
              return (
                <a
                  key={p.label}
                  className={on ? "fb-chip fb-chip-on" : "fb-chip"}
                  onClick={() => applySlot(p)}
                >
                  {p.label}
                </a>
              );
            })}
          </div>
        </div>
        <Button
          className="fb-reset"
          leftIcon={<IconPlusIcPublicRestore iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="重置"
          onClick={onReset}
        />
      </div>
      {amountInvalid && (
        <div className="fb-applied">
          <span className="fb-amount-warn">
            金额区间无效：最大金额需不小于最小金额，当前已忽略金额筛选
          </span>
        </div>
      )}
      {exception && (
        <div className="fb-applied">
          <span className="fb-applied-chip">
            {isTimeoutException ? <IconPlusIcPublicAlarmClock iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicWarning iconSize="0.875rem" iconColor={['currentcolor']} />}
            已应用筛选：
            {isTimeoutException
              ? `超时未发货 · ${exceptionCount} 单`
              : `物流异常 · ${exceptionCount} 单`}
            <IconPlusIcPublicClose iconSize="0.75rem" iconColor={['currentcolor']} className="fb-chip-close" />
          </span>
        </div>
      )}
    </div>
  );
}
