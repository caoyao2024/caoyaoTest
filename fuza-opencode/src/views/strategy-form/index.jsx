import { useRef, useState } from 'react';
import Button from '@nce/eview-react/Button';
import Form from '@nce/eview-react/Form';
import Toggle from '@nce/eview-react/Toggle';
import { useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import { basicFieldItems, advancedFieldItems } from '../../components/strategy-fields/index.jsx';
import { useToast } from '../../components/toast.jsx';
import './index.css';

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
// advanced / flap 在源项目是 Form 字段（useWatch）；eview-react 下转为受控 state（Toggle 自定义行布局），
// 不入 Form——它们是 UI 开关而非提交字段。
export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [advanced, setAdvanced] = useState(false);
  const [flap, setFlap] = useState(true);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const notify = useToast();

  const handleSuccess = () => {
    notify('success', t('toast.created'));
  };

  return (
    <section className="panel-card strategy-form">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <Icon name="sliders-horizontal" size={16} />
            {t('form.title')}
          </h2>
          <p className="panel-card__desc">{t('form.desc')}</p>
        </div>
        <div className="panel-card__actions">
          <span className="strategy-form__draft">
            <Icon name="pencil-line" size={12} />
            {t('form.draftTag')}
          </span>
          <Button
            status="text"
            leftIcon={<Icon name="external-link" size={14} />}
            onClick={onOpenModal}
            text={t('form.openModal')}
          />
        </div>
      </header>

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        initialValues={{ level: 'warning', intervalSec: 60 }}
        validateErrorType="tip"
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        {basicFieldItems(intl)}

        <div className="switch-row strategy-form__toggle">
          <div className="switch-row__text">
            <span className="switch-row__label">{t('form.advanced.toggle')}</span>
            <span className="switch-row__desc">{t('form.advanced.toggleDesc')}</span>
          </div>
          <Toggle data={[false, true]} toggled={advanced} onToggle={setAdvanced} />
        </div>

        {advanced ? advancedFieldItems(intl, flap, setFlap) : null}

        {advanced ? (
          <p className="strategy-form__hint">
            <Icon name="info" size={12} />
            {t('form.hint')}
          </p>
        ) : null}

        <div className="strategy-form__footer">
          <Button
            leftIcon={<Icon name="undo-2" size={14} />}
            onClick={() => formRef.current?.resetFields()}
            text={t('form.reset')}
          />
          <div className="strategy-form__footer-main">
            <Button onClick={() => notify('success', t('toast.draft'))} text={t('form.saveDraft')} />
            <Button
              status="primary"
              leftIcon={<Icon name="save" size={14} />}
              onClick={() => formRef.current?.submit()}
              text={t('form.submit')}
            />
          </div>
        </div>
      </Form>
    </section>
  );
}
