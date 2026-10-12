import { useState, useEffect } from "react";
import Dialog from "@nce/eview-react/Dialog";
import Select from "@/shared/Select";
import DivMessage from "@nce/eview-react/DivMessage";
import FormField from "../../components/form-field/index.jsx";
import { ITEM_STATUS, PRIORITIES } from "../../mock/packages.js";
import "./index.css";

const STATUS_OPTIONS = Object.keys(ITEM_STATUS).map((k) => ({ value: k, text: ITEM_STATUS[k].text }));
const PRIORITY_OPTIONS = PRIORITIES.map((p) => ({ value: p.value, text: p.label }));

// 批量配置弹窗：对选中电路统一下发状态 / 优先级
export default function BatchModal({ open, count, onCancel, onOk }) {
  const [status, setStatus] = useState("configuring");
  const [priority, setPriority] = useState(undefined);
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  useEffect(() => {
    if (open) {
      setStatus("configuring");
      setPriority(undefined);
    }
  }, [open]);

  const confirm = () => {
    if (!status && !priority) {
      notify("warn", "请至少选择一项要下发的配置");
      return;
    }
    onOk({ status, priority });
  };

  return (
    <>
      <Dialog
        title="批量配置"
        isOpen={open}
        onClose={onCancel}
        size={[480, "auto"]}
        destroyOnClose
        buttons={[
          { text: "取消", onClick: onCancel },
          { text: "确认下发", status: "primary", onClick: confirm },
        ]}
      >
        <div className="modal-note">
          将对已选中的 <strong>{count}</strong> 条电路统一下发以下配置。
        </div>
        <div className="modal-form">
          <FormField label="目标状态" htmlFor="bm-status">
            <Select id="bm-status" style={{ width: "100%" }} options={STATUS_OPTIONS} value={status} onChange={(v) => { setStatus(v); setNotice(null); }} />
          </FormField>
          <FormField label="优先级" htmlFor="bm-priority">
            <Select id="bm-priority" style={{ width: "100%" }} enableClear defaultLabel="保持原优先级" options={PRIORITY_OPTIONS} value={priority} onChange={(v) => { setPriority(v); setNotice(null); }} />
          </FormField>
        </div>
      </Dialog>
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </>
  );
}
