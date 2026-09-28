// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. metrics.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view: panel-card / status-tag / category-chip / ratio-value)
//   Layer 4 views         → src/views/{name}/      (one per section: header-bar / page-heading / metric-filter / metric-table / metric-editor)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// 场景：数据指标管理页 —— 仅表单 + 表格，无图表。
//
// 暗色方案：aui3_1_dark 挂 <body>（eview-react 组件暗色）+ .dark 挂 <html>（原始 token 暗色覆盖），
// 在 context.jsx 的 useEffect 中切换。main.jsx 的 ConfigProvider + IntlProvider 已就绪。
import DivMessage from '@nce/eview-react/DivMessage';
import { AppProvider, useApp } from './context.jsx';
import { HeaderBar } from './views/header-bar/index.jsx';
import { PageHeading } from './views/page-heading/index.jsx';
import { MetricFilter } from './views/metric-filter/index.jsx';
import { MetricTable } from './views/metric-table/index.jsx';
import { MetricEditor } from './views/metric-editor/index.jsx';

function AppContent() {
  const { notice } = useApp();
  return (
    <div className="app-root">
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => {}}
          style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000 }}
        />
      ) : null}
      <HeaderBar />
      <main className="app-main">
        <PageHeading />
        <MetricFilter />
        <MetricTable />
      </main>
      <MetricEditor />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
