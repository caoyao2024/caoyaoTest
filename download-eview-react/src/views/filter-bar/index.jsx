// Layer 4: 筛选条 — 关键词搜索 / 时间范围切换 / 行业下拉 / 导出下拉，联动下方所有数据区
import { useState } from "react";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicDownload, IconPlusIcPublicExcleFileTextured, IconPlusIcPublicSearch, IconPlusIcPublicTxtFileTextured } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import SelectCard from "@nce/eview-react/SelectCard";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import DivMessage from "@nce/eview-react/DivMessage";
import { useApp } from "../../context.jsx";
import { CUSTOMER_COUNTS, INDUSTRY_OPTIONS, TIME_RANGES, getRiskCustomers } from "../../mock/dashboard.jsx";
import "./index.css";

const EXPORT_MENU_OPTIONS = [
  { id: "excel", text: "导出 Excel", serialno: "excel", iconUrl: <IconPlusIcPublicExcleFileTextured iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "pdf", text: "导出 PDF", serialno: "pdf", iconUrl: <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

export default function FilterBar() {
  const { timeRange, setTimeRange, industry, setIndustry, keyword, setKeyword } = useApp();
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const customerTotal = CUSTOMER_COUNTS[industry] != null ? CUSTOMER_COUNTS[industry] : CUSTOMER_COUNTS["全部行业"];
  const riskCount = getRiskCustomers(timeRange, industry, keyword).length;
  const isFilterActive = industry !== "全部行业" || keyword.trim() !== "";

  const handleExport = (evt) => {
    const serialno = evt.value;
    if (serialno === undefined) return;
    const format = serialno === "excel" ? "Excel" : "PDF";
    notify("success", `正在导出当前筛选结果（${format}），共 ${riskCount} 条风险记录…`);
  };

  const handleReset = () => {
    setKeyword("");
    setIndustry("全部行业");
    setTimeRange("30d");
    notify("default", "已重置筛选条件");
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setNotice(null);
  };

  const timeRangeData = TIME_RANGES.map((range) => ({ text: range.label, value: range.key }));
  const industryOptions = INDUSTRY_OPTIONS.map((item) => ({ value: item, text: item }));

  return (
    <>
      <section className="filter-bar">
        <TextField
          className="filter-search"
          value={keyword}
          onChange={handleKeywordChange}
          defaultLabel="搜索客户、行业或负责人"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--text-placeholder)']} />}
        />
        <SelectCard
          value={timeRange}
          onChange={(value) => setTimeRange(value)}
          data={timeRangeData}
        />
        <Select
          className="filter-industry"
          value={industry}
          onChange={(value) => setIndustry(value)}
          options={industryOptions}
        />
        <span className="filter-summary">
          在管客户 {customerTotal} 家 · 风险记录 {riskCount} 条
        </span>
        {isFilterActive ? (
          <a className="filter-reset" onClick={handleReset}>重置筛选</a>
        ) : null}
        <PopUpMenu options={EXPORT_MENU_OPTIONS} width="180px" onClick={handleExport}>
          <Button
            text="导出"
            leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />}
            rightIcon={<IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="filter-export-caret" />}
          />
        </PopUpMenu>
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
