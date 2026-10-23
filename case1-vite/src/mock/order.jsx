// Layer 2: mock 数据 — 电商订单运营台
// 字段语义化：orderNo 订单号 / items 商品明细 / receiver 收货人 / paidAmount 实付金额 /
// payMethod 支付方式 / logistics 物流状态 / status 订单状态 / createdAt 下单时间 /
// deliverySlot 预约配送时段 / shippingTimeout 超时未发货 / aftersale 售后申请

import dayjs from "dayjs";
import { IconPlusIcIctFan, IconPlusIcIctOutdoor, IconPlusIcIctTrophy, IconPlusIcPublicBook, IconPlusIcPublicCamera, IconPlusIcPublicDrink, IconPlusIcPublicHeadphones, IconPlusIcPublicInput, IconPlusIcPublicMobilephone, IconPlusIcPublicNotebook, IconPlusIcPublicPersonChair, IconPlusIcPublicShirt, IconPlusIcPublicSmartwatch, IconPlusIcPublicSpeaker, IconPlusIcPublicTablet, IconPlusIcPublicTv } from '@hui/icon-plus';

export const TODAY_KEY = "2026-10-21";
export const YESTERDAY_KEY = "2026-10-20";

export const PAY_METHODS = ["微信支付", "支付宝", "云闪付", "货到付款"];

// 订单状态枚举（5 种语义色，渲染见 components/status-tag）
export const ORDER_STATUS_KEYS = [
  "pendingPayment",
  "pendingShipment",
  "shipped",
  "completed",
  "aftersale",
];

// 商品类目 → 缩略图占位（Lucide 图标 + 标签语义色 token）
export const CATEGORY_STYLE = {
  phone: { icon: <IconPlusIcPublicMobilephone iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-cyan)", bg: "var(--color-tag-bg-cyan)" },
  headphones: { icon: <IconPlusIcPublicHeadphones iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-indigo)", bg: "var(--color-tag-bg-indigo)" },
  watch: { icon: <IconPlusIcPublicSmartwatch iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-purple)", bg: "var(--color-tag-bg-purple)" },
  shirt: { icon: <IconPlusIcPublicShirt iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-pink)", bg: "var(--color-tag-bg-pink)" },
  laptop: { icon: <IconPlusIcPublicNotebook iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-info)", bg: "var(--color-tag-bg-info)" },
  camera: { icon: <IconPlusIcPublicCamera iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-rose)", bg: "var(--color-tag-bg-rose)" },
  sofa: { icon: <IconPlusIcPublicPersonChair iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-alert)", bg: "var(--color-tag-bg-alert)" },
  dumbbell: { icon: <IconPlusIcIctTrophy iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-success)", bg: "var(--color-tag-bg-success)" },
  book: { icon: <IconPlusIcPublicBook iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-none)", bg: "var(--color-tag-bg-none)" },
  keyboard: { icon: <IconPlusIcPublicInput iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-info)", bg: "var(--color-tag-bg-info)" },
  tablet: { icon: <IconPlusIcPublicTablet iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-cyan)", bg: "var(--color-tag-bg-cyan)" },
  wind: { icon: <IconPlusIcIctFan iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-green)", bg: "var(--color-tag-bg-green)" },
  coffee: { icon: <IconPlusIcPublicDrink iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-warning)", bg: "var(--color-tag-bg-warning)" },
  monitor: { icon: <IconPlusIcPublicTv iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-info)", bg: "var(--color-tag-bg-info)" },
  speaker: { icon: <IconPlusIcPublicSpeaker iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-purple)", bg: "var(--color-tag-bg-purple)" },
  tent: { icon: <IconPlusIcIctOutdoor iconSize="0.875rem" iconColor={['currentcolor']} />, text: "var(--color-tag-text-green)", bg: "var(--color-tag-bg-green)" },
};

// 商品目录（name/spec/price/cat 语义化字段，paidAmount 由明细汇总保证匹配）
const CATALOG = {
  phoneX7: { name: "星耀 X7 Pro 旗舰手机", spec: "曜夜黑 12GB+256GB", price: 3999, cat: "phone" },
  headphoneAnc: { name: "悦声 ANC 主动降噪耳机", spec: "月白 二代", price: 499, cat: "headphones" },
  watchS2: { name: "脉动 S2 智能运动手表", spec: "曜石黑 46mm", price: 899, cat: "watch" },
  teeBasic: { name: "云柔纯棉圆领 T 恤", spec: "白色 L 码", price: 89, cat: "shirt" },
  laptop14: { name: "曜石 14 轻薄笔记本", spec: "16GB+512GB", price: 4699, cat: "laptop" },
  cameraM6: { name: "光影 M6 微单相机", spec: "套机 15-45mm", price: 5299, cat: "camera" },
  sofaNordic: { name: "北欧风三人位布艺沙发", spec: "燕麦灰", price: 2199, cat: "sofa" },
  dumbbell20: { name: "燃力可调节哑铃", spec: "20kg 单只", price: 329, cat: "dumbbell" },
  bookHistory: { name: "二十四史·典藏版全集", spec: "全 12 册函套", price: 268, cat: "book" },
  kb87: { name: "极客 87 键机械键盘", spec: "茶轴 奶白色", price: 329, cat: "keyboard" },
  reader6: { name: "墨滴电纸书阅读器", spec: "6 英寸 32GB", price: 599, cat: "tablet" },
  purifierMini: { name: "净澈空气净化器", spec: "Mini 卧室款", price: 1299, cat: "wind" },
  coffeeAuto: { name: "鲜萃全自动咖啡机", spec: "研磨一体 银色", price: 1599, cat: "coffee" },
  monitor27: { name: "极光 27 英寸显示器", spec: "2K 165Hz", price: 1399, cat: "monitor" },
  speakerBt: { name: "悦动蓝牙音箱", spec: "重低音 黑色", price: 249, cat: "speaker" },
  jacketRun: { name: "轻羽防风跑步外套", spec: "藏青 M 码", price: 199, cat: "shirt" },
  earplugSleep: { name: "静谧硅胶睡眠耳塞", spec: "3 对装", price: 39, cat: "headphones" },
  tentSet: { name: "户外便携折叠桌椅套装", spec: "四人位", price: 359, cat: "tent" },
};

const pick = (key, qty) => ({ ...CATALOG[key], qty });

const makeOrder = (cfg) => ({
  orderNo: cfg.no,
  createdAt: `${cfg.day} ${cfg.time}`,
  day: cfg.day,
  status: cfg.status,
  payMethod: cfg.payMethod,
  logistics: cfg.logistics,
  deliverySlot: cfg.slot,
  items: cfg.items,
  paidAmount: cfg.items.reduce((sum, x) => sum + x.price * x.qty, 0),
  receiver: cfg.receiver,
  phone: cfg.phone,
  address: cfg.address,
  remark: cfg.remark || "",
  shippingTimeout: !!cfg.timeout,
  aftersale: cfg.aftersale || null,
});

// 22 条订单：时间倒序（新 → 旧），状态覆盖 5 种；售后队列 6 条与主表同源
const RAW_ORDERS = [
  makeOrder({
    no: "SO20261021-0841", day: "2026-10-21", time: "17:42",
    status: "pendingPayment", payMethod: "微信支付", logistics: "未发货", slot: ["18:00", "22:00"],
    items: [pick("phoneX7", 1)],
    receiver: "沈亦周", phone: "13758229104",
    address: "浙江省杭州市西湖区文二西路 718 号西溪创意园 3 幢 502 室",
  }),
  makeOrder({
    no: "SO20261021-0836", day: "2026-10-21", time: "16:58",
    status: "pendingShipment", payMethod: "支付宝", logistics: "待揽收", slot: ["14:00", "18:00"],
    items: [pick("watchS2", 1), pick("speakerBt", 1)],
    receiver: "顾晓萌", phone: "15068332217",
    address: "江苏省南京市建邺区江东中路 313 号中海塞纳丽舍 6 栋 1103 室",
  }),
  makeOrder({
    no: "SO20261021-0802", day: "2026-10-21", time: "15:21",
    status: "aftersale", payMethod: "微信支付", logistics: "已签收", slot: ["09:00", "12:00"],
    items: [pick("teeBasic", 3)],
    receiver: "何雨桐", phone: "18967512390",
    address: "四川省成都市高新区天府三街新希望大厦 B 座 2201 室",
    aftersale: { type: "仅退款", reason: "T 恤尺码偏小，吊牌未拆，申请仅退款", waitingMinutes: 115 },
  }),
  makeOrder({
    no: "SO20261021-0778", day: "2026-10-21", time: "14:47",
    status: "shipped", payMethod: "微信支付", logistics: "运输中", slot: ["14:00", "18:00"],
    items: [pick("purifierMini", 1)],
    receiver: "陆知远", phone: "13699884421",
    address: "湖北省武汉市洪山区珞喻路 766 号百脑汇写字楼 1508 室",
  }),
  makeOrder({
    no: "SO20261021-0751", day: "2026-10-21", time: "13:30",
    status: "pendingShipment", payMethod: "云闪付", logistics: "待揽收", slot: ["09:00", "12:00"],
    items: [pick("monitor27", 1)],
    receiver: "唐可可", phone: "18855667743",
    address: "广东省广州市天河区体育西路 57 号红盾大厦 903 室",
    remark: "显示器易碎，请打木架并保价",
    timeout: true,
  }),
  makeOrder({
    no: "SO20261021-0720", day: "2026-10-21", time: "12:05",
    status: "aftersale", payMethod: "支付宝", logistics: "已签收", slot: ["09:00", "12:00"],
    items: [pick("headphoneAnc", 1)],
    receiver: "邵一敏", phone: "13022334455",
    address: "陕西省西安市雁塔区高新路 25 号瑞欣大厦 A 座 702 室",
    aftersale: { type: "退货退款", reason: "耳机左耳偶发杂音，要求退货检测", waitingMinutes: 300 },
  }),
  makeOrder({
    no: "SO20261021-0698", day: "2026-10-21", time: "11:36",
    status: "completed", payMethod: "微信支付", logistics: "已签收", slot: ["09:00", "12:00"],
    items: [pick("reader6", 1), pick("earplugSleep", 2)],
    receiver: "江晚晴", phone: "13567891234",
    address: "重庆市渝北区龙溪街道新牌坊一路 139 号 2 单元 4-2",
  }),
  makeOrder({
    no: "SO20261021-0661", day: "2026-10-21", time: "10:22",
    status: "pendingPayment", payMethod: "货到付款", logistics: "未发货", slot: ["18:00", "22:00"],
    items: [pick("sofaNordic", 1)],
    receiver: "温言", phone: "15987654321",
    address: "江苏省苏州市工业园区星湖街 328 号创意产业园 12 栋 1 层",
  }),
  makeOrder({
    no: "SO20261020-0588", day: "2026-10-20", time: "21:40",
    status: "pendingShipment", payMethod: "微信支付", logistics: "待揽收", slot: ["09:00", "12:00"],
    items: [pick("kb87", 2)],
    receiver: "柯政宇", phone: "13809876543",
    address: "广东省深圳市南山区科苑南路 3331 号阿里云大厦 T2 座 1801 室",
  }),
  makeOrder({
    no: "SO20261020-0566", day: "2026-10-20", time: "20:15",
    status: "aftersale", payMethod: "支付宝", logistics: "已签收", slot: ["14:00", "18:00"],
    items: [pick("jacketRun", 1)],
    receiver: "孟繁星", phone: "18611223344",
    address: "北京市朝阳区望京 SOHO T1 座 2103 室",
    aftersale: { type: "仅退款", reason: "下单后降价未按活动价结算，申请补差退款", waitingMinutes: 1260 },
  }),
  makeOrder({
    no: "SO20261020-0523", day: "2026-10-20", time: "18:33",
    status: "shipped", payMethod: "微信支付", logistics: "异常", slot: ["14:00", "18:00"],
    items: [pick("coffeeAuto", 1)],
    receiver: "冯思齐", phone: "17766554433",
    address: "上海市闵行区莘松路 958 弄圣淘沙花园 45 号 602 室",
  }),
  makeOrder({
    no: "SO20261020-0487", day: "2026-10-20", time: "16:02",
    status: "pendingShipment", payMethod: "云闪付", logistics: "待揽收", slot: ["14:00", "18:00"],
    items: [pick("dumbbell20", 2)],
    receiver: "尹星阑", phone: "15060778899",
    address: "湖南省长沙市岳麓区梅溪湖环湖路 1177 号金茂广场北塔 3306 室",
    timeout: true,
  }),
  makeOrder({
    no: "SO20261020-0455", day: "2026-10-20", time: "15:11",
    status: "completed", payMethod: "微信支付", logistics: "已签收", slot: ["09:00", "12:00"],
    items: [pick("bookHistory", 1)],
    receiver: "苏念安", phone: "13456789012",
    address: "河南省郑州市金水区花园路 39 号国贸中心 A 座 1508 室",
  }),
  makeOrder({
    no: "SO20261020-0412", day: "2026-10-20", time: "14:05",
    status: "shipped", payMethod: "支付宝", logistics: "派送中", slot: ["18:00", "22:00"],
    items: [pick("tentSet", 1)],
    receiver: "阮清野", phone: "18912345678",
    address: "云南省昆明市盘龙区白龙路 283 号翡翠湾小区 7 栋 2 单元 601 室",
  }),
  makeOrder({
    no: "SO20261019-0377", day: "2026-10-19", time: "20:48",
    status: "aftersale", payMethod: "微信支付", logistics: "已签收", slot: ["14:00", "18:00"],
    items: [pick("cameraM6", 1)],
    receiver: "华铭轩", phone: "13288889999",
    address: "浙江省杭州市滨江区江南大道 588 号中赢国际 3 幢 1207 室",
    aftersale: { type: "退货退款", reason: "相机对焦马达异响，要求退货并检测", waitingMinutes: 2630 },
  }),
  makeOrder({
    no: "SO20261019-0354", day: "2026-10-19", time: "18:22",
    status: "pendingShipment", payMethod: "微信支付", logistics: "待揽收", slot: ["18:00", "22:00"],
    items: [pick("laptop14", 1)],
    receiver: "蒋一帆", phone: "13155778899",
    address: "安徽省合肥市政务区怀宁路 200 号置地广场 C 座 901 室",
    remark: "工作日白天配送，周末勿送",
  }),
  makeOrder({
    no: "SO20261019-0321", day: "2026-10-19", time: "16:40",
    status: "pendingPayment", payMethod: "支付宝", logistics: "未发货", slot: ["09:00", "12:00"],
    items: [pick("phoneX7", 1), pick("watchS2", 1)],
    receiver: "章含烟", phone: "18699887766",
    address: "福建省厦门市思明区软件园二期望海路 10 号 3 层",
  }),
  makeOrder({
    no: "SO20261019-0298", day: "2026-10-19", time: "15:03",
    status: "shipped", payMethod: "微信支付", logistics: "异常", slot: ["14:00", "18:00"],
    items: [pick("phoneX7", 1)],
    receiver: "卫来", phone: "13544332211",
    address: "浙江省宁波市鄞州区首南街道天智巷 77 号城南华府 15 幢 808 室",
  }),
  makeOrder({
    no: "SO20261018-0245", day: "2026-10-18", time: "19:55",
    status: "aftersale", payMethod: "云闪付", logistics: "已签收", slot: ["09:00", "12:00"],
    items: [pick("headphoneAnc", 1)],
    receiver: "祝清欢", phone: "15866778899",
    address: "福建省福州市鼓楼区五四路 158 号环球广场 2201 室",
    aftersale: { type: "仅退款", reason: "佩戴夹头不适，希望仅退款", waitingMinutes: 2670 },
  }),
  makeOrder({
    no: "SO20261018-0219", day: "2026-10-18", time: "17:26",
    status: "completed", payMethod: "微信支付", logistics: "已签收", slot: ["14:00", "18:00"],
    items: [pick("teeBasic", 2), pick("jacketRun", 1)],
    receiver: "简若溪", phone: "13699112233",
    address: "山东省济南市历下区经十路 9777 号鲁商国奥城 4 号楼 1302 室",
  }),
  makeOrder({
    no: "SO20261018-0187", day: "2026-10-18", time: "14:12",
    status: "pendingShipment", payMethod: "支付宝", logistics: "待揽收", slot: ["09:00", "12:00"],
    items: [pick("purifierMini", 1), pick("reader6", 1)],
    receiver: "骆闻笛", phone: "18877001122",
    address: "天津市南开区鞍山西道 265 号时代公寓 A 座 1603 室",
    timeout: true,
  }),
  makeOrder({
    no: "SO20261018-0153", day: "2026-10-18", time: "11:47",
    status: "aftersale", payMethod: "微信支付", logistics: "已签收", slot: ["18:00", "22:00"],
    items: [pick("tentSet", 1), pick("dumbbell20", 1)],
    receiver: "楚天阔", phone: "17733445566",
    address: "河北省石家庄市桥西区中山西路 356 号中交财富中心 1106 室",
    aftersale: { type: "退货退款", reason: "桌板有划痕且缺少地脚配件，要求退货", waitingMinutes: 3060 },
  }),
];

// 初始订单（深拷贝，避免组件内变更污染 mock 源）
export function buildInitialOrders() {
  return RAW_ORDERS.map((o) => ({
    ...o,
    items: o.items.map((x) => ({ ...x })),
    deliverySlot: [...o.deliverySlot],
    aftersale: o.aftersale ? { ...o.aftersale } : null,
  }));
}

// 昨日快照（存量指标环比基准）
export const STAT_SNAPSHOT = { pendingShipment: 8, aftersale: 4 };

export function fmtMoney(n) {
  return n.toLocaleString("zh-CN");
}

export function maskPhone(p) {
  return p ? `${p.slice(0, 3)}****${p.slice(7)}` : "";
}

export function waitingMinutesToText(m) {
  if (m < 60) return `${m} 分钟`;
  if (m < 1440) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return mm ? `${h} 小时 ${mm} 分` : `${h} 小时`;
  }
  const d = Math.floor(m / 1440);
  const h = Math.round((m % 1440) / 60);
  return h ? `${d} 天 ${h} 小时` : `${d} 天`;
}

export function isUrgentWait(m) {
  return m >= 1440;
}

// ---- 运行时扩展：新建订单 / 快捷创建 / 操作动态 ----

// 商品类目中文标签
export const CATEGORY_LABELS = {
  phone: "手机数码",
  headphones: "耳机音频",
  watch: "智能穿戴",
  shirt: "服饰运动",
  laptop: "电脑办公",
  camera: "摄影摄像",
  sofa: "家居家具",
  dumbbell: "运动健身",
  book: "图书文娱",
  keyboard: "外设配件",
  tablet: "电纸阅读",
  wind: "家用电器",
  coffee: "厨房电器",
  monitor: "显示器",
  speaker: "音箱音频",
  tent: "户外露营",
};

// 新建订单表单：商品下拉选项
export const CATALOG_OPTIONS = Object.entries(CATALOG).map(([key, p]) => ({
  value: key,
  label: `${p.name} · ¥${p.price}`,
}));

// 新建订单表单：预约配送时段选项（value 以 "-" 连接起止时间）
export const SLOT_OPTIONS = [
  { value: "09:00-12:00", label: "上午 09:00 - 12:00" },
  { value: "14:00-18:00", label: "下午 14:00 - 18:00" },
  { value: "18:00-22:00", label: "晚间 18:00 - 22:00" },
];

export function makeItem(key, qty) {
  return { ...CATALOG[key], qty };
}

export function generateOrderNo(existingNos = []) {
  for (let i = 0; i < 50; i++) {
    const no = `SO${dayjs().format("YYYYMMDD")}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!existingNos.includes(no)) return no;
  }
  return `SO${dayjs().format("YYYYMMDD")}-${Date.now() % 10000}`;
}

// 今日操作动态种子（团队成员此前动作，时间倒序）
export const SEED_ACTIVITIES = [
  { icon: "badge-check", tone: "success", text: "王倩 同意了 SO20261020-0412 的仅退款申请", time: "17:05" },
  { icon: "truck", tone: "info", text: "陈立 批量发货 12 单（华东仓发出）", time: "16:40" },
  { icon: "map-pin", tone: "info", text: "林晓 修改了 SO20261019-0354 的收货地址", time: "15:52" },
  { icon: "sticky-note", tone: "none", text: "王倩 更新了 SO20261021-0751 的发货备注", time: "14:30" },
  { icon: "circle-x", tone: "error", text: "陈立 取消了 SO20261020-0444（买家申请）", time: "13:18" },
];
