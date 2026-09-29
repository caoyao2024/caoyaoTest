import { useEffect, useRef, useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import Form from "@nce/eview-react/Form";
import Switch from "@nce/eview-react/Switch";
import DivMessage from "@nce/eview-react/DivMessage";
import { IconPlusIcPublicPlusCircle, IconPlusIcPublicTransverseRectangleTemplate } from "@nce/icon-plus";
import { useIntl } from "react-intl";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略弹窗表单 — 页面头/表格行均可唤起，复用同一套参数字段
// Modal → Dialog：open→isOpen；footer→buttons 数组；onClose 不自动关闭，需自己置 false
// Form 模式：useForm()→useRef；validateFields() Promise → submit() + onSuccess 回调；Switch data=[false,true]
export default function StrategyModal({ open, record, onClose }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const [notice, setNotice] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  // 打开时回填（编辑模式）或重置（新建模式）；enableNow 跟随 record.status
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

  // 校验通过 → onSuccess；校验失败 → onFailed 停在弹窗
  const handleSuccess = (values) => {
    setEnableNow(values.enableNow !== false);
    notify(
      "success",
      record ? t("toast.updated") : t("toast.created")
    );
    onClose();
  };

  // asDraft=true 时跳过校验直接保存草稿
  const submit = (asDraft) => {
    if (asDraft) {
      notify("success", t("toast.draft"));
      onClose();
      return;
    }
    formRef.current?.submit();
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      size={[680, "auto"]}
      style={{ maxHeight: "80vh" }}
      title={
        <span className="strategy-modal__title">
          <IconPlusIcPublicPlusCircle iconSize={16} iconColor={["currentcolor"]} />
          {record ? t("modal.title.edit") : t("modal.title.new")}
        </span>
      }
      buttons={[
        { text: t("modal.cancel"), onClick: onClose },
        { text: t("modal.draft"), onClick: () => submit(true) },
        { text: t("modal.ok"), status: "primary", onClick: () => submit(false) },
      ]}
    >
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={5000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <p className="strategy-modal__desc">{t("modal.desc")}</p>

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        initialValues={{ enableNow: true, level: "warning", intervalSec: 60, flap: true }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <StrategyFields />

        <div className="switch-row">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("modal.enableNow")}</span>
            <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
          </div>
          <Form.Item
            name="enableNow"
            valuePropName="toggled"
            updateTrigger="onToggle"
            noStyle
          >
            <Switch
              data={[false, true]}
              onToggle={(value) => setEnableNow(value !== false)}
            />
          </Form.Item>
        </div>

        <p className="strategy-modal__status">
          <IconPlusIcPublicTransverseRectangleTemplate
            iconSize={12}
            iconColor={["currentcolor"]}
          />
          {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
        </p>
      </Form>
    </Dialog>
  );
}
