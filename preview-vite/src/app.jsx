// App entry — Tag 组件展示页面
import { AppProvider } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import TagShowcase from "./views/tag-showcase/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <main className="app-main">
          <TagShowcase />
        </main>
      </div>
    </AppProvider>
  );
}
