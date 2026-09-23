// Layer 3: 指标分类色标（非语义配色，仅用于分类区分，映射固定）
const CATEGORY_TONE = {
  资源性能: 'info',
  业务运营: 'green',
  服务质量: 'purple',
  安全合规: 'rose',
  容量规划: 'cyan',
};

export default function CategoryChip({ category }) {
  const tone = CATEGORY_TONE[category] || 'none';
  return <span className={'category-chip category-chip--' + tone}>{category}</span>;
}
