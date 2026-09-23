const CATEGORY_TONE = {
  资源性能: "info",
  业务运营: "green",
  服务质量: "purple",
  安全合规: "rose",
  容量规划: "cyan",
};

function CategoryChip({ category }) {
  const tone = CATEGORY_TONE[category] || "none";
  return <span className={"category-chip category-chip--" + tone}>{category}</span>;
}

export default CategoryChip;
