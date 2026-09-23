import TextField from '@nce/eview-react/TextField';
import Toggle from '@nce/eview-react/Toggle';
import TipBox from '@nce/eview-react/TipBox';
import Badge from '@nce/eview-react/Badge';
import IconButton from '@nce/eview-react/IconButton';
import { Icon } from '../../shared/icon.jsx';
import { useApp } from '../../context.jsx';

function HeaderBar() {
  const { isDark, toggleDark, draft, updateDraft, applyFilters } = useApp();

  const handleSearch = (event) => {
    if (event.key === "Enter") applyFilters();
  };

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <span className="header-bar__logo">
          <Icon name="gauge" size={18} />
        </span>
        <span className="header-bar__name">数据指标中心</span>
        <span className="header-bar__divider" />
        <span className="header-bar__module">指标管理</span>
      </div>

      <div className="header-bar__tools">
        <div className="header-bar__search">
          <span className="header-bar__search-icon">
            <Icon name="search" size={14} />
          </span>
          <TextField
            value={draft.keyword}
            onChange={(value) => updateDraft("keyword", value)}
            onKeyDown={handleSearch}
            placeholder="搜索指标名称、编码或负责人"
          />
        </div>
        <TipBox content={isDark ? "切换浅色模式" : "切换深色模式"}>
          <Toggle toggled={isDark} onToggle={toggleDark} />
        </TipBox>
        <Badge content={3}>
          <IconButton iconName={<Icon name="bell" size={16} />} tipText="通知" />
        </Badge>
        <span className="header-bar__divider" />
        <button type="button" className="header-bar__user">
          <img className="header-bar__avatar" src="/user.png" alt="用户头像" />
          <span className="header-bar__username">顾云舟</span>
          <Icon name="chevron-down" size={14} />
        </button>
      </div>
    </header>
  );
}

export default HeaderBar;
