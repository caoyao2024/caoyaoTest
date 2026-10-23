import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import DivMessage from "@nce/eview-react/DivMessage";

export function useNotice() {
  const [notice, setNotice] = useState(null);

  const notify = useCallback((type, text) => {
    setNotice({ type, text, key: Date.now() });
  }, []);

  const close = useCallback(() => setNotice(null), []);

  const el = notice
    ? createPortal(
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
          }}
        >
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={close}
          />
        </div>,
        document.body
      )
    : null;

  return [notify, el];
}
