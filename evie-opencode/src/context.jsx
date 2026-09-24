import { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { INITIAL_METRICS, decorateMetric, nowStamp, nextMetricId } from './mock/metrics.js';

const AppContext = createContext(null);

const EMPTY_FILTERS = {
  keyword: '',
  category: undefined,
  cycle: undefined,
  status: undefined,
  dimension: undefined,
  source: undefined,
  owner: undefined,
  unit: undefined,
};

function matchMetric(metric, filters) {
  const keyword = (filters.keyword || '').trim().toLowerCase();
  if (keyword) {
    const haystack = (metric.name + ' ' + metric.code + ' ' + metric.owner).toLowerCase();
    if (haystack.indexOf(keyword) === -1) return false;
  }
  const keys = ['category', 'cycle', 'status', 'dimension', 'source', 'owner', 'unit'];
  return keys.every((key) => !filters[key] || metric[key] === filters[key]);
}

function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editor, setEditor] = useState({ open: false, mode: 'create', record: null });
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    document.body.classList.toggle('aui3_1_dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const notify = useCallback((text, type = 'success') => {
    setNotice({ key: Date.now(), type, text });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice?.key]);

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
  const searchKeyword = (keyword) => setFilters((prev) => ({ ...prev, keyword }));
  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
  };

  const openCreate = () => setEditor({ open: true, mode: 'create', record: null });
  const openEdit = (record) => setEditor({ open: true, mode: 'edit', record });
  const closeEditor = () => setEditor({ open: false, mode: 'create', record: null });

  const saveMetric = (values) => {
    const stamp = nowStamp();
    const ea = values.effectiveAt;
    const effectiveAt = ea ? (ea.format ? ea.format('YYYY-MM-DD') : String(ea)) : '';
    setMetrics((list) => {
      const payload = { ...values, effectiveAt, updatedAt: stamp };
      if (editor.mode === 'edit' && editor.record) {
        return list.map((metric) =>
          metric.id === editor.record.id ? decorateMetric({ ...metric, ...payload }) : metric
        );
      }
      const created = decorateMetric({
        ...payload,
        id: nextMetricId(list),
        current: 0,
        trend: 0,
        description: values.description || '',
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
        name: source.name + '（副本）',
        status: 'draft',
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
    searchKeyword,
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
    notice,
    notify,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  return useContext(AppContext);
}

export { AppProvider, useApp };
