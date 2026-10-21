// Tag 组件展示主视图 — 涵盖 Tag 的各类形态
import { useState } from "react";
import { IconPlusIcCarUser, IconPlusIcIctVerifyResult, IconPlusIcPublicAlert, IconPlusIcPublicBellClock, IconPlusIcPublicCheckmark, IconPlusIcPublicClock, IconPlusIcPublicCloseCircle, IconPlusIcPublicEnvelope, IconPlusIcPublicLoadingClockwise, IconPlusIcPublicPlus, IconPlusIcPublicSearch, IconPlusIcPublicStar } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import TextField from "@/shared/TextField";
import DemoSection from "../../components/demo-section/index.jsx";
import "./index.css";

const PRESET_COLORS = [
  "magenta", "red", "volcano", "orange", "gold",
  "lime", "green", "cyan", "blue", "geekblue", "purple",
];

const CUSTOM_COLORS = ["#f50", "#2db7f5", "#87d068", "#108ee9", "#52c41a", "#722ed1"];

const CATEGORIES = ["Movies", "Books", "Music", "Sports"];

export default function TagShowcase() {
  const [tags, setTags] = useState(["产品经理", "设计师", "前端工程师", "后端工程师"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState(["Books", "Music"]);

  const handleClose = (removed) => {
    setTags((prev) => prev.filter((t) => t !== removed));
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags((prev) => [...prev, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleCategoryChange = (cat, checked) => {
    setSelected((prev) =>
      checked ? [...prev, cat] : prev.filter((t) => t !== cat)
    );
  };

  return (
    <div className="tag-showcase">
      <DemoSection title="基础标签" description="默认样式的标签容器,适合简单的标记场景。">
        <Tag>标签一</Tag>
        <Tag>标签二</Tag>
        <Tag>标签三</Tag>
      </DemoSection>

      <DemoSection
        title="预设颜色"
        description="使用 color 属性传入预设色名,内置 12 种语义色彩,自动匹配浅色背景与文字色。"
      >
        {PRESET_COLORS.map((c) => (
          <Tag key={c} color={c}>{c}</Tag>
        ))}
      </DemoSection>

      <DemoSection
        title="状态标签"
        description="success / processing / error / default / warning 五种状态色,常用于对象状态标记。"
      >
        <Tag color="success">success</Tag>
        <Tag color="processing">processing</Tag>
        <Tag color="error">error</Tag>
        <Tag color="default">default</Tag>
        <Tag color="warning">warning</Tag>
        <Tag color="success" icon={<IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={['currentcolor']} />}>已通过</Tag>
        <Tag color="processing" icon={<IconPlusIcPublicClock iconSize="0.875rem" iconColor={['currentcolor']} />}>审核中</Tag>
        <Tag color="error" icon={<IconPlusIcPublicCloseCircle iconSize="0.875rem" iconColor={['currentcolor']} />}>已驳回</Tag>
        <Tag color="warning" icon={<IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />}>待处理</Tag>
      </DemoSection>

      <DemoSection
        title="自定义颜色"
        description="color 接受任意十六进制色值,自动填充背景并以反色显示文本。"
      >
        {CUSTOM_COLORS.map((c) => (
          <Tag key={c} color={c}>{c}</Tag>
        ))}
      </DemoSection>

      <DemoSection
        title="带图标标签"
        description="通过 icon 属性添加前置图标,常与色彩搭配表达语义。"
      >
        <Tag icon={<IconPlusIcPublicEnvelope iconSize="0.875rem" iconColor={['currentcolor']} />}>邮件</Tag>
        <Tag icon={<IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />} color="processing">用户</Tag>
        <Tag icon={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />} color="success">查询</Tag>
        <Tag icon={<IconPlusIcPublicBellClock iconSize="0.875rem" iconColor={['currentcolor']} />} color="warning">通知</Tag>
        <Tag icon={<IconPlusIcPublicStar iconSize="0.875rem" iconColor={['currentcolor']} />} color="magenta">收藏</Tag>
        <Tag icon={<IconPlusIcIctVerifyResult iconSize="0.875rem" iconColor={['currentcolor']} />} color="geekblue">已认证</Tag>
      </DemoSection>

      <DemoSection
        title="可关闭标签"
        description="closable 添加关闭按钮,onClose 中调用 preventDefault 后由业务侧控制移除逻辑,可结合输入框动态新增。"
      >
        {tags.map((tag) => (
          <Tag
            key={tag}
            closable
            onClose={(e) => {
              e.preventDefault();
              handleClose(tag);
            }}
          >
            {tag}
          </Tag>
        ))}
        {inputVisible ? (
          <TextField
            style={{ width: 120 }}
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            onBlur={handleInputConfirm}
            autoFocus
          />
        ) : (
          <Tag className="tag-add-btn" onClick={() => setInputVisible(true)}>
            <IconPlusIcPublicPlus iconSize="0.75rem" iconColor={['currentcolor']} /> 添加标签
          </Tag>
        )}
      </DemoSection>

      <DemoSection
        title="可选择标签 (CheckableTag)"
        description="Tag.CheckableTag 支持选中切换,适用于分类筛选、多选标签等场景。"
      >
        <span className="tag-inline-label">兴趣方向:</span>
        {CATEGORIES.map((cat) => {
          const isSelected = selected.indexOf(cat) > -1;
          return (
            <Tag
              key={cat}
              color={isSelected ? "processing" : undefined}
              onClick={() => handleCategoryChange(cat, !isSelected)}
              style={{ cursor: "pointer" }}
            >
              {cat}
            </Tag>
          );
        })}
        <span className="tag-inline-label">已选:</span>
        <span className="tag-selected-text">{selected.join("、") || "无"}</span>
      </DemoSection>

      <DemoSection
        title="无边框标签"
        description="bordered={false} 去除描边,适合信息密度高的列表场景。"
      >
        <Tag bordered={false}>default</Tag>
        <Tag bordered={false} color="success">success</Tag>
        <Tag bordered={false} color="processing">processing</Tag>
        <Tag bordered={false} color="error">error</Tag>
        <Tag bordered={false} color="warning">warning</Tag>
        <Tag bordered={false} color="magenta">magenta</Tag>
        <Tag bordered={false} color="geekblue">geekblue</Tag>
        <Tag bordered={false} color="purple">purple</Tag>
      </DemoSection>

      <DemoSection
        title="胶囊形状"
        description="通过自定义 border-radius 形成胶囊形态,适合分类、关键词标记。"
      >
        <Tag className="tag-pill" color="processing">前端</Tag>
        <Tag className="tag-pill" color="success">已发布</Tag>
        <Tag className="tag-pill" color="warning">草稿</Tag>
        <Tag className="tag-pill" color="error">已下架</Tag>
        <Tag className="tag-pill" color="magenta">活动</Tag>
        <Tag className="tag-pill" color="gold">精选</Tag>
      </DemoSection>

      <DemoSection
        title="应用场景:对象状态"
        description="在表格行或列表项中标记对象的运行状态,搭配图标增强可读性。"
      >
        <Tag color="success">在线</Tag>
        <Tag color="default">离线</Tag>
        <Tag color="processing">同步中</Tag>
        <Tag color="error">故障</Tag>
        <Tag color="warning">维护中</Tag>
        <Tag color="success" icon={<IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={['currentcolor']} />}>健康</Tag>
        <Tag color="error" icon={<IconPlusIcPublicCloseCircle iconSize="0.875rem" iconColor={['currentcolor']} />}>异常</Tag>
        <Tag color="processing" icon={<IconPlusIcPublicLoadingClockwise iconSize="0.875rem" iconColor={['currentcolor']} />}>部署中</Tag>
      </DemoSection>
    </div>
  );
}
