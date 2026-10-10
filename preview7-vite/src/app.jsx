// App entry — 运营商政企业务受理页面
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → mock/              (per-domain files, e.g. order.js)
//   Layer 3 reusable      → components/{name}/ (cross-view, e.g. form-field)
//   Layer 4 views         → views/{name}/      (one per section, e.g. header-bar / side-nav)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { AppProvider } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import OrderWizard from "./views/order-wizard/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <div className="app-body">
          <SideNav />
          <main className="app-main">
            <OrderWizard />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
