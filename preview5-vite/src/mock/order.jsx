import {
  IconPlusIcPublicDashboard,
  IconPlusIcDigitalPowerDpFile,
  IconPlusIcPublicClipboard,
  IconPlusIcDigitalPowerDpUserCluster,
  IconPlusIcPublicBarChart,
  IconPlusIcPublicPlus,
  IconPlusIcPublicRefreshClockwise,
  IconPlusIcIctRepeatedCoverage,
  IconPlusIcPublicCloseCircle,
  IconPlusIcDigitalPowerDpDocList,
  IconPlusIcPublicSend,
  IconPlusIcPublicBox,
  IconPlusIcDigitalPowerDpPort,
  IconPlusIcIctServers,
  IconPlusIcPublicChartBar,
  IconPlusIcPublicSecurity,
  IconPlusIcPublicIdcard,
  IconPlusIcPublicMappinOnMap,
  IconPlusIcPublicCalendar,
  IconPlusIcPublicCreditcard,
  IconPlusIcPublicCheckmark,
  IconPlusIcPublicClock,
  IconPlusIcPublicNotes,
} from '@nce/icon-plus';
// Layer 2: 运营商业务受理 — 领域 mock 数据
// 语义化键名，供视图层直接消费。

// ── 顶部主导航（原生 nav 自写）──
export const topNavItems = [
  { key: "workbench", label: "经营工作台", icon: <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "order", label: "业务受理", icon: <IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "ticket", label: "工单管理", icon: <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "customer", label: "客户中心", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "report", label: "经营分析", icon: <IconPlusIcPublicBarChart iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// ── 侧边导航（eview-react Accordion）──
export const sideMenuItems = [
  {
    value: "grp-order",
    title: "业务受理",
    icon: <IconPlusIcDigitalPowerDpFile iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      { value: "order-create", title: "新装受理" },
      { value: "order-change", title: "套餐变更" },
      { value: "order-transfer", title: "移机受理" },
      { value: "order-cancel", title: "销户受理" },
    ],
  },
  {
    value: "grp-ticket",
    title: "工单处理",
    icon: <IconPlusIcPublicClipboard iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      { value: "ticket-list", title: "工单列表" },
      { value: "ticket-dispatch", title: "派单管理" },
      { value: "ticket-track", title: "装维进度" },
    ],
  },
  {
    value: "grp-resource",
    title: "资源管理",
    icon: <IconPlusIcIctServers iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      { value: "res-number", title: "号码资源" },
      { value: "res-port", title: "端口资源" },
      { value: "res-device", title: "设备资源" },
    ],
  },
  {
    value: "grp-audit",
    title: "统计分析",
    icon: <IconPlusIcPublicBarChart iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      { value: "stat-daily", title: "业务报表" },
      { value: "stat-audit", title: "受理稽核" },
    ],
  },
];

// ── 步骤定义 ──
export const stepItems = [
  { text: "客户资料", description: "实名与联系方式", value: "0" },
  { text: "产品订购", description: "套餐与增值服务", value: "1" },
  { text: "安装信息", description: "地址与预约时间", value: "2" },
  { text: "费用确认", description: "资费与支付方式", value: "3" },
  { text: "提交审核", description: "核对并提交工单", value: "4" },
];

// ── 证件类型 ──
export const certTypes = [
  { value: "idcard", text: "居民身份证" },
  { value: "passport", text: "护照" },
  { value: "hkmacau", text: "港澳居民来往内地通行证" },
  { value: "tw", text: "台湾居民来往大陆通行证" },
];

// ── 产品类型 ──
export const productTypes = [
  { value: "fusion", text: "5G 融合套餐", desc: "手机 + 宽带 + IPTV 融合优惠" },
  { value: "mobile", text: "5G 手机套餐", desc: "流量语音组合，随用随办" },
  { value: "broadband", text: "家庭宽带套餐", desc: "光纤入户，多设备共享" },
];

// ── 套餐列表 ──
export const plans = [
  { id: "fusion-099", type: "fusion", name: "5G 融合畅享 99", price: 99, original: 129, data: "30GB", voice: "500 分钟", broadband: "300M", tags: ["热销"] },
  { id: "fusion-139", type: "fusion", name: "5G 融合畅享 139", price: 139, original: 189, data: "60GB", voice: "1000 分钟", broadband: "500M", tags: ["推荐"] },
  { id: "fusion-199", type: "fusion", name: "5G 融合尊享 199", price: 199, original: 259, data: "100GB", voice: "1500 分钟", broadband: "1000M", tags: ["千兆"] },
  { id: "fusion-299", type: "fusion", name: "5G 融合尊享 299", price: 299, original: 389, data: "150GB", voice: "2000 分钟", broadband: "1000M", tags: ["旗舰"] },
  { id: "mobile-059", type: "mobile", name: "5G 畅享 59", price: 59, original: 79, data: "20GB", voice: "300 分钟", broadband: "—", tags: [] },
  { id: "mobile-089", type: "mobile", name: "5G 畅享 89", price: 89, original: 119, data: "40GB", voice: "600 分钟", broadband: "—", tags: ["热销"] },
  { id: "mobile-129", type: "mobile", name: "5G 尊享 129", price: 129, original: 169, data: "80GB", voice: "1000 分钟", broadband: "—", tags: [] },
  { id: "broadband-060", type: "broadband", name: "家庭宽带 300M", price: 60, original: 80, data: "—", voice: "—", broadband: "300M", tags: [] },
  { id: "broadband-100", type: "broadband", name: "家庭宽带 500M", price: 100, original: 130, data: "—", voice: "—", broadband: "500M", tags: ["提速"] },
  { id: "broadband-160", type: "broadband", name: "千兆宽带 1000M", price: 160, original: 210, data: "—", voice: "—", broadband: "1000M", tags: ["千兆"] },
];

// ── 增值服务 ──
export const addons = [
  { id: "cloud", name: "天翼云盘 2T", price: 10, desc: "超大云存储空间" },
  { id: "iptv", name: "IPTV 高清电视", price: 20, desc: "200+ 高清直播频道" },
  { id: "security", name: "家庭安防", price: 15, desc: "智能看家摄像头" },
  { id: "msg5g", name: "5G 消息包", price: 6, desc: "富媒体消息服务" },
  { id: "roaming", name: "国际漫游包", price: 30, desc: "出境流量日包" },
];

// ── 接入与设备 ──
export const accessTypes = [
  { value: "ftth", text: "FTTH 光纤入户" },
  { value: "cable", text: "网线入户" },
  { value: "wireless", text: "5G 无线接入" },
];

export const opticalModems = [
  { value: "hn8145xr", text: "华为 HN8145XR（Wi-Fi 6）" },
  { value: "f7607p", text: "中兴 F7607P（Wi-Fi 6）" },
  { value: "tewa800g", text: "天邑 TEWA-800G" },
  { value: "self", text: "用户自备光猫" },
];

export const installModes = [
  { value: "onsite", text: "上门安装" },
  { value: "selfpick", text: "营业厅自提" },
  { value: "remote", text: "远程开通" },
];

// ── 支付与发票 ──
export const payMethods = [
  { value: "wechat", text: "微信支付" },
  { value: "alipay", text: "支付宝" },
  { value: "unionpay", text: "银联在线" },
  { value: "deduct", text: "银行代扣" },
];

export const invoiceTypes = [
  { value: "personal", text: "电子发票（个人）" },
  { value: "company", text: "电子发票（单位）" },
  { value: "paper", text: "纸质发票（邮寄）" },
];

export const contractPeriods = [
  { value: "none", text: "无合约" },
  { value: "12", text: "12 个月" },
  { value: "24", text: "24 个月" },
  { value: "36", text: "36 个月" },
];

// ── 受理渠道（用于工单来源展示）──
export const saleChannels = [
  { value: "online", text: "线上营业厅" },
  { value: "store", text: "线下门店" },
  { value: "hotline", text: "客服热线" },
  { value: "manager", text: "政企客户经理" },
];

// ── 办理须知 ──
export const orderNotices = [
  { icon: <IconPlusIcPublicIdcard iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "实名登记：办理入网须提供本人有效身份证件原件。" },
  { icon: <IconPlusIcPublicMappinOnMap iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "装机地址需在光纤覆盖范围内，提交后系统自动核验。" },
  { icon: <IconPlusIcPublicCalendar iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "预约安装后，装维工程师将在 4 小时内与您联系确认。" },
  { icon: <IconPlusIcPublicCreditcard iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "首月费用按实际使用天数折算，次月起按月正常计费。" },
  { icon: <IconPlusIcPublicSecurity iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "合约期内解约需结清剩余费用并支付相应违约金。" },
];

// ── 最近受理工单 ──
export const recentOrders = [
  { id: "GD20261008-0042", customer: "张伟", product: "5G 融合畅享 139", status: "processing", channel: "线上营业厅", time: "10-08 09:24" },
  { id: "GD20261008-0038", customer: "李静", product: "千兆宽带 1000M", status: "completed", channel: "线下门店", time: "10-08 08:51" },
  { id: "GD20261007-0315", customer: "王强", product: "5G 畅享 89", status: "pending", channel: "客服热线", time: "10-07 20:12" },
  { id: "GD20261007-0298", customer: "赵敏", product: "5G 融合尊享 199", status: "completed", channel: "线上营业厅", time: "10-07 17:40" },
  { id: "GD20261007-0271", customer: "陈晨", product: "家庭宽带 500M", status: "failed", channel: "政企客户经理", time: "10-07 15:03" },
  { id: "GD20261006-0188", customer: "刘洋", product: "5G 融合畅享 99", status: "draft", channel: "线上营业厅", time: "10-06 11:27" },
];

// ── 工单状态字典 ──
export const orderStatusMap = {
  completed: { text: "已完工", color: "success", icon: <IconPlusIcPublicCheckmark iconSize="0.75rem" iconColor={['currentcolor']} /> },
  processing: { text: "处理中", color: "primary", icon: <IconPlusIcPublicRefreshClockwise iconSize="0.75rem" iconColor={['currentcolor']} /> },
  pending: { text: "待受理", color: "warning", icon: <IconPlusIcPublicClock iconSize="0.75rem" iconColor={['currentcolor']} /> },
  failed: { text: "已退单", color: "danger", icon: <IconPlusIcPublicCloseCircle iconSize="0.75rem" iconColor={['currentcolor']} /> },
  draft: { text: "草稿", color: "default", icon: <IconPlusIcPublicNotes iconSize="0.75rem" iconColor={['currentcolor']} /> },
};

// ── 一次性费用常量 ──
export const INSTALL_FEE = 100;
export const TAX_RATE = 0.06;
