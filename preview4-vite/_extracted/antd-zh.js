var __export = {};
/* ===== assets/shared/antd-zh.js ===== */
(function () {
// antd-zh.js — 中文 locale 补丁包
// antd.min.js / dayjs.min.js UMD 均不含 locale 包,本文件补齐:
//   1. 注册 dayjs zh-cn locale(星期/月份/相对时间中文化)
//   2. 导出 antd ConfigProvider 可用的 zhCN locale 对象
//
// 用法(页面入口):
//   import zhCN from "./assets/shared/antd-zh.js";
//   <ConfigProvider locale={zhCN}> ... </ConfigProvider>

// ---- 1. 注册 dayjs zh-cn locale(dayjs.min.js 核心包不带任何 locale) ----
dayjs.locale(
  "zh-cn",
  {
    name: "zh-cn",
    weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
    weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
    weekdaysMin: "日_一_二_三_四_五_六".split("_"),
    months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
    monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
    weekStart: 1,
    formats: {
      LT: "HH:mm",
      LTS: "HH:mm:ss",
      L: "YYYY/MM/DD",
      LL: "YYYY年M月D日",
      LLL: "YYYY年M月D日 Ah点mm分",
      LLLL: "YYYY年M月D日ddddAh点mm分",
      l: "YYYY/M/D",
      ll: "YYYY年M月D日",
      lll: "YYYY年M月D日 HH:mm",
      llll: "YYYY年M月D日dddd HH:mm",
    },
    relativeTime: {
      future: "%s内",
      past: "%s前",
      s: "几秒",
      m: "1 分钟",
      mm: "%d 分钟",
      h: "1 小时",
      hh: "%d 小时",
      d: "1 天",
      dd: "%d 天",
      M: "1 个月",
      MM: "%d 个月",
      y: "1 年",
      yy: "%d 年",
    },
    meridiem(hour, minute) {
      const hm = hour * 100 + minute;
      if (hm < 600) return "凌晨";
      if (hm < 900) return "早上";
      if (hm < 1130) return "上午";
      if (hm < 1230) return "中午";
      if (hm < 1800) return "下午";
      return "晚上";
    },
    ordinal(number, period) {
      switch (period) {
        case "W":
          return `${number}周`;
        default:
          return `${number}日`;
      }
    },
  },
  true
);
// ---- 2. antd zh_CN locale(对齐 antd 5 官方 zh_CN,常用组件全量) ----
const typeTemplate = "${label}不是一个有效的${type}";
const zhCN = {
  locale: "zh-cn",
  dayjsLocale: "zh-cn",
  Pagination: {
    items_per_page: "条/页",
    jump_to: "跳至",
    jump_to_confirm: "确定",
    page: "页",
    prev_page: "上一页",
    next_page: "下一页",
    prev_5: "向前 5 页",
    next_5: "向后 5 页",
    prev_3: "向前 3 页",
    next_3: "向后 3 页",
  },
  DatePicker: {
    lang: {
      placeholder: "请选择日期",
      yearPlaceholder: "请选择年份",
      quarterPlaceholder: "请选择季度",
      monthPlaceholder: "请选择月份",
      weekPlaceholder: "请选择周",
      rangePlaceholder: ["开始日期", "结束日期"],
      rangeYearPlaceholder: ["开始年份", "结束年份"],
      rangeMonthPlaceholder: ["开始月份", "结束月份"],
      rangeWeekPlaceholder: ["开始周", "结束周"],
      locale: "zh_cn",
      today: "今天",
      now: "此刻",
      backToToday: "返回今天",
      ok: "确定",
      timeSelect: "选择时间",
      dateSelect: "选择日期",
      weekSelect: "选择周",
      clear: "清除",
      month: "月",
      year: "年",
      previousMonth: "上个月 (翻页上键)",
      nextMonth: "下个月 (翻页下键)",
      monthSelect: "选择月份",
      yearSelect: "选择年份",
      decadeSelect: "选择年代",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH时mm分ss秒",
      previousYear: "上一年 (Control键加左方向键)",
      nextYear: "下一年 (Control键加右方向键)",
      previousDecade: "上一年代",
      nextDecade: "下一年代",
      previousCentury: "上一世纪",
      nextCentury: "下一世纪",
      shortWeekDays: ["一", "二", "三", "四", "五", "六", "日"],
    },
    timePickerLocale: { placeholder: "请选择时间" },
  },
  TimePicker: { placeholder: "请选择时间" },
  Calendar: {
    lang: {
      placeholder: "请选择日期",
      yearPlaceholder: "请选择年份",
      quarterPlaceholder: "请选择季度",
      monthPlaceholder: "请选择月份",
      weekPlaceholder: "请选择周",
      rangePlaceholder: ["开始日期", "结束日期"],
      locale: "zh_cn",
      today: "今天",
      now: "此刻",
      backToToday: "返回今天",
      ok: "确定",
      timeSelect: "选择时间",
      dateSelect: "选择日期",
      weekSelect: "选择周",
      clear: "清除",
      month: "月",
      year: "年",
      previousMonth: "上个月 (翻页上键)",
      nextMonth: "下个月 (翻页下键)",
      monthSelect: "选择月份",
      yearSelect: "选择年份",
      decadeSelect: "选择年代",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH时mm分ss秒",
      previousYear: "上一年 (Control键加左方向键)",
      nextYear: "下一年 (Control键加右方向键)",
      previousDecade: "上一年代",
      nextDecade: "下一年代",
      previousCentury: "上一世纪",
      nextCentury: "下一世纪",
      shortWeekDays: ["一", "二", "三", "四", "五", "六", "日"],
    },
    timePickerLocale: { placeholder: "请选择时间" },
  },
  global: { placeholder: "请选择" },
  Table: {
    filterTitle: "筛选",
    filterConfirm: "确定",
    filterReset: "重置",
    filterEmptyText: "无筛选项",
    filterCheckall: "全选",
    filterSearchPlaceholder: "在筛选项中搜索",
    emptyText: "暂无数据",
    selectAll: "全选当页",
    selectInvert: "反选当页",
    selectNone: "清空所有",
    selectionAll: "全选所有",
    sortTitle: "排序",
    expand: "展开行",
    collapse: "关闭行",
    triggerDesc: "点击降序",
    triggerAsc: "点击升序",
    cancelSort: "取消排序",
  },
  Modal: { okText: "确定", cancelText: "取消", justOkText: "知道了" },
  Tour: { Next: "下一步", Previous: "上一步", Finish: "结束" },
  Popconfirm: { okText: "确定", cancelText: "取消" },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "请输入搜索内容",
    itemUnit: "项",
    itemsUnit: "项",
    remove: "删除",
    selectCurrent: "全选当页",
    removeCurrent: "删除当页",
    selectAll: "全选所有",
    removeAll: "删除全部",
    selectInvert: "反选当页",
  },
  Upload: {
    uploading: "文件上传中",
    removeFile: "删除文件",
    uploadError: "上传错误",
    previewFile: "预览文件",
    downloadFile: "下载文件",
  },
  Empty: { description: "暂无数据" },
  Icon: { icon: "图标" },
  Text: {
    edit: "编辑",
    copy: "复制",
    copied: "复制成功",
    expand: "展开",
    collapse: "收起",
  },
  Form: {
    optional: "（可选）",
    defaultValidateMessages: {
      default: "字段验证错误${label}",
      required: "请输入${label}",
      enum: "${label}必须是其中一个[${enum}]",
      whitespace: "${label}不能为空字符",
      date: {
        format: "${label}日期格式无效",
        parse: "${label}不能转换为日期",
        invalid: "${label}是一个无效日期",
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate,
      },
      string: {
        len: "${label}须为${len}个字符",
        min: "${label}最少${min}个字符",
        max: "${label}最多${max}个字符",
        range: "${label}须在${min}-${max}个字符之间",
      },
      number: {
        len: "${label}必须等于${len}",
        min: "${label}最小值为${min}",
        max: "${label}最大值为${max}",
        range: "${label}须在${min}-${max}之间",
      },
      array: {
        len: "须为${len}个${label}",
        min: "最少${min}个${label}",
        max: "最多${max}个${label}",
        range: "${label}数量须在${min}-${max}之间",
      },
      pattern: { mismatch: "${label}与模式不匹配（${pattern}）" },
    },
  },
  Image: { preview: "预览" },
  QRCode: { expired: "二维码已过期", refresh: "点击刷新", scanned: "已扫描" },
  ColorPicker: {
    presetEmpty: "暂无",
    transparent: "无色",
    singleColor: "单色",
    gradientColor: "渐变色",
  },
};
  Object.assign(__export, { zhCN });
})();

/* ===== src/context.jsx ===== */
(function () {
  const { useState, useEffect, createContext, useContext } = React;
// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeTopNav, setActiveTopNav] = useState("workorder");
  const [activeSideKey, setActiveSideKey] = useState("order-create");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    navCollapsed,
    toggleNav: () => setNavCollapsed((c) => !c),
    activeTopNav,
    setActiveTopNav,
    activeSideKey,
    setActiveSideKey,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  return useContext(AppContext);
}
  Object.assign(__export, { AppProvider, useApp });
})();

/* ===== assets/shared/icon.jsx ===== */
(function () {
  const LUCIDE = {
    "arrow-right": [["path",{"d":"M5 12h14"}],["path",{"d":"m12 5 7 7-7 7"}]],
    "badge-check": [["path",{"d":"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"}],["path",{"d":"m9 12 2 2 4-4"}]],
    "bell": [["path",{"d":"M10.268 21a2 2 0 0 0 3.464 0"}],["path",{"d":"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"}]],
    "boxes": [["path",{"d":"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"}],["path",{"d":"m7 16.5-4.74-2.85"}],["path",{"d":"m7 16.5 5-3"}],["path",{"d":"M7 16.5v5.17"}],["path",{"d":"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"}],["path",{"d":"m17 16.5-5-3"}],["path",{"d":"m17 16.5 4.74-2.85"}],["path",{"d":"M17 16.5v5.17"}],["path",{"d":"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"}],["path",{"d":"M12 8 7.26 5.15"}],["path",{"d":"m12 8 4.74-2.85"}],["path",{"d":"M12 13.5V8"}]],
    "calendar-check": [["path",{"d":"M8 2v3"}],["path",{"d":"M16 2v3"}],["rect",{"x":"3","y":"3","width":"18","height":"18","rx":"2"}],["path",{"d":"M3 9h18"}],["path",{"d":"m9 15 2 2 4-4"}]],
    "chart-column": [["path",{"d":"M3 3v16a2 2 0 0 0 2 2h16"}],["path",{"d":"M18 17V9"}],["path",{"d":"M13 17V5"}],["path",{"d":"M8 17v-3"}]],
    "chevron-down": [["path",{"d":"m6 9 6 6 6-6"}]],
    "chevron-right": [["path",{"d":"m9 18 6-6-6-6"}]],
    "chevron-up": [["path",{"d":"m18 15-6-6-6 6"}]],
    "circle-alert": [["circle",{"cx":"12","cy":"12","r":"10"}],["line",{"x1":"12","x2":"12","y1":"8","y2":"12"}],["line",{"x1":"12","x2":"12.01","y1":"16","y2":"16"}]],
    "circle-check": [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"m9 12 2 2 4-4"}]],
    "circle-user": [["circle",{"cx":"12","cy":"12","r":"10"}],["circle",{"cx":"12","cy":"10","r":"3"}],["path",{"d":"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"}]],
    "clipboard-check": [["rect",{"width":"8","height":"4","x":"8","y":"2","rx":"1","ry":"1"}],["path",{"d":"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}],["path",{"d":"m9 14 2 2 4-4"}]],
    "clipboard-list": [["rect",{"width":"8","height":"4","x":"8","y":"2","rx":"1","ry":"1"}],["path",{"d":"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}],["path",{"d":"M12 11h4"}],["path",{"d":"M12 16h4"}],["path",{"d":"M8 11h.01"}],["path",{"d":"M8 16h.01"}]],
    "clock": [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 6v6l4 2"}]],
    "file-check": [["path",{"d":"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{"d":"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{"d":"m9 15 2 2 4-4"}]],
    "file-clock": [["path",{"d":"M16 22h2a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v2.85"}],["path",{"d":"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{"d":"M8 14v2.2l1.6 1"}],["circle",{"cx":"8","cy":"16","r":"6"}]],
    "file-text": [["path",{"d":"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{"d":"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{"d":"M10 9H8"}],["path",{"d":"M16 13H8"}],["path",{"d":"M16 17H8"}]],
    "hard-drive": [["path",{"d":"M10 16h.01"}],["path",{"d":"M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}],["path",{"d":"M21.946 12.013H2.054"}],["path",{"d":"M6 16h.01"}]],
    "headphones": [["path",{"d":"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"}]],
    "inbox": [["polyline",{"points":"22 12 16 12 14 15 10 15 8 12 2 12"}],["path",{"d":"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}]],
    "info": [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 16v-4"}],["path",{"d":"M12 8h.01"}]],
    "layers": [["path",{"d":"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"}],["path",{"d":"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"}],["path",{"d":"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"}]],
    "layout-dashboard": [["rect",{"width":"7","height":"9","x":"3","y":"3","rx":"1"}],["rect",{"width":"7","height":"5","x":"14","y":"3","rx":"1"}],["rect",{"width":"7","height":"9","x":"14","y":"12","rx":"1"}],["rect",{"width":"7","height":"5","x":"3","y":"16","rx":"1"}]],
    "log-out": [["path",{"d":"m16 17 5-5-5-5"}],["path",{"d":"M21 12H9"}],["path",{"d":"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}]],
    "moon": [["path",{"d":"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"}]],
    "network": [["rect",{"x":"16","y":"16","width":"6","height":"6","rx":"1"}],["rect",{"x":"2","y":"16","width":"6","height":"6","rx":"1"}],["rect",{"x":"9","y":"2","width":"6","height":"6","rx":"1"}],["path",{"d":"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"}],["path",{"d":"M12 12V8"}]],
    "panel-left-close": [["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2"}],["path",{"d":"M9 3v18"}],["path",{"d":"m16 15-3-3 3-3"}]],
    "panel-left-open": [["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2"}],["path",{"d":"M9 3v18"}],["path",{"d":"m14 9 3 3-3 3"}]],
    "paperclip": [["path",{"d":"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"}]],
    "phone": [["path",{"d":"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"}]],
    "plus": [["path",{"d":"M5 12h14"}],["path",{"d":"M12 5v14"}]],
    "rotate-ccw": [["path",{"d":"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{"d":"M3 3v5h5"}]],
    "save": [["path",{"d":"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{"d":"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{"d":"M7 3v4a1 1 0 0 0 1 1h7"}]],
    "scan-line": [["path",{"d":"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{"d":"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{"d":"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{"d":"M7 21H5a2 2 0 0 1-2-2v-2"}],["path",{"d":"M7 12h10"}]],
    "search": [["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]],
    "send": [["path",{"d":"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"}],["path",{"d":"m21.854 2.147-10.94 10.939"}]],
    "server": [["rect",{"width":"20","height":"8","x":"2","y":"2","rx":"2","ry":"2"}],["rect",{"width":"20","height":"8","x":"2","y":"14","rx":"2","ry":"2"}],["line",{"x1":"6","x2":"6.01","y1":"6","y2":"6"}],["line",{"x1":"6","x2":"6.01","y1":"18","y2":"18"}]],
    "settings": [["path",{"d":"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{"cx":"12","cy":"12","r":"3"}]],
    "shield-check": [["path",{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{"d":"m9 12 2 2 4-4"}]],
    "siren": [["path",{"d":"M7 18v-6a5 5 0 1 1 10 0v6"}],["path",{"d":"M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"}],["path",{"d":"M21 12h1"}],["path",{"d":"M18.5 4.5 18 5"}],["path",{"d":"M2 12h1"}],["path",{"d":"M12 2v1"}],["path",{"d":"m4.929 4.929.707.707"}],["path",{"d":"M12 12v6"}]],
    "square-menu": [["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2"}],["path",{"d":"M7 8h10"}],["path",{"d":"M7 12h10"}],["path",{"d":"M7 16h10"}]],
    "square-pen": [["path",{"d":"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}],["path",{"d":"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"}]],
    "sun": [["circle",{"cx":"12","cy":"12","r":"4"}],["path",{"d":"M12 2v2"}],["path",{"d":"M12 20v2"}],["path",{"d":"m4.93 4.93 1.41 1.41"}],["path",{"d":"m17.66 17.66 1.41 1.41"}],["path",{"d":"M2 12h2"}],["path",{"d":"M20 12h2"}],["path",{"d":"m6.34 17.66-1.41 1.41"}],["path",{"d":"m19.07 4.93-1.41 1.41"}]],
    "thermometer-snowflake": [["path",{"d":"m10 20-1.25-2.5L6 18"}],["path",{"d":"M10 4 8.75 6.5 6 6"}],["path",{"d":"M10.585 15H10"}],["path",{"d":"M2 12h6.5L10 9"}],["path",{"d":"M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"}],["path",{"d":"m4 10 1.5 2L4 14"}],["path",{"d":"m7 21 3-6-1.5-3"}],["path",{"d":"m7 3 3 6h2"}]],
    "trash-2": [["path",{"d":"M10 11v6"}],["path",{"d":"M14 11v6"}],["path",{"d":"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{"d":"M3 6h18"}],["path",{"d":"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]],
    "upload": [["path",{"d":"M12 3v12"}],["path",{"d":"m17 8-5-5-5 5"}],["path",{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}]],
    "x": [["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]],
    "zap": [["path",{"d":"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"}]],
  };
  const { useState, useEffect } = React;
// ---- Lucide (offline fallback, table injected at build time) ----
const ICONS = typeof LUCIDE !== "undefined" ? LUCIDE : {};

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function lookupIcon(name) {
  if (!name) return null;
  return (
    ICONS[name] ||
    ICONS[camelToKebab(name)] ||
    ICONS[name.replace(/-([a-z])/g, (_m, c) => c.toUpperCase())] ||
    null
  );
}

// ---- icon-plus (联通) online flow, same as packages/previewpc ----
const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;

let plusState = null; // null = probing, true = icon-plus available, false = fall back to Lucide
let plusPromise = null; // singleton getConfig probe promise
let iconConfig = null;
let defaultColorId = "";
const iconInfoMap = {}; // name -> { name, url }
const svgCache = new Map(); // "name&variant&color" -> svg text

// variant prop -> getConfig style key (matches previewpc's shapeToStyleKey)
const STYLE_KEY = {
  lined: "border",
  filled: "filled",
  "two-tone": "two_colors1",
  circle: "round_bottom2",
  square: "square_bottom2",
};

function getStyleValue(styleKey) {
  return iconConfig?.style?.find((s) => s.key === styleKey)?.value || styleKey;
}

// resolve an API color id from the requested hex against getConfig colors
function resolveColorId(variant, colorHex) {
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colors = (iconConfig?.colors || []).filter((c) => c.style === styleValue);
  if (colorHex) {
    const m = colors.find((c) =>
      c.value.split(",").map((v) => v.trim()).includes(colorHex)
    );
    if (m) return m.id;
  }
  return defaultColorId || colors[0]?.id || "";
}

// getConfig probe == 联通可用性验证 (same as previewpc fetchIconConfig)
function ensurePlus() {
  if (plusPromise) return plusPromise;
  plusPromise = (async () => {
    try {
      const resp = await fetch(GET_CONFIG);
      if (!resp.ok) {
        plusState = false;
        return false;
      }
      iconConfig = await resp.json();
      const linear = iconConfig.colors?.find(
        (c) => c.type === "linear" || c.type === "通用色"
      );
      defaultColorId =
        linear?.id || iconConfig.colors?.[0]?.id || "";
      plusState = true;
      return true;
    } catch (e) {
      plusState = false;
      return false;
    }
  })();
  return plusPromise;
}

// pick the best icon-plus match for a keyword (prefer system-icon group, then name contains keyword, else first)
function selectBestIcon(icons, keyword) {
  return (
    icons.find(
      (i) => Array.isArray(i.group) && i.group.some((g) => g.includes("系统图标"))
    ) ||
    icons.find((i) => i.name?.toLowerCase().includes(keyword.toLowerCase())) ||
    icons[0]
  );
}

// name -> { name, url } via getIconInfo (cached in iconInfoMap)
async function resolveIconInfo(name) {
  if (iconInfoMap[name]) return iconInfoMap[name];
  try {
    const resp = await fetch(
      `${GET_ICON_INFO}?keyword=${encodeURIComponent(name)}&topK=2&source_id=6`
    );
    const data = await resp.json(); // [{ keyword, icons: [{ icon_id, name, category, group[], url }] }]
    const entry = (Array.isArray(data) ? data : [data]).find(
      (d) => d.icons?.length
    );
    const selected = selectBestIcon(entry?.icons || [], name);
    if (!selected?.url) return null;
    iconInfoMap[name] = { name: selected.name, url: selected.url };
    return iconInfoMap[name];
  } catch (e) {
    return null;
  }
}

// fetch the SVG text for a name via getIcon (url + size + variant + colorId + fileType=svg)
async function fetchSvg(name, variant, colorHex) {
  const info = await resolveIconInfo(name);
  if (!info) return "";
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colorId = resolveColorId(variant, colorHex);
  try {
    const resp = await fetch(
      `${GET_ICON}?url=${encodeURIComponent(info.url)}&size=16&style=${encodeURIComponent(
        styleValue
      )}&color=${encodeURIComponent(colorId)}&fileType=svg`
    );
    const data = await resp.json(); // { url, name, data } or array
    const item = Array.isArray(data) ? data[0] : data;
    return item?.data || ""; // raw SVG text, injected as-is
  } catch (e) {
    return "";
  }
}

// size → rem 字符串;数字(设计画布 px)兜底转换为 rem
function resolveSize(size) {
  if (typeof size === "number") {
    console.warn(`[Icon] size={${size}} is a number — use rem string instead (e.g. size="${(size / 16).toFixed(4).replace(/\.?0+$/, "")}rem")`);
    const rem = size / 16;
    return `${parseFloat(rem.toFixed(4))}rem`;
  }
  return size;
}

function Icon({
  name,
  src,
  size = "1rem",
  color,
  className = "",
  style,
  strokeWidth = 2,
  variant = "lined",
}) {
  const resolvedSize = resolveSize(size);
  const [plus, setPlus] = useState(plusState); // reuse already-probed result
  const [svg, setSvg] = useState(
    () => svgCache.get(`${name}&${variant}&${color}`) || ""
  );

  useEffect(() => {
    if (src) return; // user-asset mode: no network needed
    let alive = true;
    ensurePlus().then((ok) => {
      if (!alive) return;
      setPlus(ok);
      if (!ok) return; // getConfig probe failed → Lucide branch
      const key = `${name}&${variant}&${color}`;
      if (svgCache.has(key)) {
        setSvg(svgCache.get(key));
        return;
      }
      fetchSvg(name, variant, color).then((s) => {
        if (!alive) return;
        svgCache.set(key, s);
        setSvg(s);
      });
    });
    return () => {
      alive = false;
    };
  }, [src, name, variant, color]);

  // user-provided asset (svg/png/jpg) via relative path — overrides name when both are set
  if (src) {
    return React.createElement("img", {
      src: src,
      width: resolvedSize,
      height: resolvedSize,
      className: className,
      alt: "",
      "aria-hidden": true,
      style: { ...style, display: "inline-block", verticalAlign: "middle" },
    });
  }

  // probe not finished yet → render nothing
  if (plus === null) return null;

  // icon-plus unavailable (offline) → Lucide fallback (original behavior)
  if (plus === false) {
    const nodes = lookupIcon(name);
    if (!nodes) return null;
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: resolvedSize,
        height: resolvedSize,
        viewBox: "0 0 24 24",
        fill: "none",
        strokeWidth: strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className,
        "aria-hidden": true,
        style: { ...style, stroke: color || "currentColor" },
      },
      nodes.map(([tag, attrs], i) =>
        React.createElement(tag, { key: i, ...attrs })
      )
    );
  }

  // icon-plus available → render fetched SVG text as-is (only width/height on the wrapper)
  if (!svg) {
    return React.createElement("span", {
      className,
      "aria-hidden": true,
      style: { ...style, width: resolvedSize, height: resolvedSize },
    });
  }
  
  return React.createElement("span", {
    className,
    "aria-hidden": true,
    style: { ...style, width: resolvedSize, height: resolvedSize },
    dangerouslySetInnerHTML: { __html: svg },
  });
}
  Object.assign(__export, { Icon });
})();

/* ===== src/mock/workorder.js ===== */
(function () {
// Layer 2 — 工单填报领域 Mock 数据

const topNavItems = [
  { key: "dashboard", label: "工作台", icon: "layout-dashboard" },
  {
    key: "workorder",
    label: "工单中心",
    icon: "clipboard-list",
    children: [
      { key: "wo-create", label: "工单填报", desc: "新建巡检 / 维修工单" },
      { key: "wo-list", label: "工单列表", desc: "全部工单与流转状态" },
      { key: "wo-approve", label: "待我审批", desc: "3 条待处理" },
      { key: "wo-template", label: "填报模板", desc: "按设备类型套用" },
    ],
  },
  {
    key: "asset",
    label: "资产管理",
    icon: "hard-drive",
    children: [
      { key: "asset-ledger", label: "资产台账", desc: "1,284 台在网设备" },
      { key: "asset-lifecycle", label: "生命周期", desc: "上架 / 变更 / 退役" },
      { key: "asset-spare", label: "备件库存", desc: "库存预警 6 项" },
    ],
  },
  { key: "patrol", label: "巡检计划", icon: "calendar-check" },
  { key: "report", label: "报表分析", icon: "chart-column" },
];

const sideMenu = [
  {
    key: "grp-overview",
    label: "运营概览",
    icon: "layout-dashboard",
    children: [
      { key: "overview-board", label: "实时看板" },
      { key: "overview-todo", label: "我的待办" },
    ],
  },
  {
    key: "grp-order",
    label: "工单管理",
    icon: "clipboard-list",
    children: [
      { key: "order-create", label: "新建巡检工单" },
      { key: "order-list", label: "工单列表" },
      { key: "order-approval", label: "审批中心" },
      { key: "order-dispatch", label: "派单调度" },
    ],
  },
  {
    key: "grp-device",
    label: "设备与巡检",
    icon: "server",
    children: [
      { key: "device-ledger", label: "设备台账" },
      { key: "device-plan", label: "巡检计划" },
      { key: "device-alarm", label: "告警记录" },
    ],
  },
  {
    key: "grp-report",
    label: "统计分析",
    icon: "chart-column",
    children: [
      { key: "report-efficiency", label: "工单效率分析" },
      { key: "report-fault", label: "故障率趋势" },
    ],
  },
  { key: "grp-setting", label: "系统设置", icon: "settings" },
];

const notifications = [
  { id: "n1", title: "工单 WO-20260928-0041 已超时", time: "8 分钟前", tone: "error", icon: "siren" },
  { id: "n2", title: "杭州 IDC-3 机房温度告警恢复", time: "36 分钟前", tone: "success", icon: "thermometer-snowflake" },
  { id: "n3", title: "李泽宇提交了巡检工单待你审批", time: "1 小时前", tone: "info", icon: "clipboard-check" },
  { id: "n4", title: "备件库存 UPS-模块 低于安全水位", time: "3 小时前", tone: "warning", icon: "boxes" },
  { id: "n5", title: "本周巡检计划完成率 86%", time: "昨天 18:00", tone: "neutral", icon: "chart-column" },
];

const orderTypes = [
  { value: "routine", label: "例行巡检" },
  { value: "fault", label: "故障维修" },
  { value: "change", label: "变更实施" },
  { value: "emergency", label: "应急保障" },
  { value: "acceptance", label: "工程验收" },
];

const priorityOptions = [
  { value: "low", label: "低 · 计划内" },
  { value: "medium", label: "中 · 常规" },
  { value: "high", label: "高 · 优先" },
  { value: "urgent", label: "紧急 · 立即" },
];

const priorityMeta = {
  low: { label: "低", tone: "neutral" },
  medium: { label: "中", tone: "info" },
  high: { label: "高", tone: "critical" },
  critical: { label: "严重", tone: "critical" },
  urgent: { label: "紧急", tone: "error" },
};

// 兜底元数据 —— 任何未在枚举中登记的取值都不会导致渲染中断
const fallbackMeta = { label: "未知", tone: "neutral" };

function metaOf(table, key) {
  return (table && table[key]) || fallbackMeta;
}

const stationOptions = [
  { value: "hz-idc-01", label: "杭州 · 滨江 IDC-1 机房" },
  { value: "hz-idc-03", label: "杭州 · 滨江 IDC-3 机房" },
  { value: "sh-jd-02", label: "上海 · 嘉定机房" },
  { value: "bj-cy-05", label: "北京 · 朝阳数据中心" },
  { value: "gz-th-02", label: "广州 · 天河边缘节点" },
  { value: "cd-jj-01", label: "成都 · 经开灾备中心" },
  { value: "sz-ns-04", label: "深圳 · 南山汇聚机房" },
];

const ownerOptions = [
  { value: "u-1024", label: "陈亦然 · 网络运维一组" },
  { value: "u-1088", label: "李泽宇 · 网络运维一组" },
  { value: "u-1120", label: "沈嘉禾 · 服务器运维组" },
  { value: "u-1206", label: "赵思齐 · 机房设施组" },
  { value: "u-1315", label: "徐怀安 · 安全运营组" },
  { value: "u-1402", label: "林知遥 · 网络运维二组" },
  { value: "u-1466", label: "高屹山 · 灾备与容灾组" },
];

const ccOptions = [
  { value: "u-1024", label: "陈亦然" },
  { value: "u-1120", label: "沈嘉禾" },
  { value: "u-1206", label: "赵思齐" },
  { value: "u-1315", label: "徐怀安" },
  { value: "u-1402", label: "林知遥" },
  { value: "u-1466", label: "高屹山" },
];

const deviceOptions = [
  { value: "DEV-SW-0231", label: "DEV-SW-0231 · 核心交换机 CE-8850" },
  { value: "DEV-SW-0417", label: "DEV-SW-0417 · 汇聚交换机 S6730" },
  { value: "DEV-SRV-1188", label: "DEV-SRV-1188 · 机架服务器 RH2288" },
  { value: "DEV-UPS-0064", label: "DEV-UPS-0064 · UPS 电源 160kVA" },
  { value: "DEV-AC-0209", label: "DEV-AC-0209 · 精密空调 25kW" },
  { value: "DEV-FW-0033", label: "DEV-FW-0033 · 下一代防火墙 USG6600" },
  { value: "DEV-ODF-0087", label: "DEV-ODF-0087 · 光纤配线架 ODF-288" },
  { value: "DEV-PWR-0152", label: "DEV-PWR-0152 · 智能 PDU 32A" },
];

const inspectionItemOptions = [
  { value: "power", label: "电源与供电状态" },
  { value: "temp", label: "设备进出风温度" },
  { value: "fan", label: "风扇转速与异响" },
  { value: "led", label: "指示灯与告警面板" },
  { value: "port", label: "端口误码与光功率" },
  { value: "cable", label: "线缆连接与标签" },
  { value: "dust", label: "防尘网清洁度" },
  { value: "firmware", label: "固件版本一致性" },
];

const resultOptions = [
  { value: "normal", label: "正常" },
  { value: "abnormal", label: "异常" },
  { value: "pending", label: "待复核" },
];

const resultMeta = {
  normal: { label: "正常", tone: "success" },
  abnormal: { label: "异常", tone: "error" },
  pending: { label: "待复核", tone: "warning" },
};

const unitOptions = [
  { value: "℃", label: "℃" },
  { value: "%", label: "%" },
  { value: "dBm", label: "dBm" },
  { value: "rpm", label: "rpm" },
  { value: "A", label: "A" },
  { value: "MPa", label: "MPa" },
];

const ackOptions = [
  { value: "safety", label: "已阅读并遵守《机房作业安全须知》" },
  { value: "photo", label: "现场照片已同步至工单附件" },
  { value: "spare", label: "所需备件已提交领用申请" },
  { value: "customer", label: "已与客户确认作业窗口期" },
];

const recentOrders = [
  { id: "WO-20260928-0041", title: "IDC-3 精密空调回风温度偏高排查", station: "杭州 · 滨江 IDC-3", owner: "赵思齐", time: "09-28 14:20", status: "overdue", priority: "urgent" },
  { id: "WO-20260928-0039", title: "核心交换机 CE-8850 例行巡检", station: "杭州 · 滨江 IDC-1", owner: "陈亦然", time: "09-28 10:05", status: "reviewing", priority: "medium" },
  { id: "WO-20260927-0118", title: "汇聚交换机光模块更换实施", station: "上海 · 嘉定机房", owner: "李泽宇", time: "09-27 16:40", status: "done", priority: "high" },
  { id: "WO-20260927-0092", title: "UPS 电池组容量测试", station: "北京 · 朝阳数据中心", owner: "沈嘉禾", time: "09-27 11:18", status: "processing", priority: "medium" },
  { id: "WO-20260926-0233", title: "边缘节点机柜上架布线", station: "广州 · 天河边缘节点", owner: "林知遥", time: "09-26 15:52", status: "done", priority: "low" },
  { id: "WO-20260926-0207", title: "防火墙策略变更验证", station: "深圳 · 南山汇聚机房", owner: "徐怀安", time: "09-26 09:31", status: "reviewing", priority: "high" },
  { id: "WO-20260925-0144", title: "灾备中心存储链路切换演练", station: "成都 · 经开灾备中心", owner: "高屹山", time: "09-25 20:07", status: "draft", priority: "medium" },
  { id: "WO-20260925-0101", title: "智能 PDU 电流异常复核", station: "杭州 · 滨江 IDC-1", owner: "陈亦然", time: "09-25 13:26", status: "done", priority: "critical" },
  { id: "WO-20260924-0198", title: "ODF 配线架标签补录", station: "上海 · 嘉定机房", owner: "李泽宇", time: "09-24 17:03", status: "done", priority: "low" },
  { id: "WO-20260924-0166", title: "机柜级温湿度探头校准", station: "北京 · 朝阳数据中心", owner: "沈嘉禾", time: "09-24 10:41", status: "overdue", priority: "urgent" },
  { id: "WO-20260923-0122", title: "核心防火墙固件升级验证", station: "深圳 · 南山汇聚机房", owner: "徐怀安", time: "09-23 21:15", status: "reviewing", priority: "high" },
  { id: "WO-20260923-0088", title: "备用发电机组空载试机", station: "成都 · 经开灾备中心", owner: "高屹山", time: "09-23 08:52", status: "processing", priority: "medium" },
  { id: "WO-20260922-0051", title: "边缘节点带宽扩容复核", station: "广州 · 天河边缘节点", owner: "林知遥", time: "09-22 15:37", status: "done", priority: "medium" },
  { id: "WO-20260922-0033", title: "冷通道封闭整改验收", station: "杭州 · 滨江 IDC-3", owner: "赵思齐", time: "09-22 09:14", status: "draft", priority: "low" },
];

const orderStatusMeta = {
  draft: { label: "草稿", tone: "neutral" },
  processing: { label: "处理中", tone: "info" },
  reviewing: { label: "待审批", tone: "warning" },
  overdue: { label: "已超时", tone: "error" },
  done: { label: "已完成", tone: "success" },
};

const approvalNodes = [
  { title: "提交工单", desc: "填报人：陈亦然", time: "进行中", tone: "brand" },
  { title: "班组审核", desc: "网络运维一组 · 李泽宇", time: "预计 1 小时内", tone: "neutral" },
  { title: "值班经理审批", desc: "机房运营中心 · 徐怀安", time: "预计 4 小时内", tone: "neutral" },
  { title: "归档与回访", desc: "系统自动归档并推送客户", time: "完成后自动执行", tone: "neutral" },
];

const guidelines = [
  "工单标题需包含「设备 + 现象」，便于后续检索，例如「CE-8850 端口误码升高」。",
  "优先级选择「紧急」时需在 30 分钟内到达现场，且必须上传现场照片。",
  "巡检明细中任一项判定为「异常」，都必须填写备注说明处置动作。",
  "计划结束时间需晚于开始时间，且与预计工时保持合理区间。",
  "提交后工单进入审批流，草稿可随时编辑，提交后需撤回才能修改。",
];

const filePool = [
  { name: "现场照片_机柜正面.jpg", size: "2.4 MB", kind: "image" },
  { name: "巡检记录表_0928.xlsx", size: "186 KB", kind: "sheet" },
  { name: "光功率测试截图.png", size: "812 KB", kind: "image" },
  { name: "设备运行日志.log", size: "4.1 MB", kind: "log" },
  { name: "变更方案_评审版.pdf", size: "1.2 MB", kind: "doc" },
];
  Object.assign(__export, { metaOf, topNavItems, sideMenu, notifications, orderTypes, priorityOptions, priorityMeta, fallbackMeta, stationOptions, ownerOptions, ccOptions, deviceOptions, inspectionItemOptions, resultOptions, resultMeta, unitOptions, ackOptions, recentOrders, orderStatusMeta, approvalNodes, guidelines, filePool });
})();

/* ===== src/views/top-bar/index.jsx ===== */
(function () {
  const { useState } = React;
  const { Input, Popover, Button, Tooltip } = antd;
  const { Icon, useApp, topNavItems, notifications } = __export;
const TONE_ICON_BG = {
  error: "var(--error-container)",
  success: "var(--success-container)",
  info: "var(--info-container)",
  warning: "var(--warning-container)",
  neutral: "var(--surface-variant)",
};

const TONE_ICON_FG = {
  error: "var(--error)",
  success: "var(--success)",
  info: "var(--info)",
  warning: "var(--on-warning-container)",
  neutral: "var(--on-surface-variant)",
};

const toneBg = (tone) => TONE_ICON_BG[tone] || TONE_ICON_BG.neutral;
const toneFg = (tone) => TONE_ICON_FG[tone] || TONE_ICON_FG.neutral;

// Layer 4: 顶部菜单栏 — 全部使用 JSX 手写(不使用 Menu 组件)
function TopBar() {
  const { isDark, toggleDark, activeTopNav, setActiveTopNav } = useApp();
  const [openKey, setOpenKey] = useState(null);

  const notifyPanel = (
    <div className="notify-panel">
      <div className="notify-panel__head">
        <span className="notify-panel__title">通知中心</span>
        <a className="notify-panel__more">全部标为已读</a>
      </div>
      <ul className="notify-panel__list">
        {notifications.map((n) => (
          <li className="notify-item" key={n.id}>
            <span
              className="notify-item__icon"
              style={{ background: toneBg(n.tone), color: toneFg(n.tone) }}
            >
              <Icon name={n.icon} size="0.875rem" />
            </span>
            <span className="notify-item__main">
              <span className="notify-item__title">{n.title}</span>
              <span className="notify-item__time">{n.time}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const userPanel = (
    <div className="user-panel">
      <div className="user-panel__profile">
        <img className="user-panel__avatar" src="./assets/uploads/user.png" alt="用户头像" />
        <div>
          <p className="user-panel__name">陈亦然</p>
          <p className="user-panel__role">网络运维一组 · 组长</p>
        </div>
      </div>
      <div className="user-panel__links">
        <a className="user-panel__link"><Icon name="circle-user" size="0.875rem" />个人中心</a>
        <a className="user-panel__link"><Icon name="settings" size="0.875rem" />账号设置</a>
        <a className="user-panel__link"><Icon name="shield-check" size="0.875rem" />权限申请</a>
        <a className="user-panel__link user-panel__link--danger"><Icon name="log-out" size="0.875rem" />退出登录</a>
      </div>
    </div>
  );

  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <span className="top-bar__logo">
          <Icon name="layers" size="1.25rem" />
        </span>
        <span className="top-bar__brand-text">
          <strong className="top-bar__brand-name">星云运维平台</strong>
          <span className="top-bar__brand-sub">CloudOps Console</span>
        </span>
      </div>

      <nav className="top-bar__nav" onMouseLeave={() => setOpenKey(null)}>
        {topNavItems.map((item) => {
          const active = activeTopNav === item.key;
          const hasChildren = !!item.children;
          return (
            <div
              className={`top-nav-item ${active ? "is-active" : ""} ${
                openKey === item.key ? "is-open" : ""
              }`}
              key={item.key}
              onMouseEnter={() => setOpenKey(hasChildren ? item.key : null)}
            >
              <button
                type="button"
                className="top-nav-item__trigger"
                onClick={() => {
                  setActiveTopNav(item.key);
                  setOpenKey(hasChildren && openKey !== item.key ? item.key : null);
                }}
              >
                <Icon name={item.icon} size="1rem" />
                <span>{item.label}</span>
                {hasChildren ? (
                  <Icon name={openKey === item.key ? "chevron-up" : "chevron-down"} size="0.75rem" />
                ) : null}
              </button>

              {hasChildren && openKey === item.key ? (
                <div className="top-nav-item__panel">
                  {item.children.map((child) => (
                    <button
                      type="button"
                      className="top-nav-child"
                      key={child.key}
                      onClick={() => {
                        setActiveTopNav(item.key);
                        setOpenKey(null);
                      }}
                    >
                      <span className="top-nav-child__label">{child.label}</span>
                      <span className="top-nav-child__desc">{child.desc}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="top-bar__tools">
        <Input
          className="top-bar__search"
          size="small"
          allowClear
          placeholder="搜索工单号、设备编号或站点"
          prefix={<Icon name="search" size="0.875rem" />}
          onPressEnter={() => {}}
        />

        <Tooltip title="帮助文档">
          <button type="button" className="icon-btn">
            <Icon name="circle-alert" size="1rem" />
          </button>
        </Tooltip>

        <Popover content={notifyPanel} trigger="click" placement="bottomRight" arrow={false}>
          <button type="button" className="icon-btn">
            <Icon name="bell" size="1rem" />
            <span className="icon-btn__dot" />
          </button>
        </Popover>

        <Tooltip title={isDark ? "切换浅色模式" : "切换深色模式"}>
          <button type="button" className="icon-btn" onClick={toggleDark}>
            <Icon name={isDark ? "sun" : "moon"} size="1rem" />
          </button>
        </Tooltip>

        <span className="top-bar__divider" />

        <Popover content={userPanel} trigger="click" placement="bottomRight" arrow={false}>
          <button type="button" className="user-chip">
            <img className="user-chip__avatar" src="./assets/uploads/user.png" alt="陈亦然" />
            <span className="user-chip__text">
              <span className="user-chip__name">陈亦然</span>
              <span className="user-chip__role">网络运维一组</span>
            </span>
            <Icon name="chevron-down" size="0.75rem" />
          </button>
        </Popover>
      </div>
    </header>
  );
}
  Object.assign(__export, { TopBar });
})();

/* ===== src/views/side-nav/index.jsx ===== */
(function () {
  const { useState } = React;
  const { Menu, Progress, Tooltip } = antd;
  const { Icon, useApp, sideMenu } = __export;
// Layer 4: 侧边导航 — 使用 Menu 组件承载多级导航
function SideNav() {
  const { navCollapsed, toggleNav, activeSideKey, setActiveSideKey } = useApp();
  const [openKeys, setOpenKeys] = useState(["grp-order", "grp-device"]);

  const items = sideMenu.map((group) => {
    const base = {
      key: group.key,
      icon: <Icon name={group.icon} size="1rem" />,
      label: group.label,
    };
    if (!group.children) return base;
    return {
      ...base,
      children: group.children.map((child) => ({ key: child.key, label: child.label })),
    };
  });

  return (
    <aside className={`side-nav ${navCollapsed ? "side-nav--collapsed" : ""}`}>
      <div className="side-nav__top">
        {navCollapsed ? null : (
          <span className="side-nav__caption">
            <Icon name="square-menu" size="0.875rem" />
            工作台导航
          </span>
        )}
        <Tooltip title={navCollapsed ? "展开导航" : "收起导航"} placement="right">
          <button type="button" className="side-nav__toggle" onClick={toggleNav}>
            <Icon name={navCollapsed ? "panel-left-open" : "panel-left-close"} size="1rem" />
          </button>
        </Tooltip>
      </div>

      <div className="side-nav__menu">
        <Menu
          mode="inline"
          theme="light"
          inlineCollapsed={navCollapsed}
          selectedKeys={[activeSideKey]}
          openKeys={navCollapsed ? [] : openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={({ key }) => setActiveSideKey(key)}
          items={items}
        />
      </div>

      {navCollapsed ? null : (
        <div className="side-nav__foot">
          <div className="quota">
            <div className="quota__head">
              <span className="quota__title">本月巡检额度</span>
              <span className="quota__value">86%</span>
            </div>
            <Progress percent={86} showInfo={false} size="small" strokeColor="var(--primary)" />
            <p className="quota__desc">已完成 172 / 200 次巡检，剩余 5 天</p>
          </div>
          <a className="side-nav__help">
            <Icon name="headphones" size="0.875rem" />
            运维值班热线 400-820-1120
          </a>
        </div>
      )}
    </aside>
  );
}
  Object.assign(__export, { SideNav });
})();

/* ===== src/views/page-header/index.jsx ===== */
(function () {
  const { Breadcrumb, Button, Tooltip } = antd;
  const { Icon } = __export;
// Layer 4: 页面标题区 — 面包屑 + 标题 + 操作
function PageHeader({ draftSaved, onSaveDraft, onOpenTemplate, onSubmit }) {
  return (
    <header className="page-head">
      <div className="page-head__main">
        <Breadcrumb
          items={[
            { title: "首页" },
            { title: "工单中心" },
            { title: "新建巡检工单" },
          ]}
        />
        <div className="page-head__title-row">
          <h1 className="page-head__title">新建巡检工单</h1>
          <span className="page-head__badge">
            <Icon name="square-pen" size="0.75rem" />
            {draftSaved ? "草稿已保存" : "草稿未保存"}
          </span>
        </div>
        <p className="page-head__desc">
          按机房巡检规范填写工单信息，提交后进入班组审核流程；带 <em>*</em> 的字段为必填项。
        </p>
      </div>

      <div className="page-head__actions">
        <Tooltip title="套用已保存的填报模板">
          <Button icon={<Icon name="file-clock" size="0.875rem" />} onClick={onOpenTemplate}>
            套用模板
          </Button>
        </Tooltip>
        <Button icon={<Icon name="save" size="0.875rem" />} onClick={onSaveDraft}>
          保存草稿
        </Button>
        <Button type="primary" icon={<Icon name="send" size="0.875rem" />} onClick={onSubmit}>
          提交工单
        </Button>
      </div>
    </header>
  );
}
  Object.assign(__export, { PageHeader });
})();

/* ===== src/components/field-row/index.jsx ===== */
(function () {
  const { Icon } = __export;
// Layer 3: 表单字段行 — 标签 + 控件 + 校验信息(纯 H5 骨架,不使用 Form/Form.Item)
function FieldRow({
  label,
  required,
  htmlFor,
  error,
  help,
  full,
  className = "",
  children,
}) {
  return (
    <div className={`field-row ${full ? "field-row--full" : ""} ${className}`}>
      <label className="field-row__label" htmlFor={htmlFor}>
        {required ? <span className="field-row__req" aria-hidden="true">*</span> : null}
        {label}
      </label>
      <div className="field-row__control">{children}</div>
      {error ? (
        <p className="field-row__error">
          <Icon name="circle-alert" size="0.875rem" />
          <span>{error}</span>
        </p>
      ) : help ? (
        <p className="field-row__help">{help}</p>
      ) : null}
    </div>
  );
}
  Object.assign(__export, { FieldRow });
})();

/* ===== src/components/panel-card/index.jsx ===== */
(function () {
  const { Icon } = __export;
// Layer 3: 内容卡片容器(div + token,不使用 Card/Elevation 组合以外的样式)
function PanelCard({
  title,
  subtitle,
  icon,
  extra,
  children,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section className={`panel-card ${className}`}>
      {title ? (
        <header className="panel-card__head">
          <div className="panel-card__head-main">
            {icon ? (
              <span className="panel-card__icon">
                <Icon name={icon} size="1rem" />
              </span>
            ) : null}
            <div className="panel-card__titles">
              <h3 className="panel-card__title">{title}</h3>
              {subtitle ? <p className="panel-card__subtitle">{subtitle}</p> : null}
            </div>
          </div>
          {extra ? <div className="panel-card__extra">{extra}</div> : null}
        </header>
      ) : null}
      <div className={`panel-card__body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
  Object.assign(__export, { PanelCard });
})();

/* ===== src/components/status-tag/index.jsx ===== */
(function () {
// Layer 3: 语义状态标签(纯 H5 + token,不使用 Badge)
function StatusTag({ tone = "neutral", label, icon, size = "medium" }) {
  return (
    <span className={`status-tag status-tag--${tone} status-tag--${size}`}>
      {icon ? <span className="status-tag__dot" /> : null}
      {label}
    </span>
  );
}
  Object.assign(__export, { StatusTag });
})();

/* ===== src/views/workorder-form/index.jsx ===== */
(function () {
  const { useRef } = React;
  const { Input, Select, Radio, InputNumber, DatePicker, Switch, Checkbox, Button, Tooltip, Progress } = antd;
  const { Icon, orderTypes, priorityOptions, priorityMeta, stationOptions, ownerOptions, ccOptions, deviceOptions, inspectionItemOptions, resultOptions, resultMeta, unitOptions, ackOptions, metaOf } = __export;
  const FieldRow = __export.FieldRow;
  const PanelCard = __export.PanelCard;
  const StatusTag = __export.StatusTag;
const FILE_KIND_ICON = {
  image: "file-text",
  sheet: "table",
  log: "file-clock",
  doc: "file-check",
};

// Layer 4: 工单填报表单 — 纯 H5 骨架 + antd 输入组件受控使用
function WorkorderForm({
  form,
  errors,
  checks,
  setField,
  setItem,
  addItem,
  removeItem,
  onOpenEntry,
  addFiles,
  addSampleFile,
  removeFile,
  toggleAck,
  scrollTo,
  onSubmit,
  onSaveDraft,
  onReset,
}) {
  const fileRef = useRef(null);
  const itemErrors = errors.itemErrors || [];
  const doneCount = checks.filter((c) => c.ok).length;
  const percent = Math.round((doneCount / checks.length) * 100);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="wo-form">
      {/* ========== 1. 基础信息 ========== */}
      <PanelCard
        className="wo-form__section"
        icon="file-text"
        title="基础信息"
        subtitle="工单归属、责任人与计划作业窗口"
        extra={<StatusTag tone="brand" label="第 1 步 / 共 3 步" size="small" />}
      >
        <div className="form-grid" id="wo-section-basic">
          <FieldRow
            label="工单标题"
            required
            full
            htmlFor="wo-title"
            error={errors.title}
            help="建议格式：设备编号 + 现象，例如「DEV-AC-0209 回风温度持续偏高」"
          >
            <Input
              id="wo-title"
              value={form.title}
              maxLength={60}
              showCount
              status={errors.title ? "error" : undefined}
              placeholder="请输入工单标题"
              onChange={(e) => setField("title", e.target.value)}
            />
          </FieldRow>

          <FieldRow label="工单类型" required htmlFor="wo-type" error={errors.type}>
            <Select
              id="wo-type"
              value={form.type}
              options={orderTypes}
              allowClear
              status={errors.type ? "error" : undefined}
              placeholder="请选择工单类型"
              onChange={(v) => setField("type", v)}
            />
          </FieldRow>

          <FieldRow
            label="优先级"
            required
            htmlFor="wo-priority"
            error={errors.priority}
            help={`当前：${metaOf(priorityMeta, form.priority).label}优先级`}
          >
            <Radio.Group
              value={form.priority}
              optionType="button"
              buttonStyle="solid"
              options={priorityOptions}
              onChange={(e) => setField("priority", e.target.value)}
            />
          </FieldRow>

          <FieldRow label="所属站点" required htmlFor="wo-station" error={errors.station}>
            <Select
              id="wo-station"
              value={form.station}
              options={stationOptions}
              showSearch
              optionFilterProp="label"
              status={errors.station ? "error" : undefined}
              placeholder="请选择机房 / 站点"
              onChange={(v) => setField("station", v)}
            />
          </FieldRow>

          <FieldRow label="现场责任人" required htmlFor="wo-owner" error={errors.owner}>
            <Select
              id="wo-owner"
              value={form.owner}
              options={ownerOptions}
              showSearch
              optionFilterProp="label"
              status={errors.owner ? "error" : undefined}
              placeholder="请选择现场责任人"
              onChange={(v) => setField("owner", v)}
            />
          </FieldRow>

          <FieldRow label="联系电话" required htmlFor="wo-phone" error={errors.phone}>
            <Input
              id="wo-phone"
              value={form.phone}
              maxLength={11}
              prefix={<Icon name="phone" size="0.875rem" />}
              status={errors.phone ? "error" : undefined}
              placeholder="请输入 11 位手机号"
              onChange={(e) => setField("phone", e.target.value.replace(/\D/g, ""))}
            />
          </FieldRow>

          <FieldRow label="抄送人" htmlFor="wo-cc" help="提交后同步推送至抄送人">
            <Select
              id="wo-cc"
              mode="multiple"
              value={form.ccPersons}
              options={ccOptions}
              maxTagCount="responsive"
              placeholder="选择需要同步的同事"
              onChange={(v) => setField("ccPersons", v)}
            />
          </FieldRow>

          <FieldRow
            label="计划开始与结束时间"
            required
            full
            htmlFor="wo-range"
            error={errors.range}
            help="作业窗口需与客户协商一致，最长不超过 30 天"
          >
            <DatePicker.RangePicker
              id="wo-range"
              value={form.range}
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder={["计划开始时间", "计划结束时间"]}
              status={errors.range ? "error" : undefined}
              onChange={(v) => setField("range", v)}
            />
          </FieldRow>

          <FieldRow
            label="预计工时（小时）"
            required
            htmlFor="wo-duration"
            error={errors.duration}
            help="含路途与现场准备时间"
          >
            <InputNumber
              id="wo-duration"
              mode="spinner"
              variant="outlined"
              value={form.duration}
              min={0}
              max={72}
              step={0.5}
              precision={1}
              status={errors.duration ? "error" : undefined}
              placeholder="0.5 – 72"
              onChange={(v) => setField("duration", v)}
            />
          </FieldRow>

          <FieldRow label="作业完成后需客户确认" htmlFor="wo-ack-switch" help="开启后客户将收到完工确认链接">
            <Switch
              id="wo-ack-switch"
              checked={form.needCustomerAck}
              checkedChildren="需确认"
              unCheckedChildren="免确认"
              onChange={(v) => setField("needCustomerAck", v)}
            />
          </FieldRow>
        </div>
      </PanelCard>

      {/* ========== 2. 巡检明细 ========== */}
      <PanelCard
        className="wo-form__section"
        icon="scan-line"
        title="巡检明细"
        subtitle={`已添加 ${form.items.length} 条巡检记录，逐台设备登记实测值`}
        extra={
          <>
            <Button size="small" icon={<Icon name="square-pen" size="0.875rem" />} onClick={onOpenEntry}>
              详细登记
            </Button>
            <Button size="small" icon={<Icon name="plus" size="0.875rem" />} onClick={addItem}>
              添加空行
            </Button>
          </>
        }
      >
        {errors.items ? (
          <p className="field-row__error inspect__alert">
            <Icon name="circle-alert" size="0.875rem" />
            <span>{errors.items}</span>
          </p>
        ) : null}

        <div className="inspect" id="wo-items">
          <div className="inspect__head">
            <span className="inspect__col inspect__col--no">#</span>
            <span className="inspect__col">设备</span>
            <span className="inspect__col">巡检项</span>
            <span className="inspect__col">巡检结果</span>
            <span className="inspect__col">实测值 / 单位</span>
            <span className="inspect__col">处置说明</span>
            <span className="inspect__col inspect__col--op">操作</span>
          </div>

          {form.items.length === 0 ? (
            <div className="inspect__empty">
              <Icon name="inbox" size="1.5rem" />
              <p>暂无巡检明细，请点击「添加巡检项」开始登记</p>
            </div>
          ) : null}

          {form.items.map((row, i) => {
            const rowErr = itemErrors[i] || {};
            return (
              <div className="inspect__row" key={row.id}>
                <span className="inspect__col inspect__col--no">
                  <span className="inspect__no">{i + 1}</span>
                </span>

                <div className="inspect__col">
                  <Select
                    id={`wo-item-${i}-device`}
                    value={row.device}
                    options={deviceOptions}
                    showSearch
                    optionFilterProp="label"
                    size="small"
                    placeholder="选择设备"
                    status={rowErr.device ? "error" : undefined}
                    onChange={(v) => setItem(i, "device", v)}
                  />
                  {rowErr.device ? <p className="field-row__error">{rowErr.device}</p> : null}
                </div>

                <div className="inspect__col">
                  <Select
                    id={`wo-item-${i}-item`}
                    value={row.item}
                    options={inspectionItemOptions}
                    size="small"
                    placeholder="选择巡检项"
                    status={rowErr.item ? "error" : undefined}
                    onChange={(v) => setItem(i, "item", v)}
                  />
                  {rowErr.item ? <p className="field-row__error">{rowErr.item}</p> : null}
                </div>

                <div className="inspect__col">
                  <Select
                    id={`wo-item-${i}-result`}
                    value={row.result}
                    options={resultOptions}
                    size="small"
                    placeholder="结果"
                    status={rowErr.result ? "error" : undefined}
                    onChange={(v) => setItem(i, "result", v)}
                  />
                  {rowErr.result ? <p className="field-row__error">{rowErr.result}</p> : null}
                </div>

                <div className="inspect__col">
                  <div className="inspect__pair">
                    <InputNumber
                      id={`wo-item-${i}-value`}
                      mode="spinner"
                      variant="outlined"
                      size="small"
                      value={row.value}
                      status={rowErr.value ? "error" : undefined}
                      placeholder="实测值"
                      onChange={(v) => setItem(i, "value", v)}
                    />
                    <Select
                      value={row.unit}
                      options={unitOptions}
                      size="small"
                      onChange={(v) => setItem(i, "unit", v)}
                    />
                  </div>
                  {rowErr.value ? <p className="field-row__error">{rowErr.value}</p> : null}
                </div>

                <div className="inspect__col">
                  <Input
                    id={`wo-item-${i}-note`}
                    value={row.note}
                    size="small"
                    placeholder={row.result === "abnormal" ? "异常必填：处置动作" : "可选：现场备注"}
                    status={rowErr.note ? "error" : undefined}
                    onChange={(e) => setItem(i, "note", e.target.value)}
                  />
                  {rowErr.note ? <p className="field-row__error">{rowErr.note}</p> : null}
                </div>

                <div className="inspect__col inspect__col--op">
                  {row.result ? (
                    <StatusTag
                      tone={metaOf(resultMeta, row.result).tone}
                      label={metaOf(resultMeta, row.result).label}
                      size="small"
                    />
                  ) : null}
                  <Tooltip title={form.items.length === 1 ? "至少保留一条巡检明细" : "删除该行"}>
                    <Button
                      shape="circle"
                      size="small"
                      disabled={form.items.length === 1}
                      icon={<Icon name="trash-2" size="0.875rem" />}
                      onClick={() => removeItem(i)}
                    />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="dashed"
          block
          className="inspect__add"
          icon={<Icon name="plus" size="0.875rem" />}
          onClick={onOpenEntry}
        >
          打开「登记巡检明细」弹窗，纵向表单逐项填写
        </Button>
      </PanelCard>

      {/* ========== 3. 补充说明与附件 ========== */}
      <PanelCard
        className="wo-form__section"
        icon="paperclip"
        title="补充说明与附件"
        subtitle="现场描述与佐证材料将随工单一起流转"
        extra={<StatusTag tone="brand" label="第 3 步 / 共 3 步" size="small" />}
      >
        <div className="form-grid">
          <FieldRow
            label="问题描述"
            required
            full
            htmlFor="wo-description"
            error={errors.description}
            help={`${String(form.description || "").length} / 500 字，建议包含现象、影响范围、已采取措施`}
          >
            <Input.TextArea
              id="wo-description"
              value={form.description}
              rows={4}
              maxLength={500}
              status={errors.description ? "error" : undefined}
              placeholder="例如：IDC-3 机房 3 号列头柜回风温度连续 2 小时高于 32℃，已临时开启备用精密空调，需现场核查冷通道封闭情况。"
              onChange={(e) => setField("description", e.target.value)}
            />
          </FieldRow>

          <FieldRow
            label="现场附件"
            full
            htmlFor="wo-file"
            error={errors.attachments}
            help={`已上传 ${form.attachments.length} / 5 个；高优先级或存在异常项时至少 1 个`}
          >
            <div className="attach">
              <div
                className="attach__drop"
                onClick={() => fileRef.current && fileRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Icon name="upload" size="1.5rem" />
                <span className="attach__drop-title">点击选择文件，或将文件拖拽到此处</span>
                <span className="attach__drop-hint">支持 jpg / png / pdf / xlsx / log，单个文件不超过 20MB</span>
              </div>
              <input
                id="wo-file"
                ref={fileRef}
                type="file"
                multiple
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />

              <div className="attach__actions">
                <a onClick={addSampleFile}>
                  <Icon name="file-check" size="0.875rem" /> 追加一份示例附件
                </a>
                <span className="attach__count">共 {form.attachments.length} 个文件</span>
              </div>

              {form.attachments.length ? (
                <ul className="attach__list">
                  {form.attachments.map((f, i) => (
                    <li className="attach-item" key={`${f.name}-${i}`}>
                      <span className="attach-item__icon">
                        <Icon name={FILE_KIND_ICON[f.kind] || "file-text"} size="1rem" />
                      </span>
                      <span className="attach-item__main">
                        <span className="attach-item__name">{f.name}</span>
                        <span className="attach-item__size">{f.size}</span>
                      </span>
                      <button
                        type="button"
                        className="attach-item__remove"
                        onClick={() => removeFile(i)}
                      >
                        <Icon name="x" size="0.875rem" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="attach__empty">尚未上传附件</p>
              )}
            </div>
          </FieldRow>

          <FieldRow label="提交前确认" required full htmlFor="wo-acks" error={errors.acks}>
            <div className="ack-list" id="wo-acks">
              <Checkbox.Group
                value={form.acks}
                options={ackOptions}
                onChange={toggleAck}
              />
            </div>
          </FieldRow>
        </div>
      </PanelCard>

      {/* ========== 底部操作条 ========== */}
      <div className="form-footbar">
        <div className="form-footbar__status">
          <Progress
            percent={percent}
            size="small"
            showInfo={false}
            strokeColor={percent === 100 ? "var(--success)" : "var(--primary)"}
            style={{ width: "8rem" }}
          />
          <span className="form-footbar__text">
            校验通过 <strong>{doneCount}</strong> / {checks.length} 项
          </span>
          {percent < 100 ? (
            <a className="form-footbar__link" onClick={() => scrollTo("wo-acks")}>
              查看未通过项
            </a>
          ) : (
            <span className="form-footbar__ok">
              <Icon name="circle-check" size="0.875rem" />
              校验全部通过，可提交
            </span>
          )}
        </div>
        <div className="form-footbar__actions">
          <Button icon={<Icon name="rotate-ccw" size="0.875rem" />} onClick={onReset}>
            重置
          </Button>
          <Button icon={<Icon name="save" size="0.875rem" />} onClick={onSaveDraft}>
            保存草稿
          </Button>
          <Button type="primary" icon={<Icon name="send" size="0.875rem" />} onClick={onSubmit}>
            提交工单
          </Button>
        </div>
      </div>
    </div>
  );
}
  Object.assign(__export, { WorkorderForm });
})();

/* ===== src/views/form-aside/index.jsx ===== */
(function () {
  const { Progress, Timeline, Tooltip } = antd;
  const { Icon, guidelines, recentOrders, orderStatusMeta, priorityMeta, approvalNodes, metaOf } = __export;
  const PanelCard = __export.PanelCard;
  const StatusTag = __export.StatusTag;
// Layer 4: 表单右侧辅助区 — 校验进度 / 填报指引 / 最近工单 / 审批流程
function FormAside({ checks, onJump, onOpenOrder }) {
  const doneCount = checks.filter((c) => c.ok).length;
  const percent = Math.round((doneCount / checks.length) * 100);
  const pending = checks.filter((c) => !c.ok);

  const timelineItems = approvalNodes.map((node, i) => ({
    color: i === 0 ? "var(--primary)" : "var(--outline)",
    children: (
      <div className="apv-node">
        <span className={`apv-node__title ${i === 0 ? "is-current" : ""}`}>{node.title}</span>
        <span className="apv-node__desc">{node.desc}</span>
        <span className="apv-node__time">{node.time}</span>
      </div>
    ),
  }));

  return (
    <aside className="form-aside">
      <PanelCard
        icon="badge-check"
        title="填报校验"
        subtitle={`已通过 ${doneCount} / ${checks.length} 项`}
      >
        <div className="check-progress">
          <Progress
            type="circle"
            percent={percent}
            size={88}
            strokeColor={percent === 100 ? "var(--success)" : "var(--primary)"}
            format={(p) => <span className="check-progress__num">{p}%</span>}
          />
          <p className="check-progress__tip">
            {percent === 100
              ? "校验全部通过，可提交工单"
              : `还有 ${pending.length} 项需要完善后才能提交`}
          </p>
        </div>

        <ul className="check-list">
          {checks.map((c) => (
            <li className={`check-item ${c.ok ? "is-ok" : ""}`} key={c.key}>
              <button type="button" className="check-item__btn" onClick={() => onJump(c.target)}>
                <Icon name={c.ok ? "circle-check" : "circle-alert"} size="1rem" />
                <span className="check-item__main">
                  <span className="check-item__label">{c.label}</span>
                  <span className="check-item__hint">{c.hint}</span>
                </span>
                <Icon name="chevron-right" size="0.875rem" />
              </button>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard icon="info" title="填报指引" subtitle="来自《机房巡检作业规范 v3.2》">
        <ol className="guide-list">
          {guidelines.map((g, i) => (
            <li className="guide-item" key={g}>
              <span className="guide-item__no">{i + 1}</span>
              <span className="guide-item__text">{g}</span>
            </li>
          ))}
        </ol>
        <a className="aside-link">
          查看完整规范
          <Icon name="arrow-right" size="0.875rem" />
        </a>
      </PanelCard>

      <PanelCard
        icon="clock"
        title="最近工单"
        subtitle="我参与的近 12 条工单"
        extra={<a className="aside-link aside-link--sm">全部</a>}
      >
        <ul className="order-list">
          {recentOrders.map((o) => (
            <li className="order-item" key={o.id}>
              <button type="button" className="order-item__btn" onClick={() => onOpenOrder(o.id)}>
                <span className="order-item__top">
                  <span className="order-item__title">{o.title}</span>
                  <StatusTag
                    tone={metaOf(orderStatusMeta, o.status).tone}
                    label={metaOf(orderStatusMeta, o.status).label}
                    size="small"
                  />
                </span>
                <span className="order-item__meta">
                  <span className="order-item__id">{o.id}</span>
                  <span className="order-item__dot" />
                  <span>{o.station}</span>
                  <span className="order-item__dot" />
                  <span>{o.time}</span>
                  <span className="order-item__dot" />
                  <span className={`order-item__prio is-${o.priority}`}>
                    {metaOf(priorityMeta, o.priority).label}优先级
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard icon="shield-check" title="审批流程" subtitle="提交后自动流转">
        <Timeline items={timelineItems} />
        <div className="aside-note">
          <Tooltip title="如需加急，请在提交后联系值班经理">
            <span className="aside-note__text">
              <Icon name="siren" size="0.875rem" />
              紧急工单可申请绿色通道，30 分钟内响应
            </span>
          </Tooltip>
        </div>
      </PanelCard>
    </aside>
  );
}
  Object.assign(__export, { FormAside });
})();

/* ===== src/views/inspect-entry-modal/index.jsx ===== */
(function () {
  const { useState, useEffect } = React;
  const { Modal, Select, Input, InputNumber, Radio, Switch, Button } = antd;
  const { Icon, deviceOptions, inspectionItemOptions, resultOptions, unitOptions, ownerOptions } = __export;
  const FieldRow = __export.FieldRow;
const EMPTY_DRAFT = {
  device: undefined,
  item: undefined,
  result: undefined,
  value: null,
  unit: "℃",
  level: "minor",
  note: "",
  owner: "u-1024",
  confirmed: false,
};

const LEVEL_OPTIONS = [
  { value: "minor", label: "一般 · 记录观察即可" },
  { value: "major", label: "较大 · 需当日处理" },
  { value: "critical", label: "严重 · 需立即处置" },
];

// Layer 4: 登记巡检明细弹窗 — 纵向排列的紧凑表单(标签在上方,单列)
function InspectEntryModal({ open, onCancel, onSubmit }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [errors, setErrors] = useState({});

  // 每次打开重置草稿与校验状态
  useEffect(() => {
    if (open) {
      setDraft(EMPTY_DRAFT);
      setErrors({});
    }
  }, [open]);

  const setField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleReset = () => {
    setDraft(EMPTY_DRAFT);
    setErrors({});
  };

  const handleSubmit = () => {
    const next = {};
    if (!draft.device) next.device = "请选择设备";
    if (!draft.item) next.item = "请选择巡检项";
    if (!draft.result) next.result = "请选择巡检结果";
    if (draft.value === null || draft.value === undefined || draft.value === "") {
      next.value = "请填写实测值";
    } else if (draft.value < 0 || draft.value > 10000) {
      next.value = "实测值需在 0 – 10000 之间";
    }
    if (draft.result === "abnormal") {
      if (!draft.level) next.level = "请选择异常等级";
      if (String(draft.note || "").trim().length < 5) next.note = "判定为异常时，处置说明至少 5 个字符";
    }
    if (!draft.owner) next.owner = "请选择复核责任人";

    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit(draft);
  };

  const isAbnormal = draft.result === "abnormal";

  return (
    <Modal
      className="entry-modal"
      open={open}
      title="登记巡检明细"
      width={520}
      maskClosable={false}
      onCancel={onCancel}
      footer={[
        <Button key="reset" icon={<Icon name="rotate-ccw" size="0.875rem" />} onClick={handleReset}>
          重置
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="ok" type="primary" icon={<Icon name="plus" size="0.875rem" />} onClick={handleSubmit}>
          确定并添加
        </Button>,
      ]}
    >
      <div className="entry-form">
        <p className="entry-form__tip">
          <Icon name="info" size="0.875rem" />
          <span>此处登记的单条明细会追加到工单的巡检列表中，关闭弹窗不会丢失已保存内容。</span>
        </p>

        <FieldRow label="设备" required htmlFor="entry-device" error={errors.device}>
          <Select
            id="entry-device"
            value={draft.device}
            options={deviceOptions}
            showSearch
            optionFilterProp="label"
            status={errors.device ? "error" : undefined}
            placeholder="请选择本次巡检的设备"
            onChange={(v) => setField("device", v)}
          />
        </FieldRow>

        <FieldRow label="巡检项" required htmlFor="entry-item" error={errors.item}>
          <Select
            id="entry-item"
            value={draft.item}
            options={inspectionItemOptions}
            status={errors.item ? "error" : undefined}
            placeholder="请选择需要登记的巡检项"
            onChange={(v) => setField("item", v)}
          />
        </FieldRow>

        <FieldRow
          label="巡检结果"
          required
          htmlFor="entry-result"
          error={errors.result}
          help="选择「异常」后需要补充异常等级与处置说明"
        >
          <Radio.Group
            value={draft.result}
            optionType="button"
            buttonStyle="solid"
            options={resultOptions}
            onChange={(e) => setField("result", e.target.value)}
          />
        </FieldRow>

        <FieldRow label="实测值与单位" required htmlFor="entry-value" error={errors.value}>
          <div className="entry-form__pair">
            <InputNumber
              id="entry-value"
              mode="spinner"
              variant="outlined"
              value={draft.value}
              min={0}
              max={10000}
              status={errors.value ? "error" : undefined}
              placeholder="请输入实测值"
              onChange={(v) => setField("value", v)}
            />
            <Select
              value={draft.unit}
              options={unitOptions}
              onChange={(v) => setField("unit", v)}
            />
          </div>
        </FieldRow>

        {isAbnormal ? (
          <FieldRow label="异常等级" required htmlFor="entry-level" error={errors.level}>
            <Select
              id="entry-level"
              value={draft.level}
              options={LEVEL_OPTIONS}
              status={errors.level ? "error" : undefined}
              placeholder="请选择异常等级"
              onChange={(v) => setField("level", v)}
            />
          </FieldRow>
        ) : null}

        <FieldRow
          label="处置说明"
          required={isAbnormal}
          htmlFor="entry-note"
          error={errors.note}
          help={isAbnormal ? "异常项必填：说明已采取的动作与后续计划" : "可选：补充现场观察到的细节"}
        >
          <Input.TextArea
            id="entry-note"
            value={draft.note}
            rows={3}
            maxLength={200}
            status={errors.note ? "error" : undefined}
            placeholder="例如：已更换跳线并送测，观察 30 分钟误码未增长。"
            onChange={(e) => setField("note", e.target.value)}
          />
        </FieldRow>

        <FieldRow label="复核责任人" required htmlFor="entry-owner" error={errors.owner}>
          <Select
            id="entry-owner"
            value={draft.owner}
            options={ownerOptions}
            showSearch
            optionFilterProp="label"
            status={errors.owner ? "error" : undefined}
            placeholder="请选择复核责任人"
            onChange={(v) => setField("owner", v)}
          />
        </FieldRow>

        <FieldRow
          label="已现场确认并拍照留证"
          htmlFor="entry-confirm"
          help="开启后该明细会标记为已复核，审批环节优先通过"
        >
          <Switch
            id="entry-confirm"
            checked={draft.confirmed}
            checkedChildren="已确认"
            unCheckedChildren="未确认"
            onChange={(v) => setField("confirmed", v)}
          />
        </FieldRow>
      </div>
    </Modal>
  );
}
  Object.assign(__export, { InspectEntryModal });
})();

/* ===== src/views/workorder-page/validate.js ===== */
(function () {
// 工单校验规则 — 提交时统一校验,结果写入 errors 对象

const ITEM_FIELDS = ["device", "item", "result", "value", "note"];

function isEmptyValue(v) {
  return v === null || v === undefined || String(v).trim() === "";
}

function needsAttachment(form) {
  return (
    form.priority === "urgent" ||
    form.priority === "high" ||
    form.items.some((row) => row.result === "abnormal")
  );
}

function validateItems(form, errors) {
  const itemErrors = form.items.map((row) => {
    const e = {};
    if (!row.device) e.device = "请选择设备";
    if (!row.item) e.item = "请选择巡检项";
    if (!row.result) e.result = "请选择巡检结果";
    if (isEmptyValue(row.value)) e.value = "请填写实测值";
    if (row.result === "abnormal" && !String(row.note || "").trim()) {
      e.note = "判定为异常时必须填写处置说明";
    }
    return e;
  });

  if (!form.items.length) {
    errors.items = "至少添加一条巡检明细";
  } else if (itemErrors.some((e) => Object.keys(e).length)) {
    errors.items = "巡检明细存在未填写或不合规的字段，请逐行修正";
  }
  return itemErrors;
}

function runValidation(form) {
  const errors = {};
  const title = String(form.title || "").trim();
  const desc = String(form.description || "").trim();

  if (!title) errors.title = "请填写工单标题";
  else if (title.length < 6) errors.title = "工单标题至少 6 个字符，建议包含设备名称与现象";
  else if (title.length > 60) errors.title = "工单标题不超过 60 个字符";

  if (!form.type) errors.type = "请选择工单类型";
  if (!form.station) errors.station = "请选择所属站点";
  if (!form.owner) errors.owner = "请指定现场责任人";

  const phone = String(form.phone || "").trim();
  if (!phone) errors.phone = "请填写联系电话，便于现场联络";
  else if (!/^1[3-9]\d{9}$/.test(phone)) errors.phone = "手机号格式不正确，应为 1 开头的 11 位数字";

  const range = form.range;
  if (!range || !range[0] || !range[1]) errors.range = "请选择计划开始与结束时间";
  else if (!range[1].isAfter(range[0])) errors.range = "计划结束时间必须晚于开始时间";
  else if (range[0].add(30, "day").isBefore(range[1])) {
    errors.range = "计划周期不得超过 30 天，超出请拆分多张工单";
  }

  if (isEmptyValue(form.duration)) errors.duration = "请填写预计工时";
  else if (form.duration < 0.5) errors.duration = "预计工时不少于 0.5 小时";
  else if (form.duration > 72) errors.duration = "预计工时不超过 72 小时，超出请拆分多张工单";

  const itemErrors = validateItems(form, errors);

  if (!desc) errors.description = "请描述现场现象、影响范围与已采取的措施";
  else if (desc.length < 10) errors.description = "问题描述至少 10 个字符，避免只写“已处理”";
  else if (desc.length > 500) errors.description = "问题描述不超过 500 个字符";

  if (form.attachments.length > 5) {
    errors.attachments = "附件最多上传 5 个，请合并或先删除部分文件";
  } else if (needsAttachment(form) && !form.attachments.length) {
    errors.attachments = "当前优先级或巡检结果要求必须上传现场附件";
  }

  if (!form.acks.length) errors.acks = "请至少勾选一项确认事项后再提交";
  else if (!form.acks.includes("safety")) errors.acks = "必须确认已阅读《机房作业安全须知》";

  if (itemErrors.some((e) => Object.keys(e).length)) errors.itemErrors = itemErrors;

  return errors;
}

function hasErrors(errors) {
  const flat = Object.keys(errors).some((k) => k !== "itemErrors" && !!errors[k]);
  const rows = !!(errors.itemErrors && errors.itemErrors.some((e) => e && Object.keys(e).length));
  return flat || rows;
}

const FIELD_ORDER = [
  ["title", "wo-title"],
  ["type", "wo-type"],
  ["station", "wo-station"],
  ["owner", "wo-owner"],
  ["phone", "wo-phone"],
  ["range", "wo-range"],
  ["duration", "wo-duration"],
  ["items", "wo-items"],
  ["description", "wo-description"],
  ["attachments", "wo-attachments"],
  ["acks", "wo-acks"],
];

function firstErrorId(errors) {
  if (errors.itemErrors) {
    for (let i = 0; i < errors.itemErrors.length; i += 1) {
      const row = errors.itemErrors[i];
      if (!row) continue;
      const field = ITEM_FIELDS.find((f) => row[f]);
      if (field) return `wo-item-${i}-${field}`;
    }
  }
  for (let i = 0; i < FIELD_ORDER.length; i += 1) {
    if (errors[FIELD_ORDER[i][0]]) return FIELD_ORDER[i][1];
  }
  return null;
}

// 校验进度面板 —— 六项分组校验
function computeChecks(form) {
  const title = String(form.title || "").trim();
  const phone = String(form.phone || "").trim();
  const desc = String(form.description || "").trim();
  const range = form.range;

  const basicOk =
    title.length >= 6 &&
    !!form.type &&
    !!form.station &&
    !!form.owner &&
    /^1[3-9]\d{9}$/.test(phone);

  const scheduleOk =
    !!range &&
    !!range[0] &&
    !!range[1] &&
    range[1].isAfter(range[0]) &&
    !isEmptyValue(form.duration) &&
    form.duration >= 0.5 &&
    form.duration <= 72;

  const itemsOk =
    form.items.length > 0 &&
    form.items.every(
      (row) =>
        row.device &&
        row.item &&
        row.result &&
        !isEmptyValue(row.value) &&
        (row.result !== "abnormal" || String(row.note || "").trim())
    );

  const attachOk = form.attachments.length <= 5 && (!needsAttachment(form) || form.attachments.length > 0);

  return [
    { key: "basic", label: "基础信息与联系人", ok: basicOk, target: "wo-title", hint: "标题 / 类型 / 站点 / 责任人 / 手机号" },
    { key: "schedule", label: "计划时间与工时", ok: scheduleOk, target: "wo-range", hint: "结束晚于开始，工时 0.5–72 小时" },
    { key: "items", label: "巡检明细", ok: itemsOk, target: "wo-items", hint: "每行需填写设备 / 巡检项 / 结果 / 实测值" },
    { key: "desc", label: "问题描述", ok: desc.length >= 10 && desc.length <= 500, target: "wo-description", hint: "10–500 字的现场描述" },
    { key: "attach", label: "附件材料", ok: attachOk, target: "wo-attachments", hint: "高优先级或异常项必须上传附件" },
    { key: "ack", label: "提交确认", ok: form.acks.includes("safety"), target: "wo-acks", hint: "需确认机房作业安全须知" },
  ];
}
  Object.assign(__export, { isEmptyValue, needsAttachment, runValidation, hasErrors, firstErrorId, computeChecks });
})();

/* ===== src/views/workorder-page/index.jsx ===== */
(function () {
  const { useMemo, useState } = React;
  const { Steps, Modal, Button, message } = antd;
  const { Icon, runValidation, hasErrors, firstErrorId, computeChecks, filePool, stationOptions, ownerOptions, orderTypes, priorityOptions } = __export;
  const PageHeader = __export.PageHeader;
  const WorkorderForm = __export.WorkorderForm;
  const FormAside = __export.FormAside;
  const InspectEntryModal = __export.InspectEntryModal;
const SECTION_TARGETS = ["wo-section-basic", "wo-items", "wo-acks"];

const TEMPLATES = [
  {
    key: "tpl-cooling",
    name: "精密空调例行巡检",
    desc: "温度 / 供电 / 风扇 / 防尘网 4 项，适用于季度巡检",
    icon: "thermometer-snowflake",
    patch: {
      type: "routine",
      priority: "medium",
      duration: 2,
      description:
        "按季度巡检计划对机房精密空调执行例行检查，重点记录回风温度、供电电流与防尘网清洁度，发现偏差即时记录并上报。",
      items: [
        { device: "DEV-AC-0209", item: "temp", result: "normal", value: 24.5, unit: "℃", note: "回风温度稳定" },
        { device: "DEV-AC-0209", item: "power", result: "normal", value: 18.4, unit: "A", note: "" },
        { device: "DEV-AC-0209", item: "fan", result: "normal", value: 920, unit: "rpm", note: "" },
        { device: "DEV-AC-0209", item: "dust", result: "pending", value: 60, unit: "%", note: "需在下次巡检前更换防尘网" },
      ],
    },
  },
  {
    key: "tpl-power",
    name: "UPS 电源专项检查",
    desc: "电池组容量 / 输出电流 / 告警面板，适用于月度专项",
    icon: "zap",
    patch: {
      type: "fault",
      priority: "high",
      duration: 4,
      description:
        "UPS 电池组容量测试出现容量衰减告警，需现场核查电池组单体电压、连接端子温升，并同步核对告警面板记录。",
      items: [
        { device: "DEV-UPS-0064", item: "power", result: "abnormal", value: 386, unit: "A", note: "输出电流波动 ±12%，需复测" },
        { device: "DEV-UPS-0064", item: "led", result: "pending", value: 1, unit: "℃", note: "告警面板存在历史告警未清除" },
      ],
    },
  },
  {
    key: "tpl-network",
    name: "核心交换机端口巡检",
    desc: "端口误码 / 光功率 / 固件版本，适用于网络变更后验证",
    icon: "network",
    patch: {
      type: "change",
      priority: "urgent",
      duration: 1.5,
      description:
        "完成核心交换机上行端口扩容割接后的验证巡检，需确认端口误码率、光功率与固件版本一致性，异常端口立即回退。",
      items: [
        { device: "DEV-SW-0231", item: "port", result: "normal", value: -6.4, unit: "dBm", note: "光功率在正常区间" },
        { device: "DEV-SW-0417", item: "port", result: "abnormal", value: -18.2, unit: "dBm", note: "光功率偏低，已更换跳线送测" },
        { device: "DEV-SW-0231", item: "firmware", result: "normal", value: 1, unit: "%", note: "" },
      ],
    },
  },
];

const KIND_BY_EXT = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  xlsx: "sheet",
  xls: "sheet",
  csv: "sheet",
  log: "log",
  pdf: "doc",
  docx: "doc",
};

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function guessKind(name) {
  const ext = String(name).split(".").pop().toLowerCase();
  return KIND_BY_EXT[ext] || "doc";
}

let itemSeq = 3;

function makeInitialForm() {
  return {
    title: "",
    type: "routine",
    priority: "high",
    station: "hz-idc-03",
    owner: "u-1024",
    phone: "",
    ccPersons: ["u-1120", "u-1206"],
    range: null,
    duration: 2.5,
    needCustomerAck: true,
    items: [
      { id: 1, device: "DEV-AC-0209", item: "temp", result: "abnormal", value: 33.6, unit: "℃", note: "" },
      { id: 2, device: "DEV-UPS-0064", item: "power", result: "normal", value: 386, unit: "A", note: "运行平稳" },
    ],
    description: "",
    attachments: [{ name: "现场照片_机柜正面.jpg", size: "2.4 MB", kind: "image" }],
    acks: [],
  };
}

// Layer 4: 工单填报页面 — 状态编排 + 表单 + 校验 + 侧栏
function WorkorderPage() {
  const [form, setForm] = useState(makeInitialForm);
  const [errors, setErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const checks = useMemo(() => computeChecks(form), [form]);
  const doneCount = checks.filter((c) => c.ok).length;

  const stepFlags = useMemo(() => {
    const ok = (keys) => keys.every((k) => checks.find((c) => c.key === k).ok);
    const g0 = ok(["basic", "schedule"]);
    const g1 = ok(["items", "desc", "attach"]);
    return { g0, g1, g2: ok(["ack"]) };
  }, [checks]);

  const currentStep = !stepFlags.g0 ? 0 : !stepFlags.g1 ? 1 : 2;

  const stationLabel = (stationOptions.find((s) => s.value === form.station) || {}).label;
  const ownerLabel = (ownerOptions.find((o) => o.value === form.owner) || {}).label;
  const typeLabel = (orderTypes.find((t) => t.value === form.type) || {}).label;
  const priorityLabel = (priorityOptions.find((p) => p.value === form.priority) || {}).label;

  const clearKey = (key, prev) => {
    if (!prev[key]) return prev;
    const next = { ...prev };
    delete next[key];
    return next;
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => clearKey(key, prev));
    setDraftSaved(false);
  };

  const setItem = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
    setErrors((prev) => {
      const row = prev.itemErrors ? prev.itemErrors[index] : null;
      if (!row || !row[field]) return prev;
      const itemErrors = prev.itemErrors.map((e, i) => (i === index ? { ...e, [field]: undefined } : e));
      const next = { ...prev, itemErrors };
      if (!itemErrors.some((e) => e && Object.keys(e).some((k) => !!e[k]))) delete next.items;
      return next;
    });
    setDraftSaved(false);
  };

  const addItem = () => {
    itemSeq += 1;
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: itemSeq, device: undefined, item: undefined, result: undefined, value: null, unit: "℃", note: "" },
      ],
    }));
    setErrors({});
    setDraftSaved(false);
  };

  // 弹窗「登记巡检明细」提交的单条记录,追加到明细列表
  const addItemFromModal = (row) => {
    itemSeq += 1;
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...row, id: itemSeq }] }));
    setErrors({});
    setDraftSaved(false);
    setEntryOpen(false);
    messageApi.success(
      `已登记 1 条巡检明细（${row.result === "abnormal" ? "异常" : row.result === "pending" ? "待复核" : "正常"}），列表已更新`
    );
  };

  const removeItem = (index) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((row, i) => i !== index) }));
    setErrors({});
    setDraftSaved(false);
    messageApi.info("已删除该条巡检明细");
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const mapped = files.map((f) => ({
      name: f.name,
      size: formatSize(f.size),
      kind: guessKind(f.name),
    }));
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, ...mapped].slice(0, 5) }));
    setErrors((prev) => clearKey("attachments", prev));
    setDraftSaved(false);
    messageApi.success(`已添加 ${mapped.length} 个附件`);
  };

  const addSampleFile = () => {
    const sample = filePool[form.attachments.length % filePool.length];
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, sample].slice(0, 5) }));
    setErrors((prev) => clearKey("attachments", prev));
    setDraftSaved(false);
  };

  const removeFile = (index) => {
    setForm((prev) => ({ ...prev, attachments: prev.attachments.filter((f, i) => i !== index) }));
    setDraftSaved(false);
  };

  const toggleAck = (values) => {
    setForm((prev) => ({ ...prev, acks: values }));
    setErrors((prev) => clearKey("acks", prev));
    setDraftSaved(false);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const input = el.matches("input, textarea") ? el : el.querySelector("input, textarea");
    if (input) setTimeout(() => input.focus({ preventScroll: true }), 340);
  };

  const handleSubmit = () => {
    const nextErrors = runValidation(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const flatCount = Object.keys(nextErrors).filter((k) => k !== "itemErrors" && nextErrors[k]).length;
      const rowCount = nextErrors.itemErrors
        ? nextErrors.itemErrors.filter((e) => e && Object.keys(e).some((k) => !!e[k])).length
        : 0;
      messageApi.error(`校验未通过：${flatCount + rowCount} 处字段需要修正，请检查标红位置`);
      const targetId = firstErrorId(nextErrors);
      if (targetId) setTimeout(() => scrollTo(targetId), 80);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOrderNo(`WO-${dayjs().format("YYYYMMDD")}-${Math.floor(Math.random() * 900) + 100}`);
      setSuccessOpen(true);
      setDraftSaved(true);
    }, 900);
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    messageApi.success("草稿已保存，可在「工单中心 - 工单列表 - 草稿」中继续编辑");
  };

  const handleReset = () => {
    setForm(makeInitialForm());
    setErrors({});
    setDraftSaved(false);
    messageApi.info("表单已重置为初始状态");
  };

  const applyTemplate = (tpl) => {
    itemSeq += tpl.patch.items.length;
    setForm((prev) => ({
      ...prev,
      ...tpl.patch,
      items: tpl.patch.items.map((row, i) => ({ ...row, id: itemSeq - tpl.patch.items.length + i + 1 })),
    }));
    setErrors({});
    setTemplateOpen(false);
    setDraftSaved(false);
    messageApi.success(`已套用模板「${tpl.name}」，请核对后补充标题与联系电话`);
  };

  return (
    <div className="wo-page">
      {contextHolder}

      <PageHeader
        draftSaved={draftSaved}
        onSaveDraft={handleSaveDraft}
        onOpenTemplate={() => setTemplateOpen(true)}
        onSubmit={handleSubmit}
      />

      <div className="wo-page__steps">
        <Steps
          current={currentStep}
          onChange={(i) => scrollTo(SECTION_TARGETS[i])}
          items={[
            { title: "基础信息", description: stepFlags.g0 ? "已完成" : "待完善" },
            { title: "巡检明细", description: stepFlags.g1 ? "已完成" : "待完善" },
            { title: "确认提交", description: stepFlags.g2 ? "已完成" : "待完善" },
          ]}
        />
      </div>

      <div className="wo-page__body">
        <WorkorderForm
          form={form}
          errors={errors}
          checks={checks}
          setField={setField}
          setItem={setItem}
          addItem={addItem}
          removeItem={removeItem}
          onOpenEntry={() => setEntryOpen(true)}
          addFiles={addFiles}
          addSampleFile={addSampleFile}
          removeFile={removeFile}
          toggleAck={toggleAck}
          scrollTo={scrollTo}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          onReset={handleReset}
        />

        <FormAside
          checks={checks}
          onJump={scrollTo}
          onOpenOrder={(id) => messageApi.info(`已打开工单 ${id} 的详情抽屉`)}
        />
      </div>

      <Modal
        open={successOpen}
        title="工单已提交"
        okText="查看工单详情"
        cancelText="继续填报下一张"
        onOk={() => setSuccessOpen(false)}
        onCancel={() => {
          setSuccessOpen(false);
          setForm(makeInitialForm());
          setErrors({});
          setDraftSaved(false);
        }}
      >
        <div className="submit-result">
          <span className="submit-result__icon">
            <Icon name="circle-check" size="2rem" />
          </span>
          <p className="submit-result__title">工单 {orderNo} 已进入审批流程</p>
          <ul className="submit-result__list">
            <li>
              <span>工单标题</span>
              <strong>{form.title}</strong>
            </li>
            <li>
              <span>工单类型 / 优先级</span>
              <strong>
                {typeLabel} · {priorityLabel}
              </strong>
            </li>
            <li>
              <span>所属站点</span>
              <strong>{stationLabel}</strong>
            </li>
            <li>
              <span>现场责任人</span>
              <strong>{ownerLabel}</strong>
            </li>
            <li>
              <span>巡检明细 / 附件</span>
              <strong>
                {form.items.length} 条记录 · {form.attachments.length} 个附件
              </strong>
            </li>
            <li>
              <span>预计下发时间</span>
              <strong>班组审核通过后 30 分钟内</strong>
            </li>
          </ul>
        </div>
      </Modal>

      <InspectEntryModal
        open={entryOpen}
        onCancel={() => setEntryOpen(false)}
        onSubmit={addItemFromModal}
      />

      <Modal
        open={templateOpen}
        title="套用填报模板"
        footer={null}
        onCancel={() => setTemplateOpen(false)}
        width={560}
      >
        <p className="tpl-tip">选择模板后将覆盖巡检明细与描述内容，已填写的基础信息会保留。</p>
        <ul className="tpl-list">
          {TEMPLATES.map((tpl) => (
            <li className="tpl-item" key={tpl.key}>
              <button type="button" className="tpl-item__btn" onClick={() => applyTemplate(tpl)}>
                <span className="tpl-item__icon">
                  <Icon name={tpl.icon} size="1.25rem" />
                </span>
                <span className="tpl-item__main">
                  <span className="tpl-item__name">{tpl.name}</span>
                  <span className="tpl-item__desc">{tpl.desc}</span>
                </span>
                <Icon name="chevron-right" size="1rem" />
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
  Object.assign(__export, { WorkorderPage });
})();

/* ===== app.jsx ===== */
(function () {
  const { ConfigProvider } = antd;
  const { AppProvider, useApp } = __export;
  const zhCN = __export.zhCN;
  const TopBar = __export.TopBar;
  const SideNav = __export.SideNav;
  const WorkorderPage = __export.WorkorderPage;
// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. workorder.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. field-row / panel-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. top-bar / side-nav)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.









function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <AppShell />
      </ConfigProvider>
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
  Object.assign(__export, { App });
})();
/* ===== render ===== */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(__export.App));
