import Tag from "@/shared/Tag";

// Layer 3: 状态标签 —— 语义状态 → antd Tag 预设色
export default function StatusTag({ value, map }) {
  const hit = map[value] || { text: value, type: "default" };
  return (
    <Tag color={hit.type} bordered={false}>
      {hit.text}
    </Tag>
  );
}
