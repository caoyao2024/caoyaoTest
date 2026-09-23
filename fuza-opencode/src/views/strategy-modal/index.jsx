import { useEffect, useRef, useState } from 'react';
import Dialog from '@nce/eview-react/Dialog';
import Form from '@nce/eview-react/Form';
import Toggle from '@nce/eview-react/Toggle';
import { useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import { basicFieldItems } from '../../components/strategy-fields/index.jsx';
import { useToast } from '../../components/toast.jsx';
import './index.css';

// Layer 4: 策略弹窗表单 — 页面头/表格行均可唤起，复用同一套参数字段
// antd Modal → Dialog（isOpen 受控 + buttons 数组 + onClose 自行置 false）
export default function StrategyModal({ open, record, onClose }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const notify = useToast();

  useEffect(() => {
    if (!open) return;
    if (record) {
      formRef.current?.setFieldsValue({
        name: record.name,
        deviceType: record.deviceType,
        intervalSec: record.intervalSec,
        level: record.level,
      });
      setEnableNow(record.status === 'enabled');
    } else {
      formRef.current?.resetFields();
      setEnableNow(true);
    }
  }, [open, record]);

  const handleSuccess = () => {
    notify('success', record ? t('toast.updated') : t('toast.created'));
    onClose();
  };

  const submit = (asDraft) => {
    if (asDraft) {
      notify('success', t('toast.draft'));
      onClose();
    } else {
      formRef.current?.submit();
    }
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      size={[680, 'auto']}
      style={{ maxHeight: '80vh' }}
      title={
        <span className="strategy-modal__title">
          <Icon name="circle-plus" size={16} />
          {record ? t('modal.title.edit') : t('modal.title.new')}
        </span>
      }
      buttons={[
        { text: t('modal.cancel'), onClick: onClose },
        { text: t('modal.draft'), onClick: () => submit(true) },
        { text: t('modal.ok'), status: 'primary', onClick: () => submit(false) },
      ]}
    >
      <p className="strategy-modal__desc">{t('modal.desc')}</p>

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

        <div className="switch-row">
          <div className="switch-row__text">
            <span className="switch-row__label">{t('modal.enableNow')}</span>
            <span className="switch-row__desc">{t('modal.enableNowDesc')}</span>
          </div>
          <Toggle data={[false, true]} toggled={enableNow} onToggle={setEnableNow} />
        </div>

        <p className="strategy-modal__status">
          <Icon name={enableNow ? 'circle-check' : 'pencil-line'} size={12} />
          {enableNow ? t('opt.status.enabled') : t('opt.status.draft')}
        </p>
      </Form>
    </Dialog>
  );
}
