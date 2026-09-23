import { useState, useRef, useEffect } from 'react';
import { Icon } from '../../shared/icon.jsx';

export default function MoreActions({ items, onSelect, triggerIcon = "ellipsis" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="more-actions" ref={ref}>
      <button
        type="button"
        className="more-actions__trigger"
        onClick={() => setOpen(!open)}
      >
        <Icon name={triggerIcon} size={15} />
      </button>
      {open && (
        <div className="more-actions__menu">
          {items.map((item, i) =>
            item.type === "divider" ? (
              <div key={i} className="more-actions__divider" />
            ) : (
              <button
                key={item.key}
                type="button"
                className={"more-actions__item" + (item.danger ? " more-actions__item--danger" : "")}
                onClick={() => {
                  setOpen(false);
                  onSelect(item.key);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
