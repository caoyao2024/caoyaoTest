// Layer 4: 指标定义编辑器（抽屉表单：新建 / 编辑复用同一份字段）
// Form 模式转换：useForm+Promise → useRef+onSuccess；多列用 Form itemCol（不套 div/Row/Col）。
import { useRef, useEffect, useState } from 'react';
import Button from '@nce/eview-react/Button';
import Drawer from '@nce/eview-react/Drawer';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import TextArea from '@nce/eview-react/TextArea';
import Spinner from '@nce/eview-react/Spinner';
import Select from '@nce/eview-react/Select';
import DatePicker from '@nce/eview-react/DatePicker';
import DivMessage from '@nce/eview-react/DivMessage';
import Icon from '../../shared/icon.jsx';
import { useApp } from '../../context.jsx';
import {
  CATEGORY_OPTIONS,
  CYCLE_OPTIONS,
  DIMENSION_OPTIONS,
  OWNER_OPTIONS,
  POLARITY_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
  UNIT_OPTIONS,
} from '../../mock/metrics.js';

// initialValues 必须传对象（硬约束 #10）；新建态默认值。effectiveAt 用 Date（eview DatePicker 受控值建议 Date）。
const EDITOR_DEFAULTS = {
  name: '',
  code: '',
  category: '资源性能',
  cycle: '每日',
  dimension: '全局',
  unit: '%',
  polarity: 'higher',
  status: 'draft',
  source: '指标中台',
  owner: '张明',
  target: '',
  effectiveAt: new Date(),
  description: '',
};

export default function MetricEditor() {
  const { editor, closeEditor, saveMetric } = useApp();
  const formRef = useRef(null);
  const [notice, setNotice] = useState(null);
  const isEdit = editor.mode === 'edit';

  // 打开时回填：编辑态用 setFieldsValue 覆盖（initialValues 仅初始化生效）；effectiveAt 转 Date。
  useEffect(() => {
    if (!editor.open) return;
    if (isEdit && editor.record && formRef.current) {
      formRef.current.setFieldsValue({
        ...editor.record,
        effectiveAt: editor.record.effectiveAt ? new Date(editor.record.effectiveAt) : new Date(),
      });
    }
  }, [editor.open, editor.mode, editor.record, isEdit]);

  const handleSuccess = (values) => {
    saveMetric(values);
    setNotice({ key: Date.now(), type: 'success', text: isEdit ? '指标定义已更新' : '指标定义已创建' });
  };

  return (
    <Drawer
      title={isEdit ? '编辑指标' : '新建指标'}
      width={720}
      visible={editor.open}
      destroyOnClose
      isClickMask={false}
      className="metric-editor"
      onClose={closeEditor}
    >
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      {/* itemCol={12} 两列；section 标题作为 Form 直接子级（不包裹 Form.Item），满足硬约束 #9/#12 */}
      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        initialValues={EDITOR_DEFAULTS}
        validateErrorType="tip"
        onSuccess={handleSuccess}
        onFailed={() => setNotice({ key: Date.now(), type: 'warn', text: '请修正标红字段' })}
        className="metric-editor__form"
      >
        <section className="metric-editor__section">
          <h3 className="metric-editor__section-title">基本信息</h3>
        </section>
        <Form.Item label="指标名称" name="name" rules={[{ required: true }]}>
          <TextField placeholder="例如：集群 CPU 平均使用率" />
        </Form.Item>
        <Form.Item label="指标编码" name="code" rules={[{ required: true }]}>
          <TextField
            placeholder="例如：res.cpu.usage.avg"
            validator={(value) => ({
              result: /^[a-z0-9.]*$/.test(value || ''),
              message: '仅支持小写字母、数字与英文句点',
            })}
          />
        </Form.Item>
        <Form.Item label="指标分类" name="category" rules={[{ required: true }]}>
          <Select options={CATEGORY_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="统计周期" name="cycle" rules={[{ required: true }]}>
          <Select options={CYCLE_OPTIONS} defaultLabel="请选择" />
        </Form.Item>

        <section className="metric-editor__section">
          <h3 className="metric-editor__section-title">统计口径</h3>
        </section>
        <Form.Item label="统计维度" name="dimension" rules={[{ required: true }]}>
          <Select options={DIMENSION_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="统计单位" name="unit" rules={[{ required: true }]}>
          <Select options={UNIT_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="目标值" name="target" rules={[{ required: true }]}>
          {/* 目标值可达百万级，Spinner 默认 max=100，放宽上限 */}
          <Spinner min={0} max={1000000000} precision={2} step={1} doNotFocusWhenValueUpdate />
        </Form.Item>
        <Form.Item label="指标极性" name="polarity" rules={[{ required: true }]}>
          <Select options={POLARITY_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="数据来源" name="source" rules={[{ required: true }]}>
          <Select options={SOURCE_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="责任人" name="owner" rules={[{ required: true }]}>
          <Select options={OWNER_OPTIONS} defaultLabel="请选择" />
        </Form.Item>

        <section className="metric-editor__section">
          <h3 className="metric-editor__section-title">生效与归属</h3>
        </section>
        <Form.Item label="生效日期" name="effectiveAt" rules={[{ required: true }]}>
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择生效日期" />
        </Form.Item>
        <Form.Item label="指标状态" name="status" rules={[{ required: true }]}>
          <Select options={STATUS_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        {/* 单项整行覆盖 itemCol */}
        <Form.Item label="指标说明" name="description" col={24}>
          <TextArea
            rows={3}
            placeholder="说明统计口径、异常判定规则与下游联动，例如：按机房维度采集，偏差超过 10% 触发告警。"
          />
        </Form.Item>
      </Form>

      {isEdit && editor.record ? (
        <div className="metric-editor__meta">
          <Icon name="clock" size={14} />
          <span>
            最近更新 {editor.record.updatedAt} · 达成率 {Number(editor.record.ratio || 0).toFixed(1)}%
          </span>
        </div>
      ) : null}

      {/* Drawer 无内置按钮区，底部栏自写（绝对定位） */}
      <div
        className="metric-editor__footer"
        style={{ position: 'absolute', right: 0, bottom: 0, width: '100%' }}
      >
        <Button text="取消" onClick={closeEditor} />
        <Button status="primary" text="保存" onClick={() => formRef.current && formRef.current.submit()} style={{ marginLeft: 12 }} />
      </div>
    </Drawer>
  );
}
