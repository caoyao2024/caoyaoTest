import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import { useApp } from '../../context.jsx';
import './index.css';

// Layer 4: 侧边导航 — 一级模块 + 策略/设备/告警二级菜单，支持折叠
// antd Menu 无对应 → 手写可折叠侧导航（含展开子组）
export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState('strategy-form');
  const [openGroups, setOpenGroups] = useState(() => new Set(['strategy', 'device']));
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const groups = [
    {
      key: 'strategy',
      icon: 'scroll-text',
      label: t('nav.strategy'),
      children: [
        { key: 'strategy-form', icon: 'sliders-horizontal', label: t('nav.strategy.form') },
        { key: 'strategy-list', icon: 'list-checks', label: t('nav.strategy.list') },
        { key: 'strategy-tpl', icon: 'copy', label: t('nav.strategy.template') },
      ],
    },
    {
      key: 'device',
      icon: 'network',
      label: t('nav.device'),
      children: [
        { key: 'device-list', icon: 'router', label: t('nav.device.list') },
        { key: 'device-group', icon: 'users', label: t('nav.device.group') },
        { key: 'device-firmware', icon: 'hard-drive', label: t('nav.device.firmware') },
      ],
    },
    {
      key: 'alarm',
      icon: 'bell',
      label: t('nav.alarm'),
      children: [
        { key: 'alarm-rule', icon: 'triangle-alert', label: t('nav.alarm.rule') },
        { key: 'alarm-history', icon: 'activity', label: t('nav.alarm.history') },
      ],
    },
  ];
  const singles = [
    { key: 'overview', icon: 'layout-dashboard', label: t('nav.overview') },
    { key: 'report', icon: 'chart-column', label: t('nav.report') },
    { key: 'audit', icon: 'shield-check', label: t('nav.audit') },
    { key: 'settings', icon: 'settings', label: t('nav.settings') },
  ];

  const toggleGroup = (key) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const renderItem = (item) => (
    <button
      key={item.key}
      type="button"
      className={`side-nav__item${current === item.key ? ' is-active' : ''}`}
      onClick={() => setCurrent(item.key)}
    >
      <Icon name={item.icon} size={16} />
      {collapsed ? null : <span className="side-nav__item-text">{item.label}</span>}
    </button>
  );

  return (
    <aside className={`side-nav${collapsed ? ' is-collapsed' : ''}`}>
      <nav className="side-nav__menu">
        {singles.slice(0, 1).map(renderItem)}

        {groups.map((g) => {
          const open = openGroups.has(g.key);
          const hasActiveChild = g.children.some((c) => c.key === current);
          return (
            <div className="side-nav__group" key={g.key}>
              <button
                type="button"
                className={`side-nav__item${hasActiveChild ? ' is-parent-active' : ''}`}
                onClick={() => toggleGroup(g.key)}
              >
                <Icon name={g.icon} size={16} />
                {collapsed ? null : <span className="side-nav__item-text">{g.label}</span>}
                {collapsed ? null : (
                  <Icon name={open ? 'chevron-down' : 'chevron-right'} size={12} />
                )}
              </button>
              {open && !collapsed ? (
                <div className="side-nav__sub">
                  {g.children.map(renderItem)}
                </div>
              ) : null}
            </div>
          );
        })}

        {singles.slice(1).map(renderItem)}
      </nav>

      <div className="side-nav__footer">
        <Icon name="wifi" size={14} />
        {collapsed ? null : <span>{t('nav.version')}</span>}
      </div>
    </aside>
  );
}
