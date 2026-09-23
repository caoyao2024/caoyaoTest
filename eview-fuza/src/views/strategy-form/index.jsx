import { useState, useRef } from "react";
import { useIntl } from "react-intl";
import Form from "@nce/eview-react/Form";
import Toggle from "@nce/eview-react/Toggle";
import Button from "@nce/eview-react/Button";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/toast.jsx";
import { renderBasicFields, renderAdvancedFields } from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
// Form 2.0 托管：ref + onSuccess 回调（替代 useForm + validateFields Promise）
export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const { notify, view } = useToast();

  const handleSuccess = (values) => {
    if (submitting) return;
    setSubmitting(true);
    notify("success", t("toast.created"));
    setTimeout(() => setSubmitting(false), 600);
  };

  const handleReset = () => {
    formRef.current?.resetFields();
    setAdvanced(false);
  };

  return (
    <section className="panel-card strategy-form">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <Icon name="sliders-horizontal" size={16} />
            {t("form.title")}
          </h2>
          <p className="panel-card__desc">{t("form.desc")}</p>
        </div>
        <div className="panel-card__actions">
          <span className="strategy-form__draft">
            <Icon name="pencil-line" size={12} />
            {t("form.draftTag")}
          </span>
          <Button
            status="text"
            text={t("form.openModal")}
            leftIcon={<Icon name="external-link" size={14} />}
            onClick={onOpenModal}
          />
        </div>
      </header>

      {view}

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="div"
        initialValues={{
          advanced: false,
          level: "warning",
          intervalSec: 60,
          flap: true,
          notify: ["inbox", "email"],
        }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
        onValuesChange={(changed) => {
          if (changed && "advanced" in changed) setAdvanced(!!changed.advanced);
        }}
      >
        {renderBasicFields(t)}

        <p className="strategy-fields__hint-line">{t("form.advanced.toggleDesc")}</p>
        <Form.Item
          label={t("form.advanced.toggle")}
          name="advanced"
          valuePropName="toggled"
          updateTrigger="onToggle"
          col={24}
        >
          <Toggle data={[false, true]} />
        </Form.Item>

        {advanced ? renderAdvancedFields(t, intl) : null}

        {advanced ? (
          <p className="strategy-form__hint">
            <Icon name="info" size={12} />
            {t("form.hint")}
          </p>
        ) : null}

        <div className="strategy-form__footer">
          <Button text={t("form.reset")} leftIcon={<Icon name="undo-2" size={14} />} onClick={handleReset} />
          <div className="strategy-form__footer-main">
            <Button text={t("form.saveDraft")} onClick={() => notify("success", t("toast.draft"))} />
            <Button
              status="primary"
              text={t("form.submit")}
              disabled={submitting}
              leftIcon={<Icon name="save" size={14} />}
              onClick={() => formRef.current?.submit()}
            />
          </div>
        </div>
      </Form>
    </section>
  );
}
