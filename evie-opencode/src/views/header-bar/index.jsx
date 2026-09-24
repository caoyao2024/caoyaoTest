import SearchInput from '@nce/eview-react/SearchInput';
import Switch from '@nce/eview-react/Switch';
import TipBox from '@nce/eview-react/TipBox';
import Badge from '@nce/eview-react/Badge';
import IconButton from '@nce/eview-react/IconButton';
import { IconPlusIcPublicDashboard, IconPlusIcPublicNotice, IconPlusIcPublicChevronDown } from '@nce/icon-plus';
import { useApp } from '../../context.jsx';

export default function HeaderBar() {
  const { isDark, toggleDark, draft, updateDraft, searchKeyword, notify } = useApp();

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <span className="header-bar__logo">
          <IconPlusIcPublicDashboard iconSize={16} iconColor={['currentColor']} />
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
          onSearch={(value) => searchKeyword(value)}
          onClear={() => { updateDraft('keyword', ''); searchKeyword(''); }}
        />
        <TipBox type="simple" content={isDark ? '切换浅色模式' : '切换深色模式'} direction="bottom">
          <Switch toggled={isDark} onToggle={toggleDark} />
        </TipBox>
        <Badge content={3} offset={[-2, 2]}>
          <IconButton iconName={<IconPlusIcPublicNotice iconSize={16} />} tipText="通知" onClick={() => notify('暂无新通知')} />
        </Badge>
        <span className="header-bar__divider" />
        <button type="button" className="header-bar__user">
          <img className="header-bar__avatar" src="./user.png" alt="用户头像" />
          <span className="header-bar__username">顾云舟</span>
          <IconPlusIcPublicChevronDown iconSize={14} iconColor={['currentColor']} />
        </button>
      </div>
    </header>
  );
}
