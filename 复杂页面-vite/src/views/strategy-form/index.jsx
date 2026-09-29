import { useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import Form from "@nce/eview-react/Form";
import Switch from "@nce/eview-react/Switch";
import DivMessage from "@nce/eview-react/DivMessage";
import {
  IconPlusIcPublicTransverseRectangleTemplate,
  IconPlusIcPublicInfo,
} from "@nce/icon-plus";
import { useIntl } from "react-intl";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
// Form 模式转换：useForm()→useRef(null)；validateFields() Promise → ref.submit() + onSuccess 回调
// initialValues 必须传对象（|| {}）；Form 内不用 div 做栅格，用 Form 级 itemCol + Form.Item.col
export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOn, setAdvancedOn] = useState(false);
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  // Form 内 advanced 字段切换后回写本地 state（替代 antd Form.useWatch）
  // onSuccess 收到 values 后处理提交；onFailed 校验失败停在本页
  const handleSuccess = async (values) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      setAdvancedOn(values.advanced === true);
      notify("success", t("toast.created"));
      setTimeout(() => setSubmitting(false), 600);
    } catch {
      setSubmitting(false);
    }
  };

  // 点击高级开关：通过 ref 取值更新本地 state（eview-react Form 没有 useWatch 等价物）
  const handleAdvancedToggle = (value) => {
    setAdvancedOn(value);
  };

  return (
    <section className="panel-card strategy-form">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} />
            {t("form.title")}
          </h2>
          <p className="panel-card__desc">{t("form.desc")}</p>
        </div>
        <div className="panel-card__actions">
          <span className="strategy-form__draft">
            <IconPlusIcPublicTransverseRectangleTemplate iconSize={12} iconColor={["currentcolor"]} />
            {t("form.draftTag")}
          </span>
          <Button
            status="text"
            text={t("form.openModal")}
            leftIcon={<IconPlusIcPublicTransverseRectangleTemplate iconSize={14} iconColor={["currentcolor"]} />}
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
        itemCol={12}
        validateErrorType="tip"
        initialValues={{
          advanced: false,
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
          <Form.Item
            name="advanced"
            valuePropName="toggled"
            updateTrigger="onToggle"
            noStyle
          >
            <Switch
              data={[false, true]}
              onToggle={handleAdvancedToggle}
            />
          </Form.Item>
        </div>

        {advancedOn ? <StrategyAdvanced /> : null}

        {advancedOn ? (
          <p className="strategy-form__hint">
            <IconPlusIcPublicInfo iconSize={12} iconColor={["currentcolor"]} />
            {t("form.hint")}
          </p>
        ) : null}

        <div className="strategy-form__footer">
          <Button
            text={t("form.reset")}
            leftIcon={<IconPlusIcPublicTransverseRectangleTemplate iconSize={14} iconColor={["currentcolor"]} />}
            onClick={() => formRef.current?.resetFields()}
          />
          <div className="strategy-form__footer-main">
            <Button text={t("form.saveDraft")} onClick={() => notify("success", t("toast.draft"))} />
            <Button
              status="primary"
              text={submitting ? t("form.submit") + "..." : t("form.submit")}
              disabled={submitting}
              leftIcon={<IconPlusIcPublicTransverseRectangleTemplate iconSize={14} iconColor={["currentcolor"]} />}
              onClick={() => formRef.current?.submit()}
            />
          </div>
        </div>
      </Form>
    </section>
  );
}
