// Layer 2: 案件池 —— 3 个全量案件（支持队列切换）+ 7 个未到审批环节的案件
// 每个全量案件包含：摘要 / 客户与保单画像 / 资料核验 / 定损评估（明细·影像·意见）/ 历史案件 / 风控报告 / 流转节点 / 表单默认值 / 备注

// ── 共享工具与常量 ──
export const formatMoney = (n) => "¥" + Number(n || 0).toLocaleString("zh-CN");

export const formatRemaining = (ms) => {
  const mins = Math.floor(ms / 60000);
  if (mins <= 0) return "已超时";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? h + " 小时 " + m + " 分" : m + " 分钟";
};

export const riskLevelOptions = ["低", "中", "高"];

export const materialOptions = ["维修发票", "现场照片", "交警证明", "医疗单据", "委托书"];

export const riskLevelHint = {
  低: "常规案件：单证与定损无异常，可按标准流程处理。",
  中: "关注案件：请复核维修清单与历史出险频次后决策。",
  高: "高风险案件：需组长会签，建议核实现场与配件价格。",
};

export const QUICK_PHRASES = [
  "同意按定损金额赔付，单证齐全、流程合规。",
  "已核实维修清单与配件价格，未见异常。",
  "历史出险频次偏高，已复核现场照片与票据一致性。",
  "建议扣除残值与免赔额后按预计赔付金额结案。",
  "人伤费用核定合理，同意按核定金额结案。",
];

// ── 案件 1：周敏 · 车损事故（当前默认展示案件） ──
const case1 = {
  id: 1,
  queue: { priority: "normal", deadlineHours: 4.5, claimType: "车损事故" },
  summary: {
    claimNo: "CLM-2026-1008-2931",
    reportNo: "RPT-2026-1008-2931",
    insuredName: "周敏",
    incidentTime: "2026-10-12 08:40",
    reportTime: "2026-10-12 09:05",
    reportChannel: "电话报案 · 95518",
    claimAmount: 28650,
    policyNo: "PDSC-2026-3501-8827",
    plateNo: "苏A·D82K6",
    vehicleModel: "特斯拉 Model Y 2022款 长续航版",
    insuranceType: "机动车损失保险 + 第三者责任险（300万）",
    incidentLocation: "南京市建邺区江东中路与应天大街交叉口",
    handler: "王思远",
    handlerRole: "审批专员",
    responsibility: "后车全责（交警认定）",
    incidentDescription:
      "早高峰时段，被保险人驾驶车辆正常直行通过路口时被后方车辆追尾，致本车前保险杠、前大灯、中网、水箱框架等部件受损，无人员受伤。后车（三者方）全责，已由其承保公司完成三者定损，本案按车损险先行赔付后行使代位追偿。",
  },
  profile: {
    rows: [
      ["客户等级", "金牌客户"],
      ["投保年限", "5 年"],
      ["近 24 个月出险", "7 次（含本案）"],
      ["累计已赔付", "¥76,780"],
      ["诚信记录", "无骗赔记录"],
    ],
  },
  vehicle: {
    rows: [
      ["购车时间", "2022-03"],
      ["使用性质", "家庭自用"],
      ["检验有效期", "2027-03"],
      ["当前里程", "4.6 万公里"],
    ],
  },
  policy: {
    rows: [
      ["险种组合", "车损险 + 三者险（300万）"],
      ["车损保额", "¥289,000"],
      ["保险期间", "2026-01-10 至 2026-12-31"],
      ["特别约定", "绝对免赔额 2,000 元/次"],
    ],
  },
  verify: {
    summary: {
      conclusion: "通过",
      materialCount: 7,
      verifier: "刘芳",
      finishTime: "2026-10-18 14:20",
      remark: "七项单证齐全有效，其中两项为补充后通过；影像件与原件交叉核验一致，未见涂改痕迹。",
    },
    records: [
      { id: 1, materialName: "保险单抄件", materialType: "系统单证", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:40" },
      { id: 2, materialName: "机动车行驶证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:42" },
      { id: 3, materialName: "驾驶人驾驶证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:45" },
      { id: 4, materialName: "被保险人身份证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:47" },
      { id: 5, materialName: "收款银行账户信息", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-15 09:50" },
      { id: 6, materialName: "维修清单及维修发票", materialType: "原件", verifyResult: "补充后通过", verifier: "刘芳", verifyTime: "2026-10-17 10:05" },
      { id: 7, materialName: "交通事故认定书（盖章件）", materialType: "原件", verifyResult: "补充后通过", verifier: "刘芳", verifyTime: "2026-10-20 08:55" },
    ],
  },
  assess: {
    summary: {
      totalAmount: 28650,
      partsFee: 19800,
      laborFee: 8850,
      residualValue: 200,
      assessor: "刘志强",
      firstAssessTime: "2026-10-14 16:45",
      finishTime: "2026-10-19 16:30",
      repairFactory: "南京恒达汽车销售服务有限公司（合作 4S 店）",
      remark: "损伤项目与碰撞痕迹吻合，配件价格执行品牌方公开价，工时费按南京地区一类维修企业标准计价。",
    },
    items: [
      { id: 1, damageItem: "前保险杠总成", repairWay: "更换", partsFee: 4200, laborFee: 800, subtotal: 5000 },
      { id: 2, damageItem: "前大灯总成（左）", repairWay: "更换", partsFee: 5600, laborFee: 600, subtotal: 6200 },
      { id: 3, damageItem: "中网总成", repairWay: "更换", partsFee: 2300, laborFee: 500, subtotal: 2800 },
      { id: 4, damageItem: "水箱框架", repairWay: "更换", partsFee: 3100, laborFee: 700, subtotal: 3800 },
      { id: 5, damageItem: "车速传感器", repairWay: "更换", partsFee: 1900, laborFee: 400, subtotal: 2300 },
      { id: 6, damageItem: "前部线束检查与更换", repairWay: "更换", partsFee: 2700, laborFee: 900, subtotal: 3600 },
      { id: 7, damageItem: "发动机舱盖", repairWay: "钣金喷漆", partsFee: 0, laborFee: 2350, subtotal: 2350 },
      { id: 8, damageItem: "前围板及纵梁", repairWay: "校正修复", partsFee: 0, laborFee: 2600, subtotal: 2600 },
    ],
    chartOption: {
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
    },
    images: [
      { id: 1, title: "现场照片 · 前部碰撞全景", category: "现场照片", uploader: "查勘员 · 陈斌", uploadTime: "10-12 15:20" },
      { id: 2, title: "现场照片 · 前保险杠损伤", category: "现场照片", uploader: "查勘员 · 陈斌", uploadTime: "10-12 15:22" },
      { id: 3, title: "现场照片 · 前大灯破损（左）", category: "现场照片", uploader: "查勘员 · 陈斌", uploadTime: "10-12 15:24" },
      { id: 4, title: "现场照片 · 纵梁变形痕迹", category: "现场照片", uploader: "查勘员 · 陈斌", uploadTime: "10-12 15:26" },
      { id: 5, title: "维修发票 · 原件翻拍", category: "费用单证", uploader: "被保险人 · 周敏", uploadTime: "10-17 09:32" },
      { id: 6, title: "交通事故认定书 · 盖章件", category: "证明文件", uploader: "被保险人 · 周敏", uploadTime: "10-20 08:55" },
      { id: 7, title: "旧件回收 · 更换件合影", category: "旧件留档", uploader: "定损员 · 刘志强", uploadTime: "10-19 10:20" },
      { id: 8, title: "维修完工 · 复检照片", category: "完工复检", uploader: "定损员 · 刘志强", uploadTime: "10-19 15:40" },
    ],
    opinions: {
      assessorNote: "损伤项目与碰撞痕迹吻合，配件价格执行品牌方公开价，工时费按南京地区一类维修企业标准计价。",
      reviewerNote: "复核意见：项目与痕迹吻合，同意定损结论；提醒审批岗关注高频出险客户的配件价格合理性。",
      oldPartsNote: "更换旧件（前保险杠、前大灯、中网、水箱框架、传感器、线束）由回收公司统一处理，残值 ¥200 已在定损总额中扣除。",
    },
  },
  history: {
    claims: [
      { id: 1, claimNo: "CLM-2026-0812-2451", incidentTime: "2026-08-12 18:30", closedTime: "2026-09-02 14:07", claimType: "人伤事故", claimAmount: 46800, paidAmount: 41500, deductible: 2000, conclusion: "协商结案", handler: "王思远", incidentLocation: "南京市江宁区 · 双龙大道", description: "与非机动车刮擦致三者软组织损伤，医疗费 8,600 元另计误工补偿，协商 41,500 元结案。" },
      { id: 2, claimNo: "CLM-2026-0530-1877", incidentTime: "2026-05-30 20:40", closedTime: "2026-06-11 09:55", claimType: "暴雨水淹", claimAmount: 15600, paidAmount: 14300, deductible: 1300, conclusion: "已赔付", handler: "李雪", incidentLocation: "南京市江北新区 · 滨江大道", description: "暴雨积水没过底盘，内饰与电路清洗烘干，发动机无损，按定损金额赔付。" },
      { id: 3, claimNo: "CLM-2026-0214-0398", incidentTime: "2026-02-14 09:15", closedTime: "2026-02-27 16:30", claimType: "车损事故", claimAmount: 8900, paidAmount: 7200, deductible: 1700, conclusion: "部分赔付", handler: "王思远", incidentLocation: "南京市栖霞区 · 仙林大道", description: "冰雪天气追尾致前部损伤；两项配件按副厂价核定差额，最终赔付 7,200 元。" },
      { id: 4, claimNo: "CLM-2025-0908-2210", incidentTime: "2025-09-08 12:05", closedTime: "2025-09-30 11:22", claimType: "三者物损", claimAmount: 12400, paidAmount: 11000, deductible: 1400, conclusion: "协商结案", handler: "王思远", incidentLocation: "南京市雨花台区 · 软件大道", description: "倒车撞坏他人仓库卷帘门，与三者方协商按 11,000 元一次性结案，签署谅解备忘。" },
      { id: 5, claimNo: "CLM-2025-0620-1542", incidentTime: "2025-06-20 07:50", closedTime: "2025-06-25 15:40", claimType: "玻璃破碎", claimAmount: 1850, paidAmount: 0, deductible: 0, conclusion: "免责拒赔", handler: "李雪", incidentLocation: "南京市建邺区 · 江东中路", description: "高速行驶中前挡风玻璃被石击破损；未投保玻璃单独破碎险，按条款免责结案。" },
      { id: 6, claimNo: "CLM-2025-0311-0765", incidentTime: "2025-03-11 17:25", closedTime: "2025-03-24 10:18", claimType: "单方剐蹭", claimAmount: 3200, paidAmount: 2780, deductible: 400, conclusion: "已赔付", handler: "李雪", incidentLocation: "南京市鼓楼区中山北路 · 商场地库出入口", description: "地库立柱剐蹭右前门，钣金喷漆修复；扣除免赔额后按定损金额全额赔付。" },
    ],
    note: "该客户出险频次偏高（同客群 P85 以上），历史案件均正常结案，无骗赔记录；建议关注理赔频率。",
  },
  riskReport: {
    score: 72,
    time: "2026-10-20 09:15",
    rules: [
      { name: "高频出险客户", level: "critical", desc: "近 24 个月出险 7 次，高于同车型客群 P85 水平" },
      { name: "更换件占比偏高", level: "critical", desc: "配件费占比 69.1%，高于同类型案件均值 58%" },
      { name: "通勤时段出险", level: "info", desc: "出险时间 08:40 属早高峰通勤时段，风险中性" },
    ],
    suggestion: "建议审批时核对维修清单与配件价格，必要时要求提供旧件照片或安排复勘。",
  },
  flowNodes: [
    { id: 1, time: "10-12 09:05", title: "电话报案受理", operator: "95518 坐席 · 王静", actionType: "info", remark: "客户来电报案，初步核实出险经过与保单效力，生成报案号 RPT-2026-1008-2931，指引客户保护现场等待查勘。" },
    { id: 2, time: "10-12 15:20", title: "现场查勘完成", operator: "查勘员 · 陈斌", actionType: "pass", remark: "按调度当日 14:00 到场查勘；现场照片 12 张已上传，碰撞痕迹与报案描述吻合，交警认定后车全责，查勘报告编号 KY-2026-1008-2931。" },
    { id: 4, time: "10-13 10:12", title: "定损任务分派", operator: "调度中心 · 系统", actionType: "info", remark: "车辆已拖至合作维修厂（南京恒达 4S 店），定损任务分派至定损员刘志强。" },
    { id: 5, time: "10-14 16:45", title: "初次定损完成", operator: "定损员 · 刘志强", actionType: "pass", remark: "出具定损报告：定损总额 ¥28,650，含配件费 ¥19,800、工时费 ¥8,850，更换旧件残值回收扣除 ¥200。" },
    { id: 6, time: "10-15 11:08", title: "材料补充通知", operator: "单证岗 · 刘芳", actionType: "supplement", remark: "维修发票原件与交通事故认定书盖章件缺失，向被保险人周敏发送补充材料通知，限时 5 个工作日。" },
    { id: 7, time: "10-17 09:32", title: "维修发票补交", operator: "被保险人 · 周敏", actionType: "supplement", remark: "收到维修发票原件（票号 03200178），金额与定损清单核对一致。" },
    { id: 8, time: "10-18 14:20", title: "单证复核通过", operator: "单证岗 · 刘芳", actionType: "pass", remark: "七项单证齐全，与定损报告交叉核验无差异，资料核验环节归档。" },
    { id: 9, time: "10-19 10:05", title: "风控初审驳回", operator: "风控岗 · 赵磊", actionType: "reject", remark: "交通事故认定书为无盖章复印件，暂缓流转，要求补充交警部门盖章件后重新提交。" },
    { id: 10, time: "10-20 09:15", title: "补充材料复审通过", operator: "风控岗 · 赵磊", actionType: "pass", remark: "收到交警盖章事故认定书，风险扫描通过；历史出险频次提示已推送审批岗关注。" },
    { id: 11, time: "10-20 11:40", title: "转审批决策", operator: "系统 · 自动流转", actionType: "current", remark: "案件分派至审批专员王思远，处理时限 24 小时。" },
  ],
  formDefaults: {
    opinion: "",
    riskLevel: "中",
    materials: ["维修发票", "现场照片"],
    deductible: 2000,
    injuryInvolved: false,
  },
  initialSaved: false,
  initialNotes: [
    { author: "风控岗 · 赵磊", time: "10-20 09:20", content: "本案配件费占比偏高，建议审批时重点核对维修清单与旧件回收记录。" },
  ],
};

// ── 案件 2：陈志强 · 单方事故（低风险，恢复自暂存草稿） ──
const case2 = {
  id: 2,
  queue: { priority: "normal", deadlineHours: 18, claimType: "单方事故" },
  summary: {
    claimNo: "CLM-2026-0921-1746",
    reportNo: "RPT-2026-0921-1746",
    insuredName: "陈志强",
    incidentTime: "2026-10-16 19:25",
    reportTime: "2026-10-16 19:31",
    reportChannel: "APP 自助报案",
    claimAmount: 8750,
    policyNo: "PDSC-2026-1102-3345",
    plateNo: "苏A·F71T2",
    vehicleModel: "大众迈腾 2023款 330TSI 豪华版",
    insuranceType: "机动车损失保险 + 车上人员责任险（司机）",
    incidentLocation: "南京市秦淮区 · 小区地下车库 B2 层",
    handler: "王思远",
    handlerRole: "审批专员",
    responsibility: "单方责任（被保险人全责）",
    incidentDescription:
      "被保险人倒车入库时因车库光线不足操作失误，车尾撞上立柱，造成后保险杠、后围板及右后尾灯损伤，无人员受伤，未涉及第三方财产损失。客户通过 APP 自助报案并上传现场照片，符合免现场查勘条件。",
  },
  profile: {
    rows: [
      ["客户等级", "白银客户"],
      ["投保年限", "3 年"],
      ["近 24 个月出险", "4 次（含本案）"],
      ["累计已赔付", "¥6,900"],
      ["诚信记录", "无异常"],
    ],
  },
  vehicle: {
    rows: [
      ["购车时间", "2023-05"],
      ["使用性质", "家庭自用"],
      ["检验有效期", "2027-05"],
      ["当前里程", "2.1 万公里"],
    ],
  },
  policy: {
    rows: [
      ["险种组合", "车损险 + 司机座位险（2万）"],
      ["车损保额", "¥168,000"],
      ["保险期间", "2026-05-20 至 2027-05-19"],
      ["特别约定", "已投保不计免赔率特约（0 元免赔）"],
    ],
  },
  verify: {
    summary: {
      conclusion: "通过",
      materialCount: 6,
      verifier: "李雪",
      finishTime: "2026-10-18 10:12",
      remark: "六项单证齐全有效，其中维修发票为更正后重新开具版本，票据信息与被保险人一致。",
    },
    records: [
      { id: 1, materialName: "保险单抄件", materialType: "系统单证", verifyResult: "通过", verifier: "李雪", verifyTime: "2026-10-17 09:05" },
      { id: 2, materialName: "机动车行驶证", materialType: "影像件", verifyResult: "通过", verifier: "李雪", verifyTime: "2026-10-17 09:07" },
      { id: 3, materialName: "驾驶人驾驶证", materialType: "影像件", verifyResult: "通过", verifier: "李雪", verifyTime: "2026-10-17 09:09" },
      { id: 4, materialName: "被保险人身份证", materialType: "影像件", verifyResult: "通过", verifier: "李雪", verifyTime: "2026-10-17 09:12" },
      { id: 5, materialName: "收款银行账户信息", materialType: "影像件", verifyResult: "通过", verifier: "李雪", verifyTime: "2026-10-17 09:15" },
      { id: 6, materialName: "维修清单及维修发票", materialType: "原件", verifyResult: "补充后通过", verifier: "李雪", verifyTime: "2026-10-18 09:48" },
    ],
  },
  assess: {
    summary: {
      totalAmount: 8750,
      partsFee: 5600,
      laborFee: 3150,
      residualValue: 150,
      assessor: "马俊",
      firstAssessTime: "2026-10-17 11:20",
      finishTime: "2026-10-19 14:05",
      repairFactory: "南京众联汽车维修服务有限公司（合作二类厂）",
      remark: "倒车单方事故，损伤集中车尾右侧，与立柱刮痕高度吻合；按二类维修厂工时标准计价。",
    },
    items: [
      { id: 1, damageItem: "后保险杠总成", repairWay: "更换", partsFee: 2800, laborFee: 500, subtotal: 3300 },
      { id: 2, damageItem: "右后尾灯总成", repairWay: "更换", partsFee: 1450, laborFee: 300, subtotal: 1750 },
      { id: 3, damageItem: "后围板", repairWay: "钣金修复", partsFee: 0, laborFee: 1400, subtotal: 1400 },
      { id: 4, damageItem: "后保险杠下装饰板", repairWay: "更换", partsFee: 750, laborFee: 650, subtotal: 1400 },
      { id: 5, damageItem: "倒车雷达探头（右外）", repairWay: "更换", partsFee: 600, laborFee: 300, subtotal: 900 },
    ],
    chartOption: {
      data: [
        { 定损项目: "后保险杠总成", 定损金额: 3300 },
        { 定损项目: "右后尾灯总成", 定损金额: 1750 },
        { 定损项目: "后围板", 定损金额: 1400 },
        { 定损项目: "下装饰板", 定损金额: 1400 },
        { 定损项目: "倒车雷达探头", 定损金额: 900 },
      ],
      xAxis: { data: "定损项目" },
      yAxisTitle: "定损金额 (元)",
      direction: "horizontal",
    },
    images: [
      { id: 1, title: "现场照片 · 车尾全景", category: "现场照片", uploader: "被保险人 · 陈志强", uploadTime: "10-16 19:31" },
      { id: 2, title: "现场照片 · 立柱刮痕", category: "现场照片", uploader: "被保险人 · 陈志强", uploadTime: "10-16 19:33" },
      { id: 3, title: "现场照片 · 尾灯破损", category: "现场照片", uploader: "被保险人 · 陈志强", uploadTime: "10-16 19:35" },
      { id: 4, title: "维修发票 · 原件翻拍", category: "费用单证", uploader: "被保险人 · 陈志强", uploadTime: "10-18 09:46" },
      { id: 5, title: "定损拆检照片", category: "拆检验损", uploader: "定损员 · 马俊", uploadTime: "10-17 11:20" },
      { id: 6, title: "维修完工 · 复检照片", category: "完工复检", uploader: "定损员 · 马俊", uploadTime: "10-19 13:50" },
    ],
    opinions: {
      assessorNote: "倒车单方事故，损伤集中车尾右侧，与车库立柱刮痕高度吻合；按二类维修厂工时标准计价，金额区间合理。",
      reviewerNote: "复核意见：定损项目完整，未见扩大损失，同意按定损金额结案。",
      oldPartsNote: "更换旧件（后保险杠、右后尾灯、下装饰板、雷达探头）由回收公司统一处理，残值 ¥150 已在定损总额中扣除。",
    },
  },
  history: {
    claims: [
      { id: 1, claimNo: "CLM-2026-0709-1832", incidentTime: "2026-07-09 14:20", closedTime: "2026-07-21 10:36", claimType: "三者物损", claimAmount: 5400, paidAmount: 4800, deductible: 0, conclusion: "协商结案", handler: "李雪", incidentLocation: "南京市玄武区 · 龙蟠路", description: "停车开门撞损相邻车辆后视镜与车门，双方协商按 4,800 元一次性结案。" },
      { id: 2, claimNo: "CLM-2026-0316-1204", incidentTime: "2026-03-16 08:05", closedTime: "2026-03-27 15:12", claimType: "单方剐蹭", claimAmount: 2100, paidAmount: 2100, deductible: 0, conclusion: "已赔付", handler: "李雪", incidentLocation: "南京市秦淮区 · 小区地库", description: "地库转角剐蹭左前叶子板，钣金喷漆修复；投保不计免赔，按定损全额赔付。" },
      { id: 3, claimNo: "CLM-2025-1128-0917", incidentTime: "2025-11-28 17:40", closedTime: "2025-12-02 11:28", claimType: "玻璃破碎", claimAmount: 1300, paidAmount: 0, deductible: 0, conclusion: "免责拒赔", handler: "王思远", incidentLocation: "南京市江宁区 · 天元东路", description: "高速石击致前挡风玻璃破损，未投保玻璃单独破碎险，按条款免责结案。" },
    ],
    note: "该客户历史案件以小额单方事故为主，理赔记录正常，风险较低。",
  },
  riskReport: {
    score: 58,
    time: "2026-10-19 14:10",
    rules: [
      { name: "新车首保期内", level: "info", desc: "购车 1.5 年内出险，属常见风险场景" },
      { name: "夜间出险", level: "info", desc: "出险时间 19:25，地下车库光线不足，风险中性" },
    ],
    suggestion: "风险较低，单证与定损一致，可按标准流程处理。",
  },
  flowNodes: [
    { id: 1, time: "10-16 19:31", title: "APP 自助报案受理", operator: "理赔系统 · 自动", actionType: "info", remark: "客户通过 APP 上传现场照片 6 张并完成电子签名确认，报案号 RPT-2026-0921-1746 自动生成。" },
    { id: 2, time: "10-16 19:40", title: "系统初审通过", operator: "风控引擎 · 系统", actionType: "pass", remark: "照片清晰、损失部位集中，满足免现场查勘条件（单方事故且损失 < 1 万元）。" },
    { id: 3, time: "10-17 09:50", title: "定损任务分派", operator: "调度中心 · 系统", actionType: "info", remark: "案件分派至定损员马俊，预约 10-17 11:00 至合作修理厂定损。" },
    { id: 4, time: "10-17 11:20", title: "现场定损完成", operator: "定损员 · 马俊", actionType: "pass", remark: "出具定损报告：定损总额 ¥8,750，含配件 ¥5,600、工时 ¥3,150，旧件残值回收 ¥150。" },
    { id: 5, time: "10-17 16:05", title: "材料补充通知", operator: "单证岗 · 李雪", actionType: "supplement", remark: "维修发票开票信息与被保险人不一致，通知重新开具并限时 3 个工作日。" },
    { id: 6, time: "10-18 09:48", title: "维修发票重新提交", operator: "被保险人 · 陈志强", actionType: "supplement", remark: "收到更正后发票原件（票号 02881042），票据信息与被保险人核对一致。" },
    { id: 7, time: "10-18 10:12", title: "单证复核通过", operator: "单证岗 · 李雪", actionType: "pass", remark: "六项单证齐全有效，资料核验环节归档。" },
    { id: 8, time: "10-19 14:05", title: "定损复核归档", operator: "定损员 · 马俊", actionType: "pass", remark: "定损复核通过，案件自动流转至审批决策环节。" },
    { id: 9, time: "10-19 15:30", title: "转审批决策", operator: "系统 · 自动流转", actionType: "current", remark: "案件分派至审批专员王思远，处理时限 24 小时；审批意见草稿已自动恢复。" },
  ],
  formDefaults: {
    opinion: "经复核，本案为倒车单方事故，责任明确，单证齐全，定损金额与市场行情一致，同意按定损金额赔付。",
    riskLevel: "低",
    materials: ["维修发票", "现场照片"],
    deductible: 0,
    injuryInvolved: false,
  },
  initialSaved: true,
  initialNotes: [
    { author: "调度中心 · 系统", time: "10-19 15:02", content: "本案件为低风险快速通道候选，建议优先处理。" },
  ],
};

// ── 案件 3：吴慧兰 · 人伤事故（加急，剩余时限紧张） ──
const case3 = {
  id: 3,
  queue: { priority: "urgent", deadlineHours: 1.2, claimType: "人伤事故" },
  summary: {
    claimNo: "CLM-2026-1003-0855",
    reportNo: "RPT-2026-1003-0855",
    insuredName: "吴慧兰",
    incidentTime: "2026-10-18 07:55",
    reportTime: "2026-10-18 08:10",
    reportChannel: "微信小程序报案",
    claimAmount: 63200,
    policyNo: "PDSC-2026-2204-5561",
    plateNo: "苏A·C39W8",
    vehicleModel: "丰田凯美瑞 2021款 2.5G 豪华版",
    insuranceType: "机动车损失保险 + 第三者责任险（200万）+ 附加医保外用药责任",
    incidentLocation: "南京市鼓楼区 · 湖南路与中山北路交叉口",
    handler: "王思远",
    handlerRole: "审批专员",
    responsibility: "主责（机动车方，交警认定）",
    incidentDescription:
      "早高峰时段，被保险人驾车右转时与非机动车发生刮擦，致骑行人左臂软组织挫伤及电动车损坏，本车右前部受损。交警认定机动车负主要责任。人伤费用含三甲医院医疗费、误工费与护理费，医保外用药已按附加险纳入核定。",
  },
  profile: {
    rows: [
      ["客户等级", "白银客户"],
      ["投保年限", "6 年"],
      ["近 24 个月出险", "6 次（含本案）"],
      ["累计已赔付", "¥20,700"],
      ["诚信记录", "无异常"],
    ],
  },
  vehicle: {
    rows: [
      ["购车时间", "2021-08"],
      ["使用性质", "家庭自用"],
      ["检验有效期", "2027-08"],
      ["当前里程", "5.8 万公里"],
    ],
  },
  policy: {
    rows: [
      ["险种组合", "车损险 + 三者险（200万）+ 医保外用药"],
      ["车损保额", "¥126,000"],
      ["保险期间", "2026-08-01 至 2027-07-31"],
      ["特别约定", "绝对免赔额 2,000 元/次；人伤需完整医疗票据"],
    ],
  },
  verify: {
    summary: {
      conclusion: "通过",
      materialCount: 8,
      verifier: "刘芳",
      finishTime: "2026-10-20 16:40",
      remark: "八项单证齐全有效；医疗票据 12 张已核对收费专用章，误工证明与病假建议书交叉核验一致。",
    },
    records: [
      { id: 1, materialName: "保险单抄件", materialType: "系统单证", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-19 09:10" },
      { id: 2, materialName: "机动车行驶证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-19 09:12" },
      { id: 3, materialName: "驾驶人驾驶证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-19 09:15" },
      { id: 4, materialName: "被保险人身份证", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-19 09:18" },
      { id: 5, materialName: "收款银行账户信息", materialType: "影像件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-19 09:20" },
      { id: 6, materialName: "交通事故认定书", materialType: "原件", verifyResult: "通过", verifier: "刘芳", verifyTime: "2026-10-19 09:25" },
      { id: 7, materialName: "医疗票据（12 张）", materialType: "原件", verifyResult: "补充后通过", verifier: "刘芳", verifyTime: "2026-10-20 15:50" },
      { id: 8, materialName: "误工及护理证明", materialType: "原件", verifyResult: "补充后通过", verifier: "刘芳", verifyTime: "2026-10-20 16:05" },
    ],
  },
  assess: {
    summary: {
      totalAmount: 63200,
      partsFee: 18600,
      laborFee: 6400,
      injuryMedicalFee: 22400,
      injuryCompensation: 15800,
      residualValue: 300,
      assessor: "刘志强 / 人伤跟踪岗 · 孙倩",
      firstAssessTime: "2026-10-19 10:30",
      finishTime: "2026-10-20 17:15",
      repairFactory: "南京恒达汽车销售服务有限公司（合作 4S 店）",
      remark: "车损项目与碰撞痕迹吻合；人伤医疗费用凭三甲医院票据核定，医保外用药已按附加险纳入；误工护理补偿依据收入证明与病假建议书核定。",
    },
    items: [
      { id: 1, damageItem: "前保险杠总成", repairWay: "更换", partsFee: 4300, laborFee: 700, subtotal: 5000 },
      { id: 2, damageItem: "右前大灯总成", repairWay: "更换", partsFee: 5200, laborFee: 500, subtotal: 5700 },
      { id: 3, damageItem: "前格栅", repairWay: "更换", partsFee: 2200, laborFee: 400, subtotal: 2600 },
      { id: 4, damageItem: "右前翼子板", repairWay: "钣金喷漆", partsFee: 0, laborFee: 2600, subtotal: 2600 },
      { id: 5, damageItem: "大灯支架及前部线束", repairWay: "更换", partsFee: 4100, laborFee: 900, subtotal: 5000 },
      { id: 6, damageItem: "三者电动车损失", repairWay: "一次赔付", partsFee: 2800, laborFee: 0, subtotal: 2800 },
      { id: 7, damageItem: "现场施救与拖车", repairWay: "服务", partsFee: 0, laborFee: 1300, subtotal: 1300 },
    ],
    chartOption: {
      data: [
        { 定损项目: "右前大灯总成", 定损金额: 5700 },
        { 定损项目: "前保险杠总成", 定损金额: 5000 },
        { 定损项目: "线束及支架", 定损金额: 5000 },
        { 定损项目: "前格栅", 定损金额: 2600 },
        { 定损项目: "右前翼子板", 定损金额: 2600 },
        { 定损项目: "三者电动车", 定损金额: 2800 },
        { 定损项目: "施救拖车", 定损金额: 1300 },
      ],
      xAxis: { data: "定损项目" },
      yAxisTitle: "定损金额 (元)",
      direction: "horizontal",
    },
    images: [
      { id: 1, title: "现场照片 · 路口全景", category: "现场照片", uploader: "查勘员 · 陈斌", uploadTime: "10-18 09:10" },
      { id: 2, title: "现场照片 · 非机动车倒地", category: "现场照片", uploader: "查勘员 · 陈斌", uploadTime: "10-18 09:12" },
      { id: 3, title: "现场照片 · 右前部受损", category: "现场照片", uploader: "查勘员 · 陈斌", uploadTime: "10-18 09:14" },
      { id: 4, title: "医疗票据翻拍（一）", category: "费用单证", uploader: "被保险人 · 吴慧兰", uploadTime: "10-20 15:50" },
      { id: 5, title: "医疗票据翻拍（二）", category: "费用单证", uploader: "被保险人 · 吴慧兰", uploadTime: "10-20 15:52" },
      { id: 6, title: "误工及收入证明", category: "证明文件", uploader: "被保险人 · 吴慧兰", uploadTime: "10-20 16:05" },
      { id: 7, title: "交通事故认定书", category: "证明文件", uploader: "查勘员 · 陈斌", uploadTime: "10-18 10:30" },
      { id: 8, title: "三者电动车定损照", category: "三者损失", uploader: "定损员 · 刘志强", uploadTime: "10-19 11:05" },
    ],
    opinions: {
      assessorNote: "车损项目与碰撞痕迹吻合；人伤医疗费用凭三甲医院票据核定，医保外用药费用已按附加险责任纳入。",
      reviewerNote: "人伤跟踪岗复核：医疗费用 ¥22,400、误工护理补偿 ¥15,800 核定合理，与伤情证明及收入证明一致；提醒关注伤者复查安排，避免结案后追加。",
      oldPartsNote: "更换旧件残值回收 ¥300 已扣除；三者电动车已与车主协商以旧换新抵扣部分损失。",
    },
  },
  history: {
    claims: [
      { id: 1, claimNo: "CLM-2026-0830-2003", incidentTime: "2026-08-30 21:10", closedTime: "2026-09-11 10:26", claimType: "暴雨水淹", claimAmount: 9800, paidAmount: 7800, deductible: 2000, conclusion: "已赔付", handler: "李雪", incidentLocation: "南京市鼓楼区 · 中山北路", description: "暴雨积水进入车厢，内饰清洗与电路检测；扣除免赔额后按定损金额赔付。" },
      { id: 2, claimNo: "CLM-2026-0622-1589", incidentTime: "2026-06-22 16:45", closedTime: "2026-07-03 14:18", claimType: "单方剐蹭", claimAmount: 3200, paidAmount: 2600, deductible: 600, conclusion: "协商结案", handler: "李雪", incidentLocation: "南京市鼓楼区 · 小区停车区", description: "倒车剐蹭消防栓，与物业协商按 2,600 元修复结案。" },
      { id: 3, claimNo: "CLM-2026-0107-0245", incidentTime: "2026-01-07 08:20", closedTime: "2026-01-19 11:32", claimType: "玻璃破碎", claimAmount: 2100, paidAmount: 2100, deductible: 0, conclusion: "已赔付", handler: "王思远", incidentLocation: "南京市鼓楼区 · 北京西路", description: "冰雹致后挡风玻璃破损，已投保玻璃单独破碎险，按定损全额赔付。" },
      { id: 4, claimNo: "CLM-2025-0919-1356", incidentTime: "2025-09-19 13:05", closedTime: "2025-09-29 16:44", claimType: "三者物损", claimAmount: 4200, paidAmount: 3400, deductible: 800, conclusion: "已赔付", handler: "王思远", incidentLocation: "南京市鼓楼区 · 湖南路", description: "转弯剐蹭外卖电动车载物架，赔付物损 3,400 元，无人伤。" },
      { id: 5, claimNo: "CLM-2025-0402-1108", incidentTime: "2025-04-02 18:30", closedTime: "2025-04-15 09:51", claimType: "车损事故", claimAmount: 6800, paidAmount: 4800, deductible: 2000, conclusion: "部分赔付", handler: "李雪", incidentLocation: "南京市建邺区 · 应天大街", description: "追尾致前部损伤，一项配件按副厂价核定差额，赔付 4,800 元。" },
    ],
    note: "历史案件均为车损与人伤小额案件，理赔记录正常；本案人伤费用占比较高，建议重点核实误工与护理补偿依据。",
  },
  riskReport: {
    score: 66,
    time: "2026-10-20 17:20",
    rules: [
      { name: "涉及人伤", level: "critical", desc: "三者人伤费用占比 60.4%，需完整医疗票据与伤情证明" },
      { name: "误工补偿金额偏高", level: "critical", desc: "误工护理补偿 ¥15,800 占人伤费用 41%，建议核对收入证明" },
      { name: "主干道交叉口事故", level: "info", desc: "事故地点为信号灯路口，责任认定清晰，风险中性" },
    ],
    suggestion: "建议核对伤者收入证明与医院病假建议书，必要时电话回访伤者确认误工天数后决策。",
  },
  flowNodes: [
    { id: 1, time: "10-18 08:10", title: "小程序报案受理", operator: "在线坐席 · 李莹", actionType: "info", remark: "客户通过微信小程序报案并上传现场照片 8 张，生成报案号 RPT-2026-1003-0855，同步推送伤者就医提示。" },
    { id: 2, time: "10-18 09:10", title: "现场查勘完成", operator: "查勘员 · 陈斌", actionType: "pass", remark: "人伤案件优先派发，查勘员 30 分钟内到场；现场照片 15 张上传，伤者已送医（市第二医院急诊），交警出具事故认定书：机动车主责。" },
    { id: 4, time: "10-18 13:40", title: "人伤跟踪介入", operator: "人伤跟踪岗 · 孙倩", actionType: "info", remark: "建立人伤跟踪档案，对接伤者家属，提醒保留全部医疗票据、病假建议书与收入证明。" },
    { id: 5, time: "10-19 10:30", title: "车辆定损完成", operator: "定损员 · 刘志强", actionType: "pass", remark: "车损定损 ¥25,000（配件 ¥18,600 / 工时 ¥6,400），含三者电动车损失 ¥2,800 与施救拖车费。" },
    { id: 6, time: "10-20 14:15", title: "医疗票据审核退回", operator: "人伤跟踪岗 · 孙倩", actionType: "reject", remark: "首次提交票据缺医院收费专用章，退回并通知补交盖章件。" },
    { id: 7, time: "10-20 15:50", title: "医疗票据补交", operator: "被保险人 · 吴慧兰", actionType: "supplement", remark: "收到三甲医院盖章票据 12 张，医保外用药费用已按附加险纳入核定。" },
    { id: 8, time: "10-20 16:40", title: "单证复核通过", operator: "单证岗 · 刘芳", actionType: "pass", remark: "八项单证齐全有效，医疗票据与病假建议书交叉核验一致。" },
    { id: 9, time: "10-20 17:15", title: "人伤费用核定", operator: "人伤跟踪岗 · 孙倩", actionType: "pass", remark: "人伤费用核定 ¥38,200（医疗 ¥22,400 / 误工护理 ¥15,800），与车损合计 ¥63,200。" },
    { id: 10, time: "10-20 17:30", title: "转审批决策", operator: "系统 · 自动流转", actionType: "current", remark: "案件分派至审批专员王思远，处理时限 24 小时；客户已来电催办，请优先处理。" },
  ],
  formDefaults: {
    opinion: "",
    riskLevel: "中",
    materials: ["维修发票", "现场照片", "交警证明", "医疗单据"],
    deductible: 2000,
    injuryInvolved: true,
  },
  initialSaved: false,
  initialNotes: [
    { author: "人伤跟踪岗 · 孙倩", time: "10-20 17:20", content: "伤者复查预约 10-23，如需延长误工天数请及时同步，避免结案后追加赔付。" },
    { author: "95518 坐席 · 李莹", time: "10-21 08:32", content: "被保险人今晨来电催办，已安抚并承诺今日反馈，请优先处理本案。" },
  ],
};

export const casePool = [case1, case2, case3];

// ── 队列中尚未流转至审批环节的案件（点击仅提示，不可进入工作台） ──
export const otherQueueItems = [
  { id: 101, claimNo: "CLM-2026-1015-0612", insuredName: "赵一鸣", claimType: "车损事故", claimAmount: 12600, currentStage: "资料核验", reportChannel: "电话报案" },
  { id: 102, claimNo: "CLM-2026-1014-0887", insuredName: "钱思彤", claimType: "三者物损", claimAmount: 8900, currentStage: "定损评估", reportChannel: "APP 自助报案" },
  { id: 103, claimNo: "CLM-2026-1013-1204", insuredName: "孙立军", claimType: "暴雨水淹", claimAmount: 21400, currentStage: "定损评估", reportChannel: "电话报案" },
  { id: 104, claimNo: "CLM-2026-1012-1358", insuredName: "李梅", claimType: "单方剐蹭", claimAmount: 2600, currentStage: "资料核验", reportChannel: "微信小程序报案" },
  { id: 105, claimNo: "CLM-2026-1011-1742", insuredName: "周子墨", claimType: "玻璃破碎", claimAmount: 1900, currentStage: "资料核验", reportChannel: "APP 自助报案" },
  { id: 106, claimNo: "CLM-2026-1010-0913", insuredName: "吴启帆", claimType: "人伤事故", claimAmount: 38700, currentStage: "定损评估", reportChannel: "电话报案" },
  { id: 107, claimNo: "CLM-2026-1009-2246", insuredName: "郑晓芸", claimType: "车损事故", claimAmount: 15800, currentStage: "查勘调度", reportChannel: "微信小程序报案" },
];

// 历史案件结案结论 → 状态标签语义色
export const conclusionTagMap = {
  已赔付: "success",
  协商结案: "info",
  部分赔付: "critical",
  免责拒赔: "error",
};
