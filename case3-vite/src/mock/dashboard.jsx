// Layer 2: 客户成功运营总台 — Mock 数据层
// 约定：字段全部语义化命名；金额统一「¥xx.x万」、百分比统一「xx.x%」、时长单位「小时」。
import dayjs from "dayjs";
import { IconPlusIcBpitTicket, IconPlusIcCarUser, IconPlusIcPublicAlert, IconPlusIcPublicClipboard, IconPlusIcPublicClock, IconPlusIcPublicHeartWaveform, IconPlusIcPublicMoneyCircle, IconPlusIcPublicNotebook, IconPlusIcPublicPhoneGear, IconPlusIcPublicPlusCircle, IconPlusIcPublicSortDown, IconPlusIcPublicSortUp, IconPlusIcPublicSuccess, IconPlusIcPublicTeams, IconPlusIcPublicTxtFileTextured } from '@hui/icon-plus';

// ── 顶部导航 ──
export const MAIN_NAV = [
  { key: "workbench", label: "工作台" },
  { key: "customers", label: "客户" },
  { key: "tickets", label: "工单" },
  { key: "insights", label: "数据" },
  { key: "settings", label: "设置" },
];

export const CURRENT_USER = {
  name: "林晚晴",
  role: "客户成功负责人",
  teamSize: 5,
  avatar: "/uploads/user.png",
};

// ── 消息通知（系统 / 审批 / @我 三类，每类 2 条未读） ──
export const NOTIFICATION_CATEGORIES = [
  { key: "system", label: "系统" },
  { key: "approval", label: "审批" },
  { key: "mention", label: "@我" },
];

export const NOTIFICATIONS = [
  { id: "NT-01", category: "system", icon: <IconPlusIcBpitTicket iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "error", title: "「云帆数科」高优工单 #4821 已超时 2.3 小时", time: "12 分钟前", unread: true },
  { id: "NT-02", category: "system", icon: <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "critical", title: "「悦购连锁商城」健康分降至 35，进入流失预警", time: "1 小时前", unread: true },
  { id: "NT-03", category: "system", icon: <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "info", title: "本周健康分周报已生成，可查看趋势变化", time: "昨天 18:20", unread: false },
  { id: "NT-04", category: "approval", icon: <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "info", title: "「绿源新能源」续约折扣申请待你审批", time: "5 小时前", unread: true },
  { id: "NT-05", category: "approval", icon: <IconPlusIcPublicSuccess iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "success", title: "「极光视觉设计」续约合同已进入审批流", time: "3 小时前", unread: true },
  { id: "NT-06", category: "approval", icon: <IconPlusIcPublicSuccess iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "success", title: "「知行研学社」合同盖章流程已完成", time: "昨天 16:40", unread: false },
  { id: "NT-07", category: "mention", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "info", title: "陈璐 在工单 #4821 中 @了你：需要负责人支援", time: "10 分钟前", unread: true },
  { id: "NT-08", category: "mention", icon: <IconPlusIcPublicTeams iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "info", title: "周雨桐 在「续约冲刺月」群中 @了你", time: "30 分钟前", unread: true },
  { id: "NT-09", category: "mention", icon: <IconPlusIcPublicTeams iconSize="0.875rem" iconColor={['currentcolor']} />, tone: "info", title: "王思远 在客户「青枫网络」备注中 @了你", time: "昨天 09:12", unread: false },
];

// ── 实时风险告警轮播条（5 条，客户降级 / 工单超时 / 续约风险 / 登录异常） ──
export const RISK_ALERTS = [
  {
    id: "AL-01",
    eventType: "客户降级",
    level: "紧急",
    title: "「悦购连锁商城」健康分由 41 降至 35，已降级为流失预警",
    timeAgo: "5 分钟前",
    customerId: "CU-1061",
  },
  {
    id: "AL-02",
    eventType: "工单超时",
    level: "高",
    title: "「云帆数科」高优工单 #4821 超时 2.3 小时未响应",
    timeAgo: "12 分钟前",
    customerId: "CU-1038",
  },
  {
    id: "AL-03",
    eventType: "续约风险",
    level: "高",
    title: "「蓝鲸在线教育」续约审批停滞 3 天，距到期仅剩 10 天",
    timeAgo: "28 分钟前",
    customerId: "CU-1122",
  },
  {
    id: "AL-04",
    eventType: "登录异常",
    level: "中",
    title: "「恒泰重工集团」管理员连续 5 次登录失败，建议尽快联系确认",
    timeAgo: "1 小时前",
    customerId: "CU-1055",
  },
  {
    id: "AL-05",
    eventType: "客户降级",
    level: "中",
    title: "「沃尔森超市」健康分由 58 跌至 49，由观察降级为风险",
    timeAgo: "2 小时前",
    customerId: "CU-1108",
  },
];

// ── 筛选维度 ──
export const TIME_RANGES = [
  { key: "7d", label: "近7天" },
  { key: "30d", label: "近30天" },
  { key: "quarter", label: "本季度" },
];

export const INDUSTRY_OPTIONS = ["全部行业", "互联网", "金融", "制造", "零售", "医疗", "教育"];

// 各行业在管客户数（合计 86 家，与 KPI「健康客户占比」口径一致）
export const CUSTOMER_COUNTS = {
  全部行业: 86,
  互联网: 26,
  金融: 17,
  制造: 14,
  零售: 12,
  医疗: 10,
  教育: 7,
};

// 行业在客户盘中的占比系数（用于派生单行业视角下的图表数据）
const INDUSTRY_FACTORS = {
  全部行业: 1,
  互联网: 0.3,
  金融: 0.2,
  制造: 0.16,
  零售: 0.14,
  医疗: 0.12,
  教育: 0.08,
};

// 确定性抖动（0.9–1.1）：让单行业派生数据呈现独立波形，同一输入恒定复现
function seededJitter(seed) {
  let hash = 2166136261;
  const text = String(seed);
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return 0.9 + ((hash >>> 0) % 101) / 500;
}

function resolveFactor(industry) {
  return INDUSTRY_FACTORS[industry] != null ? INDUSTRY_FACTORS[industry] : 1;
}

// ── KPI 指标卡（本月口径） ──
export const KPI_CARDS = [
  {
    key: "renewal-amount",
    title: "本月续约金额",
    value: "¥286.5万",
    trend: { icon: <IconPlusIcPublicSortUp iconSize="1rem" iconColor={['currentcolor']} />, text: "同比 +12.4%", tone: "good" },
    description: "已续约 38 家 · 客单价 ¥7.5万",
    icon: <IconPlusIcPublicMoneyCircle iconSize="1rem" iconColor={['currentcolor']} />,
    tone: "brand",
    progress: { percent: 82, label: "月目标达成率 82%" },
  },
  {
    key: "health-ratio",
    title: "健康客户占比",
    value: "62.8%",
    trend: { icon: <IconPlusIcPublicSortUp iconSize="1rem" iconColor={['currentcolor']} />, text: "同比 +3.2pct", tone: "good" },
    description: "健康 54 家 / 在管 86 家",
    icon: <IconPlusIcPublicHeartWaveform iconSize="1rem" iconColor={['currentcolor']} />,
    tone: "success",
    progress: { percent: 62.8, label: "健康线基准 60%" },
  },
  {
    key: "high-risk",
    title: "高风险客户数",
    value: "18 家",
    trend: { icon: <IconPlusIcPublicSortUp iconSize="1rem" iconColor={['currentcolor']} />, text: "同比 +4 家", tone: "bad" },
    description: "含流失预警 6 家，建议本周介入",
    icon: <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} />,
    tone: "error",
    progress: { percent: 20.9, label: "占在管客户 20.9%" },
  },
  {
    key: "avg-response",
    title: "平均响应时长",
    value: "2.6 小时",
    trend: { icon: <IconPlusIcPublicSortDown iconSize="1rem" iconColor={['currentcolor']} />, text: "同比 -0.8 小时", tone: "good" },
    description: "工单首次响应 P90 为 4.2 小时",
    icon: <IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} />,
    tone: "info",
    progress: { percent: 91, label: "SLA 达标率 91%" },
  },
];

// ── 趋势数据（3 系列，按时间范围的基础序列，波动不单调） ──
const TREND_BASE = {
  "7d": {
    labels: ["10-14", "10-15", "10-16", "10-17", "10-18", "10-19", "10-20"],
    activity: [498, 521, 476, 543, 517, 562, 538],
    ticketCount: [84, 97, 90, 108, 95, 112, 99],
    usageHours: [305, 328, 289, 341, 314, 352, 329],
  },
  "30d": {
    labels: ["09-27", "09-29", "10-01", "10-03", "10-05", "10-07", "10-09", "10-11", "10-13", "10-15", "10-17", "10-19"],
    activity: [486, 512, 468, 534, 505, 558, 492, 537, 561, 508, 546, 573],
    ticketCount: [78, 92, 85, 104, 96, 88, 112, 97, 83, 105, 94, 108],
    usageHours: [296, 318, 284, 335, 308, 342, 291, 326, 354, 305, 338, 361],
  },
  quarter: {
    labels: ["07-06", "07-13", "07-20", "07-27", "08-03", "08-10", "08-17", "08-24", "08-31", "09-07", "09-14", "09-21"],
    activity: [402, 438, 415, 452, 429, 467, 443, 481, 458, 496, 472, 515],
    ticketCount: [62, 71, 66, 78, 73, 85, 79, 92, 86, 98, 91, 104],
    usageHours: [242, 268, 255, 281, 266, 295, 278, 306, 292, 318, 305, 334],
  },
};

const TREND_SERIES = [
  { key: "activity", name: "活跃度（次）" },
  { key: "ticketCount", name: "工单量（个）" },
  { key: "usageHours", name: "使用时长（小时）" },
];

export function getTrendData(timeRange, industry) {
  const base = TREND_BASE[timeRange] || TREND_BASE["30d"];
  const factor = resolveFactor(industry);
  const series = TREND_SERIES.map((meta) => ({
    name: meta.name,
    data: base[meta.key].map((value, index) => {
      if (industry === "全部行业") return value;
      return Math.max(1, Math.round(value * factor * seededJitter(`${industry}|${meta.key}|${timeRange}|${index}`)));
    }),
  }));
  return { labels: base.labels, series };
}

// ── 健康度分布（饼图 4 类，合计与在管口径一致） ──
const HEALTH_DISTRIBUTION_BASE = {
  "7d": { 健康: 56, 观察: 13, 风险: 12, 流失预警: 5 },
  "30d": { 健康: 54, 观察: 14, 风险: 12, 流失预警: 6 },
  quarter: { 健康: 50, 观察: 16, 风险: 13, 流失预警: 7 },
};

export const HEALTH_STATUS_ORDER = ["健康", "观察", "风险", "流失预警"];

export function getHealthDistribution(timeRange, industry) {
  const base = HEALTH_DISTRIBUTION_BASE[timeRange] || HEALTH_DISTRIBUTION_BASE["30d"];
  const factor = resolveFactor(industry);
  return HEALTH_STATUS_ORDER.map((status) => {
    if (industry === "全部行业") return { name: status, value: base[status] };
    const scaled = Math.round(base[status] * factor * seededJitter(`${industry}|${status}|${timeRange}`));
    return { name: status, value: Math.max(1, scaled) };
  });
}

// ── 风险客户表（12 行 · 4 种状态 · 健康分随时间范围联动，分数始终落在状态区间内） ──
export const RISK_CUSTOMERS = [
  { id: "CU-1024", companyName: "星辰物联科技", industry: "互联网", healthScore: { "7d": 52, "30d": 47, quarter: 44 }, csm: "王思远", renewalDate: "2026-11-02", status: "风险" },
  { id: "CU-1038", companyName: "云帆数科", industry: "金融", healthScore: { "7d": 34, "30d": 31, quarter: 28 }, csm: "陈璐", renewalDate: "2026-10-28", status: "流失预警" },
  { id: "CU-1049", companyName: "墨白文创", industry: "教育", healthScore: { "7d": 68, "30d": 64, quarter: 61 }, csm: "林晚晴", renewalDate: "2026-12-05", status: "观察" },
  { id: "CU-1055", companyName: "恒泰重工集团", industry: "制造", healthScore: { "7d": 55, "30d": 50, quarter: 47 }, csm: "王思远", renewalDate: "2026-11-18", status: "风险" },
  { id: "CU-1061", companyName: "悦购连锁商城", industry: "零售", healthScore: { "7d": 38, "30d": 35, quarter: 33 }, csm: "赵启明", renewalDate: "2026-10-25", status: "流失预警" },
  { id: "CU-1072", companyName: "青枫网络", industry: "互联网", healthScore: { "7d": 72, "30d": 66, quarter: 62 }, csm: "陈璐", renewalDate: "2026-12-12", status: "观察" },
  { id: "CU-1080", companyName: "瑞和华康医疗", industry: "医疗", healthScore: { "7d": 57, "30d": 53, quarter: 49 }, csm: "林晚晴", renewalDate: "2026-11-26", status: "风险" },
  { id: "CU-1093", companyName: "领航证券资讯", industry: "金融", healthScore: { "7d": 71, "30d": 65, quarter: 60 }, csm: "赵启明", renewalDate: "2026-12-18", status: "观察" },
  { id: "CU-1101", companyName: "精工智能装备", industry: "制造", healthScore: { "7d": 86, "30d": 83, quarter: 81 }, csm: "王思远", renewalDate: "2026-12-08", status: "健康" },
  { id: "CU-1108", companyName: "沃尔森超市", industry: "零售", healthScore: { "7d": 54, "30d": 49, quarter: 46 }, csm: "陈璐", renewalDate: "2026-11-09", status: "风险" },
  { id: "CU-1115", companyName: "安诺基因科技", industry: "医疗", healthScore: { "7d": 88, "30d": 85, quarter: 82 }, csm: "赵启明", renewalDate: "2026-12-20", status: "健康" },
  { id: "CU-1122", companyName: "蓝鲸在线教育", industry: "互联网", healthScore: { "7d": 36, "30d": 32, quarter: 29 }, csm: "林晚晴", renewalDate: "2026-10-30", status: "流失预警" },
];

export function getRiskCustomers(timeRange, industry, keyword) {
  const range = timeRange || "30d";
  const trimmed = (keyword || "").trim().toLowerCase();
  return RISK_CUSTOMERS.filter((customer) => {
    if (industry && industry !== "全部行业" && customer.industry !== industry) return false;
    if (trimmed) {
      const haystack = `${customer.companyName}${customer.industry}${customer.csm}`.toLowerCase();
      if (!haystack.includes(trimmed)) return false;
    }
    return true;
  }).map((customer) => ({
    ...customer,
    healthScore: customer.healthScore[range] != null ? customer.healthScore[range] : customer.healthScore["30d"],
  }));
}

// ── 30 天内到期客户（6 条，与风险表客户不重复；含健康档案供详情抽屉使用） ──
export const EXPIRING_CUSTOMERS = [
  { id: "CU-2101", companyName: "极光视觉设计", industry: "互联网", renewalDate: "2026-10-27", amount: 12.8, owner: "周雨桐", status: "观察", healthScore: 74 },
  { id: "CU-2107", companyName: "汇金小额贷款", industry: "金融", renewalDate: "2026-11-03", amount: 26.4, owner: "王思远", status: "健康", healthScore: 84 },
  { id: "CU-2112", companyName: "绿源新能源", industry: "制造", renewalDate: "2026-11-08", amount: 31.2, owner: "陈璐", status: "健康", healthScore: 88 },
  { id: "CU-2119", companyName: "悦己美妆电商", industry: "零售", renewalDate: "2026-11-12", amount: 9.6, owner: "周雨桐", status: "观察", healthScore: 65 },
  { id: "CU-2123", companyName: "康桥心理咨询", industry: "医疗", renewalDate: "2026-11-16", amount: 7.2, owner: "林晚晴", status: "健康", healthScore: 81 },
  { id: "CU-2128", companyName: "知行研学社", industry: "教育", renewalDate: "2026-11-19", amount: 15.8, owner: "赵启明", status: "健康", healthScore: 90 },
];

export function getExpiringCustomers(industry, keyword) {
  const trimmed = (keyword || "").trim().toLowerCase();
  return EXPIRING_CUSTOMERS.filter((customer) => {
    if (industry && industry !== "全部行业" && customer.industry !== industry) return false;
    if (trimmed) {
      const haystack = `${customer.companyName}${customer.industry}${customer.owner}`.toLowerCase();
      if (!haystack.includes(trimmed)) return false;
    }
    return true;
  }).map((customer) => ({
    ...customer,
    daysLeft: Math.max(0, dayjs(customer.renewalDate).startOf("day").diff(dayjs().startOf("day"), "day")),
  }));
}

// ── 团队成员（5 人 CSM 团队） ──
export const TEAM_MEMBERS = [
  { name: "林晚晴", role: "团队负责人" },
  { name: "王思远", role: "高级 CSM" },
  { name: "陈璐", role: "CSM" },
  { name: "赵启明", role: "CSM" },
  { name: "周雨桐", role: "CSM" },
];

// ── 表单选项 ──
export const FOLLOW_UP_WAYS = ["电话回访", "视频会议", "上门拜访", "邮件沟通"];

export const TICKET_PRIORITIES = [
  { label: "低", value: "low" },
  { label: "中", value: "medium" },
  { label: "高", value: "high" },
  { label: "紧急", value: "urgent" },
];

// ── 客户统一档案（风险表 + 到期榜单共用详情数据） ──
export const HEALTH_TREND_LABELS = TREND_BASE["30d"].labels;

const LAST_LOGIN_OPTIONS = ["今天 09:24", "今天 08:12", "昨天 17:40", "2 天前 14:05", "3 天前 10:36"];

function deriveNumber(seed, min, max) {
  const ratio = (seededJitter(seed) - 0.9) / 0.2;
  return min + Math.round((max - min) * ratio);
}

function buildHealthTrend(quarterScore, currentScore) {
  return Array.from({ length: HEALTH_TREND_LABELS.length }, (_, index) => {
    const ratio = index / (HEALTH_TREND_LABELS.length - 1);
    const baseValue = Math.round(quarterScore + (currentScore - quarterScore) * ratio);
    const wobble = deriveNumber(`trend-wobble|${index}`, -4, 4);
    return Math.max(5, Math.min(100, baseValue + wobble));
  });
}

function buildActivities(customer) {
  const activities = [];
  if (customer.status === "流失预警" || customer.status === "风险") {
    activities.push({ daysAgo: 0, color: "red", title: "专项拯救计划启动", detail: "健康分跌破阈值，已启动拯救计划，跟进频次提升至每周 2 次。" });
  } else if (customer.status === "观察") {
    activities.push({ daysAgo: 0, color: "blue", title: "加入观察名单", detail: "活跃度连续两周下滑，已列入观察名单并加强监测。" });
  } else {
    activities.push({ daysAgo: 2, color: "green", title: "QBR 季度复盘完成", detail: "季度业务复盘会完成，客户对整体服务表示认可。" });
  }
  activities.push(
    { daysAgo: 3, color: "blue", title: "电话回访完成", detail: "与客户对接人沟通近期使用情况，反馈整体满意，已记录至客户档案。" },
    { daysAgo: 7, color: "green", title: "功能培训交付", detail: "完成新版报表模块线上培训，参与 6 人，会务材料已同步。" },
    { daysAgo: 12, color: "gray", title: "工单关闭", detail: "数据导出异常工单处理完毕，客户确认功能恢复。" },
    { daysAgo: 21, color: "blue", title: "使用报告发送", detail: "月度使用报告已发送至客户邮箱，核心功能活跃度环比上升。" },
    { daysAgo: 30, color: "gray", title: "续约意向沟通", detail: "与采购负责人初步确认续约意向，等待预算审批结果。" }
  );
  return activities.map((activity) => ({
    ...activity,
    timeText: dayjs().subtract(activity.daysAgo, "day").format("MM-DD"),
  }));
}

export function getAllCustomerOptions() {
  return [...RISK_CUSTOMERS, ...EXPIRING_CUSTOMERS].map((customer) => ({
    value: customer.id,
    label: `${customer.companyName}（${customer.industry}）`,
  }));
}

export function getCustomerName(customerId) {
  const customer = [...RISK_CUSTOMERS, ...EXPIRING_CUSTOMERS].find((item) => item.id === customerId);
  return customer ? customer.companyName : "";
}

// 客户详情：合并风险表与到期榜单数据，派生趋势 / 档案 / 跟进动态
export function getCustomerDetail(customerId) {
  const riskCustomer = RISK_CUSTOMERS.find((item) => item.id === customerId);
  const expiringCustomer = EXPIRING_CUSTOMERS.find((item) => item.id === customerId);
  const base = riskCustomer || expiringCustomer;
  if (!base) return null;

  const currentScore = riskCustomer ? riskCustomer.healthScore["30d"] : expiringCustomer.healthScore;
  const quarterScore = riskCustomer
    ? riskCustomer.healthScore.quarter
    : Math.max(5, currentScore + deriveNumber(`${customerId}|quarter`, -6, 4));
  const csm = riskCustomer ? riskCustomer.csm : expiringCustomer.owner;
  const amount = riskCustomer ? deriveNumber(`${customerId}|amount`, 9, 36) : expiringCustomer.amount;

  return {
    id: base.id,
    companyName: base.companyName,
    industry: base.industry,
    status: base.status,
    healthScore: currentScore,
    scoreDelta: currentScore - quarterScore,
    csm,
    renewalDate: base.renewalDate,
    daysLeft: Math.max(0, dayjs(base.renewalDate).startOf("day").diff(dayjs().startOf("day"), "day")),
    amount,
    activeAccounts: deriveNumber(`${customerId}|accounts`, 18, 160),
    lastLogin: LAST_LOGIN_OPTIONS[deriveNumber(`${customerId}|login`, 0, LAST_LOGIN_OPTIONS.length - 1)],
    healthTrend: buildHealthTrend(quarterScore, currentScore),
    activities: buildActivities(base),
  };
}

// ── 本月续约明细（KPI 下钻弹窗，节选 8 条） ──
export const RENEWAL_RECORDS = [
  { id: "RN-01", companyName: "盛远物流科技", amount: 21.6, cycle: "12 个月", renewalDate: "2026-10-05", payStatus: "已回款" },
  { id: "RN-02", companyName: "启明律所", amount: 14.2, cycle: "12 个月", renewalDate: "2026-10-08", payStatus: "已回款" },
  { id: "RN-03", companyName: "南洋跨境电商", amount: 33.8, cycle: "24 个月", renewalDate: "2026-10-11", payStatus: "审批中" },
  { id: "RN-04", companyName: "橙心互动传媒", amount: 11.5, cycle: "12 个月", renewalDate: "2026-10-13", payStatus: "已回款" },
  { id: "RN-05", companyName: "泰克精密仪器", amount: 27.9, cycle: "12 个月", renewalDate: "2026-10-16", payStatus: "待确认" },
  { id: "RN-06", companyName: "恒宇地产集团", amount: 42.3, cycle: "24 个月", renewalDate: "2026-10-17", payStatus: "审批中" },
  { id: "RN-07", companyName: "蓝湾餐饮集团", amount: 16.4, cycle: "12 个月", renewalDate: "2026-10-19", payStatus: "已回款" },
  { id: "RN-08", companyName: "微创医疗器械", amount: 38.4, cycle: "24 个月", renewalDate: "2026-10-20", payStatus: "审批中" },
];

// ── 响应时长趋势（KPI 下钻弹窗） ──
export const RESPONSE_TREND = {
  labels: ["10-14", "10-15", "10-16", "10-17", "10-18", "10-19", "10-20"],
  avg: [3.1, 2.9, 3.3, 2.7, 2.5, 2.8, 2.6],
  p90: [4.8, 4.5, 5.1, 4.4, 4.0, 4.3, 4.2],
};

// ── 团队负载（右侧栏） ──
export const TEAM_WORKLOAD = [
  { name: "林晚晴", role: "团队负责人", pendingTasks: 6, activeCustomers: 18, capacity: 72 },
  { name: "王思远", role: "高级 CSM", pendingTasks: 9, activeCustomers: 22, capacity: 88 },
  { name: "陈璐", role: "CSM", pendingTasks: 4, activeCustomers: 15, capacity: 55 },
  { name: "赵启明", role: "CSM", pendingTasks: 11, activeCustomers: 24, capacity: 96 },
  { name: "周雨桐", role: "CSM", pendingTasks: 3, activeCustomers: 12, capacity: 42 },
];

// ── 快捷操作 ──
export const QUICK_ACTIONS = [
  { key: "new-follow-up", label: "新建跟进", icon: <IconPlusIcPublicNotebook iconSize="1.25rem" iconColor={['currentcolor']} />, feedback: "已打开「新建跟进」表单（演示）" },
  { key: "call-back", label: "发起回访", icon: <IconPlusIcPublicPhoneGear iconSize="1.25rem" iconColor={['currentcolor']} />, feedback: "已打开「发起回访」表单（演示）" },
  { key: "submit-ticket", label: "提交工单", icon: <IconPlusIcBpitTicket iconSize="1.25rem" iconColor={['currentcolor']} />, feedback: "已打开「提交工单」表单（演示）" },
  { key: "create-group", label: "拉群", icon: <IconPlusIcPublicPlusCircle iconSize="1.25rem" iconColor={['currentcolor']} />, feedback: "已发起客户拉群流程（演示）" },
];

// ── 产品公告（轮播 3 条） ──
export const ANNOUNCEMENTS = [
  {
    id: "AN-01",
    tag: "产品更新",
    tagColor: "processing",
    title: "健康分模型 v2.5 上线",
    date: "2026-10-18",
    description: "新增使用深度与工单情绪因子，健康分预测准确率提升 18%，建议重新校准观察名单。",
  },
  {
    id: "AN-02",
    tag: "新功能",
    tagColor: "success",
    title: "批量回访计划支持自动排期",
    date: "2026-10-12",
    description: "按健康分与续约周期自动生成回访任务，一键分派给团队成员，晨会即可过一遍。",
  },
  {
    id: "AN-03",
    tag: "公告",
    tagColor: "warning",
    title: "11 月续约冲刺月活动开启",
    date: "2026-10-08",
    description: "完成续约目标的团队可获得额外激励，冲刺进度实时同步在团队管理页。",
  },
];
