// Layer 4: 构成区 — 饼图展示客户健康度分布；点击扇区下钻风险客户表格（状态筛选 + 滚动定位）
import Chart from "@nce/eview-react/Chart";
import ChartActions from "../../components/chart-actions/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { scrollToSection, useApp } from "../../context.jsx";
import { TIME_RANGES, getHealthDistribution } from "../../mock/dashboard.jsx";
import "./index.css";

export default function HealthPieCard() {
  const { timeRange, industry, setTableStatusFilter, isDark } = useApp();

  const activeRange = TIME_RANGES.find((range) => range.key === timeRange);
  const rangeLabel = activeRange ? activeRange.label : "近30天";

  const distribution = getHealthDistribution(timeRange, industry);
  const totalCount = distribution.reduce((sum, item) => sum + item.value, 0);

  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  // 点击扇区 → 联动表格状态页签并滚动定位
  const handleChartRendered = (echartsInstance) => {
    if (!echartsInstance) return;
    echartsInstance.on("click", (params) => {
      if (!params || !params.name) return;
      setTableStatusFilter(params.name);
      scrollToSection(".risk-table-card");
    });
  };

  return (
    <SectionCard
      className="health-pie-card"
      title="客户健康度分布"
      subtitle={`${rangeLabel} · ${industry} · 共 ${totalCount} 家 · 点击扇区筛选表格`}
      actions={<ChartActions refreshText="分布数据已刷新" />}
    >
      <Chart
        name="PieChart"
        option={{
          ...chartBase,
          data: distribution,
          title: { text: String(totalCount), subtext: "在管客户（家）" },
          legendPosition: "bottomCenter",
        }}
        onChartRendered={handleChartRendered}
        style={{ height: "16rem" }}
      />
    </SectionCard>
  );
}
