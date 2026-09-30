// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → context.jsx             (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → mock/                   (per-domain files, e.g. workorder.js)
//   Layer 3 reusable      → components/{name}/      (cross-view, e.g. field-row / panel-card)
//   Layer 4 views         → views/{name}/           (one per tab/section, e.g. top-bar / side-nav)
//   Layer 5 layout        → app.jsx                 (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.
// 暗色模式：isDark 状态与切换 UI 在 context.jsx(AppProvider) 与 top-bar；
// ConfigProvider(theme.darkAlgorithm) 已移除，eview ConfigProvider + IntlProvider 由 main.jsx 提供，
// aui3_1_dark(body) + dark(html) 类名切换在 context.jsx 的 useEffect 中驱动。

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
