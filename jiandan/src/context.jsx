import { useState, useEffect, createContext, useContext, useMemo, useCallback } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import MessageDialog from "@nce/eview-react/MessageDialog";
import { INITIAL_METRICS, decorateMetric, nowStamp, nextMetricId } from "./mock/metrics.js";

const AppContext = createContext(null);

const EMPTY_FILTERS = {
  keyword: "",
  category: undefined,
  cycle: undefined,
  status: undefined,
  dimension: undefined,
  source: undefined,
  owner: undefined,
  unit: undefined,
};

function matchMetric(metric, filters) {
  const keyword = (filters.keyword || "").trim().toLowerCase();
  if (keyword) {
    const haystack = (metric.name + " " + metric.code + " " + metric.owner).toLowerCase();
    if (haystack.indexOf(keyword) === -1) return false;
  }
  const keys = ["category", "cycle", "status", "dimension", "source", "owner", "unit"];
  return keys.every((key) => !filters[key] || metric[key] === filters[key]);
}

function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editor, setEditor] = useState({ open: false, mode: "create", record: null });

  const [toast, setToast] = useState({ display: false, content: "", key: 0 });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    content: "",
    okText: "确定",
    cancelText: "取消",
    danger: false,
    onOk: null,
  });

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const filteredMetrics = useMemo(
    () => metrics.filter((metric) => matchMetric(metric, filters)),
    [metrics, filters]
  );

  const activeFilterCount = useMemo(
    () => Object.keys(EMPTY_FILTERS).filter((key) => Boolean(filters[key])).length,
    [filters]
  );

  const updateDraft = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const applyFilters = () => setFilters(draft);
  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
  };

  const openCreate = () => setEditor({ open: true, mode: "create", record: null });
  const openEdit = (record) => setEditor({ open: true, mode: "edit", record });
  const closeEditor = () => setEditor({ open: false, mode: "create", record: null });

  const showToast = useCallback((content) => {
    setToast({ display: true, content, key: Date.now() });
  }, []);

  const showConfirm = useCallback((opts) => {
    setConfirmDialog({
      isOpen: true,
      title: opts.title || "",
      content: opts.content || "",
      okText: opts.okText || "确定",
      cancelText: opts.cancelText || "取消",
      danger: opts.danger || false,
      onOk: opts.onOk || null,
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const saveMetric = (values) => {
    const stamp = nowStamp();
    const effectiveAt = values.effectiveAt ? (typeof values.effectiveAt === "string" ? values.effectiveAt : values.effectiveAt.format("YYYY-MM-DD")) : "";
    setMetrics((list) => {
      const payload = { ...values, effectiveAt, updatedAt: stamp };
      if (editor.mode === "edit" && editor.record) {
        return list.map((metric) =>
          metric.id === editor.record.id ? decorateMetric({ ...metric, ...payload }) : metric
        );
      }
      const created = decorateMetric({
        ...payload,
        id: nextMetricId(list),
        current: 0,
        trend: 0,
        description: values.description || "",
      });
      return [created, ...list];
    });
    closeEditor();
  };

  const duplicateMetric = (id) => {
    setMetrics((list) => {
      const source = list.find((metric) => metric.id === id);
      if (!source) return list;
      const copy = decorateMetric({
        ...source,
        id: nextMetricId(list),
        name: source.name + "（副本）",
        status: "draft",
        updatedAt: nowStamp(),
      });
      return [copy, ...list];
    });
  };

  const updateStatus = (ids, status) => {
    setMetrics((list) =>
      list.map((metric) =>
        ids.indexOf(metric.id) !== -1
          ? { ...metric, status, updatedAt: nowStamp() }
          : metric
      )
    );
    setSelectedRowKeys((keys) => keys.filter((key) => ids.indexOf(key) === -1));
  };

  const removeMetric = (id) => {
    setMetrics((list) => list.filter((metric) => metric.id !== id));
    setSelectedRowKeys((keys) => keys.filter((key) => key !== id));
  };

  const value = {
    isDark,
    toggleDark: () => setIsDark((dark) => !dark),
    metrics,
    filteredMetrics,
    draft,
    filters,
    activeFilterCount,
    updateDraft,
    applyFilters,
    resetFilters,
    selectedRowKeys,
    setSelectedRowKeys,
    editor,
    openCreate,
    openEdit,
    closeEditor,
    saveMetric,
    duplicateMetric,
    updateStatus,
    removeMetric,
    showToast,
    showConfirm,
  };

  const handleConfirmOk = () => {
    const onOk = confirmDialog.onOk;
    closeConfirm();
    if (typeof onOk === "function") {
      onOk();
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast.display ? (
        <DivMessage key={toast.key} display type="success">
          {toast.content}
        </DivMessage>
      ) : null}
      <MessageDialog
        type="confirm"
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        content={confirmDialog.content}
        highRisk={confirmDialog.danger}
        buttons={{
          ok: { text: confirmDialog.okText, status: confirmDialog.danger ? "risk" : "primary", onClick: handleConfirmOk },
          cancel: { text: confirmDialog.cancelText, onClick: closeConfirm },
        }}
      />
    </AppContext.Provider>
  );
}

function useApp() {
  return useContext(AppContext);
}

export { AppProvider, useApp };
