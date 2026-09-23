import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 皮肤模式、界面语言、侧边栏折叠
// eview-react 暗色切换：aui3_1_dark 挂 <body>（eview-react 组件暗色）+ .dark 挂 <html>（原始 token 暗色覆盖）
// aui3_1 常驻 <body>（index.html 写死），暗色时叠 aui3_1_dark
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("zh");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
