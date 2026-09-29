import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 皮肤模式、界面语言、侧边栏折叠
// 换肤双轨驱动（app.jsx 的 useEffect 负责）：
//   - <html> 切 .dark（原始 token 暗色覆盖）
//   - <body> 切 aui3_1_dark（eview-react 组件暗色；aui3_1 在 index.html 常驻）
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("zh");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
  }, [lang]);

  const value = {
    isDark,
    lang,
    collapsed,
    setLang,
    toggleDark: () => setIsDark((d) => !d),
    toggleCollapsed: () => setCollapsed((c) => !c),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
