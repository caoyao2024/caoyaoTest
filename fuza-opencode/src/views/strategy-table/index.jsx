import { useMemo, useState } from 'react';
import Table from '@nce/eview-react/Table';
import Button from '@nce/eview-react/Button';
import IconButton from '@nce/eview-react/IconButton';
import SearchInput from '@nce/eview-react/SearchInput';
import { useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import StatusTag from '../../components/status-tag/index.jsx';
import {
  levelTone,
  statusMeta,
  strategyRows,
  displayName,
  displayOwner,
} from '../../mock/strategy.js';
import { useApp } from '../../context.jsx';
import { useToast } from '../../components/toast.jsx';
import './index.css';

// Layer 4: 策略清单表格 — Segmented 视图筛选 + 搜索 + 行选择批量操作
// antd Table → eview Table（dataset/keyIndex/render）；Segmented 无对应 → 手写 .seg
export default function StrategyTable({ onEdit }) {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const notify = useToast();

  const [view, setView] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return strategyRows.filter((row) => {
      const matchView =
        view === 'all' ? true : view === 'enabled' ? row.status === 'enabled' : row.status !== 'enabled';
      const matchKw =
        !kw ||
        row.id.toLowerCase().includes(kw) ||
        row.name.toLowerCase().includes(kw) ||
        row.nameEn.toLowerCase().includes(kw);
      return matchView && matchKw;
    });
  }, [view, keyword]);

  const enabledCount = strategyRows.filter((r) => r.status === 'enabled').length;

  const columns = [
    {
      title: t('table.col.id'),
      key: 'id',
      width: 132,
      render: (v) => <span className="strategy-table__code">{v}</span>,
    },
    {
      title: t('table.col.name'),
      key: 'name',
      width: 208,
      render: (v, row) => (
        <Button status="text" className="strategy-table__link" onClick={() => onEdit(row)} text={displayName(row, lang)} />
      ),
    },
    {
      title: t('table.col.deviceType'),
      key: 'deviceType',
      width: 148,
      render: (v) => <span className="strategy-table__type">{t('opt.device.' + v, v)}</span>,
    },
    {
      title: t('table.col.interval'),
      key: 'intervalSec',
      width: 110,
      align: 'right',
      render: (v) => `${v} ${t('table.unit.second')}`,
    },
    {
      title: t('table.col.level'),
      key: 'level',
      width: 108,
      render: (v) => <StatusTag labelId={`opt.level.${v}`} tone={levelTone[v]} />,
    },
    { title: t('table.col.devices'), key: 'devices', width: 100, align: 'right' },
    {
      title: t('table.col.status'),
      key: 'status',
      width: 110,
      render: (v) => <StatusTag labelId={statusMeta[v].labelId} tone={statusMeta[v].tone} />,
    },
    {
      title: t('table.col.owner'),
      key: 'owner',
      width: 104,
      render: (_v, row) => displayOwner(row, lang),
    },
    {
      title: t('table.col.updatedAt'),
      key: 'updatedAt',
      width: 152,
      render: (v) => <span className="strategy-table__time">{v}</span>,
    },
    {
      title: t('table.col.actions'),
      key: 'actions',
      width: 176,
      align: 'center',
      render: (_v, row) => (
        <div className="strategy-table__ops">
          <IconButton
            size="small"
            iconName={<Icon name="pencil" size={13} />}
            tipText={t('table.action.edit')}
            onClick={() => onEdit(row)}
          />
          <IconButton
            size="small"
            iconName={<Icon name="copy" size={13} />}
            tipText={t('table.action.copy')}
            onClick={() => notify('success', t('toast.copied'))}
          />
          <IconButton
            size="small"
            iconName={<Icon name={row.status === 'enabled' ? 'pause' : 'play'} size={13} />}
            tipText={row.status === 'enabled' ? t('table.action.disable') : t('table.action.enable')}
            onClick={() =>
              notify(
                'success',
                intl.formatMessage(
                  { id: row.status === 'enabled' ? 'toast.disabled' : 'toast.enabled' },
                  { count: 1 }
                )
              )
            }
          />
          <IconButton
            size="small"
            iconName={<Icon name="trash-2" size={13} />}
            tipText={t('table.action.delete')}
            onClick={() => notify('success', t('toast.deleted'))}
          />
        </div>
      ),
    },
  ];

  const batch = (action) => {
    if (!selectedRowKeys.length) {
      notify('warn', t('toast.selectFirst'));
      return;
    }
    notify(
      'success',
      intl.formatMessage(
        { id: action === 'enable' ? 'toast.enabled' : 'toast.disabled' },
        { count: selectedRowKeys.length }
      )
    );
    setSelectedRowKeys([]);
  };

  const viewFilters = [
    { value: 'all', label: t('table.filter.all') },
    { value: 'enabled', label: t('table.filter.enabled') },
    { value: 'disabled', label: t('table.filter.disabled') },
  ];

  return (
    <section className="panel-card strategy-table">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <Icon name="list-checks" size={16} />
            {t('table.title')}
          </h2>
          <p className="panel-card__desc">
            {intl.formatMessage(
              { id: 'table.desc' },
              { total: strategyRows.length, enabled: enabledCount }
            )}
          </p>
        </div>
        <div className="seg">
          {viewFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`seg__btn${view === f.value ? ' is-active' : ''}`}
              onClick={() => setView(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="strategy-table__toolbar">
        <SearchInput
          className="strategy-table__search"
          placeholder={t('table.search.ph')}
          value={keyword}
          onChange={(v) => setKeyword(v)}
          onClear={() => setKeyword('')}
        />
        <span className="strategy-table__count">
          {selectedRowKeys.length
            ? intl.formatMessage({ id: 'table.selected' }, { count: selectedRowKeys.length })
            : `${dataSource.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            leftIcon={<Icon name="play" size={14} />}
            disabled={!selectedRowKeys.length}
            onClick={() => batch('enable')}
            text={t('table.batch.enable')}
          />
          <Button
            leftIcon={<Icon name="pause" size={14} />}
            disabled={!selectedRowKeys.length}
            onClick={() => batch('disable')}
            text={t('table.batch.disable')}
          />
          <IconButton
            size="small"
            iconName={<Icon name="refresh-cw" size={14} />}
            tipText={t('table.refresh')}
            onClick={() => notify('success', t('table.refresh'))}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataset={dataSource.map((r) => ({ ...r, actions: null }))}
        keyIndex={0}
        emptyTableMsg={t('table.empty')}
        showEmptyImage
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        onRowCheck={(_row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enableRowExpand
        onRowExpend={(row) => (
          <div className="strategy-table__expand">
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t('table.expand.threshold')}</span>
              <span className="strategy-table__expand-v">{row.threshold}%</span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t('table.expand.retry')}</span>
              <span className="strategy-table__expand-v">{row.retry} {t('form.retry.unit')}</span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t('table.expand.notify')}</span>
              <span className="strategy-table__expand-v">
                {row.notify.map((n) => t('opt.notify.' + n, n)).join(' / ')}
              </span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t('table.expand.flap')}</span>
              <span className="strategy-table__expand-v">
                {row.flap ? t('table.expand.on') : t('table.expand.off')}
              </span>
            </div>
          </div>
        )}
        enablePagination
        enableAutoPaging
        pageSize={8}
        pageSizeOptions={[8, 16, 24]}
      />
    </section>
  );
}
