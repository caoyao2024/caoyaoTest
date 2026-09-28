// Layer 4: 指标定义编辑器（抽屉表单：新建 / 编辑复用同一份字段）
import { useEffect, useRef } from 'react';
import Button from '@nce/eview-react/Button';
import DatePicker from '@nce/eview-react/DatePicker';
import Drawer from '@nce/eview-react/Drawer';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import TextArea from '@nce/eview-react/TextArea';
import Spinner from '@nce/eview-react/Spinner';
import Select from '@nce/eview-react/Select';
import { IconPlusIcPublicClock } from '@nce/icon-plus';
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

function MetricEditor() {
  const { editor, closeEditor, saveMetric, notify } = useApp();
  const formRef = useRef(null);
  const isEdit = editor.mode === "edit";

  useEffect(() => {
    if (!editor.open) return;
    if (isEdit && editor.record) {
      formRef.current?.setFieldsValue({
        ...editor.record,
        effectiveAt: editor.record.effectiveAt ? new Date(editor.record.effectiveAt) : new Date(),
      });
    } else {
      formRef.current?.resetFields();
      formRef.current?.setFieldsValue({
        category: "资源性能",
        cycle: "每日",
        dimension: "全局",
        unit: "%",
        polarity: "higher",
        status: "draft",
        source: "指标中台",
        owner: "张明",
        effectiveAt: new Date(),
      });
    }
  }, [editor.open, editor.mode, editor.record]);

  const handleSuccess = (values) => {
    saveMetric(values);
    notify("success", isEdit ? "指标定义已更新" : "指标定义已创建");
  };

  return (
    <Drawer
      visible={editor.open}
      width={720}
      className="metric-editor"
      title={isEdit ? "编辑指标" : "新建指标"}
      onClose={closeEditor}
      destroyOnClose
    >
      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        validateAllChildComponent={true}
        initialValues={{}}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <h3 className="metric-editor__section-title">基本信息</h3>
        <Form.Item label="指标名称" name="name" rules={[{ required: true }]}>
          <TextField placeholder="例如：集群 CPU 平均使用率" maxLength={64} />
        </Form.Item>
        <Form.Item label="指标编码" name="code" rules={[{ required: true }]}>
          <TextField
            placeholder="例如：res.cpu.usage.avg"
            validator={(value) => ({
              result: !value || /^[a-z0-9.]+$/.test(value),
              message: "仅支持小写字母、数字与英文句点",
            })}
          />
        </Form.Item>
        <Form.Item label="指标分类" name="category" rules={[{ required: true }]}>
          <Select options={CATEGORY_OPTIONS} defaultLabel="请选择" enableClear />
        </Form.Item>
        <Form.Item label="统计周期" name="cycle" rules={[{ required: true }]}>
          <Select options={CYCLE_OPTIONS} defaultLabel="请选择" enableClear />
        </Form.Item>

        <h3 className="metric-editor__section-title">统计口径</h3>
        <Form.Item label="统计维度" name="dimension" rules={[{ required: true }]}>
          <Select options={DIMENSION_OPTIONS} defaultLabel="请选择" enableClear />
        </Form.Item>
        <Form.Item label="统计单位" name="unit" rules={[{ required: true }]}>
          <Select options={UNIT_OPTIONS} defaultLabel="请选择" enableClear />
        </Form.Item>
        <Form.Item label="目标值" name="target" rules={[{ required: true }]}>
          <Spinner min={0} precision={2} />
        </Form.Item>
        <Form.Item label="指标极性" name="polarity" rules={[{ required: true }]}>
          <Select options={POLARITY_OPTIONS} defaultLabel="请选择" enableClear />
        </Form.Item>
        <Form.Item label="数据来源" name="source" rules={[{ required: true }]}>
          <Select options={SOURCE_OPTIONS} defaultLabel="请选择" enableClear />
        </Form.Item>
        <Form.Item label="责任人" name="owner" rules={[{ required: true }]}>
          <Select options={OWNER_OPTIONS} defaultLabel="请选择" enableClear />
        </Form.Item>

        <h3 className="metric-editor__section-title">生效与归属</h3>
        <Form.Item label="生效日期" name="effectiveAt" rules={[{ required: true }]}>
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择生效日期" />
        </Form.Item>
        <Form.Item label="指标状态" name="status" rules={[{ required: true }]}>
          <Select options={STATUS_OPTIONS} defaultLabel="请选择" enableClear />
        </Form.Item>
        <Form.Item label="指标说明" name="description" col={24}>
          <TextArea
            rows={3}
            placeholder="说明统计口径、异常判定规则与下游联动，例如：按机房维度采集，偏差超过 10% 触发告警。"
            maxLength={200}
          />
        </Form.Item>
      </Form>

      {isEdit && editor.record ? (
        <div className="metric-editor__meta">
          <IconPlusIcPublicClock iconSize={14} iconColor={['currentcolor']} />
          <span>
            最近更新 {editor.record.updatedAt} · 达成率 {Number(editor.record.ratio || 0).toFixed(1)}%
          </span>
        </div>
      ) : null}

      <div className="metric-editor__footer">
        <Button onClick={closeEditor}>取消</Button>
        <Button status="primary" onClick={() => formRef.current?.submit()}>保存</Button>
      </div>
    </Drawer>
  );
}

export { MetricEditor };
