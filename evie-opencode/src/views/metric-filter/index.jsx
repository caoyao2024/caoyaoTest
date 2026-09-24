import { useState } from 'react';
import Button from '@nce/eview-react/Button';
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';
import { IconPlusIcPublicSearch, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicChevronUp, IconPlusIcPublicChevronDown } from '@nce/icon-plus';
import { useApp } from '../../context.jsx';
import { CATEGORY_OPTIONS, CYCLE_OPTIONS, DIMENSION_OPTIONS, OWNER_OPTIONS, SOURCE_OPTIONS, STATUS_OPTIONS, UNIT_OPTIONS } from '../../mock/metrics.js';
import PanelCard from '../../components/panel-card/index.jsx';

const FULL_WIDTH = { width: '100%' };
const toOptions = (opts) => opts.map((o) => ({ value: o.value, text: o.label }));

function Field({ label, children }) {
  return (
    <div className="metric-filter__field">
      <label className="metric-filter__label">{label}</label>
      {children}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <Select
        enableClear
        selectStyle={FULL_WIDTH}
        value={value}
        options={toOptions(options)}
        defaultLabel="全部"
        onChange={(next) => onChange(next)}
      />
    </Field>
  );
}

export default function MetricFilter() {
  const { draft, updateDraft, applyFilters, resetFilters, activeFilterCount } = useApp();
  const [expanded, setExpanded] = useState(false);

  return (
    <PanelCard
      className="metric-filter"
      title="指标筛选"
      subtitle={activeFilterCount ? activeFilterCount + ' 个条件已生效' : '支持按名称、分类、周期与责任人组合筛选'}
    >
      <div className="metric-filter__grid">
        <Field label="指标名称 / 编码">
          <TextField
            value={draft.keyword}
            placeholder="输入指标名称或编码"
            inputStyle={FULL_WIDTH}
            onChange={(value) => updateDraft('keyword', value)}
          />
        </Field>
        <FilterSelect
          label="指标分类"
          value={draft.category}
          options={CATEGORY_OPTIONS}
          onChange={(value) => updateDraft('category', value)}
        />
        <FilterSelect
          label="统计周期"
          value={draft.cycle}
          options={CYCLE_OPTIONS}
          onChange={(value) => updateDraft('cycle', value)}
        />
        <FilterSelect
          label="指标状态"
          value={draft.status}
          options={STATUS_OPTIONS}
          onChange={(value) => updateDraft('status', value)}
        />

        {expanded ? (
          <>
            <FilterSelect
              label="统计维度"
              value={draft.dimension}
              options={DIMENSION_OPTIONS}
              onChange={(value) => updateDraft('dimension', value)}
            />
            <FilterSelect
              label="数据来源"
              value={draft.source}
              options={SOURCE_OPTIONS}
              onChange={(value) => updateDraft('source', value)}
            />
            <FilterSelect
              label="责任人"
              value={draft.owner}
              options={OWNER_OPTIONS}
              onChange={(value) => updateDraft('owner', value)}
            />
            <FilterSelect
              label="统计单位"
              value={draft.unit}
              options={UNIT_OPTIONS}
              onChange={(value) => updateDraft('unit', value)}
            />
          </>
        ) : null}
      </div>

      <div className="metric-filter__actions">
        <Button
          status="text"
          text={expanded ? '收起筛选' : '展开筛选'}
          rightIcon={expanded ? <IconPlusIcPublicChevronUp iconSize={14} /> : <IconPlusIcPublicChevronDown iconSize={14} />}
          onClick={() => setExpanded(!expanded)}
        />
        <Button text="重置" leftIcon={<IconPlusIcPublicRefreshClockwise iconSize={14} />} onClick={resetFilters} />
        <Button status="primary" text="查询" leftIcon={<IconPlusIcPublicSearch iconSize={14} />} onClick={applyFilters} />
      </div>
    </PanelCard>
  );
}
