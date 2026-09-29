// App entry — ICT React page (eview-react 迁移后)
// Layer 5 layout → app.jsx (根容器装配，Provider/IntlProvider 已提到 main.jsx)

import { useState, useCallback } from "react";
import { IconPlusIcPublicDownload, IconPlusIcPublicPlus } from '@nce/icon-plus';
import DivMessage from "@nce/eview-react/DivMessage";
import { useApp } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import StrategyForm from "./views/strategy-form/index.jsx";
import StrategyTable from "./views/strategy-table/index.jsx";
import StrategyModal from "./views/strategy-modal/index.jsx";

function Shell() {
  const { lang } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null);

  const notify = useCallback((type, text) => {
    setNotice({ key: Date.now(), type, text });
  }, []);

  const openModal = (record) => {
    setEditing(record || null);
    setModalOpen(true);
  };

  return (
    <div className="app-root">
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={5000}
          onClose={() => setNotice(null)}
          style={{ position: "fixed", top: 16, right: 16, zIndex: 10001 }}
        />
      ) : null}

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
                <IconPlusIcPublicDownload iconSize={14} iconColor={['currentcolor']} />
                {lang === "zh" ? "导入配置" : "Import"}
              </button>
              <button
                type="button"
                className="app-page-head__btn app-page-head__btn--primary"
                onClick={() => openModal(null)}
              >
                <IconPlusIcPublicPlus iconSize={14} iconColor={['currentcolor']} />
                {lang === "zh" ? "新建策略" : "New Strategy"}
              </button>
            </div>
          </div>

          <div className="app-main__stack">
            <StrategyForm onOpenModal={() => openModal(null)} />
            <StrategyTable onEdit={openModal} notify={notify} />
          </div>
        </main>
      </div>

      <StrategyModal open={modalOpen} record={editing} onClose={() => setModalOpen(false)} notify={notify} />
    </div>
  );
}

export default function App() {
  return <Shell />;
}
