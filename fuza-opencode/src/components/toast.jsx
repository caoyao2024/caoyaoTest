import { createContext, useCallback, useContext, useState } from 'react';
import DivMessage from '@nce/eview-react/DivMessage';

// antd message.* 无命令式 API → eview-react 用 DivMessage 渲染。
// 统一 ToastProvider：notify(type, text) 在内容区右上角弹一条，默认 4s 自动消失（error 常驻）。
const ToastContext = createContext(null);

let seq = 0;

export function ToastProvider({ children }) {
  const [notice, setNotice] = useState(null);

  const notify = useCallback((type, text, title) => {
    seq += 1;
    setNotice({ key: seq, type, text, title });
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          title={notice.title}
          disposeTimeOut={4000}
          enableDisposeTimeOut={notice.type !== 'error'}
          onClose={() => setNotice(null)}
          className="app-toast"
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const notify = useContext(ToastContext);
  return notify || (() => {});
}
