// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. order.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. form-field / status-tag)
//   Layer 4 views         → src/views/{name}/      (one per section, e.g. top-bar / order-form)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { useState } from "react";
import { AppProvider } from "./context.jsx";
import TopBar from "./views/top-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import OrderForm from "./views/order-form/index.jsx";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppProvider>
      <div className="app-root">
        <TopBar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
        <div className="app-body">
          <SideNav collapsed={collapsed} />
          <main className="app-main">
            <OrderForm />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
