import { useState, useEffect, createContext, useContext } from 'react';

// Layer 1: 全局状态 — 皮肤模式、界面语言、侧边栏折叠
// 暗色单轨驱动：isDark 同时切 <body> 的 aui3_1_dark（eview-react 组件暗色）与 <html> 的 .dark（原始 token 暗色覆盖）
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('zh');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // aui3_1 已在 index.html 的 <body> 上常驻；暗色时叠 aui3_1_dark
    document.body.classList.toggle('aui3_1_dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
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
