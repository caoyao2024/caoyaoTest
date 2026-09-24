import { useState } from "react";
import { useApp } from "./context.jsx";
import { Icon } from "./shared/icon.jsx";
import { ToastProvider } from "./shared/toast.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import StrategyForm from "./views/strategy-form/index.jsx";
import StrategyTable from "./views/strategy-table/index.jsx";
import StrategyModal from "./views/strategy-modal/index.jsx";
import "./app.css";

// Layer 5: 布局装配 — Provider 在 main.jsx，这里只剩根容器与页面骨架
function Shell() {
  const { lang } = useApp();
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
                <Icon name="download" size={14} />
                {lang === "zh" ? "导入配置" : "Import"}
              </button>
              <button
                type="button"
                className="app-page-head__btn app-page-head__btn--primary"
                onClick={() => openModal(null)}
              >
                <Icon name="plus" size={14} />
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
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  );
}
