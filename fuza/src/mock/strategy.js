// Layer 2: 策略域 mock 数据 — 选项集 + 策略清单（24 条，状态多样）

export const deviceTypeOptions = [
  { value: "gateway", labelId: "opt.device.gateway" },
  { value: "switch", labelId: "opt.device.switch" },
  { value: "camera", labelId: "opt.device.camera" },
  { value: "sensor", labelId: "opt.device.sensor" },
  { value: "edge", labelId: "opt.device.edge" },
  { value: "ap", labelId: "opt.device.ap" },
];

export const levelOptions = [
  { value: "critical", labelId: "opt.level.critical" },
  { value: "warning", labelId: "opt.level.warning" },
  { value: "info", labelId: "opt.level.info" },
];

export const notifyOptions = [
  { value: "inbox", labelId: "opt.notify.inbox" },
  { value: "email", labelId: "opt.notify.email" },
  { value: "sms", labelId: "opt.notify.sms" },
  { value: "webhook", labelId: "opt.notify.webhook" },
];

// tone 映射到语义色（success / warning / error / info / neutral）
export const statusMeta = {
  enabled: { labelId: "opt.status.enabled", tone: "success" },
  disabled: { labelId: "opt.status.disabled", tone: "neutral" },
  draft: { labelId: "opt.status.draft", tone: "info" },
  expired: { labelId: "opt.status.expired", tone: "warning" },
};

export const levelTone = {
  critical: "error",
  warning: "warning",
  info: "info",
};

export function labelOf(options, value, dict) {
  const hit = options.find((o) => o.value === value);
  if (!hit) return value;
  const pack = dict[hit.labelId];
  return pack || hit.labelId;
}

export const strategyRows = [
  { id: "STY-2609-001", name: "网关在线率监测", nameEn: "Gateway online rate", deviceType: "gateway", intervalSec: 30, level: "critical", status: "enabled", devices: 128, owner: "李伟", ownerEn: "Li Wei", updatedAt: "2026-09-18 14:32", threshold: 99, retry: 3, notify: ["inbox", "sms"], flap: true },
  { id: "STY-2609-002", name: "汇聚交换机端口抖动", nameEn: "Switch port flapping", deviceType: "switch", intervalSec: 15, level: "critical", status: "enabled", devices: 64, owner: "王倩", ownerEn: "Wang Qian", updatedAt: "2026-09-18 11:05", threshold: 95, retry: 2, notify: ["inbox", "email"], flap: true },
  { id: "STY-2609-003", name: "智能摄像头离线告警", nameEn: "Camera offline alarm", deviceType: "camera", intervalSec: 60, level: "warning", status: "enabled", devices: 256, owner: "陈涛", ownerEn: "Chen Tao", updatedAt: "2026-09-17 20:18", threshold: 90, retry: 5, notify: ["inbox"], flap: false },
  { id: "STY-2609-004", name: "机房温湿度超限", nameEn: "Room temp/humidity limit", deviceType: "sensor", intervalSec: 120, level: "warning", status: "enabled", devices: 42, owner: "周敏", ownerEn: "Zhou Min", updatedAt: "2026-09-17 16:47", threshold: 80, retry: 3, notify: ["inbox", "sms", "email"], flap: true },
  { id: "STY-2609-005", name: "边缘节点算力过载", nameEn: "Edge node CPU overload", deviceType: "edge", intervalSec: 10, level: "critical", status: "enabled", devices: 18, owner: "李伟", ownerEn: "Li Wei", updatedAt: "2026-09-17 09:24", threshold: 85, retry: 1, notify: ["inbox", "webhook"], flap: false },
  { id: "STY-2609-006", name: "无线 AP 关联数异常", nameEn: "AP association anomaly", deviceType: "ap", intervalSec: 45, level: "info", status: "disabled", devices: 96, owner: "赵磊", ownerEn: "Zhao Lei", updatedAt: "2026-09-16 19:02", threshold: 70, retry: 3, notify: ["inbox"], flap: false },
  { id: "STY-2609-007", name: "网关固件版本合规", nameEn: "Gateway firmware compliance", deviceType: "gateway", intervalSec: 3600, level: "info", status: "enabled", devices: 128, owner: "王倩", ownerEn: "Wang Qian", updatedAt: "2026-09-16 15:31", threshold: 100, retry: 1, notify: ["email"], flap: false },
  { id: "STY-2609-008", name: "交换机链路丢包率", nameEn: "Switch packet loss", deviceType: "switch", intervalSec: 20, level: "critical", status: "enabled", devices: 64, owner: "陈涛", ownerEn: "Chen Tao", updatedAt: "2026-09-16 10:12", threshold: 98, retry: 2, notify: ["inbox", "sms"], flap: true },
  { id: "STY-2609-009", name: "摄像头存储空间预警", nameEn: "Camera storage warning", deviceType: "camera", intervalSec: 300, level: "warning", status: "draft", devices: 140, owner: "周敏", ownerEn: "Zhou Min", updatedAt: "2026-09-15 22:40", threshold: 75, retry: 4, notify: ["inbox", "email"], flap: false },
  { id: "STY-2609-010", name: "传感器电量低于阈值", nameEn: "Sensor low battery", deviceType: "sensor", intervalSec: 600, level: "warning", status: "enabled", devices: 42, owner: "赵磊", ownerEn: "Zhao Lei", updatedAt: "2026-09-15 18:05", threshold: 20, retry: 2, notify: ["inbox"], flap: false },
  { id: "STY-2609-011", name: "边缘节点磁盘写满", nameEn: "Edge node disk full", deviceType: "edge", intervalSec: 60, level: "critical", status: "enabled", devices: 18, owner: "李伟", ownerEn: "Li Wei", updatedAt: "2026-09-15 13:58", threshold: 90, retry: 3, notify: ["inbox", "sms", "webhook"], flap: true },
  { id: "STY-2609-012", name: "AP 信道干扰检测", nameEn: "AP channel interference", deviceType: "ap", intervalSec: 30, level: "info", status: "draft", devices: 96, owner: "王倩", ownerEn: "Wang Qian", updatedAt: "2026-09-14 21:16", threshold: 60, retry: 2, notify: ["inbox"], flap: false },
  { id: "STY-2609-013", name: "网关双机热备切换", nameEn: "Gateway HA failover", deviceType: "gateway", intervalSec: 5, level: "critical", status: "enabled", devices: 32, owner: "陈涛", ownerEn: "Chen Tao", updatedAt: "2026-09-14 17:44", threshold: 100, retry: 1, notify: ["inbox", "sms", "email"], flap: true },
  { id: "STY-2609-014", name: "交换机风扇转速异常", nameEn: "Switch fan speed abnormal", deviceType: "switch", intervalSec: 120, level: "warning", status: "disabled", devices: 24, owner: "周敏", ownerEn: "Zhou Min", updatedAt: "2026-09-14 09:33", threshold: 65, retry: 3, notify: ["inbox"], flap: false },
  { id: "STY-2609-015", name: "摄像头视频流中断", nameEn: "Camera stream interrupted", deviceType: "camera", intervalSec: 10, level: "critical", status: "enabled", devices: 256, owner: "赵磊", ownerEn: "Zhao Lei", updatedAt: "2026-09-13 20:09", threshold: 97, retry: 2, notify: ["inbox", "webhook"], flap: true },
  { id: "STY-2609-016", name: "机房漏水检测联动", nameEn: "Water leak linkage", deviceType: "sensor", intervalSec: 15, level: "critical", status: "enabled", devices: 12, owner: "李伟", ownerEn: "Li Wei", updatedAt: "2026-09-13 14:26", threshold: 100, retry: 1, notify: ["inbox", "sms"], flap: false },
  { id: "STY-2609-017", name: "边缘节点容器重启", nameEn: "Edge container restart", deviceType: "edge", intervalSec: 45, level: "warning", status: "draft", devices: 18, owner: "王倩", ownerEn: "Wang Qian", updatedAt: "2026-09-12 19:51", threshold: 88, retry: 4, notify: ["email", "webhook"], flap: true },
  { id: "STY-2609-018", name: "AP 空口利用率过载", nameEn: "AP airtime utilization", deviceType: "ap", intervalSec: 60, level: "warning", status: "enabled", devices: 96, owner: "陈涛", ownerEn: "Chen Tao", updatedAt: "2026-09-12 11:37", threshold: 78, retry: 3, notify: ["inbox", "email"], flap: false },
  { id: "STY-2609-019", name: "网关配置漂移检测", nameEn: "Gateway config drift", deviceType: "gateway", intervalSec: 1800, level: "info", status: "expired", devices: 128, owner: "周敏", ownerEn: "Zhou Min", updatedAt: "2026-08-30 10:02", threshold: 100, retry: 1, notify: ["inbox"], flap: false },
  { id: "STY-2609-020", name: "交换机堆叠状态巡检", nameEn: "Switch stack health", deviceType: "switch", intervalSec: 300, level: "info", status: "enabled", devices: 40, owner: "赵磊", ownerEn: "Zhao Lei", updatedAt: "2026-09-11 16:18", threshold: 92, retry: 2, notify: ["inbox"], flap: false },
  { id: "STY-2609-021", name: "摄像头遮挡智能识别", nameEn: "Camera occlusion detection", deviceType: "camera", intervalSec: 20, level: "warning", status: "disabled", devices: 180, owner: "李伟", ownerEn: "Li Wei", updatedAt: "2026-09-10 15:44", threshold: 85, retry: 3, notify: ["inbox", "email"], flap: false },
  { id: "STY-2609-022", name: "传感器数据上报中断", nameEn: "Sensor reporting interrupted", deviceType: "sensor", intervalSec: 90, level: "critical", status: "enabled", devices: 42, owner: "王倩", ownerEn: "Wang Qian", updatedAt: "2026-09-10 09:07", threshold: 96, retry: 2, notify: ["inbox", "sms"], flap: true },
  { id: "STY-2609-023", name: "边缘节点证书到期", nameEn: "Edge certificate expiry", deviceType: "edge", intervalSec: 86400, level: "warning", status: "expired", devices: 18, owner: "陈涛", ownerEn: "Chen Tao", updatedAt: "2026-08-22 08:15", threshold: 70, retry: 1, notify: ["email"], flap: false },
  { id: "STY-2609-024", name: "无线 AP 固件批量升级", nameEn: "AP bulk firmware upgrade", deviceType: "ap", intervalSec: 7200, level: "info", status: "disabled", devices: 96, owner: "周敏", ownerEn: "Zhou Min", updatedAt: "2026-09-09 13:29", threshold: 100, retry: 5, notify: ["inbox", "email", "webhook"], flap: false },
];

export function displayName(row, lang) {
  return lang === "zh" ? row.name : row.nameEn;
}

export function displayOwner(row, lang) {
  return lang === "zh" ? row.owner : row.ownerEn;
}
