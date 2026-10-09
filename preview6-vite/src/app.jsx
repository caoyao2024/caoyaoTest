// App entry — 采集规则配置（顶部导航 + 侧边导航 + 表单向下列 + 表格）
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 主题模式)
//   Layer 2 mock data     → src/mock/rules.js      (采集规则 mock + 选项字典)
//   Layer 3 reusable      → src/components/soft-tag/
//   Layer 4 views         → src/views/app-header | app-sidebar | rule-form | rule-table
//   Layer 5 layout        → app.jsx

import { useState } from "react";
import { AppProvider } from "./context.jsx";
import AppHeader from "./views/app-header/index.jsx";
import AppSidebar from "./views/app-sidebar/index.jsx";
import RuleForm from "./views/rule-form/index.jsx";
import RuleTable from "./views/rule-table/index.jsx";
import { ruleList } from "./mock/rules.js";
import "./app.css";

export default function App() {
  const [rules, setRules] = useState(ruleList);

  const handleCreate = (rule) => {
    setRules((prev) => [rule, ...prev]);
  };

  return (
    <AppProvider>
      <div className="app-root">
        <AppHeader />
        <div className="app-body">
          <AppSidebar />
          <main className="app-content">
            <RuleForm onCreate={handleCreate} />
            <RuleTable data={rules} />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
