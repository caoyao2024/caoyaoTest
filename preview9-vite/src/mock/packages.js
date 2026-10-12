// Layer 2: 业务域 mock 数据 —— 运营商云网专线开通

export const CUSTOMERS = [
  { value: "cmcc", label: "中国移动通信集团" },
  { value: "ctcc", label: "中国电信股份有限公司" },
  { value: "cucc", label: "中国联通网络通信" },
  { value: "hw", label: "华为技术有限公司" },
  { value: "tencent", label: "腾讯云计算(北京)" },
  { value: "jd", label: "京东科技控股" },
  { value: "csg", label: "南方电网数字集团" },
  { value: "sf", label: "顺丰速运有限公司" },
];

export const SCENES = [
  { value: "cloud", label: "云专线接入" },
  { value: "p2p", label: "点到点专线" },
  { value: "internet", label: "互联网专线" },
  { value: "vpn", label: "组网专线(VPN)" },
  { value: "fiber", label: "裸光纤租用" },
  { value: "slice", label: "5G 切片专线" },
];

// 带宽规格：price 为每月基础价（元）
export const BANDWIDTH_SPECS = [
  { value: "10M", label: "10 Mbps", price: 800 },
  { value: "50M", label: "50 Mbps", price: 3200 },
  { value: "100M", label: "100 Mbps", price: 5800 },
  { value: "200M", label: "200 Mbps", price: 10500 },
  { value: "500M", label: "500 Mbps", price: 24000 },
  { value: "1G", label: "1 Gbps", price: 42000 },
];

export const REGIONS = [
  { value: "north", label: "华北区域" },
  { value: "east", label: "华东区域" },
  { value: "south", label: "华南区域" },
  { value: "west", label: "西部区域" },
];

export const PRIORITIES = [
  { value: "high", label: "高" },
  { value: "mid", label: "中" },
  { value: "low", label: "低" },
];

// 站点资源（按区域）
export const STATIONS = {
  north: ["北京亦庄 A 级机房", "天津滨海核心机房", "石家庄裕华汇聚机房", "北京望京边缘节点"],
  east: ["上海临港 A 级机房", "杭州滨江核心机房", "南京江宁汇聚机房", "苏州工业园边缘节点"],
  south: ["广州天河 A 级机房", "深圳前海核心机房", "福州鼓楼汇聚机房", "东莞松山湖边缘节点"],
  west: ["成都高新区 A 级机房", "西安雁塔核心机房", "重庆两江汇聚机房", "贵阳大数据机房"],
};

// 配置清单状态
export const ITEM_STATUS = {
  pending: { text: "待配置", type: "default" },
  configuring: { text: "配置中", type: "processing" },
  ready: { text: "已就绪", type: "success" },
  abnormal: { text: "异常", type: "error" },
};

export const ORDER_STATUS = {
  done: { text: "已开通", type: "success" },
  processing: { text: "开通中", type: "processing" },
  review: { text: "待审核", type: "warning" },
  reject: { text: "已驳回", type: "error" },
  cancel: { text: "已退订", type: "default" },
};

// 初始电路配置清单
export const INITIAL_CONFIG_ITEMS = [
  { id: "c1", code: "DY-2026-100231", customer: "中国移动通信集团", bandwidth: "100M", cycle: "包月", station: "北京亦庄 A 级机房", region: "华北区域", price: 5800, priority: "high", status: "ready" },
  { id: "c2", code: "DY-2026-100232", customer: "中国移动通信集团", bandwidth: "500M", cycle: "包年", station: "天津滨海核心机房", region: "华北区域", price: 24000, priority: "mid", status: "configuring" },
  { id: "c3", code: "DY-2026-100233", customer: "腾讯云计算(北京)", bandwidth: "200M", cycle: "包月", station: "上海临港 A 级机房", region: "华东区域", price: 10500, priority: "high", status: "pending" },
  { id: "c4", code: "DY-2026-100234", customer: "京东科技控股", bandwidth: "50M", cycle: "包月", station: "深圳前海核心机房", region: "华南区域", price: 3200, priority: "low", status: "abnormal" },
  { id: "c5", code: "DY-2026-100235", customer: "南方电网数字集团", bandwidth: "1G", cycle: "包年", station: "广州天河 A 级机房", region: "华南区域", price: 42000, priority: "high", status: "configuring" },
  { id: "c6", code: "DY-2026-100236", customer: "顺丰速运有限公司", bandwidth: "100M", cycle: "包月", station: "成都高新区 A 级机房", region: "西部区域", price: 5800, priority: "mid", status: "pending" },
];

// 开通工单
export const ORDERS = [
  { id: "o1", orderNo: "GD-2026-009821", customer: "中国移动通信集团", scene: "云专线接入", bandwidth: "100M", stations: 4, amount: 23200, status: "done", createdAt: "2026-09-28 10:12", eta: "2026-10-02" },
  { id: "o2", orderNo: "GD-2026-009820", customer: "腾讯云计算(北京)", scene: "组网专线(VPN)", bandwidth: "500M", stations: 8, amount: 96000, status: "processing", createdAt: "2026-09-30 14:35", eta: "2026-10-06" },
  { id: "o3", orderNo: "GD-2026-009818", customer: "京东科技控股", scene: "互联网专线", bandwidth: "200M", stations: 2, amount: 21000, status: "review", createdAt: "2026-10-01 09:05", eta: "2026-10-05" },
  { id: "o4", orderNo: "GD-2026-009815", customer: "华为技术有限公司", scene: "点对点专线", bandwidth: "1G", stations: 6, amount: 252000, status: "done", createdAt: "2026-09-25 16:48", eta: "2026-09-30" },
  { id: "o5", orderNo: "GD-2026-009812", customer: "南方电网数字集团", scene: "云专线接入", bandwidth: "500M", stations: 12, amount: 288000, status: "processing", createdAt: "2026-09-24 11:20", eta: "2026-10-03" },
  { id: "o6", orderNo: "GD-2026-009810", customer: "顺丰速运有限公司", scene: "5G 切片专线", bandwidth: "50M", stations: 30, amount: 96000, status: "reject", createdAt: "2026-09-22 13:02", eta: "2026-09-29" },
  { id: "o7", orderNo: "GD-2026-009807", customer: "中国电信股份有限公司", scene: "裸光纤租用", bandwidth: "100M", stations: 3, amount: 17400, status: "cancel", createdAt: "2026-09-20 08:55", eta: "2026-09-26" },
  { id: "o8", orderNo: "GD-2026-009805", customer: "中国联通网络通信", scene: "互联网专线", bandwidth: "200M", stations: 5, amount: 52500, status: "done", createdAt: "2026-09-18 15:10", eta: "2026-09-23" },
  { id: "o9", orderNo: "GD-2026-009802", customer: "腾讯云计算(北京)", scene: "云专线接入", bandwidth: "1G", stations: 10, amount: 420000, status: "done", createdAt: "2026-09-16 10:40", eta: "2026-09-21" },
  { id: "o10", orderNo: "GD-2026-009799", customer: "京东科技控股", scene: "组网专线(VPN)", bandwidth: "100M", stations: 7, amount: 40600, status: "review", createdAt: "2026-09-15 17:22", eta: "2026-09-20" },
  { id: "o11", orderNo: "GD-2026-009795", customer: "华为技术有限公司", scene: "点对点专线", bandwidth: "500M", stations: 4, amount: 96000, status: "processing", createdAt: "2026-09-12 09:30", eta: "2026-09-19" },
  { id: "o12", orderNo: "GD-2026-009790", customer: "中国移动通信集团", scene: "互联网专线", bandwidth: "50M", stations: 15, amount: 48000, status: "done", createdAt: "2026-09-10 14:05", eta: "2026-09-15" },
  { id: "o13", orderNo: "GD-2026-009786", customer: "顺丰速运有限公司", scene: "云专线接入", bandwidth: "200M", stations: 22, amount: 231000, status: "processing", createdAt: "2026-09-08 11:48", eta: "2026-09-14" },
  { id: "o14", orderNo: "GD-2026-009781", customer: "南方电网数字集团", scene: "裸光纤租用", bandwidth: "100M", stations: 2, amount: 11600, status: "done", createdAt: "2026-09-05 16:30", eta: "2026-09-09" },
  { id: "o15", orderNo: "GD-2026-009777", customer: "中国电信股份有限公司", scene: "5G 切片专线", bandwidth: "500M", stations: 18, amount: 432000, status: "reject", createdAt: "2026-09-03 08:12", eta: "2026-09-08" },
  { id: "o16", orderNo: "GD-2026-009772", customer: "中国联通网络通信", scene: "组网专线(VPN)", bandwidth: "1G", stations: 9, amount: 378000, status: "done", createdAt: "2026-09-01 13:55", eta: "2026-09-06" },
  { id: "o17", orderNo: "GD-2026-009768", customer: "腾讯云计算(北京)", scene: "点对点专线", bandwidth: "100M", stations: 6, amount: 34800, status: "cancel", createdAt: "2026-08-29 10:20", eta: "2026-09-03" },
  { id: "o18", orderNo: "GD-2026-009763", customer: "京东科技控股", scene: "云专线接入", bandwidth: "200M", stations: 11, amount: 115500, status: "done", createdAt: "2026-08-27 15:44", eta: "2026-09-01" },
  { id: "o19", orderNo: "GD-2026-009758", customer: "华为技术有限公司", scene: "互联网专线", bandwidth: "500M", stations: 3, amount: 72000, status: "review", createdAt: "2026-08-25 09:10", eta: "2026-08-30" },
  { id: "o20", orderNo: "GD-2026-009752", customer: "中国移动通信集团", scene: "5G 切片专线", bandwidth: "50M", stations: 25, amount: 80000, status: "done", createdAt: "2026-08-22 11:32", eta: "2026-08-27" },
];

// 资源池
export const RESOURCE_POOLS = [
  { id: "r1", region: "华北区域", city: "北京", totalPorts: 480, usedPorts: 396, grade: "A 级", status: "done" },
  { id: "r2", region: "华北区域", city: "天津", totalPorts: 320, usedPorts: 208, grade: "A 级", status: "done" },
  { id: "r3", region: "华东区域", city: "上海", totalPorts: 560, usedPorts: 512, grade: "A 级", status: "review" },
  { id: "r4", region: "华东区域", city: "杭州", totalPorts: 400, usedPorts: 264, grade: "B 级", status: "done" },
  { id: "r5", region: "华南区域", city: "广州", totalPorts: 520, usedPorts: 468, grade: "A 级", status: "processing" },
  { id: "r6", region: "华南区域", city: "深圳", totalPorts: 600, usedPorts: 432, grade: "A 级", status: "done" },
  { id: "r7", region: "西部区域", city: "成都", totalPorts: 300, usedPorts: 156, grade: "B 级", status: "done" },
  { id: "r8", region: "西部区域", city: "西安", totalPorts: 260, usedPorts: 221, grade: "B 级", status: "reject" },
];

// 参数模板
export const TEMPLATES = [
  { id: "t1", name: "标准云专线-100M", scene: "云专线接入", bandwidth: "100M", cycle: "包月", priority: "mid", owner: "张工", updatedAt: "2026-09-30 09:20" },
  { id: "t2", name: "大带宽组网-1G", scene: "组网专线(VPN)", bandwidth: "1G", cycle: "包年", priority: "high", owner: "李工", updatedAt: "2026-09-28 14:05" },
  { id: "t3", name: "边缘汇聚-50M", scene: "互联网专线", bandwidth: "50M", cycle: "包月", priority: "low", owner: "王工", updatedAt: "2026-09-26 11:12" },
  { id: "t4", name: "双活点对点-200M", scene: "点对点专线", bandwidth: "200M", cycle: "包年", priority: "high", owner: "赵工", updatedAt: "2026-09-22 16:40" },
  { id: "t5", name: "5G 切片轻量包", scene: "5G 切片专线", bandwidth: "50M", cycle: "包月", priority: "mid", owner: "陈工", updatedAt: "2026-09-18 10:30" },
  { id: "t6", name: "裸纤直连-500M", scene: "裸光纤租用", bandwidth: "500M", cycle: "包年", priority: "high", owner: "周工", updatedAt: "2026-09-15 08:50" },
];

// 工具：按 value 取 label / 价格
export function labelOf(list, value) {
  const hit = list.find((i) => i.value === value);
  return hit ? hit.label : value;
}

export function priceOf(bandwidth) {
  const hit = BANDWIDTH_SPECS.find((i) => i.value === bandwidth);
  return hit ? hit.price : 0;
}
