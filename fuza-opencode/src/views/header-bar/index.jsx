import IconButton from '@nce/eview-react/IconButton';
import Badge from '@nce/eview-react/Badge';
import SearchInput from '@nce/eview-react/SearchInput';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import { useApp } from '../../context.jsx';
import './index.css';

// Layer 4: 顶部导航栏 — 品牌 / 全局导航 / 国际化切换 / 明暗切换 / 用户区
// antd Menu / Segmented 无对应 → 手写横向 nav 与 .seg 分段控件
export default function HeaderBar() {
  const { isDark, lang, collapsed, setLang, toggleDark, toggleCollapsed } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const topNav = [
    { key: 'overview', icon: 'layout-dashboard', label: t('nav.overview') },
    { key: 'strategy', icon: 'scroll-text', label: t('nav.strategy') },
    { key: 'device', icon: 'network', label: t('nav.device') },
    { key: 'alarm', icon: 'bell', label: t('nav.alarm') },
    { key: 'report', icon: 'chart-column', label: t('nav.report') },
  ];

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <IconButton
          size="small"
          iconName={<Icon name={collapsed ? 'panel-left-open' : 'panel-left-close'} size={16} />}
          tipText={t('nav.toggleSider')}
          onClick={toggleCollapsed}
        />
        <span className="header-bar__logo">
          <Icon name="shield-check" size={18} />
        </span>
        <span className="header-bar__names">
          <strong className="header-bar__title">{t('app.name')}</strong>
          <span className="header-bar__sub">{t('app.brandSub')}</span>
        </span>
      </div>

      <nav className="header-bar__nav" aria-label="top nav">
        {topNav.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`header-bar__nav-item${item.key === 'strategy' ? ' is-active' : ''}`}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <SearchInput
          className="header-bar__search"
          placeholder={t('top.search')}
          onSearch={() => {}}
          onClear={() => {}}
        />

        <div className="seg header-bar__lang" role="group" aria-label={t('top.lang')}>
          <button
            type="button"
            className={`seg__btn${lang === 'zh' ? ' is-active' : ''}`}
            onClick={() => setLang('zh')}
          >
            中
          </button>
          <button
            type="button"
            className={`seg__btn${lang === 'en' ? ' is-active' : ''}`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>

        <IconButton
          size="small"
          iconName={<Icon name={isDark ? 'sun' : 'moon'} size={16} />}
          tipText={isDark ? t('top.theme.toLight') : t('top.theme.toDark')}
          onClick={toggleDark}
        />

        <Badge content={6}>
          <IconButton
            size="small"
            iconName={<Icon name="bell" size={16} />}
            tipText={t('top.notify')}
            onClick={() => {}}
          />
        </Badge>

        <IconButton
          size="small"
          iconName={<Icon name="circle-question-mark" size={16} />}
          tipText={t('top.help')}
          onClick={() => {}}
        />

        <div className="header-bar__divider" />

        <div className="header-bar__user">
          <img className="header-bar__avatar" src="/uploads/user.png" alt="" />
          <span className="header-bar__user-text">
            <strong>{lang === 'zh' ? '李伟' : 'Li Wei'}</strong>
            <em>
              <FormattedMessage id="top.role" defaultMessage="网络运维管理员" />
            </em>
          </span>
        </div>

        <IconButton
          size="small"
          iconName={<Icon name="log-out" size={16} />}
          tipText={t('top.logout')}
          onClick={() => {}}
        />
      </div>
    </header>
  );
}
