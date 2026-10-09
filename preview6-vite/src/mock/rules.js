// Layer 2: 采集规则领域 mock 数据

export const dataSourceOptions = [
  { value: "modbus", text: "Modbus TCP" },
  { value: "opcua", text: "OPC UA" },
  { value: "mqtt", text: "MQTT Broker" },
  { value: "http", text: "HTTP REST API" },
  { value: "snmp", text: "SNMP v2c" },
];

export const frequencyOptions = [
  { value: "1s", text: "1 秒" },
  { value: "5s", text: "5 秒" },
  { value: "30s", text: "30 秒" },
  { value: "1m", text: "1 分钟" },
  { value: "5m", text: "5 分钟" },
];

export const formatOptions = [
  { value: "json", text: "JSON" },
  { value: "csv", text: "CSV" },
  { value: "binary", text: "Binary (raw)" },
];

export const pointOptions = [
  { value: "voltage", text: "电压 / 电流" },
  { value: "temperature", text: "温度" },
  { value: "pressure", text: "压力" },
  { value: "flow", text: "流量" },
  { value: "vibration", text: "振动" },
  { value: "power", text: "有功功率" },
];

export const storageOptions = [
  { value: "oss", text: "对象存储 OSS" },
  { value: "tsdb", text: "时序库 TSDB" },
  { value: "nas", text: "本地 NAS" },
];

const SOURCE_LABEL = {
  modbus: "Modbus TCP",
  opcua: "OPC UA",
  mqtt: "MQTT Broker",
  http: "HTTP REST API",
  snmp: "SNMP v2c",
};

export const sourceLabel = (key) => SOURCE_LABEL[key] || key;

export const ruleList = [
  { id: "RULE-1001", name: "东区变频器实时采集", source: "modbus", frequency: "1s", frequencyLabel: "1 秒", points: 128, alarm: "on", status: "running", updatedAt: "2026-10-08 09:42" },
  { id: "RULE-1002", name: "1# 锅炉温度监控", source: "opcua", frequency: "5s", frequencyLabel: "5 秒", points: 64, alarm: "on", status: "running", updatedAt: "2026-10-08 09:15" },
  { id: "RULE-1003", name: "空压站压力采集", source: "modbus", frequency: "30s", frequencyLabel: "30 秒", points: 42, alarm: "off", status: "stopped", updatedAt: "2026-10-07 18:03" },
  { id: "RULE-1004", name: "中控室网关遥测", source: "mqtt", frequency: "1s", frequencyLabel: "1 秒", points: 256, alarm: "on", status: "error", updatedAt: "2026-10-08 08:51" },
  { id: "RULE-1005", name: "污水处理流量计量", source: "http", frequency: "1m", frequencyLabel: "1 分钟", points: 18, alarm: "off", status: "running", updatedAt: "2026-10-08 07:36" },
  { id: "RULE-1006", name: "原料仓温湿度上报", source: "mqtt", frequency: "30s", frequencyLabel: "30 秒", points: 36, alarm: "on", status: "running", updatedAt: "2026-10-07 21:20" },
  { id: "RULE-1007", name: "2# 汽轮机振动监测", source: "opcua", frequency: "1s", frequencyLabel: "1 秒", points: 96, alarm: "on", status: "running", updatedAt: "2026-10-08 09:58" },
  { id: "RULE-1008", name: "配电柜电量汇总", source: "snmp", frequency: "5m", frequencyLabel: "5 分钟", points: 24, alarm: "off", status: "stopped", updatedAt: "2026-10-06 14:12" },
  { id: "RULE-1009", name: "冷却塔风机转速", source: "modbus", frequency: "5s", frequencyLabel: "5 秒", points: 32, alarm: "off", status: "running", updatedAt: "2026-10-08 06:44" },
  { id: "RULE-1010", name: "能源管理平台对接", source: "http", frequency: "1m", frequencyLabel: "1 分钟", points: 8, alarm: "on", status: "error", updatedAt: "2026-10-08 08:10" },
  { id: "RULE-1011", name: "西区产线视觉检测", source: "http", frequency: "1s", frequencyLabel: "1 秒", points: 12, alarm: "on", status: "running", updatedAt: "2026-10-08 09:31" },
  { id: "RULE-1012", name: "储罐液位采集", source: "modbus", frequency: "30s", frequencyLabel: "30 秒", points: 48, alarm: "on", status: "running", updatedAt: "2026-10-07 22:47" },
  { id: "RULE-1013", name: "照明能耗统计", source: "mqtt", frequency: "5m", frequencyLabel: "5 分钟", points: 16, alarm: "off", status: "stopped", updatedAt: "2026-10-05 10:09" },
  { id: "RULE-1014", name: "中央空调机组群控", source: "opcua", frequency: "5s", frequencyLabel: "5 秒", points: 74, alarm: "on", status: "running", updatedAt: "2026-10-08 08:28" },
  { id: "RULE-1015", name: "燃气表远程抄表", source: "snmp", frequency: "5m", frequencyLabel: "5 分钟", points: 6, alarm: "off", status: "running", updatedAt: "2026-10-07 19:55" },
  { id: "RULE-1016", name: "3# 注塑机节拍采集", source: "modbus", frequency: "1s", frequencyLabel: "1 秒", points: 88, alarm: "on", status: "error", updatedAt: "2026-10-08 09:02" },
  { id: "RULE-1017", name: "消防主机状态回传", source: "mqtt", frequency: "30s", frequencyLabel: "30 秒", points: 40, alarm: "on", status: "running", updatedAt: "2026-10-08 05:19" },
  { id: "RULE-1018", name: "立体库堆垛机遥测", source: "opcua", frequency: "1s", frequencyLabel: "1 秒", points: 112, alarm: "off", status: "stopped", updatedAt: "2026-10-04 16:40" },
  { id: "RULE-1019", name: "光伏逆变器发电量", source: "http", frequency: "1m", frequencyLabel: "1 分钟", points: 22, alarm: "off", status: "running", updatedAt: "2026-10-08 07:58" },
  { id: "RULE-1020", name: "除尘设备压差监控", source: "modbus", frequency: "5s", frequencyLabel: "5 秒", points: 30, alarm: "on", status: "running", updatedAt: "2026-10-07 23:14" },
  { id: "RULE-1021", name: "门禁与周界报警接入", source: "snmp", frequency: "30s", frequencyLabel: "30 秒", points: 14, alarm: "on", status: "stopped", updatedAt: "2026-10-06 09:33" },
  { id: "RULE-1022", name: "环保排放在线监测", source: "opcua", frequency: "5s", frequencyLabel: "5 秒", points: 58, alarm: "on", status: "running", updatedAt: "2026-10-08 09:47" },
];
