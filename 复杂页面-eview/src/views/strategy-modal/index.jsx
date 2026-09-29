import { useEffect, useRef, useState } from "react";
import { IconPlusIcPublicPlusCircle } from '@nce/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import Form from "@nce/eview-react/Form";
import Toggle from "@nce/eview-react/Toggle";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

export default function StrategyModal({ open, record, onClose, notify }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const intl = useIntl();
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

  const handleSuccess = (values) => {
    notify("success", record ? t("toast.updated") : t("toast.created"));
    onClose();
  };

  const submitDraft = () => {
    notify("success", t("toast.draft"));
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
          <IconPlusIcPublicPlusCircle iconSize={16} iconColor={['currentcolor']} />
          {record ? t("modal.title.edit") : t("modal.title.new")}
        </span>
      }
      buttons={[
        { text: t("modal.cancel"), onClick: () => onClose() },
        { text: t("modal.draft"), onClick: submitDraft },
        { text: t("modal.ok"), status: "primary", onClick: () => formRef.current?.submit() },
      ]}
    >
      <p className="strategy-modal__desc">{t("modal.desc")}</p>

      <Form
        ref={formRef}
        layout="vertical"
        validateErrorType="tip"
        initialValues={{ level: "warning", intervalSec: 60, flap: true }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <StrategyFields />

        <div className="switch-row">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("modal.enableNow")}</span>
            <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
          </div>
          <Toggle data={[false, true]} toggled={enableNow} onToggle={(v) => setEnableNow(v)} />
        </div>

        <p className="strategy-modal__status">
          <Icon name={enableNow ? "circle-check" : "pencil-line"} size={12} />
          {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
        </p>
      </Form>
    </Dialog>
  );
}
