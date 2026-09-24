import { useEffect, useRef, useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import Form from "@nce/eview-react/Form";
import Switch from "@nce/eview-react/Switch";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/toast.jsx";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略弹窗表单 — 页面头/表格行均可唤起，复用同一套参数字段
export default function StrategyModal({ open, record, onClose }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const intl = useIntl();
  const toast = useToast();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  useEffect(() => {
    if (!open) return;
    if (record) {
      formRef.current?.setFieldsValue({
        name: record.name,
        deviceType: record.deviceType,
        intervalSec: record.intervalSec,
        level: record.level,
      });
      setEnableNow(record.status === "enabled");
    } else {
      formRef.current?.resetFields();
      setEnableNow(true);
    }
  }, [open, record]);

  // 校验通过走 onSuccess 回调（替代 await form.validateFields()）
  const handleSuccess = (values) => {
    toast.success(record ? t("toast.updated") : t("toast.created"));
    onClose();
  };

  // 保存草稿：不校验，直接成功
  const handleDraft = () => {
    toast.success(t("toast.draft"));
    onClose();
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      size={[680, "auto"]}
      style={{ maxHeight: "80vh" }}
      title={
        <span className="strategy-modal__title">
          <Icon name="circle-plus" size={16} />
          {record ? t("modal.title.edit") : t("modal.title.new")}
        </span>
      }
      buttons={[
        { text: t("modal.cancel"), onClick: () => onClose() },
        { text: t("modal.draft"), onClick: handleDraft },
        { text: t("modal.ok"), status: "primary", onClick: () => formRef.current?.submit() },
      ]}
    >
      <p className="strategy-modal__desc">{t("modal.desc")}</p>

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        initialValues={{ level: "warning", intervalSec: 60, flap: true }}
        onSuccess={handleSuccess}
        onFailed={() => { /* 校验失败时由 Form.Item 就地提示 */ }}
      >
        <StrategyFields advanced={false} />

        <div className="switch-row">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("modal.enableNow")}</span>
            <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
          </div>
          <Switch
            data={[false, true]}
            toggled={enableNow}
            onToggle={(val) => setEnableNow(val)}
          />
        </div>

        <p className="strategy-modal__status">
          <Icon name={enableNow ? "circle-check" : "pencil-line"} size={12} />
          {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
        </p>
      </Form>
    </Dialog>
  );
}
