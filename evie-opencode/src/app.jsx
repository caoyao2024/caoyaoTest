import DivMessage from '@nce/eview-react/DivMessage';
import { AppProvider, useApp } from './context.jsx';
import HeaderBar from './views/header-bar/index.jsx';
import PageHeading from './views/page-heading/index.jsx';
import MetricFilter from './views/metric-filter/index.jsx';
import MetricTable from './views/metric-table/index.jsx';
import MetricEditor from './views/metric-editor/index.jsx';
import './styles/app.css';

function ToastLayer() {
  const { notice } = useApp();
  if (!notice) return null;
  return (
    <div className="app-toast">
      <DivMessage
        key={notice.key}
        display
        type={notice.type}
        text={notice.text}
        disposeTimeOut={3000}
      />
    </div>
  );
}

function AppShell() {
  return (
    <div className="app-root">
      <HeaderBar />
      <main className="app-main">
        <PageHeading />
        <MetricFilter />
        <MetricTable />
      </main>
      <MetricEditor />
      <ToastLayer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
