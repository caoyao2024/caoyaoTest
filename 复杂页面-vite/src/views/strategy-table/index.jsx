import { useMemo, useState, useRef } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import SelectCard from "@nce/eview-react/SelectCard";
import Table from "@nce/eview-react/Table";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import SearchInput from "@nce/eview-react/SearchInput";
import {
  IconPlusIcPublicSearch,
  IconPlusIcPublicCopy,
  IconPlusIcPublicTrash,
  IconPlusIcPublicPlay,
  IconPlusIcPublicPause,
  IconPlusIcPublicRefreshClockwise,
  IconPlusIcPublicTransverseRectangleTemplate,
} from "@nce/icon-plus";
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

// Layer 4: 策略清单表格 — SelectCard 视图筛选 + 搜索 + 行选择批量操作
// DivMessage 替代 antd message.success/warning（无命令式 API，用 display state + key 重挂）
export default function StrategyTable({ onEdit }) {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [view, setView] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const tableRef = useRef(null);
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

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
      render: (cell, _rowData, _opts, row) => {
        const r = row?.rawData || {};
        return (
          <Button
            status="text"
            text={displayName(r, lang)}
            onClick={() => onEdit(r)}
          />
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
      render: (_cell, _rowData, _opts, row) => displayOwner(row?.rawData || {}, lang),
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
      render: (_cell, _rowData, _opts, row) => {
        const r = row?.rawData || {};
        return (
          <div className="strategy-table__ops">
            <TipBox content={t("table.action.edit")} direction="top">
              <IconButton
                iconName={<IconPlusIcPublicTransverseRectangleTemplate iconSize={13} iconColor={["currentcolor"]} />}
                tipText={t("table.action.edit")}
                size="small"
                onClick={() => onEdit(r)}
              />
            </TipBox>
            <TipBox content={t("table.action.copy")} direction="top">
              <IconButton
                iconName={<IconPlusIcPublicCopy iconSize={13} iconColor={["currentcolor"]} />}
                tipText={t("table.action.copy")}
                size="small"
                onClick={() => notify("success", t("toast.copied"))}
              />
            </TipBox>
            <TipBox
              content={r.status === "enabled" ? t("table.action.disable") : t("table.action.enable")}
              direction="top"
            >
              <IconButton
                iconName={
                  r.status === "enabled" ? (
                    <IconPlusIcPublicPause iconSize={13} iconColor={["currentcolor"]} />
                  ) : (
                    <IconPlusIcPublicPlay iconSize={13} iconColor={["currentcolor"]} />
                  )
                }
                tipText={
                  r.status === "enabled"
                    ? t("table.action.disable")
                    : t("table.action.enable")
                }
                size="small"
                onClick={() =>
                  notify(
                    "success",
                    r.status === "enabled"
                      ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                      : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
                  )
                }
              />
            </TipBox>
            <TipBox content={t("table.action.delete")} direction="top">
              <IconButton
                iconName={<IconPlusIcPublicTrash iconSize={13} iconColor={["currentcolor"]} />}
                tipText={t("table.action.delete")}
                size="small"
                onClick={() => notify("success", t("toast.deleted"))}
              />
            </TipBox>
          </div>
        );
      },
    },
    // 隐藏列：保证 row.rawData 含展开行需要的字段（Table 文档：rawData 不保证含未在列定义 key 的字段）
    { title: "", key: "nameEn", display: false },
    { title: "", key: "ownerEn", display: false },
    { title: "", key: "threshold", display: false },
    { title: "", key: "retry", display: false },
    { title: "", key: "notify", display: false },
    { title: "", key: "flap", display: false },
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
            <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} />
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
          data={[
            { text: t("table.filter.all"), value: "all" },
            { text: t("table.filter.enabled"), value: "enabled" },
            { text: t("table.filter.disabled"), value: "disabled" },
          ]}
          value={view}
          onChange={(value) => setView(value)}
        />
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
            text={t("table.batch.enable")}
            leftIcon={<IconPlusIcPublicPlay iconSize={14} iconColor={["currentcolor"]} />}
            disabled={!checkedIndexes.length}
            onClick={() => batch("enable")}
          />
          <Button
            text={t("table.batch.disable")}
            leftIcon={<IconPlusIcPublicPause iconSize={14} iconColor={["currentcolor"]} />}
            disabled={!checkedIndexes.length}
            onClick={() => batch("disable")}
          />
          <TipBox content={t("table.refresh")} direction="top">
            <IconButton
              iconName={<IconPlusIcPublicRefreshClockwise iconSize={14} iconColor={["currentcolor"]} />}
              tipText={t("table.refresh")}
              onClick={() => notify("success", t("table.refresh"))}
            />
          </TipBox>
        </div>
      </div>

      <Table
        ref={tableRef}
        columns={columns}
        dataset={dataSource}
        emptyTableMsg={t("table.empty")}
        enableCheckBox
        checkedRows={checkedIndexes}
        onRowCheck={(_row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pagingProps={{
          pageSize: 8,
          pageSizeOptions: [8, 16, 24],
        }}
        enableRowExpand
        onRowExpend={(row) => {
          const r = row?.rawData || {};
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
                  {(r.notify || [])
                    .map((n) => translator(notifyOptions.find((o) => o.value === n).labelId))
                    .join(" / ")}
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
