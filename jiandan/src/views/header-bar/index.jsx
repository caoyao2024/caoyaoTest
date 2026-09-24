import Badge from "@nce/eview-react/Badge";
import Button from "@nce/eview-react/Button";
import Toggle from "@nce/eview-react/Toggle";
import TipBox from "@nce/eview-react/TipBox";
import TextField from "@nce/eview-react/TextField";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";

function HeaderBar() {
  const { isDark, toggleDark, draft, updateDraft, applyFilters } = useApp();

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
        <div className="header-bar__search-wrapper">
          <Icon name="search" size={14} />
          <TextField
            className="header-bar__search"
            value={draft.keyword}
            onChange={(value) => updateDraft("keyword", value)}
            onKeyDown={(event) => { if (event.key === "Enter") applyFilters(); }}
            placeholder="搜索指标名称、编码或负责人"
          />
        </div>
        <TipBox content={isDark ? "切换浅色模式" : "切换深色模式"}>
          <Toggle toggled={isDark} onToggle={toggleDark} />
        </TipBox>
        <Badge content={3}>
          <Button status="text"><Icon name="bell" size={16} /></Button>
        </Badge>
        <span className="header-bar__divider" />
        <button type="button" className="header-bar__user">
          <img className="header-bar__avatar" src="/assets/uploads/user.png" alt="用户头像" />
          <span className="header-bar__username">顾云舟</span>
          <Icon name="chevron-down" size={14} />
        </button>
      </div>
    </header>
  );
}

export default HeaderBar;
