// Layer 4: 顶部全局栏 — 品牌标识 / 全局检索 / 主题切换 / 用户区
import Badge from '@nce/eview-react/Badge';
import TextField from '@nce/eview-react/TextField';
import Switch from '@nce/eview-react/Switch';
import TipBox from '@nce/eview-react/TipBox';
import IconButton from '@nce/eview-react/IconButton';
import { IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicSearch, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown } from '@nce/icon-plus';
import { useApp } from '../../context.jsx';

function HeaderBar() {
  const { isDark, toggleDark, draft, updateDraft, applyFilters } = useApp();

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <span className="header-bar__logo">
          <IconPlusIcPublicTransverseRectangleTemplate iconSize={18} iconColor={['currentcolor']} />
        </span>
        <span className="header-bar__name">数据指标中心</span>
        <span className="header-bar__divider" />
        <span className="header-bar__module">指标管理</span>
      </div>

      <div className="header-bar__tools">
        <TextField
          className="header-bar__search"
          value={draft.keyword}
          placeholder="搜索指标名称、编码或负责人"
          onChange={(value) => updateDraft("keyword", value)}
          onKeyDown={(event) => { if (event.key === "Enter") applyFilters(); }}
        />
        <TipBox type="simple" content={isDark ? "切换浅色模式" : "切换深色模式"} direction="bottom">
          <Switch toggled={isDark} onToggle={toggleDark} />
        </TipBox>
        <Badge content={3}>
          <IconButton iconName={<IconPlusIcPublicBellClock iconSize={16} iconColor={['currentcolor']} />} />
        </Badge>
        <span className="header-bar__divider" />
        <button type="button" className="header-bar__user">
          <img className="header-bar__avatar" src="./assets/uploads/user.png" alt="用户头像" />
          <span className="header-bar__username">顾云舟</span>
          <IconPlusIcPublicChevronDown iconSize={14} iconColor={['currentcolor']} />
        </button>
      </div>
    </header>
  );
}

export { HeaderBar };
