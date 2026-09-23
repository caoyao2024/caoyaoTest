import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import Dialog from "@nce/eview-react/Dialog";
import Form from "@nce/eview-react/Form";
import Toggle from "@nce/eview-react/Toggle";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/toast.jsx";
import { renderBasicFields } from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略弹窗表单 — Dialog + Form；ok 按钮 formRef.submit() → onSuccess
export default function StrategyModal({ open, record, onClose }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const { notify, view } = useToast();

  useEffect(() => {
    if (!open) return;
    if (record) {
      formRef.current?.setFieldsValue({
        name: record.name,
        deviceType: record.deviceType,
        intervalSec: record.intervalSec,
        level: record.level,
        enableNow: record.status === "enabled",
      });
      setEnableNow(record.status === "enabled");
    } else {
      formRef.current?.resetFields();
      setEnableNow(true);
    }
  }, [open, record]);

  const handleSuccess = () => {
    notify("success", record ? t("toast.updated") : t("toast.created"));
    onClose();
  };

  const handleDraft = () => {
    notify("success", t("toast.draft"));
    onClose();
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      size={[680, null]}
      style={{ maxHeight: "80vh" }}
      title={
        <span className="strategy-modal__title">
          <Icon name="circle-plus" size={16} />
          {record ? t("modal.title.edit") : t("modal.title.new")}
        </span>
      }
      buttons={[
        { text: t("modal.cancel"), onClick: onClose },
        { text: t("modal.draft"), onClick: handleDraft },
        { text: t("modal.ok"), status: "primary", onClick: () => formRef.current?.submit() },
      ]}
    >
      {view}
      <p className="strategy-modal__desc">{t("modal.desc")}</p>

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="div"
        initialValues={{ enableNow: true, level: "warning", intervalSec: 60 }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
        onValuesChange={(changed) => {
          if (changed && "enableNow" in changed) setEnableNow(!!changed.enableNow);
        }}
      >
        {renderBasicFields(t)}

        <p className="strategy-fields__hint-line">{t("modal.enableNowDesc")}</p>
        <Form.Item
          label={t("modal.enableNow")}
          name="enableNow"
          valuePropName="toggled"
          updateTrigger="onToggle"
          col={24}
        >
          <Toggle data={[false, true]} />
        </Form.Item>

        <p className="strategy-modal__status">
          <Icon name={enableNow ? "circle-check" : "pencil-line"} size={12} />
          {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
        </p>
      </Form>
    </Dialog>
  );
}
