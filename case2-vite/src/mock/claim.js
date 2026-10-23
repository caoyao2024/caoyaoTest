// Layer 2: 当前车险理赔案件主档 + 各步骤业务数据
// 字段语义化：claimNo 案件号 / insuredName 被保险人 / claimAmount 涉案金额 / riskLevel 风险等级 …

export const claimSummary = {
  claimNo: "CLM-2026-1008-2931",
  reportNo: "RPT-2026-1008-2931",
  insuredName: "周敏",
  incidentTime: "2026-10-12 08:40",
  reportTime: "2026-10-12 09:05",
  reportChannel: "电话报案 · 95518",
  claimAmount: 28650,
  caseStatus: "审批中",
  policyNo: "PDSC-2026-3501-8827",
  plateNo: "苏A·D82K6",
  vehicleModel: "特斯拉 Model Y 2022款 长续航版",
  insuranceType: "机动车损失保险 + 第三者责任险（300万）",
  incidentLocation: "南京市建邺区江东中路与应天大街交叉口",
  handler: "王思远",
  handlerRole: "审批专员",
  deadline: "2026-10-21 11:40",
};

export const formatMoney = (n) => "¥" + Number(n || 0).toLocaleString("zh-CN");

// ── 第一步：资料核验（已完成，只读回看） ──
export const verifySummary = {
  conclusion: "通过",
  materialCount: 7,
  verifier: "刘芳",
  finishTime: "2026-10-18 14:20",
  remark: "七项单证齐全有效，其中两项为补充后通过；影像件与原件交叉核验一致，未见涂改痕迹。",
};

export const verifyRecords = [
  { id: 1, materialName: "保险单抄件", materialType: "系统单证", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:40" },
  { id: 2, materialName: "机动车行驶证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:42" },
  { id: 3, materialName: "驾驶人驾驶证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:45" },
  { id: 4, materialName: "被保险人身份证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:47" },
  { id: 5, materialName: "收款银行账户信息", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:50" },
  { id: 6, materialName: "维修清单及维修发票", materialType: "原件", verifyResult: "补充后通过", verifier: "刘芳", verifyTime: "2026-10-17 10:05" },
  { id: 7, materialName: "交通事故认定书（盖章件）", materialType: "原件", verifyResult: "补充后通过", verifier: "刘芳", verifyTime: "2026-10-20 08:55" },
];

// ── 第二步：定损评估（已完成，只读回看） ──
export const assessSummary = {
  totalAmount: 28650,
  partsFee: 19800,
  laborFee: 8850,
  residualValue: 200,
  assessor: "刘志强",
  firstAssessTime: "2026-10-14 16:45",
  finishTime: "2026-10-19 16:30",
  repairFactory: "南京恒达汽车销售服务有限公司（合作 4S 店）",
  remark: "损伤项目与碰撞痕迹吻合，配件价格执行品牌方公开价，工时费按南京地区一类维修企业标准计价。",
};

export const assessItems = [
  { id: 1, damageItem: "前保险杠总成", repairWay: "更换", partsFee: 4200, laborFee: 800, subtotal: 5000 },
  { id: 2, damageItem: "前大灯总成（左）", repairWay: "更换", partsFee: 5600, laborFee: 600, subtotal: 6200 },
  { id: 3, damageItem: "中网总成", repairWay: "更换", partsFee: 2300, laborFee: 500, subtotal: 2800 },
  { id: 4, damageItem: "水箱框架", repairWay: "更换", partsFee: 3100, laborFee: 700, subtotal: 3800 },
  { id: 5, damageItem: "车速传感器", repairWay: "更换", partsFee: 1900, laborFee: 400, subtotal: 2300 },
  { id: 6, damageItem: "前部线束检查与更换", repairWay: "更换", partsFee: 2700, laborFee: 900, subtotal: 3600 },
  { id: 7, damageItem: "发动机舱盖", repairWay: "钣金喷漆", partsFee: 0, laborFee: 2350, subtotal: 2350 },
  { id: 8, damageItem: "前围板及纵梁", repairWay: "校正修复", partsFee: 0, laborFee: 2600, subtotal: 2600 },
];

// 定损项目金额分布（BarChart 图表数据）
export const lossChartOption = {
  data: [
    { 定损项目: "前大灯总成（左）", 定损金额: 6200 },
    { 定损项目: "前保险杠总成", 定损金额: 5000 },
    { 定损项目: "水箱框架", 定损金额: 3800 },
    { 定损项目: "前部线束", 定损金额: 3600 },
    { 定损项目: "中网总成", 定损金额: 2800 },
    { 定损项目: "纵梁校正", 定损金额: 2600 },
    { 定损项目: "发动机舱盖", 定损金额: 2350 },
    { 定损项目: "车速传感器", 定损金额: 2300 },
  ],
  xAxis: { data: "定损项目" },
  yAxisTitle: "定损金额 (元)",
  direction: "horizontal",
};

// ── 第三步：审批决策表单选项 ──
export const riskLevelOptions = ["低", "中", "高"];
export const materialOptions = ["维修发票", "现场照片", "交警证明", "医疗单据", "委托书"];

export const riskLevelHint = {
  低: "常规案件：单证与定损无异常，可按标准流程处理。",
  中: "关注案件：请复核维修清单与历史出险频次后决策。",
  高: "高风险案件：需组长会签，建议核实现场与配件价格。",
};
