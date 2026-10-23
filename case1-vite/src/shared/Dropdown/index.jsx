import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export default function Dropdown({ menu, trigger, children, placement }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const { items = [], onClick } = menu || {};
  const isClick = !trigger || (Array.isArray(trigger) && trigger.includes("click"));

  return (
    <div ref={ref} className="app-dropdown" style={{ position: "relative", display: "inline-block" }}>
      <div
        onClick={() => {
          if (isClick) setOpen((v) => !v);
        }}
      >
        {children}
      </div>
      {open && (
        <div
          className="app-dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            zIndex: 1050,
            minWidth: "10rem",
          }}
        >
          {items.map((item, i) => {
            if (item.type === "divider") {
              return <div key={item.key || `divider-${i}`} className="app-dropdown-divider" />;
            }
            return (
              <div
                key={item.key}
                className="app-dropdown-item"
                onClick={() => {
                  if (onClick) onClick({ key: item.key, domEvent: null });
                  setOpen(false);
                }}
              >
                {item.icon != null && <span className="app-dropdown-icon">{item.icon}</span>}
                {item.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
