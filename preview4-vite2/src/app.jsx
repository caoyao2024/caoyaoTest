// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. workorder.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. field-row / panel-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. top-bar / side-nav)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.
// 暗色切换：main.jsx 已配 eview-react ConfigProvider + IntlProvider；
// isDark 状态在 context.jsx 的 AppProvider 内，useEffect 同时切 <html>.dark 与 <body>.aui3_1_dark。

import { AppProvider, useApp } from "./context.jsx";
import TopBar from "./views/top-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import WorkorderPage from "./views/workorder-page/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const { navCollapsed } = useApp();

  return (
    <div className={`app-root ${navCollapsed ? "app-root--collapsed" : ""}`}>
      <TopBar />
      <div className="app-body">
        <SideNav />
        <main className="app-main">
          <WorkorderPage />
        </main>
      </div>
    </div>
  );
}
