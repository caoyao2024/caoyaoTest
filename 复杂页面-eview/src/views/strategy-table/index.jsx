import { useMemo, useState } from "react";
import { IconPlusIcPublicCopy, IconPlusIcPublicPause, IconPlusIcPublicPlay, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import SelectCard from "@nce/eview-react/SelectCard";
import Table from "@nce/eview-react/Table";
import IconButton from "@nce/eview-react/IconButton";
import { useIntl } from "react-intl";
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

export default function StrategyTable({ onEdit, notify }) {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [view, setView] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [checkedIndexes, setCheckedIndexes] = useState([]);

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

  const optionDict = {};
  deviceTypeOptions.concat(levelOptions, notifyOptions).forEach((o) => {
    optionDict[o.labelId] = intl.formatMessage({ id: o.labelId, defaultMessage: o.labelId });
  });

  const translator = (id) => intl.formatMessage({ id, defaultMessage: id });

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
      render: (cell, rowData, options, row) => (
        <Button
          status="text"
          className="strategy-table__link"
          text={displayName(row?.rawData, lang)}
          onClick={() => onEdit(row?.rawData)}
        />
      ),
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
      render: (cell, rowData, options, row) => displayOwner(row?.rawData, lang),
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
        const r = row?.rawData;
        return (
          <div className="strategy-table__ops">
            <IconButton
              iconName={<IconPlusIcPublicTransverseRectangleTemplate iconSize={14} iconColor={['currentcolor']} />}
              tipText={t("table.action.edit")}
              size="small"
              onClick={() => onEdit(r)}
            />
            <IconButton
              iconName={<IconPlusIcPublicCopy iconSize={14} iconColor={['currentcolor']} />}
              tipText={t("table.action.copy")}
              size="small"
              onClick={() => notify("success", t("toast.copied"))}
            />
            <IconButton
              iconName={r?.status === "enabled" ? <IconPlusIcPublicPause iconSize={14} iconColor={['currentcolor']} /> : <IconPlusIcPublicPlay iconSize={14} iconColor={['currentcolor']} />}
              tipText={r?.status === "enabled" ? t("table.action.disable") : t("table.action.enable")}
              size="small"
              onClick={() =>
                notify(
                  "success",
                  r?.status === "enabled"
                    ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                    : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
                )
              }
            />
            <IconButton
              iconName={<IconPlusIcPublicTrash iconSize={14} iconColor={['currentcolor']} />}
              tipText={t("table.action.delete")}
              size="small"
              onClick={() => notify("success", t("toast.deleted"))}
            />
          </div>
        );
      },
    },
  ];

  const batch = (action) => {
    if (!checkedIndexes.length) {
      notify("warn", t("toast.selectFirst"));
      return;
    }
    notify(
      "success",
      intl.formatMessage(
        { id: action === "enable" ? "toast.enabled" : "toast.disabled" },
        { count: checkedIndexes.length }
      )
    );
    setCheckedIndexes([]);
  };

  return (
    <section className="panel-card strategy-table">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />
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
          type="small"
          value={view}
          onChange={(value) => setView(value)}
          data={[
            { text: t("table.filter.all"), value: "all" },
            { text: t("table.filter.enabled"), value: "enabled" },
            { text: t("table.filter.disabled"), value: "disabled" },
          ]}
        />
      </header>

      <div className="strategy-table__toolbar">
        <SearchInput
          className="strategy-table__search"
          placeholder={t("table.search.ph")}
          value={keyword}
          onChange={(value) => setKeyword(value)}
          onClear={() => setKeyword("")}
        />
        <span className="strategy-table__count">
          {checkedIndexes.length
            ? intl.formatMessage({ id: "table.selected" }, { count: checkedIndexes.length })
            : `${dataSource.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            leftIcon={<IconPlusIcPublicPlay iconSize={14} iconColor={['currentcolor']} />}
            text={t("table.batch.enable")}
            disabled={!checkedIndexes.length}
            onClick={() => batch("enable")}
          />
          <Button
            leftIcon={<IconPlusIcPublicPause iconSize={14} iconColor={['currentcolor']} />}
            text={t("table.batch.disable")}
            disabled={!checkedIndexes.length}
            onClick={() => batch("disable")}
          />
          <IconButton
            iconName={<IconPlusIcPublicRefreshClockwise iconSize={14} iconColor={['currentcolor']} />}
            tipText={t("table.refresh")}
            size="small"
            onClick={() => notify("success", t("table.refresh"))}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataset={dataSource}
        emptyTableMsg={t("table.empty")}
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[8, 16, 24]}
        enableRowExpand
        onRowExpend={(row) => {
          const r = row?.rawData;
          return (
            <div className="strategy-table__expand">
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.threshold")}</span>
                <span className="strategy-table__expand-v">{r?.threshold}%</span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.retry")}</span>
                <span className="strategy-table__expand-v">
                  {r?.retry} {t("form.retry.unit")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.notify")}</span>
                <span className="strategy-table__expand-v">
                  {r?.notify
                    ?.map((n) => translator(notifyOptions.find((o) => o.value === n).labelId))
                    .join(" / ")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.flap")}</span>
                <span className="strategy-table__expand-v">
                  {r?.flap ? t("table.expand.on") : t("table.expand.off")}
                </span>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
}
