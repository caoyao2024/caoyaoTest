// 工单表单校验规则（供 src/use-form.js 消费）

export const orderSchema = {
  title: [
    { required: true, message: "请填写工单标题" },
    { min: 8, message: "标题不少于 8 个字符，便于检索" },
    { max: 80, message: "标题不超过 80 个字符" },
  ],
  type: [{ required: true, message: "请选择工单类型" }],
  dueTime: [{ required: true, message: "请选择期望完成时间" }],
  priority: [{ required: true, message: "请选择优先级" }],
  device: [{ required: true, message: "请选择关联设备" }],
  issueCategory: [{ required: true, message: "请选择至少一个问题分类" }],
  description: [
    { required: true, message: "请填写详细描述" },
    { min: 20, message: "描述不少于 20 个字符" },
    { max: 500, message: "描述不超过 500 个字符" },
  ],
  tempMeasure: [{ required: true, message: "请选择是否已采取临时措施" }],
  tempMeasureDesc: {
    when: function (values) { return values.tempMeasure === "yes"; },
    rules: [{ required: true, message: "请简要说明已采取的临时措施" }],
  },
  team: [{ required: true, message: "请选择指派团队" }],
  assignee: [{ required: true, message: "请选择处理人" }],
  planHours: [{ required: true, message: "请填写计划工时" }],
  contactName: [{ required: true, message: "请填写联系人" }],
  contactPhone: [
    { required: true, message: "请填写联系电话" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的 11 位手机号" },
  ],
  contactEmail: [
    { required: true, message: "请填写邮箱" },
    { type: "email", message: "请输入有效的邮箱地址" },
  ],
  agreement: [{ required: true, message: "请先阅读并同意服务协议" }],
};

export const orderInitialValues = {
  agreement: false,
};
