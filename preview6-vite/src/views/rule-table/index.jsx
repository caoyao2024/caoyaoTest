// Layer 4: 采集规则列表（表格 + 检索/筛选/批量操作）
import { useState, useMemo } from "react";
import { IconPlusIcIctTopoEdit, IconPlusIcPublicBellClock, IconPlusIcPublicPauseCircle, IconPlusIcPublicPlay, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import SoftTag from "../../components/soft-tag/index.jsx";
import { dataSourceOptions, sourceLabel } from "../../mock/rules.js";
import "./index.css";

const STATUS_TONE = { running: "success", stopped: "neutral", error: "error" };
const STATUS_LABEL = { running: "运行中", stopped: "已停用", error: "异常" };

export default function RuleTable({ data }) {
  const [keyword, setKeyword] = useState("");
  const [sourceFilter, setSourceFilter] = useState(undefined);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [refreshAt, setRefreshAt] = useState("");

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return data.filter((row) => {
      const hitKw =
        !kw ||
        row.name.toLowerCase().includes(kw) ||
        row.id.toLowerCase().includes(kw);
      const hitSource = !sourceFilter || row.source === sourceFilter;
      return hitKw && hitSource;
    });
  }, [data, keyword, sourceFilter]);

  const clearSelection = () => setSelectedIndexes([]);

  const columns = [
    {
      title: "规则名称",
      key: "name",
      width: 200,
      render: (text) => (
        <a href="#rule" className="rt-link" onClick={(e) => e.preventDefault()}>
          {text}
        </a>
      ),
    },
    {
      title: "规则 ID",
      key: "id",
      width: 120,
      render: (value) => <span className="rt-plain rt-plain--muted">{value}</span>,
    },
    {
      title: "数据源",
      key: "source",
      width: 140,
      render: (value) => <span className="rt-plain">{sourceLabel(value)}</span>,
    },
    {
      title: "采集频率",
      key: "frequencyLabel",
      width: 100,
      render: (value) => <span className="rt-plain">{value}</span>,
    },
    {
      title: "点位",
      key: "points",
      width: 90,
      align: "right",
      render: (value) => <span className="rt-num">{value}</span>,
    },
    {
      title: "状态",
      key: "status",
      width: 110,
      render: (value) => <SoftTag tone={STATUS_TONE[value]}>{STATUS_LABEL[value]}</SoftTag>,
    },
    {
      title: "告警",
      key: "alarm",
      width: 110,
      render: (value) =>
        value === "on" ? (
          <SoftTag tone="brand" icon={<IconPlusIcPublicBellClock iconSize="0.75rem" iconColor={['currentcolor']} />}>
            已开启
          </SoftTag>
        ) : (
          <SoftTag tone="neutral">未开启</SoftTag>
        ),
    },
    {
      title: "更新时间",
      key: "updatedAt",
      width: 160,
      render: (value) => <span className="rt-plain rt-plain--muted">{value}</span>,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "left",
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const record = row?.rawData;
        return (
          <div className="rt-actions">
            <IconPlusIcIctTopoEdit title="编辑规则" iconSize="0.875rem" iconColor={['currentcolor']} style={{ cursor: 'pointer' }} />
            {record?.status === "running" ? (
              <IconPlusIcPublicPauseCircle title="停用规则" iconSize="0.875rem" iconColor={['currentcolor']} style={{ cursor: 'pointer' }} />
            ) : (
              <IconPlusIcPublicPlay title="启用规则" iconSize="0.875rem" iconColor={['currentcolor']} style={{ cursor: 'pointer' }} />
            )}
            <IconPlusIcPublicTrash title="删除规则" iconSize="0.875rem" iconColor={['currentcolor']} style={{ cursor: 'pointer' }} />
          </div>
        );
      },
    },
  ];

  return (
    <section className="rt-card">
      <header className="rt-toolbar">
        <div className="rt-toolbar__title">
          <h2 className="rt-card__title">已配置规则</h2>
          <span className="rt-count">共 {filtered.length} 条</span>
        </div>

        <div className="rt-toolbar__tools">
          {selectedIndexes.length > 0 && (
            <div className="rt-selection">
              <span>已选 {selectedIndexes.length} 项</span>
              <a href="#batch" onClick={(e) => e.preventDefault()}>
                批量停用
              </a>
              <a href="#clear" onClick={(e) => { e.preventDefault(); clearSelection(); }}>
                取消选择
              </a>
            </div>
          )}
          <TextField
            className="rt-search"
            placeholder="搜索规则名称或 ID"
            value={keyword}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
            onChange={(value) => setKeyword(value)}
          />
          <Select
            selectClassName="rt-filter"
            enableClear
            defaultLabel="数据源"
            selectStyle={{ width: "10rem" }}
            value={sourceFilter}
            options={dataSourceOptions}
            onChange={(value) => setSourceFilter(value)}
          />
          <IconPlusIcPublicRefreshClockwise
            title={refreshAt ? `最近刷新 ${refreshAt}` : "刷新列表"}
            iconSize="0.875rem"
            iconColor={['currentcolor']}
            onClick={() => setRefreshAt("刚刚")}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </header>

      <Table
        columns={columns}
        dataset={filtered}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedIndexes}
        onRowCheck={(_row, checkedRows) => setSelectedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={8}
      />
    </section>
  );
}
