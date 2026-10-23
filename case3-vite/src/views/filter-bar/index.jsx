// Layer 4: 筛选条 — 关键词搜索 / 时间范围切换 / 行业下拉 / 导出下拉，联动下方所有数据区
import { useState, useRef, useEffect } from "react";
import { IconPlusIcIctExcelFile, IconPlusIcPublicChevronDown, IconPlusIcPublicDownload, IconPlusIcPublicPdfFile } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import SelectCard from "@nce/eview-react/SelectCard";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import { useApp } from "../../context.jsx";
import { CUSTOMER_COUNTS, INDUSTRY_OPTIONS, TIME_RANGES, getRiskCustomers } from "../../mock/dashboard.jsx";
import "./index.css";

const EXPORT_MENU_ITEMS = [
  { key: "excel", label: "导出 Excel", icon: <IconPlusIcIctExcelFile iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "pdf", label: "导出 PDF", icon: <IconPlusIcPublicPdfFile iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// TODO(eview-react): Dropdown 无对应组件，当前手写最小可用版
function SimpleDropdown({ trigger, children, placement }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isRight = placement === "bottomRight";

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open ? (
        <div style={{
          position: "absolute",
          top: "100%",
          [isRight ? "right" : "left"]: 0,
          marginTop: "4px",
          zIndex: 1050,
          background: "var(--surface-container-highest, #fff)",
          border: "1px solid var(--divider, #e0e0e0)",
          borderRadius: "var(--radius-container, 8px)",
          boxShadow: "var(--shadow-card, 0 1px 6px rgba(0,0,0,0.08))",
          overflow: "hidden",
          minWidth: "10rem",
        }}>
          {typeof children === "function" ? children({ close: () => setOpen(false) }) : children}
        </div>
      ) : null}
    </div>
  );
}

export default function FilterBar() {
  const { timeRange, setTimeRange, industry, setIndustry, keyword, setKeyword } = useApp();
  const [notice, setNotice] = useState(null);

  const customerTotal = CUSTOMER_COUNTS[industry] != null ? CUSTOMER_COUNTS[industry] : CUSTOMER_COUNTS["全部行业"];
  const riskCount = getRiskCustomers(timeRange, industry, keyword).length;
  const isFilterActive = industry !== "全部行业" || keyword.trim() !== "";

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const handleExport = (key) => {
    const format = key === "excel" ? "Excel" : "PDF";
    notify("success", `正在导出当前筛选结果（${format}），共 ${riskCount} 条风险记录…`);
  };

  const handleReset = () => {
    setKeyword("");
    setIndustry("全部行业");
    setTimeRange("30d");
    notify("default", "已重置筛选条件");
  };

  return (
    <>
      <section className="filter-bar">
        <TextField
          className="filter-search"
          value={keyword}
          onChange={(value) => setKeyword(value)}
          placeholder="搜索客户、行业或负责人"
        />
        <SelectCard
          value={timeRange}
          onChange={(value) => setTimeRange(value)}
          data={TIME_RANGES.map((range) => ({ text: range.label, value: range.key }))}
        />
        <Select
          className="filter-industry"
          value={industry}
          onChange={(value) => setIndustry(value)}
          options={INDUSTRY_OPTIONS.map((item) => ({ value: item, text: item }))}
        />
        <span className="filter-summary">
          在管客户 {customerTotal} 家 · 风险记录 {riskCount} 条
        </span>
        {isFilterActive ? (
          <a className="filter-reset" onClick={handleReset}>重置筛选</a>
        ) : null}
        <SimpleDropdown
          trigger={
            <Button
              leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />}
              text="导出"
              rightIcon={<IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="filter-export-caret" />}
            />
          }
          placement="bottomRight"
        >
          {({ close }) => (
            <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
              {EXPORT_MENU_ITEMS.map((item) => (
                <li
                  key={item.key}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 16px", cursor: "pointer",
                    color: "var(--on-surface, #191919)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover, rgba(0,0,0,0.05))"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                  onClick={() => { handleExport(item.key); close(); }}
                >
                  {item.icon}
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </SimpleDropdown>
      </section>
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
    </>
  );
}
