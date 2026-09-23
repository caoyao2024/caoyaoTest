// Layer 4: 顶部全局栏 — 品牌标识 / 全局检索 / 主题切换 / 用户区
import Button from '@nce/eview-react/Button';
import Badge from '@nce/eview-react/Badge';
import SearchInput from '@nce/eview-react/SearchInput';
import Toggle from '@nce/eview-react/Toggle';
import TipBox from '@nce/eview-react/TipBox';
import Icon from '../../shared/icon.jsx';
import { useApp } from '../../context.jsx';

export default function HeaderBar() {
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
        <SearchInput
          className="header-bar__search"
          placeholder="搜索指标名称、编码或负责人"
          value={draft.keyword}
          onChange={(value) => updateDraft('keyword', value)}
          onSearch={() => applyFilters()}
          onClear={() => updateDraft('keyword', '')}
        />
        <TipBox type="simple" content={isDark ? '切换浅色模式' : '切换深色模式'} direction="top">
          {/* Toggle.allowPropagation 默认 false；TipBox 包裹靠 hover 触发，不受点击冒泡影响 */}
          <Toggle data={[false, true]} toggled={isDark} onToggle={() => toggleDark()} />
        </TipBox>
        <Badge content={3}>
          {/* 图标按钮：eview IconButton 未覆盖，手写 app-icon-btn */}
          <button type="button" className="app-icon-btn" title="消息通知">
            <Icon name="bell" size={16} />
          </button>
        </Badge>
        <span className="header-bar__divider" />
        <button type="button" className="header-bar__user">
          <img className="header-bar__avatar" src="/uploads/user.png" alt="用户头像" />
          <span className="header-bar__username">顾云舟</span>
          <Icon name="chevron-down" size={14} />
        </button>
      </div>
    </header>
  );
}
