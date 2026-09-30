// Layer 2 — 工单填报领域 Mock 数据

export const topNavItems = [
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

export const sideMenu = [
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

export const notifications = [
  { id: "n1", title: "工单 WO-20260928-0041 已超时", time: "8 分钟前", tone: "error", icon: "siren" },
  { id: "n2", title: "杭州 IDC-3 机房温度告警恢复", time: "36 分钟前", tone: "success", icon: "thermometer-snowflake" },
  { id: "n3", title: "李泽宇提交了巡检工单待你审批", time: "1 小时前", tone: "info", icon: "clipboard-check" },
  { id: "n4", title: "备件库存 UPS-模块 低于安全水位", time: "3 小时前", tone: "warning", icon: "boxes" },
  { id: "n5", title: "本周巡检计划完成率 86%", time: "昨天 18:00", tone: "neutral", icon: "chart-column" },
];

export const orderTypes = [
  { value: "routine", text: "例行巡检" },
  { value: "fault", text: "故障维修" },
  { value: "change", text: "变更实施" },
  { value: "emergency", text: "应急保障" },
  { value: "acceptance", text: "工程验收" },
];

export const priorityOptions = [
  { value: "low", text: "低 · 计划内" },
  { value: "medium", text: "中 · 常规" },
  { value: "high", text: "高 · 优先" },
  { value: "urgent", text: "紧急 · 立即" },
];

export const priorityMeta = {
  low: { label: "低", tone: "neutral" },
  medium: { label: "中", tone: "info" },
  high: { label: "高", tone: "critical" },
  critical: { label: "严重", tone: "critical" },
  urgent: { label: "紧急", tone: "error" },
};

// 兜底元数据 —— 任何未在枚举中登记的取值都不会导致渲染中断
export const fallbackMeta = { label: "未知", tone: "neutral" };

export function metaOf(table, key) {
  return (table && table[key]) || fallbackMeta;
}

export const stationOptions = [
  { value: "hz-idc-01", text: "杭州 · 滨江 IDC-1 机房" },
  { value: "hz-idc-03", text: "杭州 · 滨江 IDC-3 机房" },
  { value: "sh-jd-02", text: "上海 · 嘉定机房" },
  { value: "bj-cy-05", text: "北京 · 朝阳数据中心" },
  { value: "gz-th-02", text: "广州 · 天河边缘节点" },
  { value: "cd-jj-01", text: "成都 · 经开灾备中心" },
  { value: "sz-ns-04", text: "深圳 · 南山汇聚机房" },
];

export const ownerOptions = [
  { value: "u-1024", text: "陈亦然 · 网络运维一组" },
  { value: "u-1088", text: "李泽宇 · 网络运维一组" },
  { value: "u-1120", text: "沈嘉禾 · 服务器运维组" },
  { value: "u-1206", text: "赵思齐 · 机房设施组" },
  { value: "u-1315", text: "徐怀安 · 安全运营组" },
  { value: "u-1402", text: "林知遥 · 网络运维二组" },
  { value: "u-1466", text: "高屹山 · 灾备与容灾组" },
];

export const ccOptions = [
  { value: "u-1024", text: "陈亦然" },
  { value: "u-1120", text: "沈嘉禾" },
  { value: "u-1206", text: "赵思齐" },
  { value: "u-1315", text: "徐怀安" },
  { value: "u-1402", text: "林知遥" },
  { value: "u-1466", text: "高屹山" },
];

export const deviceOptions = [
  { value: "DEV-SW-0231", text: "DEV-SW-0231 · 核心交换机 CE-8850" },
  { value: "DEV-SW-0417", text: "DEV-SW-0417 · 汇聚交换机 S6730" },
  { value: "DEV-SRV-1188", text: "DEV-SRV-1188 · 机架服务器 RH2288" },
  { value: "DEV-UPS-0064", text: "DEV-UPS-0064 · UPS 电源 160kVA" },
  { value: "DEV-AC-0209", text: "DEV-AC-0209 · 精密空调 25kW" },
  { value: "DEV-FW-0033", text: "DEV-FW-0033 · 下一代防火墙 USG6600" },
  { value: "DEV-ODF-0087", text: "DEV-ODF-0087 · 光纤配线架 ODF-288" },
  { value: "DEV-PWR-0152", text: "DEV-PWR-0152 · 智能 PDU 32A" },
];

export const inspectionItemOptions = [
  { value: "power", text: "电源与供电状态" },
  { value: "temp", text: "设备进出风温度" },
  { value: "fan", text: "风扇转速与异响" },
  { value: "led", text: "指示灯与告警面板" },
  { value: "port", text: "端口误码与光功率" },
  { value: "cable", text: "线缆连接与标签" },
  { value: "dust", text: "防尘网清洁度" },
  { value: "firmware", text: "固件版本一致性" },
];

export const resultOptions = [
  { value: "normal", text: "正常" },
  { value: "abnormal", text: "异常" },
  { value: "pending", text: "待复核" },
];

export const resultMeta = {
  normal: { label: "正常", tone: "success" },
  abnormal: { label: "异常", tone: "error" },
  pending: { label: "待复核", tone: "warning" },
};

export const unitOptions = [
  { value: "℃", text: "℃" },
  { value: "%", text: "%" },
  { value: "dBm", text: "dBm" },
  { value: "rpm", text: "rpm" },
  { value: "A", text: "A" },
  { value: "MPa", text: "MPa" },
];

export const ackOptions = [
  { value: "safety", text: "已阅读并遵守《机房作业安全须知》" },
  { value: "photo", text: "现场照片已同步至工单附件" },
  { value: "spare", text: "所需备件已提交领用申请" },
  { value: "customer", text: "已与客户确认作业窗口期" },
];

export const recentOrders = [
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

export const orderStatusMeta = {
  draft: { label: "草稿", tone: "neutral" },
  processing: { label: "处理中", tone: "info" },
  reviewing: { label: "待审批", tone: "warning" },
  overdue: { label: "已超时", tone: "error" },
  done: { label: "已完成", tone: "success" },
};

export const approvalNodes = [
  { title: "提交工单", desc: "填报人：陈亦然", time: "进行中", tone: "brand" },
  { title: "班组审核", desc: "网络运维一组 · 李泽宇", time: "预计 1 小时内", tone: "neutral" },
  { title: "值班经理审批", desc: "机房运营中心 · 徐怀安", time: "预计 4 小时内", tone: "neutral" },
  { title: "归档与回访", desc: "系统自动归档并推送客户", time: "完成后自动执行", tone: "neutral" },
];

export const guidelines = [
  "工单标题需包含「设备 + 现象」，便于后续检索，例如「CE-8850 端口误码升高」。",
  "优先级选择「紧急」时需在 30 分钟内到达现场，且必须上传现场照片。",
  "巡检明细中任一项判定为「异常」，都必须填写备注说明处置动作。",
  "计划结束时间需晚于开始时间，且与预计工时保持合理区间。",
  "提交后工单进入审批流，草稿可随时编辑，提交后需撤回才能修改。",
];

export const filePool = [
  { name: "现场照片_机柜正面.jpg", size: "2.4 MB", kind: "image" },
  { name: "巡检记录表_0928.xlsx", size: "186 KB", kind: "sheet" },
  { name: "光功率测试截图.png", size: "812 KB", kind: "image" },
  { name: "设备运行日志.log", size: "4.1 MB", kind: "log" },
  { name: "变更方案_评审版.pdf", size: "1.2 MB", kind: "doc" },
];
