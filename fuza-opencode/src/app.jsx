import { useState } from 'react';
import Button from '@nce/eview-react/Button';
import { useIntl } from 'react-intl';
import { Icon } from './shared/icon.jsx';
import { ToastProvider } from './components/toast.jsx';
import HeaderBar from './views/header-bar/index.jsx';
import SideNav from './views/side-nav/index.jsx';
import StrategyForm from './views/strategy-form/index.jsx';
import StrategyTable from './views/strategy-table/index.jsx';
import StrategyModal from './views/strategy-modal/index.jsx';
import './styles/app.css';

// Layer 5: 布局装配 — Provider/IntlProvider 已在 main.jsx；此处仅 ToastProvider + 根容器
function Shell() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
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
                {`${t('page.breadcrumb.home')} / ${t('page.breadcrumb.current')} / ${t('nav.strategy.form')}`}
              </span>
              <h1 className="app-page-head__title">{t('page.title')}</h1>
              <p className="app-page-head__desc">{t('page.desc')}</p>
            </div>
            <div className="app-page-head__actions">
              <Button
                leftIcon={<Icon name="download" size={14} />}
                onClick={() => openModal(null)}
                text={t('page.import')}
              />
              <Button
                status="primary"
                leftIcon={<Icon name="plus" size={14} />}
                onClick={() => openModal(null)}
                text={t('page.new')}
              />
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
