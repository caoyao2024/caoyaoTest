import {
  IconPlusIcBpitCheckedTrue,
  IconPlusIcDigitalPowerDpArrowMoveUp,
  IconPlusIcDigitalPowerDpUserCluster,
  IconPlusIcDigitalPowerSecurityProtection,
  IconPlusIcIctBulkEdit,
  IconPlusIcIctDeliverAll,
  IconPlusIcIctLteLogicalRouter,
  IconPlusIcIctNewFile,
  IconPlusIcIctServers,
  IconPlusIcIctSwitchInterfaces,
  IconPlusIcPublicBarChart,
  IconPlusIcPublicCheckmark,
  IconPlusIcPublicClipboard,
  IconPlusIcPublicClock,
  IconPlusIcPublicCloseCircle,
  IconPlusIcPublicCreditcard,
  IconPlusIcPublicDashboard,
  IconPlusIcPublicDocClock,
  IconPlusIcPublicIdcard,
  IconPlusIcPublicLoadingClockwise,
  IconPlusIcPublicMappinOnMap,
  IconPlusIcPublicMinus,
  IconPlusIcPublicPlus,
  IconPlusIcPublicRefreshClockwise,
  IconPlusIcPublicSend,
  IconPlusIcPublicSwitchover,
  IconPlusIcPublicTag,
} from '@nce/icon-plus';
// Layer 2: 运营商业务受理 — 领域 mock 数据
// 语义化键名，供视图层直接消费。

// ── 顶部主导航（原生 nav 自写）──
export const topNavItems = [
  { key: "workbench", label: "经营工作台", icon: <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "order", label: "业务受理", icon: <IconPlusIcIctNewFile iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "ticket", label: "工单管理", icon: <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "customer", label: "客户中心", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "report", label: "经营分析", icon: <IconPlusIcPublicBarChart iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// ── 侧边导航（antd Menu）──
export const sideMenuItems = [
  {
    key: "grp-order",
    icon: <IconPlusIcIctNewFile iconSize="1rem" iconColor={['currentcolor']} />,
    label: "业务受理",
    children: [
      { key: "order-create", icon: <IconPlusIcPublicPlus iconSize="1rem" iconColor={['currentcolor']} />, label: "新装受理" },
      { key: "order-change", icon: <IconPlusIcPublicRefreshClockwise iconSize="1rem" iconColor={['currentcolor']} />, label: "套餐变更" },
      { key: "order-transfer", icon: <IconPlusIcPublicSwitchover iconSize="1rem" iconColor={['currentcolor']} />, label: "移机受理" },
      { key: "order-cancel", icon: <IconPlusIcPublicMinus iconSize="1rem" iconColor={['currentcolor']} />, label: "销户受理" },
    ],
  },
  {
    key: "grp-ticket",
    icon: <IconPlusIcPublicClipboard iconSize="1rem" iconColor={['currentcolor']} />,
    label: "工单处理",
    children: [
      { key: "ticket-list", icon: <IconPlusIcBpitCheckedTrue iconSize="1rem" iconColor={['currentcolor']} />, label: "工单列表" },
      { key: "ticket-dispatch", icon: <IconPlusIcPublicSend iconSize="1rem" iconColor={['currentcolor']} />, label: "派单管理" },
      { key: "ticket-track", icon: <IconPlusIcIctDeliverAll iconSize="1rem" iconColor={['currentcolor']} />, label: "装维进度" },
    ],
  },
  {
    key: "grp-resource",
    icon: <IconPlusIcIctServers iconSize="1rem" iconColor={['currentcolor']} />,
    label: "资源管理",
    children: [
      { key: "res-number", icon: <IconPlusIcPublicTag iconSize="1rem" iconColor={['currentcolor']} />, label: "号码资源" },
      { key: "res-port", icon: <IconPlusIcIctSwitchInterfaces iconSize="1rem" iconColor={['currentcolor']} />, label: "端口资源" },
      { key: "res-device", icon: <IconPlusIcIctLteLogicalRouter iconSize="1rem" iconColor={['currentcolor']} />, label: "设备资源" },
    ],
  },
  {
    key: "grp-audit",
    icon: <IconPlusIcPublicBarChart iconSize="1rem" iconColor={['currentcolor']} />,
    label: "统计分析",
    children: [
      { key: "stat-daily", icon: <IconPlusIcDigitalPowerDpArrowMoveUp iconSize="1rem" iconColor={['currentcolor']} />, label: "业务报表" },
      { key: "stat-audit", icon: <IconPlusIcDigitalPowerSecurityProtection iconSize="1rem" iconColor={['currentcolor']} />, label: "受理稽核" },
    ],
  },
];

// ── 步骤定义 ──
export const stepItems = [
  { title: "客户资料", description: "实名与联系方式" },
  { title: "产品订购", description: "套餐与增值服务" },
  { title: "安装信息", description: "地址与预约时间" },
  { title: "费用确认", description: "资费与支付方式" },
  { title: "提交审核", description: "核对并提交工单" },
];

// ── 证件类型 ──
export const certTypes = [
  { value: "idcard", label: "居民身份证" },
  { value: "passport", label: "护照" },
  { value: "hkmacau", label: "港澳居民来往内地通行证" },
  { value: "tw", label: "台湾居民来往大陆通行证" },
];

// ── 产品类型 ──
export const productTypes = [
  { value: "fusion", label: "5G 融合套餐", desc: "手机 + 宽带 + IPTV 融合优惠" },
  { value: "mobile", label: "5G 手机套餐", desc: "流量语音组合，随用随办" },
  { value: "broadband", label: "家庭宽带套餐", desc: "光纤入户，多设备共享" },
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
  { value: "ftth", label: "FTTH 光纤入户" },
  { value: "cable", label: "网线入户" },
  { value: "wireless", label: "5G 无线接入" },
];

export const opticalModems = [
  { value: "hn8145xr", label: "华为 HN8145XR（Wi-Fi 6）" },
  { value: "f7607p", label: "中兴 F7607P（Wi-Fi 6）" },
  { value: "tewa800g", label: "天邑 TEWA-800G" },
  { value: "self", label: "用户自备光猫" },
];

export const installModes = [
  { value: "onsite", label: "上门安装" },
  { value: "selfpick", label: "营业厅自提" },
  { value: "remote", label: "远程开通" },
];

// ── 支付与发票 ──
export const payMethods = [
  { value: "wechat", label: "微信支付" },
  { value: "alipay", label: "支付宝" },
  { value: "unionpay", label: "银联在线" },
  { value: "deduct", label: "银行代扣" },
];

export const invoiceTypes = [
  { value: "personal", label: "电子发票（个人）" },
  { value: "company", label: "电子发票（单位）" },
  { value: "paper", label: "纸质发票（邮寄）" },
];

export const contractPeriods = [
  { value: "none", label: "无合约" },
  { value: "12", label: "12 个月" },
  { value: "24", label: "24 个月" },
  { value: "36", label: "36 个月" },
];

// ── 受理渠道（用于工单来源展示）──
export const saleChannels = [
  { value: "online", label: "线上营业厅" },
  { value: "store", label: "线下门店" },
  { value: "hotline", label: "客服热线" },
  { value: "manager", label: "政企客户经理" },
];

// ── 办理须知 ──
export const orderNotices = [
  { icon: <IconPlusIcPublicIdcard iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "实名登记：办理入网须提供本人有效身份证件原件。" },
  { icon: <IconPlusIcPublicMappinOnMap iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "装机地址需在光纤覆盖范围内，提交后系统自动核验。" },
  { icon: <IconPlusIcPublicDocClock iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "预约安装后，装维工程师将在 4 小时内与您联系确认。" },
  { icon: <IconPlusIcPublicCreditcard iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "首月费用按实际使用天数折算，次月起按月正常计费。" },
  { icon: <IconPlusIcDigitalPowerSecurityProtection iconSize="0.875rem" iconColor={['currentcolor']} className="notice-icon" />, text: "合约期内解约需结清剩余费用并支付相应违约金。" },
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
  processing: { text: "处理中", color: "processing", icon: <IconPlusIcPublicLoadingClockwise iconSize="0.75rem" iconColor={['currentcolor']} /> },
  pending: { text: "待受理", color: "warning", icon: <IconPlusIcPublicClock iconSize="0.75rem" iconColor={['currentcolor']} /> },
  failed: { text: "已退单", color: "error", icon: <IconPlusIcPublicCloseCircle iconSize="0.75rem" iconColor={['currentcolor']} /> },
  draft: { text: "草稿", color: "default", icon: <IconPlusIcIctBulkEdit iconSize="0.75rem" iconColor={['currentcolor']} /> },
};

// ── 一次性费用常量 ──
export const INSTALL_FEE = 100;
export const TAX_RATE = 0.06;
