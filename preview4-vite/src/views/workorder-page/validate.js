// 工单校验规则 — 提交时统一校验,结果写入 errors 对象

const ITEM_FIELDS = ["device", "item", "result", "value", "note"];

export function isEmptyValue(v) {
  return v === null || v === undefined || String(v).trim() === "";
}

export function needsAttachment(form) {
  return (
    form.priority === "urgent" ||
    form.priority === "high" ||
    form.items.some((row) => row.result === "abnormal")
  );
}

function validateItems(form, errors) {
  const itemErrors = form.items.map((row) => {
    const e = {};
    if (!row.device) e.device = "请选择设备";
    if (!row.item) e.item = "请选择巡检项";
    if (!row.result) e.result = "请选择巡检结果";
    if (isEmptyValue(row.value)) e.value = "请填写实测值";
    if (row.result === "abnormal" && !String(row.note || "").trim()) {
      e.note = "判定为异常时必须填写处置说明";
    }
    return e;
  });

  if (!form.items.length) {
    errors.items = "至少添加一条巡检明细";
  } else if (itemErrors.some((e) => Object.keys(e).length)) {
    errors.items = "巡检明细存在未填写或不合规的字段，请逐行修正";
  }
  return itemErrors;
}

export function runValidation(form) {
  const errors = {};
  const title = String(form.title || "").trim();
  const desc = String(form.description || "").trim();

  if (!title) errors.title = "请填写工单标题";
  else if (title.length < 6) errors.title = "工单标题至少 6 个字符，建议包含设备名称与现象";
  else if (title.length > 60) errors.title = "工单标题不超过 60 个字符";

  if (!form.type) errors.type = "请选择工单类型";
  if (!form.station) errors.station = "请选择所属站点";
  if (!form.owner) errors.owner = "请指定现场责任人";

  const phone = String(form.phone || "").trim();
  if (!phone) errors.phone = "请填写联系电话，便于现场联络";
  else if (!/^1[3-9]\d{9}$/.test(phone)) errors.phone = "手机号格式不正确，应为 1 开头的 11 位数字";

  const range = form.range;
  if (!range || !range[0] || !range[1]) errors.range = "请选择计划开始与结束时间";
  else if (range[1].getTime() <= range[0].getTime()) errors.range = "计划结束时间必须晚于开始时间";
  else if (range[0].getTime() + 30 * 24 * 60 * 60 * 1000 < range[1].getTime()) {
    errors.range = "计划周期不得超过 30 天，超出请拆分多张工单";
  }

  if (isEmptyValue(form.duration)) errors.duration = "请填写预计工时";
  else if (form.duration < 0.5) errors.duration = "预计工时不少于 0.5 小时";
  else if (form.duration > 72) errors.duration = "预计工时不超过 72 小时，超出请拆分多张工单";

  const itemErrors = validateItems(form, errors);

  if (!desc) errors.description = "请描述现场现象、影响范围与已采取的措施";
  else if (desc.length < 10) errors.description = "问题描述至少 10 个字符，避免只写“已处理”";
  else if (desc.length > 500) errors.description = "问题描述不超过 500 个字符";

  if (form.attachments.length > 5) {
    errors.attachments = "附件最多上传 5 个，请合并或先删除部分文件";
  } else if (needsAttachment(form) && !form.attachments.length) {
    errors.attachments = "当前优先级或巡检结果要求必须上传现场附件";
  }

  if (!form.acks.length) errors.acks = "请至少勾选一项确认事项后再提交";
  else if (!form.acks.includes("safety")) errors.acks = "必须确认已阅读《机房作业安全须知》";

  if (itemErrors.some((e) => Object.keys(e).length)) errors.itemErrors = itemErrors;

  return errors;
}

export function hasErrors(errors) {
  const flat = Object.keys(errors).some((k) => k !== "itemErrors" && !!errors[k]);
  const rows = !!(errors.itemErrors && errors.itemErrors.some((e) => e && Object.keys(e).length));
  return flat || rows;
}

const FIELD_ORDER = [
  ["title", "wo-title"],
  ["type", "wo-type"],
  ["station", "wo-station"],
  ["owner", "wo-owner"],
  ["phone", "wo-phone"],
  ["range", "wo-range"],
  ["duration", "wo-duration"],
  ["items", "wo-items"],
  ["description", "wo-description"],
  ["attachments", "wo-attachments"],
  ["acks", "wo-acks"],
];

export function firstErrorId(errors) {
  if (errors.itemErrors) {
    for (let i = 0; i < errors.itemErrors.length; i += 1) {
      const row = errors.itemErrors[i];
      if (!row) continue;
      const field = ITEM_FIELDS.find((f) => row[f]);
      if (field) return `wo-item-${i}-${field}`;
    }
  }
  for (let i = 0; i < FIELD_ORDER.length; i += 1) {
    if (errors[FIELD_ORDER[i][0]]) return FIELD_ORDER[i][1];
  }
  return null;
}

// 校验进度面板 —— 六项分组校验
export function computeChecks(form) {
  const title = String(form.title || "").trim();
  const phone = String(form.phone || "").trim();
  const desc = String(form.description || "").trim();
  const range = form.range;

  const basicOk =
    title.length >= 6 &&
    !!form.type &&
    !!form.station &&
    !!form.owner &&
    /^1[3-9]\d{9}$/.test(phone);

  const scheduleOk =
    !!range &&
    !!range[0] &&
    !!range[1] &&
    range[1].getTime() > range[0].getTime() &&
    !isEmptyValue(form.duration) &&
    form.duration >= 0.5 &&
    form.duration <= 72;

  const itemsOk =
    form.items.length > 0 &&
    form.items.every(
      (row) =>
        row.device &&
        row.item &&
        row.result &&
        !isEmptyValue(row.value) &&
        (row.result !== "abnormal" || String(row.note || "").trim())
    );

  const attachOk = form.attachments.length <= 5 && (!needsAttachment(form) || form.attachments.length > 0);

  return [
    { key: "basic", label: "基础信息与联系人", ok: basicOk, target: "wo-title", hint: "标题 / 类型 / 站点 / 责任人 / 手机号" },
    { key: "schedule", label: "计划时间与工时", ok: scheduleOk, target: "wo-range", hint: "结束晚于开始，工时 0.5–72 小时" },
    { key: "items", label: "巡检明细", ok: itemsOk, target: "wo-items", hint: "每行需填写设备 / 巡检项 / 结果 / 实测值" },
    { key: "desc", label: "问题描述", ok: desc.length >= 10 && desc.length <= 500, target: "wo-description", hint: "10–500 字的现场描述" },
    { key: "attach", label: "附件材料", ok: attachOk, target: "wo-attachments", hint: "高优先级或异常项必须上传附件" },
    { key: "ack", label: "提交确认", ok: form.acks.includes("safety"), target: "wo-acks", hint: "需确认机房作业安全须知" },
  ];
}
