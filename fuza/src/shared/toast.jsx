import { createContext, useContext, useState, useCallback } from "react";
import DivMessage from "@nce/eview-react/DivMessage";

// eview-react DivMessage 没有命令式 API（无 message.success()），
// 此 ToastProvider 用声明式 DivMessage 模拟命令式 message.success/warning，
// 通过 context 暴露 useToast().success(text) / .warn(text) / .error(text)。
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [notice, setNotice] = useState(null);

  const show = useCallback((type, text) => {
    setNotice({ key: Date.now(), type, text });
  }, []);

  const success = useCallback((text) => show("success", text), [show]);
  const warn = useCallback((text) => show("warn", text), [show]);
  const warning = useCallback((text) => show("warn", text), [show]);
  const error = useCallback((text) => show("error", text), [show]);

  return (
    <ToastContext.Provider value={{ show, success, warn, warning, error }}>
      {children}
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 10000,
            maxWidth: 400,
          }}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      show: () => {},
      success: () => {},
      warn: () => {},
      warning: () => {},
      error: () => {},
    };
  }
  return ctx;
}
