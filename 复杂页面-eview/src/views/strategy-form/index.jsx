import { useRef, useState } from "react";
import { IconPlusIcPublicInfo, IconPlusIcPublicTransverseRectangleTemplate } from '@nce/icon-plus';
import Button from "@nce/eview-react/Button";
import Form from "@nce/eview-react/Form";
import Toggle from "@nce/eview-react/Toggle";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOn, setAdvancedOn] = useState(false);
  const [notice, setNotice] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const handleSuccess = (values) => {
    if (submitting) return;
    setSubmitting(true);
    notify("success", t("toast.created"));
    setTimeout(() => setSubmitting(false), 600);
  };

  return (
    <section className="panel-card strategy-form">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />
            {t("form.title")}
          </h2>
          <p className="panel-card__desc">{t("form.desc")}</p>
        </div>
        <div className="panel-card__actions">
          <span className="strategy-form__draft">
            <IconPlusIcPublicTransverseRectangleTemplate iconSize={12} iconColor={['currentcolor']} />
            {t("form.draftTag")}
          </span>
          <Button
            status="text"
            leftIcon={<IconPlusIcPublicTransverseRectangleTemplate iconSize={14} iconColor={['currentcolor']} />}
            text={t("form.openModal")}
            onClick={onOpenModal}
          />
        </div>
      </header>

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

      <Form
        ref={formRef}
        layout="vertical"
        validateErrorType="tip"
        initialValues={{
          level: "warning",
          intervalSec: 60,
          flap: true,
          notify: ["inbox", "email"],
        }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <StrategyFields />

        <div className="switch-row strategy-form__toggle">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.advanced.toggle")}</span>
            <span className="switch-row__desc">{t("form.advanced.toggleDesc")}</span>
          </div>
          <Toggle data={[false, true]} toggled={advancedOn} onToggle={(v) => setAdvancedOn(v)} />
        </div>

        {advancedOn ? <StrategyAdvanced /> : null}

        {advancedOn ? (
          <p className="strategy-form__hint">
            <IconPlusIcPublicInfo iconSize={12} iconColor={['currentcolor']} />
            {t("form.hint")}
          </p>
        ) : null}

        <div className="strategy-form__footer">
          <Button
            leftIcon={<IconPlusIcPublicTransverseRectangleTemplate iconSize={14} iconColor={['currentcolor']} />}
            text={t("form.reset")}
            onClick={() => {
              formRef.current?.resetFields();
              setAdvancedOn(false);
            }}
          />
          <div className="strategy-form__footer-main">
            <Button text={t("form.saveDraft")} onClick={() => notify("success", t("toast.draft"))} />
            <Button
              status="primary"
              disabled={submitting}
              leftIcon={<IconPlusIcPublicTransverseRectangleTemplate iconSize={14} iconColor={['currentcolor']} />}
              text={submitting ? `${t("form.submit")}...` : t("form.submit")}
              onClick={() => formRef.current?.submit()}
            />
          </div>
        </div>
      </Form>
    </section>
  );
}
