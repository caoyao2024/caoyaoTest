// App entry — ICT React page（UMD → Vite → eview-react 迁移后）
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 皮肤 / 语言 / 侧边栏折叠)
//   Layer 2 mock data     → src/mock/              (strategy.js: 选项集 + 策略清单)
//   Layer 3 reusable      → src/components/        (status-tag / strategy-fields)
//   Layer 4 views         → src/views/             (header-bar / side-nav / strategy-form / strategy-table / strategy-modal)
//   Layer 5 layout        → app.jsx                (根容器装配)
//
// Provider/i18n/暗色切换的 useEffect 都在 main.jsx（IntlProvider 必须是 ConfigProvider 的直接子级）。
// 暗色模式：<body> 切 aui3_1_dark，<html> 切 .dark（aui3_1 在 index.html 的 <body> 上常驻）。
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { useEffect, useState } from "react";
import { useApp } from "./context.jsx";
import { IconPlusIcPublicDownload, IconPlusIcPublicPlus } from "@nce/icon-plus";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import StrategyForm from "./views/strategy-form/index.jsx";
import StrategyTable from "./views/strategy-table/index.jsx";
import StrategyModal from "./views/strategy-modal/index.jsx";
import "./app.css";

function Shell() {
  const { isDark, lang } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openModal = (record) => {
    setEditing(record || null);
    setModalOpen(true);
  };

  return (
    <div className="app-root">
      <HeaderBar />

      <div className="app-body">
        <SideNav />

        <main className="app-main">
          <div className="app-page-head">
            <div className="app-page-head__text">
              <span className="app-page-head__crumb">
                {lang === "zh" ? "首页 / 策略配置 / 参数配置" : "Home / Strategy / Parameters"}
              </span>
              <h1 className="app-page-head__title">
                {lang === "zh" ? "策略配置" : "Strategy Configuration"}
              </h1>
              <p className="app-page-head__desc">
                {lang === "zh"
                  ? "按设备类型下发采集与告警策略，保存后 5 分钟内自动生效。"
                  : "Deliver collection and alarm strategies per device type. Changes take effect within 5 minutes."}
              </p>
            </div>
            <div className="app-page-head__actions">
              <button type="button" className="app-page-head__btn" onClick={() => openModal(null)}>
                <IconPlusIcPublicDownload iconSize={14} iconColor={["currentcolor"]} />
                {lang === "zh" ? "导入配置" : "Import"}
              </button>
              <button
                type="button"
                className="app-page-head__btn app-page-head__btn--primary"
                onClick={() => openModal(null)}
              >
                <IconPlusIcPublicPlus iconSize={14} iconColor={["currentcolor"]} />
                {lang === "zh" ? "新建策略" : "New Strategy"}
              </button>
            </div>
          </div>

          <div className="app-main__stack">
            <StrategyForm onOpenModal={() => openModal(null)} />
            <StrategyTable onEdit={openModal} />
          </div>
        </main>
      </div>

      <StrategyModal open={modalOpen} record={editing} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function App() {
  const { isDark } = useApp();
  // 暗色切换：<body> 切 aui3_1_dark（eview-react 组件暗色），<html> 切 .dark（原始 token 暗色覆盖）
  // aui3_1 在 index.html 的 <body> 上常驻，这里只 toggle aui3_1_dark
  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return <Shell />;
}
