import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeTopNav, setActiveTopNav] = useState("workorder");
  const [activeSideKey, setActiveSideKey] = useState("order-create");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    navCollapsed,
    toggleNav: () => setNavCollapsed((c) => !c),
    activeTopNav,
    setActiveTopNav,
    activeSideKey,
    setActiveSideKey,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
