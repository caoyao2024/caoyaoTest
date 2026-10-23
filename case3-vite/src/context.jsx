import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式 + 看板全局筛选 + 跨区块联动（客户抽屉 / 跟进弹窗 / 转交弹窗 / 表格状态页签）
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

// 平滑滚动定位到页面区块（配合目标卡片上的 scroll-margin-top 吸顶偏移）
export function scrollToSection(selector) {
  if (typeof document === "undefined") return;
  const target = document.querySelector(selector);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // 看板全局筛选：时间范围 / 客户行业 / 关键词（联动趋势、构成、表格与右侧栏数据）
  const [timeRange, setTimeRange] = useState("30d");
  const [industry, setIndustry] = useState("全部行业");
  const [keyword, setKeyword] = useState("");

  // 风险客户表格状态页签（饼图扇区 / KPI 卡下钻联动）
  const [tableStatusFilter, setTableStatusFilter] = useState("全部");

  // 客户详情抽屉
  const [drawerCustomerId, setDrawerCustomerId] = useState(null);

  // 跟进 / 回访弹窗（mode: "follow" 跟进 | "callback" 回访）
  const [followUpModal, setFollowUpModal] = useState({ open: false, mode: "follow", customerId: null });

  // 转交负责人弹窗（批量转交时 customerId 为空、customerName 为"选中的 N 家客户"）
  const [transferModal, setTransferModal] = useState({ open: false, customerId: null, customerName: "" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),

    timeRange,
    setTimeRange,
    industry,
    setIndustry,
    keyword,
    setKeyword,

    tableStatusFilter,
    setTableStatusFilter,

    drawerCustomerId,
    openCustomerDrawer: (customerId) => setDrawerCustomerId(customerId),
    closeCustomerDrawer: () => setDrawerCustomerId(null),

    followUpModal,
    openFollowUpModal: ({ mode = "follow", customerId = null } = {}) =>
      setFollowUpModal({ open: true, mode, customerId }),
    closeFollowUpModal: () => setFollowUpModal((prev) => ({ ...prev, open: false })),

    transferModal,
    openTransferModal: ({ customerId = null, customerName = "" } = {}) =>
      setTransferModal({ open: true, customerId, customerName }),
    closeTransferModal: () => setTransferModal((prev) => ({ ...prev, open: false })),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
