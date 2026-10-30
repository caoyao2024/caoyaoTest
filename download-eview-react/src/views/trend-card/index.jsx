// Layer 4: 趋势区 — 折线图 3 系列（活跃度 / 工单量 / 使用时长），随时间范围与行业联动；点击数据点查看数值
import { useState } from "react";
import Chart from "@nce/eview-react/Chart";
import DivMessage from "@nce/eview-react/DivMessage";
import ChartActions from "../../components/chart-actions/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { useApp } from "../../context.jsx";
import { TIME_RANGES, getTrendData } from "../../mock/dashboard.jsx";
import "./index.css";

export default function TrendCard() {
  const { timeRange, industry, isDark } = useApp();
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const activeRange = TIME_RANGES.find((range) => range.key === timeRange);
  const rangeLabel = activeRange ? activeRange.label : "近30天";

  const trend = getTrendData(timeRange, industry);
  const chartData = trend.labels.map((label, index) => {
    const row = { 日期: label };
    trend.series.forEach((seriesItem) => {
      row[seriesItem.name] = seriesItem.data[index];
    });
    return row;
  });

  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  // 点击数据点 → 反馈该点指标数值
  const handleChartRendered = (echartsInstance) => {
    if (!echartsInstance) return;
    echartsInstance.on("click", (params) => {
      if (!params || !params.seriesName) return;
      notify("default", `${params.seriesName} · ${params.name}：${params.value}`);
    });
  };

  return (
    <>
      <SectionCard
        className="trend-card"
        title="客户活跃趋势"
        subtitle={`${rangeLabel} · ${industry} · 3 项核心行为指标 · 点击数据点查看数值`}
        actions={<ChartActions refreshText="趋势数据已刷新" />}
      >
        <Chart
          name="LineChart"
          option={{
            ...chartBase,
            data: chartData,
            xAxis: { data: "日期" },
            yAxisTitle: "数值",
            smooth: true,
          }}
          onChartRendered={handleChartRendered}
          style={{ height: "16rem" }}
        />
      </SectionCard>
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
