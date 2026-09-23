import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import TextField from "@nce/eview-react/TextField";
import { Icon } from "../../shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useToast } from "../../shared/toast.jsx";
import {
  deviceTypeOptions,
  levelOptions,
  levelTone,
  notifyOptions,
  statusMeta,
  strategyRows,
  displayName,
  displayOwner,
  labelOf,
} from "../../mock/strategy.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 策略清单表格 — 视图筛选（手写 Segmented）+ 搜索 + 行选择批量操作
// antd Table → eview Table（dataset/keyIndex/columns[].key/render）；Segmented 无对应 → 手写
export default function StrategyTable({ onEdit }) {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const { notify, view } = useToast();

  const [viewFilter, setViewFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return strategyRows.filter((row) => {
      const matchView =
        viewFilter === "all" ? true : viewFilter === "enabled" ? row.status === "enabled" : row.status !== "enabled";
      const matchKw =
        !kw ||
        row.id.toLowerCase().includes(kw) ||
        row.name.toLowerCase().includes(kw) ||
        row.nameEn.toLowerCase().includes(kw);
      return matchView && matchKw;
    });
  }, [viewFilter, keyword]);

  const enabledCount = strategyRows.filter((r) => r.status === "enabled").length;

  const optionDict = {};
  deviceTypeOptions.concat(levelOptions, notifyOptions).forEach((o) => {
    optionDict[o.labelId] = intl.formatMessage({ id: o.labelId, defaultMessage: o.labelId });
  });
  const translator = (id) => intl.formatMessage({ id, defaultMessage: id });

  const columns = [
    { title: t("table.col.id"), key: "id", width: 132, render: (value) => <span className="strategy-table__code">{value}</span> },
    {
      title: t("table.col.name"),
      key: "name",
      width: 208,
      render: (_value, row) => (
        <Button status="text" className="strategy-table__link" text={displayName(row, lang)} onClick={() => onEdit(row)} />
      ),
    },
    {
      title: t("table.col.deviceType"),
      key: "deviceType",
      width: 148,
      render: (value) => <span className="strategy-table__type">{labelOf(deviceTypeOptions, value, optionDict)}</span>,
    },
    {
      title: t("table.col.interval"),
      key: "intervalSec",
      width: 110,
      align: "right",
      render: (value) => `${value} ${t("table.unit.second")}`,
    },
    {
      title: t("table.col.level"),
      key: "level",
      width: 108,
      render: (value) => <StatusTag labelId={`opt.level.${value}`} tone={levelTone[value]} />,
    },
    { title: t("table.col.devices"), key: "devices", width: 100, align: "right" },
    {
      title: t("table.col.status"),
      key: "status",
      width: 110,
      render: (value) => <StatusTag labelId={statusMeta[value].labelId} tone={statusMeta[value].tone} />,
    },
    {
      title: t("table.col.owner"),
      key: "owner",
      width: 104,
      render: (_value, row) => displayOwner(row, lang),
    },
    {
      title: t("table.col.updatedAt"),
      key: "updatedAt",
      width: 152,
      render: (value) => <span className="strategy-table__time">{value}</span>,
    },
    {
      title: t("table.col.actions"),
      key: "actions",
      width: 176,
      align: "center",
      render: (_value, row) => (
        <div className="strategy-table__ops">
          <IconButton
            iconName={<Icon name="pencil" size={13} />}
            tipText={t("table.action.edit")}
            size="small"
            onClick={() => onEdit(row)}
          />
          <IconButton
            iconName={<Icon name="copy" size={13} />}
            tipText={t("table.action.copy")}
            size="small"
            onClick={() => notify("success", t("toast.copied"))}
          />
          <IconButton
            iconName={<Icon name={row.status === "enabled" ? "pause" : "play"} size={13} />}
            tipText={row.status === "enabled" ? t("table.action.disable") : t("table.action.enable")}
            size="small"
            onClick={() =>
              notify(
                "success",
                row.status === "enabled"
                  ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                  : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
              )
            }
          />
          <IconButton
            iconName={<Icon name="trash-2" size={13} />}
            tipText={t("table.action.delete")}
            size="small"
            onClick={() => notify("success", t("toast.deleted"))}
          />
        </div>
      ),
    },
  ];

  const batch = (action) => {
    if (!selectedRowKeys.length) {
      notify("warn", t("toast.selectFirst"));
      return;
    }
    notify(
      "success",
      intl.formatMessage({ id: action === "enable" ? "toast.enabled" : "toast.disabled" }, { count: selectedRowKeys.length })
    );
    setSelectedRowKeys([]);
  };

  return (
    <section className="panel-card strategy-table">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <Icon name="list-checks" size={16} />
            {t("table.title")}
          </h2>
          <p className="panel-card__desc">
            {intl.formatMessage({ id: "table.desc" }, { total: strategyRows.length, enabled: enabledCount })}
          </p>
        </div>
        {/* TODO(eview-react): Segmented 无对应组件，手写分段控件 */}
        <div className="app-segmented" role="tablist">
          {[
            { label: t("table.filter.all"), value: "all" },
            { label: t("table.filter.enabled"), value: "enabled" },
            { label: t("table.filter.disabled"), value: "disabled" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`app-segmented__item${viewFilter === opt.value ? " is-active" : ""}`}
              onClick={() => setViewFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {view}

      <div className="strategy-table__toolbar">
        {/* TODO(eview-react): TextField 无 prefix/allowClear，搜索图标与清除按钮暂省略 */}
        <TextField
          className="strategy-table__search"
          placeholder={t("table.search.ph")}
          value={keyword}
          onChange={(value) => setKeyword(value)}
        />
        <span className="strategy-table__count">
          {selectedRowKeys.length
            ? intl.formatMessage({ id: "table.selected" }, { count: selectedRowKeys.length })
            : `${dataSource.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            text={t("table.batch.enable")}
            leftIcon={<Icon name="play" size={14} />}
            disabled={!selectedRowKeys.length}
            onClick={() => batch("enable")}
          />
          <Button
            text={t("table.batch.disable")}
            leftIcon={<Icon name="pause" size={14} />}
            disabled={!selectedRowKeys.length}
            onClick={() => batch("disable")}
          />
          <IconButton
            iconName={<Icon name="refresh-cw" size={14} />}
            tipText={t("table.refresh")}
            onClick={() => notify("success", t("table.refresh"))}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataset={dataSource}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        onRowCheck={(_row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pagingProps={{ pageSize: 8, pageSizeOptions: [8, 16, 24] }}
        emptyTableMsg={t("table.empty")}
        enableRowExpand
        onRowExpend={(row) => (
          <div className="strategy-table__expand">
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t("table.expand.threshold")}</span>
              <span className="strategy-table__expand-v">{row.threshold}%</span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t("table.expand.retry")}</span>
              <span className="strategy-table__expand-v">
                {row.retry} {t("form.retry.unit")}
              </span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t("table.expand.notify")}</span>
              <span className="strategy-table__expand-v">
                {row.notify.map((n) => translator(notifyOptions.find((o) => o.value === n).labelId)).join(" / ")}
              </span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t("table.expand.flap")}</span>
              <span className="strategy-table__expand-v">
                {row.flap ? t("table.expand.on") : t("table.expand.off")}
              </span>
            </div>
          </div>
        )}
      />
    </section>
  );
}
