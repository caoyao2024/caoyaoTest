import { useMemo, useState, useRef } from "react";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import TextField from "@nce/eview-react/TextField";
import SelectCard from "@nce/eview-react/SelectCard";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/toast.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
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

// Layer 4: 策略清单表格 — Segmented 视图筛选 + 搜索 + 行选择批量操作
export default function StrategyTable({ onEdit }) {
  const { lang } = useApp();
  const intl = useIntl();
  const toast = useToast();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [view, setView] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return strategyRows.filter((row) => {
      const matchView =
        view === "all" ? true : view === "enabled" ? row.status === "enabled" : row.status !== "enabled";
      const matchKw =
        !kw ||
        row.id.toLowerCase().includes(kw) ||
        row.name.toLowerCase().includes(kw) ||
        row.nameEn.toLowerCase().includes(kw);
      return matchView && matchKw;
    });
  }, [view, keyword]);

  const enabledCount = strategyRows.filter((r) => r.status === "enabled").length;

  // 选项集统一译一次，表格单元格内复用
  const optionDict = {};
  deviceTypeOptions.concat(levelOptions, notifyOptions).forEach((o) => {
    optionDict[o.labelId] = intl.formatMessage({ id: o.labelId, defaultMessage: o.labelId });
  });

  const translator = (id) => intl.formatMessage({ id, defaultMessage: id });

  // 从源数组查找完整行数据（row.rawData 可能不含未在列定义中的字段）
  const fullRow = (row) => dataSource.find((d) => d.id === row?.rawData?.id) || row?.rawData || {};

  const columns = [
    {
      title: t("table.col.id"),
      key: "id",
      width: 132,
      render: (cell) => <span className="strategy-table__code">{cell}</span>,
    },
    {
      title: t("table.col.name"),
      key: "name",
      width: 208,
      render: (cell, rowData, options, row) => {
        const full = fullRow(row);
        return (
          <Button status="text" className="strategy-table__link" text={displayName(full, lang)} onClick={() => onEdit(full)} />
        );
      },
    },
    {
      title: t("table.col.deviceType"),
      key: "deviceType",
      width: 148,
      render: (cell) => (
        <span className="strategy-table__type">
          {labelOf(deviceTypeOptions, cell, optionDict)}
        </span>
      ),
    },
    {
      title: t("table.col.interval"),
      key: "intervalSec",
      width: 110,
      align: "right",
      render: (cell) => `${cell} ${t("table.unit.second")}`,
    },
    {
      title: t("table.col.level"),
      key: "level",
      width: 108,
      render: (cell) => <StatusTag labelId={`opt.level.${cell}`} tone={levelTone[cell]} />,
    },
    {
      title: t("table.col.devices"),
      key: "devices",
      width: 100,
      align: "right",
    },
    {
      title: t("table.col.status"),
      key: "status",
      width: 110,
      render: (cell) => (
        <StatusTag labelId={statusMeta[cell].labelId} tone={statusMeta[cell].tone} />
      ),
    },
    {
      title: t("table.col.owner"),
      key: "owner",
      width: 104,
      render: (cell, rowData, options, row) => displayOwner(fullRow(row), lang),
    },
    {
      title: t("table.col.updatedAt"),
      key: "updatedAt",
      width: 152,
      render: (cell) => <span className="strategy-table__time">{cell}</span>,
    },
    {
      title: t("table.col.actions"),
      key: "actions",
      width: 176,
      align: "center",
      render: (cell, rowData, options, row) => {
        const r = fullRow(row);
        return (
          <div className="strategy-table__ops">
            <IconButton
              iconName={<Icon name="pencil" size={13} />}
              tipText={t("table.action.edit")}
              size="small"
              onClick={() => onEdit(r)}
            />
            <IconButton
              iconName={<Icon name="copy" size={13} />}
              tipText={t("table.action.copy")}
              size="small"
              onClick={() => toast.success(t("toast.copied"))}
            />
            <IconButton
              iconName={<Icon name={r.status === "enabled" ? "pause" : "play"} size={13} />}
              tipText={r.status === "enabled" ? t("table.action.disable") : t("table.action.enable")}
              size="small"
              onClick={() =>
                toast.success(
                  r.status === "enabled"
                    ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                    : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
                )
              }
            />
            <IconButton
              iconName={<Icon name="trash-2" size={13} />}
              tipText={t("table.action.delete")}
              size="small"
              onClick={() => toast.success(t("toast.deleted"))}
            />
          </div>
        );
      },
    },
  ];

  const batch = (action) => {
    if (!selectedRowKeys.length) {
      toast.warn(t("toast.selectFirst"));
      return;
    }
    toast.success(
      intl.formatMessage(
        { id: action === "enable" ? "toast.enabled" : "toast.disabled" },
        { count: selectedRowKeys.length }
      )
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
            {intl.formatMessage(
              { id: "table.desc" },
              { total: strategyRows.length, enabled: enabledCount }
            )}
          </p>
        </div>
        <SelectCard
          data={[
            { text: t("table.filter.all"), value: "all" },
            { text: t("table.filter.enabled"), value: "enabled" },
            { text: t("table.filter.disabled"), value: "disabled" },
          ]}
          value={view}
          onChange={(value) => setView(value)}
        />
      </header>

      <div className="strategy-table__toolbar">
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
            leftIcon={<Icon name="play" size={14} />}
            text={t("table.batch.enable")}
            disabled={!selectedRowKeys.length}
            onClick={() => batch("enable")}
          />
          <Button
            leftIcon={<Icon name="pause" size={14} />}
            text={t("table.batch.disable")}
            disabled={!selectedRowKeys.length}
            onClick={() => batch("disable")}
          />
          <IconButton
            iconName={<Icon name="refresh-cw" size={14} />}
            tipText={t("table.refresh")}
            onClick={() => toast.success(t("table.refresh"))}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataset={dataSource}
        keyIndex={0}
        emptyTableMsg={t("table.empty")}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={8}
        pageSizeOptions={[8, 16, 24]}
        enableRowExpand
        onRowExpend={(row) => {
          const r = fullRow(row);
          return (
            <div className="strategy-table__expand">
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.threshold")}</span>
                <span className="strategy-table__expand-v">{r.threshold}%</span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.retry")}</span>
                <span className="strategy-table__expand-v">
                  {r.retry} {t("form.retry.unit")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.notify")}</span>
                <span className="strategy-table__expand-v">
                  {r.notify
                    ? r.notify
                        .map((n) => translator(notifyOptions.find((o) => o.value === n).labelId))
                        .join(" / ")
                    : ""}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.flap")}</span>
                <span className="strategy-table__expand-v">
                  {r.flap ? t("table.expand.on") : t("table.expand.off")}
                </span>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
}
