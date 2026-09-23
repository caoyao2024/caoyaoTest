import { useState, useCallback } from "react";
import DivMessage from "@nce/eview-react/DivMessage";

// useToast — 用 DivMessage 替代 antd message.success / message.warning（无命令式 API）
// 每次提示换 key 重挂，重置自动消失计时；3 秒后消失。
// 用法：const { notify, view } = useToast(); notify("success", "已保存"); 在区块顶部渲染 {view}
export function useToast() {
  const [notice, setNotice] = useState(null);
  const notify = useCallback((type, text) => {
    setNotice({ key: Date.now(), type, text });
  }, []);
  const view = notice
    ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      )
    : null;
  return { notify, view };
}
