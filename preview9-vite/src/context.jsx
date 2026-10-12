import { useState, useEffect, createContext, useContext } from "react";
import { INITIAL_CONFIG_ITEMS, ORDERS } from "./mock/packages.js";

// Layer 1: 全局状态 —— 主题模式 + 跨 Tab 业务状态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  // 顶部 Tab：跨视图跳转的落点
  const [activeTab, setActiveTab] = useState("config");
  // 电路配置清单：表单生成 / 工单复制的共享数据源
  const [configItems, setConfigItems] = useState(INITIAL_CONFIG_ITEMS);
  // 开通工单：配置清单提交后生成
  const [orders, setOrders] = useState(ORDERS);
  // 由工单"复制再开通"带入表单的预填值
  const [prefill, setPrefill] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    activeTab,
    setActiveTab,
    configItems,
    setConfigItems,
    orders,
    setOrders,
    prefill,
    setPrefill,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
