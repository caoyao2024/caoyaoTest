import { AppProvider } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import PageHeading from "./views/page-heading/index.jsx";
import MetricFilter from "./views/metric-filter/index.jsx";
import MetricTable from "./views/metric-table/index.jsx";
import MetricEditor from "./views/metric-editor/index.jsx";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <main className="app-main">
          <PageHeading />
          <MetricFilter />
          <MetricTable />
        </main>
        <MetricEditor />
      </div>
    </AppProvider>
  );
}
