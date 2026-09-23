// Layer 2: 指标域 mock 数据 + 字典 + 派生计算
// 达成率按指标极性(polarity)计算：higher=越大越好，lower=越小越好（使用率 / 延迟 / 成本类）
import dayjs from 'dayjs';

// eview-react Select 的 options 项用 { value, text }（不是 antd 的 label）。
export const CATEGORY_OPTIONS = [
  { value: '资源性能', text: '资源性能' },
  { value: '容量规划', text: '容量规划' },
  { value: '服务质量', text: '服务质量' },
  { value: '业务运营', text: '业务运营' },
  { value: '安全合规', text: '安全合规' },
];

export const CYCLE_OPTIONS = [
  { value: '实时', text: '实时' },
  { value: '每小时', text: '每小时' },
  { value: '每日', text: '每日' },
  { value: '每周', text: '每周' },
  { value: '每月', text: '每月' },
];

export const DIMENSION_OPTIONS = [
  { value: '全局', text: '全局' },
  { value: '区域', text: '区域' },
  { value: '机房', text: '机房' },
  { value: '业务系统', text: '业务系统' },
  { value: '设备类型', text: '设备类型' },
  { value: '租户', text: '租户' },
];

export const UNIT_OPTIONS = [
  { value: '%', text: '%' },
  { value: 'ms', text: 'ms' },
  { value: '秒', text: '秒' },
  { value: '分', text: '分' },
  { value: '个', text: '个' },
  { value: '人', text: '人' },
  { value: '天', text: '天' },
  { value: '元', text: '元' },
];

export const SOURCE_OPTIONS = [
  { value: '指标中台', text: '指标中台' },
  { value: 'Prometheus', text: 'Prometheus' },
  { value: '日志平台', text: '日志平台' },
  { value: '业务库直连', text: '业务库直连' },
  { value: '手工填报', text: '手工填报' },
];

export const OWNER_OPTIONS = [
  { value: '张明', text: '张明 · 平台架构组' },
  { value: '李慧', text: '李慧 · 基础资源组' },
  { value: '王涛', text: '王涛 · 数据平台组' },
  { value: '赵磊', text: '赵磊 · 容量规划组' },
  { value: '陈晓', text: '陈晓 · 网络运维组' },
  { value: '刘洋', text: '刘洋 · 服务保障组' },
  { value: '孙倩', text: '孙倩 · 运维支撑组' },
  { value: '周航', text: '周航 · 业务运营组' },
  { value: '何静', text: '何静 · 增长分析组' },
  { value: '马俊', text: '马俊 · 安全合规组' },
];

export const POLARITY_OPTIONS = [
  { value: 'higher', text: '正向指标（越大越好）' },
  { value: 'lower', text: '逆向指标（越小越好）' },
];

export const STATUS_OPTIONS = [
  { value: 'online', text: '已启用' },
  { value: 'pending', text: '待审核' },
  { value: 'warning', text: '需关注' },
  { value: 'abnormal', text: '数据异常' },
  { value: 'draft', text: '草稿' },
  { value: 'offline', text: '已停用' },
];

// 状态 → 文案 / 语义色调（供 status-tag 消费，单一数据源）
export const STATUS_MAP = {
  online: { label: '已启用', tone: 'success' },
  pending: { label: '待审核', tone: 'info' },
  warning: { label: '需关注', tone: 'critical' },
  abnormal: { label: '数据异常', tone: 'error' },
  draft: { label: '草稿', tone: 'neutral' },
  offline: { label: '已停用', tone: 'muted' },
};

const RAW_METRICS = [
  { id: 'MT-1001', name: '集群 CPU 平均使用率', code: 'res.cpu.usage.avg', category: '资源性能', cycle: '每日', dimension: '机房', unit: '%', target: 70, current: 63.4, trend: -2.6, polarity: 'lower', status: 'online', owner: '张明', source: 'Prometheus', effectiveAt: '2025-03-01', updatedAt: '2026-09-21 08:30' },
  { id: 'MT-1002', name: '内存使用率峰值', code: 'res.mem.usage.peak', category: '资源性能', cycle: '每日', dimension: '机房', unit: '%', target: 82, current: 88.6, trend: 5.2, polarity: 'lower', status: 'abnormal', owner: '李慧', source: 'Prometheus', effectiveAt: '2025-03-01', updatedAt: '2026-09-21 08:32' },
  { id: 'MT-1003', name: '磁盘 IO 平均延迟', code: 'res.disk.io.latency', category: '资源性能', cycle: '每小时', dimension: '设备类型', unit: 'ms', target: 8, current: 6.4, trend: -0.8, polarity: 'lower', status: 'online', owner: '王涛', source: 'Prometheus', effectiveAt: '2025-04-12', updatedAt: '2026-09-21 09:00' },
  { id: 'MT-1004', name: '存储容量利用率', code: 'res.storage.capacity.rate', category: '容量规划', cycle: '每日', dimension: '机房', unit: '%', target: 75, current: 71.2, trend: 0.9, polarity: 'lower', status: 'online', owner: '赵磊', source: '指标中台', effectiveAt: '2025-02-18', updatedAt: '2026-09-21 08:15' },
  { id: 'MT-1005', name: '带宽峰值利用率', code: 'res.network.bandwidth.peak', category: '容量规划', cycle: '每小时', dimension: '区域', unit: '%', target: 80, current: 84.7, trend: 3.4, polarity: 'lower', status: 'warning', owner: '陈晓', source: 'Prometheus', effectiveAt: '2025-06-05', updatedAt: '2026-09-21 09:05' },
  { id: 'MT-1006', name: '机柜上架率', code: 'cap.rack.usage.rate', category: '容量规划', cycle: '每周', dimension: '机房', unit: '%', target: 90, current: 86.5, trend: 1.1, polarity: 'higher', status: 'online', owner: '赵磊', source: '指标中台', effectiveAt: '2025-02-18', updatedAt: '2026-09-20 18:00' },
  { id: 'MT-1007', name: '数据中心电力负载率', code: 'cap.power.load.rate', category: '容量规划', cycle: '每日', dimension: '机房', unit: '%', target: 65, current: 58.3, trend: -1.4, polarity: 'lower', status: 'online', owner: '赵磊', source: '业务库直连', effectiveAt: '2025-02-18', updatedAt: '2026-09-21 08:20' },
  { id: 'MT-1008', name: '接口调用成功率', code: 'svc.api.success.rate', category: '服务质量', cycle: '实时', dimension: '业务系统', unit: '%', target: 99.9, current: 99.52, trend: -0.31, polarity: 'higher', status: 'warning', owner: '刘洋', source: '指标中台', effectiveAt: '2025-01-10', updatedAt: '2026-09-21 09:12' },
  { id: 'MT-1009', name: '接口响应时间 P95', code: 'svc.api.rt.p95', category: '服务质量', cycle: '实时', dimension: '业务系统', unit: 'ms', target: 200, current: 236.5, trend: 18.6, polarity: 'lower', status: 'warning', owner: '刘洋', source: '指标中台', effectiveAt: '2025-01-10', updatedAt: '2026-09-21 09:12' },
  { id: 'MT-1010', name: '核心链路可用性', code: 'svc.core.availability', category: '服务质量', cycle: '每日', dimension: '业务系统', unit: '%', target: 99.95, current: 99.98, trend: 0.02, polarity: 'higher', status: 'online', owner: '刘洋', source: '指标中台', effectiveAt: '2025-01-10', updatedAt: '2026-09-21 08:00' },
  { id: 'MT-1011', name: '告警平均确认时长', code: 'svc.alert.ack.duration', category: '服务质量', cycle: '每日', dimension: '全局', unit: '分', target: 10, current: 12.8, trend: 1.6, polarity: 'lower', status: 'warning', owner: '孙倩', source: '日志平台', effectiveAt: '2025-05-20', updatedAt: '2026-09-21 07:50' },
  { id: 'MT-1012', name: '工单一次解决率', code: 'svc.ticket.fcr', category: '服务质量', cycle: '每周', dimension: '区域', unit: '%', target: 85, current: 81.3, trend: -2.2, polarity: 'higher', status: 'online', owner: '孙倩', source: '手工填报', effectiveAt: '2025-05-20', updatedAt: '2026-09-20 20:00' },
  { id: 'MT-1013', name: '日活跃用户数', code: 'biz.dau', category: '业务运营', cycle: '每日', dimension: '全局', unit: '人', target: 120000, current: 128460, trend: 4.8, polarity: 'higher', status: 'online', owner: '周航', source: '业务库直连', effectiveAt: '2025-01-05', updatedAt: '2026-09-21 06:00' },
  { id: 'MT-1014', name: '月活跃用户数', code: 'biz.mau', category: '业务运营', cycle: '每月', dimension: '全局', unit: '人', target: 3000000, current: 2864000, trend: 1.2, polarity: 'higher', status: 'pending', owner: '周航', source: '业务库直连', effectiveAt: '2025-01-05', updatedAt: '2026-09-20 06:00' },
  { id: 'MT-1015', name: '订单支付成功率', code: 'biz.pay.success.rate', category: '业务运营', cycle: '实时', dimension: '业务系统', unit: '%', target: 99.5, current: 99.71, trend: 0.14, polarity: 'higher', status: 'online', owner: '周航', source: '业务库直连', effectiveAt: '2025-01-05', updatedAt: '2026-09-21 09:10' },
  { id: 'MT-1016', name: '新用户注册转化率', code: 'biz.register.cvr', category: '业务运营', cycle: '每日', dimension: '区域', unit: '%', target: 32, current: 27.6, trend: -1.8, polarity: 'higher', status: 'warning', owner: '何静', source: '业务库直连', effectiveAt: '2025-03-22', updatedAt: '2026-09-21 06:20' },
  { id: 'MT-1017', name: '用户 7 日留存率', code: 'biz.retain.7d', category: '业务运营', cycle: '每周', dimension: '全局', unit: '%', target: 45, current: 43.2, trend: 0.6, polarity: 'higher', status: 'online', owner: '何静', source: '指标中台', effectiveAt: '2025-03-22', updatedAt: '2026-09-20 22:00' },
  { id: 'MT-1018', name: '单均履约成本', code: 'biz.fulfill.cost.avg', category: '业务运营', cycle: '每月', dimension: '业务系统', unit: '元', target: 12, current: 13.4, trend: 0.8, polarity: 'lower', status: 'warning', owner: '何静', source: '业务库直连', effectiveAt: '2025-03-22', updatedAt: '2026-09-20 22:10' },
  { id: 'MT-1019', name: '安全事件总数', code: 'sec.incident.total', category: '安全合规', cycle: '每日', dimension: '全局', unit: '个', target: 5, current: 3, trend: -1, polarity: 'lower', status: 'online', owner: '马俊', source: '日志平台', effectiveAt: '2025-07-01', updatedAt: '2026-09-21 08:05' },
  { id: 'MT-1020', name: '高危漏洞修复率', code: 'sec.vuln.fix.rate', category: '安全合规', cycle: '每周', dimension: '设备类型', unit: '%', target: 95, current: 88.4, trend: 2.5, polarity: 'higher', status: 'warning', owner: '马俊', source: '手工填报', effectiveAt: '2025-07-01', updatedAt: '2026-09-20 19:30' },
  { id: 'MT-1021', name: '证书剩余有效期', code: 'sec.cert.remain.days', category: '安全合规', cycle: '每日', dimension: '业务系统', unit: '天', target: 60, current: 42, trend: -3, polarity: 'higher', status: 'abnormal', owner: '马俊', source: '指标中台', effectiveAt: '2025-07-01', updatedAt: '2026-09-21 08:40' },
  { id: 'MT-1022', name: '数据同步延迟', code: 'data.sync.delay', category: '服务质量', cycle: '实时', dimension: '业务系统', unit: '秒', target: 60, current: 148, trend: 46, polarity: 'lower', status: 'abnormal', owner: '王涛', source: '指标中台', effectiveAt: '2025-08-11', updatedAt: '2026-09-21 09:15' },
  { id: 'MT-1023', name: '缓存命中率', code: 'res.cache.hit.rate', category: '资源性能', cycle: '每小时', dimension: '业务系统', unit: '%', target: 92, current: 94.6, trend: 1.3, polarity: 'higher', status: 'online', owner: '王涛', source: 'Prometheus', effectiveAt: '2025-04-12', updatedAt: '2026-09-21 09:00' },
  { id: 'MT-1024', name: '日志采集完整率', code: 'data.log.collect.rate', category: '服务质量', cycle: '每日', dimension: '全局', unit: '%', target: 99, current: 98.2, trend: -0.4, polarity: 'higher', status: 'pending', owner: '孙倩', source: '日志平台', effectiveAt: '2025-05-20', updatedAt: '2026-09-21 08:10' },
  { id: 'MT-1025', name: '离线任务成功率', code: 'data.job.success.rate', category: '服务质量', cycle: '每小时', dimension: '业务系统', unit: '%', target: 99, current: 96.7, trend: -1.1, polarity: 'higher', status: 'draft', owner: '王涛', source: '指标中台', effectiveAt: '2026-09-01', updatedAt: '2026-09-19 17:40' },
  { id: 'MT-1026', name: '数据库连接池占用率', code: 'res.db.pool.usage', category: '资源性能', cycle: '每小时', dimension: '设备类型', unit: '%', target: 80, current: 76.5, trend: 0, polarity: 'lower', status: 'offline', owner: '陈晓', source: 'Prometheus', effectiveAt: '2025-06-05', updatedAt: '2026-09-15 11:20' },
  { id: 'MT-1027', name: '租户带宽配额使用率', code: 'cap.tenant.quota.usage', category: '容量规划', cycle: '每日', dimension: '租户', unit: '%', target: 85, current: 92.4, trend: 4.6, polarity: 'lower', status: 'warning', owner: '陈晓', source: '指标中台', effectiveAt: '2026-08-20', updatedAt: '2026-09-21 08:50' },
  { id: 'MT-1028', name: '数据质量校验通过率', code: 'data.quality.pass.rate', category: '服务质量', cycle: '每日', dimension: '业务系统', unit: '%', target: 98, current: 97.6, trend: 0.3, polarity: 'higher', status: 'draft', owner: '孙倩', source: '指标中台', effectiveAt: '2026-09-10', updatedAt: '2026-09-19 16:05' },
];

const NEW_OWNER_FALLBACK = '归属待分配';

// 达成率：正向 = 当前/目标；逆向 = 目标/当前
export function computeRatio(metric) {
  const current = Number(metric.current);
  const target = Number(metric.target);
  if (!current || !target) return 0;
  const raw = metric.polarity === 'lower' ? (target / current) * 100 : (current / target) * 100;
  return Math.round(raw * 10) / 10;
}

// 是否越过阈值（表格中以告警色提示）
export function isBreach(metric) {
  const current = Number(metric.current);
  const target = Number(metric.target);
  if (!current || !target) return false;
  return metric.polarity === 'lower' ? current > target : current < target;
}

export function formatMetricValue(value, unit) {
  if (value === undefined || value === null || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  const text = Number.isInteger(num)
    ? num.toLocaleString('zh-CN')
    : num.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  return unit ? text + ' ' + unit : text;
}

function describe(metric) {
  const owner = metric.owner || NEW_OWNER_FALLBACK;
  return '按 ' + metric.dimension + ' 维度采集「' + metric.name + '」，统计周期 ' + metric.cycle +
    '，目标值 ' + metric.target + (metric.unit || '') + '，偏离阈值 10% 时推送至 ' + owner + '。';
}

// 统一补全派生字段（说明、达成率），新增/编辑后复用同一入口
export function decorateMetric(metric) {
  const next = { ...metric };
  next.ratio = computeRatio(next);
  if (!next.description) next.description = describe(next);
  return next;
}

export function nowStamp() {
  return dayjs().format('YYYY-MM-DD HH:mm');
}

export function nextMetricId(list) {
  return 'MT-' + (1000 + list.length + 1);
}

export const INITIAL_METRICS = RAW_METRICS.map((item) => decorateMetric(item));
