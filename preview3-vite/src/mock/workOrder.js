// Layer 2 — 工单填报域模拟数据

export const workOrderTypes = [
  { value: "fault", label: "设备故障报修" },
  { value: "inspection", label: "巡检异常上报" },
  { value: "change", label: "变更申请" },
  { value: "expand", label: "资源扩容申请" },
  { value: "security", label: "安全整改" },
  { value: "maintain", label: "例行维护" },
];

export const priorities = [
  { value: "p0", label: "紧急 P0", tone: "error" },
  { value: "p1", label: "高 P1", tone: "critical" },
  { value: "p2", label: "中 P2", tone: "info" },
  { value: "p3", label: "低 P3", tone: "muted" },
];

export const idcList = [
  { value: "hd1-a", label: "华东1号数据中心 · A 机房" },
  { value: "hd1-b", label: "华东1号数据中心 · B 机房" },
  { value: "hd2-c", label: "华东2号数据中心 · C 机房" },
  { value: "hb1-a", label: "华北1号数据中心 · A 机房" },
  { value: "hn1-d", label: "华南1号数据中心 · D 机房" },
  { value: "edge-sh", label: "上海边缘节点机房" },
];

const deviceSeeds = [
  ["SRV-A01-0231", "应用服务器", "Dell PowerEdge R750", "华东1号数据中心", "A 机房", "A-12-03"],
  ["SRV-A01-0232", "应用服务器", "Dell PowerEdge R750", "华东1号数据中心", "A 机房", "A-12-04"],
  ["SRV-A01-0418", "数据库服务器", "H3C UniServer R4900", "华东1号数据中心", "A 机房", "A-14-01"],
  ["SRV-B02-0075", "缓存节点", "Huawei FusionServer 2288H", "华东1号数据中心", "B 机房", "B-03-07"],
  ["SRV-B02-0081", "缓存节点", "Huawei FusionServer 2288H", "华东1号数据中心", "B 机房", "B-03-09"],
  ["SW-HD1-CORE-01", "核心交换机", "H3C S12508G-AF", "华东1号数据中心", "网络区", "N-01-01"],
  ["SW-HD1-CORE-02", "核心交换机", "H3C S12508G-AF", "华东1号数据中心", "网络区", "N-01-02"],
  ["FW-HD1-EDGE-01", "边界防火墙", "Hillstone SG-6000", "华东1号数据中心", "网络区", "N-02-05"],
  ["STG-HD1-0142", "分布式存储节点", "Inspur AS13000", "华东1号数据中心", "C 机房", "C-05-11"],
  ["STG-HD1-0143", "分布式存储节点", "Inspur AS13000", "华东1号数据中心", "C 机房", "C-05-12"],
  ["SRV-HD2-1102", "虚拟化宿主机", "Lenovo ThinkSystem SR650", "华东2号数据中心", "C 机房", "C-08-02"],
  ["SRV-HD2-1103", "虚拟化宿主机", "Lenovo ThinkSystem SR650", "华东2号数据中心", "C 机房", "C-08-03"],
  ["SRV-HD2-1104", "虚拟化宿主机", "Lenovo ThinkSystem SR650", "华东2号数据中心", "C 机房", "C-08-04"],
  ["UPS-HD2-0021", "UPS 电源", "Eaton 93PM", "华东2号数据中心", "动力区", "P-01-06"],
  ["AC-HD2-0033", "精密空调", "Vertiv PEX4", "华东2号数据中心", "动力区", "P-02-02"],
  ["SRV-HB1-3301", "消息队列节点", "Dell PowerEdge R760", "华北1号数据中心", "A 机房", "A-06-08"],
  ["SRV-HB1-3302", "消息队列节点", "Dell PowerEdge R760", "华北1号数据中心", "A 机房", "A-06-09"],
  ["SRV-HB1-3303", "消息队列节点", "Dell PowerEdge R760", "华北1号数据中心", "A 机房", "A-06-10"],
  ["SRV-HN1-5501", "边缘计算节点", "H3C UniServer R4700", "华南1号数据中心", "D 机房", "D-02-01"],
  ["SRV-HN1-5502", "边缘计算节点", "H3C UniServer R4700", "华南1号数据中心", "D 机房", "D-02-02"],
  ["SW-HN1-ACC-07", "接入交换机", "Huawei CloudEngine S6730", "华南1号数据中心", "D 机房", "D-03-05"],
  ["SRV-EDGE-SH-11", "边缘网关", "Advantech EIS-D220", "上海边缘节点机房", "边缘区", "E-01-01"],
  ["SRV-EDGE-SH-12", "边缘网关", "Advantech EIS-D220", "上海边缘节点机房", "边缘区", "E-01-02"],
  ["STG-EDGE-SH-04", "边缘存储", "QNAP TS-h1290FX", "上海边缘节点机房", "边缘区", "E-02-03"],
];

export const devices = deviceSeeds.map(function (row) {
  return {
    code: row[0],
    name: row[1],
    model: row[2],
    idcName: row[3],
    room: row[4],
    rack: row[5],
    label: row[0] + " · " + row[1],
    value: row[0],
  };
});

export const issueCategories = [
  { value: "hardware", label: "硬件告警" },
  { value: "network", label: "网络异常" },
  { value: "power", label: "供电/制冷" },
  { value: "os", label: "操作系统" },
  { value: "db", label: "数据库" },
  { value: "security", label: "安全事件" },
];

export const impactScopes = [
  { value: "single", label: "单台设备" },
  { value: "rack", label: "单个机柜" },
  { value: "row", label: "整排机架" },
  { value: "room", label: "整个机房" },
  { value: "multi-idc", label: "跨机房" },
  { value: "business", label: "业务系统受影响" },
];

export const teams = [
  { value: "net", label: "网络运维组" },
  { value: "sys", label: "系统运维组" },
  { value: "sec", label: "安全响应组" },
  { value: "app", label: "应用支撑组" },
  { value: "hw", label: "硬件保障组" },
  { value: "dc", label: "数据中心现场组" },
];

export const assignees = [
  { value: "zhangwei", label: "张伟（网络运维组）", team: "net" },
  { value: "liyan", label: "李岩（网络运维组）", team: "net" },
  { value: "chenjing", label: "陈静（系统运维组）", team: "sys" },
  { value: "zhaolei", label: "赵磊（系统运维组）", team: "sys" },
  { value: "sunqi", label: "孙琪（安全响应组）", team: "sec" },
  { value: "wangkai", label: "王凯（应用支撑组）", team: "app" },
  { value: "hemin", label: "何敏（硬件保障组）", team: "hw" },
  { value: "zhouyu", label: "周宇（数据中心现场组）", team: "dc" },
];

// 需要填写的必填字段（用于计算填写完成度）
export const requiredKeys = [
  "title",
  "type",
  "priority",
  "dueTime",
  "device",
  "issueCategory",
  "description",
  "team",
  "assignee",
  "planHours",
  "contactName",
  "contactPhone",
  "contactEmail",
  "agreement",
];

// 一键智能填充示例值
export const sampleValues = {
  title: "A 机房核心交换机 SW-HD1-CORE-01 端口持续抖动告警",
  type: "fault",
  priority: "p1",
  dueTime: null,
  device: "SW-HD1-CORE-01",
  issueCategory: ["network", "hardware"],
  impactScopes: ["room", "business"],
  description:
    "09-29 09:40 起，A 机房核心交换机 SW-HD1-CORE-01 上行端口 Te1/0/1 持续出现 CRC 校验错误，端口抖动频率约 5 分钟一次，导致 A 机房内应用服务器集群偶发丢包。已临时将流量切换至备用链路 SW-HD1-CORE-02，业务暂未中断，需排查光模块与尾纤。",
  tempMeasure: "yes",
  tempMeasureDesc: "已切换至备用核心链路，并关闭故障端口的动态路由宣告。",
  team: "net",
  assignee: "zhangwei",
  planHours: 4,
  onsiteSupport: "yes",
  ccUsers: ["chenjing", "sunqi"],
  remark: "如需更换光模块，请提前从备件库申领同型号 SFP+ 万兆多模模块。",
  contactName: "刘振华",
  contactPhone: "13800138000",
  contactEmail: "liuzhenhua@ict-example.com",
  employeeNo: "E100238",
  agreement: true,
};

export const recentOrders = [
  { id: "WO-20260928-0137", title: "A 机房核心交换机端口抖动", status: "processing", time: "09-28 14:22" },
  { id: "WO-20260928-0112", title: "虚拟化宿主机内存告警", status: "pending", time: "09-28 10:05" },
  { id: "WO-20260927-0096", title: "C 机房精密空调回风温度偏高", status: "processing", time: "09-27 17:48" },
  { id: "WO-20260927-0064", title: "分布式存储节点磁盘重建", status: "done", time: "09-27 11:30" },
  { id: "WO-20260926-0051", title: "边缘网关固件升级", status: "done", time: "09-26 20:15" },
  { id: "WO-20260926-0023", title: "华北消息队列节点扩容", status: "closed", time: "09-26 09:40" },
];
