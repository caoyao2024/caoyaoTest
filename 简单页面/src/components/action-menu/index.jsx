// 手写下拉菜单 —— eview-react 无 Dropdown 对应组件，按 fallback-handwrite 手写。
// 用法：<ActionMenu items={[{key,label,icon},{type:'divider'},{key,label,icon,danger}]} onSelect={(key)=>...} />
// 触发器为图标按钮（ellipsis），菜单绝对定位，点击外部 / 选项后自动收起。
import { useState, useRef, useEffect } from 'react';
import Icon from '../../shared/icon.jsx';

export default function ActionMenu({ items = [], onSelect, triggerIcon = 'ellipsis', triggerTitle, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const handlePick = (item) => {
    setOpen(false);
    if (item && item.key != null && onSelect) onSelect(item.key);
  };

  return (
    <span className={'app-action-menu' + (open ? ' app-action-menu--open' : '')} ref={wrapRef}>
      <button
        type="button"
        className="app-icon-btn"
        title={triggerTitle}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={triggerIcon} size={15} />
      </button>
      {open ? (
        <div className={'app-action-menu__panel app-action-menu__panel--' + align} role="menu">
          {items.map((item, i) =>
            item.type === 'divider' ? (
              <span key={i} className="app-action-menu__divider" />
            ) : (
              <button
                key={item.key ?? i}
                type="button"
                role="menuitem"
                className={'app-action-menu__item' + (item.danger ? ' app-action-menu__item--danger' : '')}
                onClick={() => handlePick(item)}
              >
                {item.icon ? <span className="app-action-menu__icon">{item.icon}</span> : null}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      ) : null}
    </span>
  );
}
