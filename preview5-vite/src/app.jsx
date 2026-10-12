import { useState } from "react";
import { AppProvider } from "./context.jsx";
import TopBar from "./views/top-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import OrderForm from "./views/order-form/index.jsx";
import "./app.css";

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
