// Layer 2 — 业务受理（企业专线开通）字典与模拟数据

export const customerTypeOptions = [
  { value: "enterprise", text: "企业客户" },
  { value: "government", text: "政府机构" },
  { value: "institution", text: "事业单位" },
  { value: "campus", text: "校园客户" },
  { value: "individual", text: "个体工商户" },
];

export const industryOptions = [
  { value: "manufacture", text: "制造业" },
  { value: "finance", text: "金融保险" },
  { value: "medical", text: "医疗卫生" },
  { value: "education", text: "教育培训" },
  { value: "internet", text: "互联网 / 软件" },
  { value: "public", text: "公共事业" },
  { value: "logistics", text: "交通物流" },
  { value: "other", text: "其他行业" },
];

export const certTypeOptions = [
  { value: "uscc", text: "统一社会信用代码" },
  { value: "license", text: "营业执照注册号" },
  { value: "org", text: "组织机构代码证" },
];

export const managerOptions = [
  { value: "m-zhaolei", text: "赵磊（华南大区）" },
  { value: "m-sunqian", text: "孙倩（华东大区）" },
  { value: "m-liwei", text: "李威（华北大区）" },
  { value: "m-chenyu", text: "陈宇（西南大区）" },
  { value: "m-zhoumin", text: "周敏（政企直营）" },
];

export const serviceTypeOptions = [
  { value: "leased", text: "专线接入" },
  { value: "broadband", text: "宽带接入" },
  { value: "cloud", text: "云网互联" },
];

export const productOptions = [
  { value: "p-unicom-100", text: "精品专线 100M 商务版" },
  { value: "p-unicom-200", text: "精品专线 200M 商务版" },
  { value: "p-unicom-500", text: "精品专线 500M 旗舰版" },
  { value: "p-cloud-1g", text: "云专线 1G 尊享版" },
  { value: "p-mpls-50", text: "MPLS-VPN 50M 组网套餐" },
  { value: "p-fiber-1000", text: "全光宽带 1000M 企业版" },
];

export const bandwidthOptions = [
  { value: "10M", text: "10 Mbps" },
  { value: "20M", text: "20 Mbps" },
  { value: "50M", text: "50 Mbps" },
  { value: "100M", text: "100 Mbps" },
  { value: "200M", text: "200 Mbps" },
  { value: "500M", text: "500 Mbps" },
  { value: "1G", text: "1 Gbps" },
  { value: "10G", text: "10 Gbps" },
];

export const accessModeOptions = [
  { value: "fiber", text: "光纤直连" },
  { value: "fiber-ont", text: "光纤 + 光猫" },
  { value: "wireless", text: "无线备份接入" },
  { value: "mpls", text: "MPLS 专网接入" },
];

export const contractOptions = [
  { value: "12", text: "12 个月" },
  { value: "24", text: "24 个月" },
  { value: "36", text: "36 个月" },
  { value: "60", text: "60 个月" },
];

export const slaOptions = [
  { value: "standard", text: "标准级（5×8 响应）" },
  { value: "platinum", text: "白金级（7×12 响应）" },
  { value: "diamond", text: "钻石级（7×24 专属）" },
];

export const surveyOptions = [
  { value: "need", text: "需要现场勘查" },
  { value: "no", text: "无需勘查，直接施工" },
];

export const appointSlotOptions = [
  { value: "am", text: "上午 09:00 - 12:00" },
  { value: "pm", text: "下午 13:00 - 18:00" },
];

export const invoiceTypeOptions = [
  { value: "special", text: "增值税专用发票" },
  { value: "general", text: "增值税普通发票" },
  { value: "electronic", text: "电子普通发票" },
];

export const provinceOptions = [
  { value: "gd", text: "广东省" },
  { value: "js", text: "江苏省" },
  { value: "zj", text: "浙江省" },
  { value: "sd", text: "山东省" },
  { value: "sc", text: "四川省" },
  { value: "bj", text: "北京市" },
];

const CITY_MAP = {
  gd: [
    { value: "gz", text: "广州市" },
    { value: "sz", text: "深圳市" },
    { value: "dg", text: "东莞市" },
    { value: "fs", text: "佛山市" },
  ],
  js: [
    { value: "nj", text: "南京市" },
    { value: "sz-js", text: "苏州市" },
    { value: "wx", text: "无锡市" },
  ],
  zj: [
    { value: "hz", text: "杭州市" },
    { value: "nb", text: "宁波市" },
    { value: "wz", text: "温州市" },
  ],
  sd: [
    { value: "jn", text: "济南市" },
    { value: "qd", text: "青岛市" },
    { value: "wf", text: "潍坊市" },
  ],
  sc: [
    { value: "cd", text: "成都市" },
    { value: "my", text: "绵阳市" },
    { value: "dy", text: "德阳市" },
  ],
  bj: [
    { value: "cy", text: "朝阳区" },
    { value: "hd", text: "海淀区" },
    { value: "dc", text: "东城区" },
  ],
};

export const roomOptions = [
  { value: "room-a1", text: "华南枢纽机房 A1" },
  { value: "room-a2", text: "华南汇聚机房 A2" },
  { value: "room-b3", text: "华东核心机房 B3" },
  { value: "room-c1", text: "华北接入机房 C1" },
];

export function getCities(province) {
  return CITY_MAP[province] || [];
}

export function labelOf(options, value) {
  const hit = options.find((o) => o.value === value);
  return hit ? hit.text : "";
}

export const draftOrders = [
  { id: "EB20261008031", name: "深圳市智联科技有限公司", product: "精品专线 500M", status: "review", statusLabel: "待审核", time: "10-08 16:20" },
  { id: "EB20261007028", name: "杭州云启信息技术有限公司", product: "云专线 1G", status: "survey", statusLabel: "勘察中", time: "10-07 11:05" },
  { id: "EB20261006017", name: "成都锦江智慧医疗中心", product: "MPLS-VPN 50M", status: "accepted", statusLabel: "已受理", time: "10-06 09:42" },
  { id: "EB20261005009", name: "南京工业大学科技园", product: "全光宽带 1000M", status: "draft", statusLabel: "草稿", time: "10-05 15:30" },
  { id: "EB20261004002", name: "青岛海联物流有限公司", product: "精品专线 200M", status: "draft", statusLabel: "草稿", time: "10-04 10:18" },
];
