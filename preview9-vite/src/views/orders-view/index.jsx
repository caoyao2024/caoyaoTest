import { useState } from "react";
import { IconPlusIcPublicEllipsis, IconPlusIcPublicEye, IconPlusIcPublicMoneyCircle, IconPlusIcPublicPlus, IconPlusIcPublicProhibitCircle, IconPlusIcPublicSearch } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { ORDER_STATUS, CUSTOMERS, SCENES } from "../../mock/packages.js";
import "./index.css";

function mbps(bandwidth) {
  if (!bandwidth) return 0;
  return bandwidth.endsWith("G") ? parseFloat(bandwidth) * 1000 : parseFloat(bandwidth);
}

export default function OrdersView() {
  const { orders, setPrefill, setActiveTab } = useApp();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(undefined);
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const data = orders.filter((o) => {
    const kw = keyword ? `${o.orderNo}${o.customer}`.toLowerCase().includes(keyword.toLowerCase()) : true;
    const st = status ? o.status === status : true;
    return kw && st;
  });

  const cloneAsDraft = (row) => {
    setPrefill({
      customer: CUSTOMERS.find((c) => c.label === row.customer)?.value,
      scene: SCENES.find((s) => s.label === row.scene)?.value,
      bandwidth: row.bandwidth,
      count: Math.max(1, Math.min(row.stations || 1, 50)),
      cycle: "包月",
      priority: "mid",
    });
    setActiveTab("config");
    notify("success", `已将工单 ${row.orderNo} 复制为开通草稿`);
  };

  const columns = [
    {
      title: "工单号",
      key: "orderNo",
      width: 168,
      allowSort: false,
      render: (v, _r, _o, row) => (
        <a className="cell-link" onClick={() => cloneAsDraft(row?.rawData)}>{v}</a>
      ),
    },
    { title: "客户名称", key: "customer", width: 200, ellipsis: true, allowSort: false },
    { title: "业务场景", key: "scene", width: 150, allowSort: false },
    { title: "带宽", key: "bandwidth", width: 96, allowSort: true },
    { title: "站点数", key: "stations", width: 92, align: "right", allowSort: true },
    { title: "合同金额 (元/月)", key: "amount", width: 150, align: "right", allowSort: true, render: (v) => v.toLocaleString() },
    {
      title: "状态",
      key: "status",
      width: 110,
      allowSort: false,
      render: (v) => <StatusTag value={v} map={ORDER_STATUS} />,
    },
    { title: "提交时间", key: "createdAt", width: 150, allowSort: true },
    { title: "预计完成", key: "eta", width: 120, allowSort: false },
    {
      title: "操作",
      key: "action",
      width: 132,
      align: "left",
      allowSort: false,
      render: (_v, _r, _o, row) => {
        const r = row?.rawData;
        return (
          <div className="row-actions">
            <a className="cell-link" onClick={() => cloneAsDraft(r)}>复制再开通</a>
            <TipBox
              trigger="click"
              direction="bottomRight"
              isMouseLeaveClose
              content={
                <div className="app-dropdown-menu">
                  <div className="app-dropdown-item">
                    <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> 查看详情
                  </div>
                  <div className="app-dropdown-item">
                    <IconPlusIcPublicMoneyCircle iconSize="0.875rem" iconColor={['currentcolor']} /> 费用明细
                  </div>
                  <div className="app-dropdown-item" style={{ color: "var(--error)" }}>
                    <IconPlusIcPublicProhibitCircle iconSize="0.875rem" iconColor={['currentcolor']} /> 申请退订
                  </div>
                </div>
              }
            >
              <span className="row-more"><IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} title="更多操作" /></span>
            </TipBox>
          </div>
        );
      },
    },
  ];

  return (
    <div className="orders-view">
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}

      <div className="orders-toolbar">
        <div className="orders-toolbar-left">
          <TextField
            style={{ width: "16rem" }}
            placeholder="搜索工单号或客户名称"
            value={keyword}
            onChange={(v) => { setKeyword(v); setNotice(null); }}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
          />
          <Select
            enableClear
            style={{ width: "10rem" }}
            defaultLabel="全部状态"
            options={Object.keys(ORDER_STATUS).map((k) => ({ value: k, text: ORDER_STATUS[k].text }))}
            value={status}
            onChange={(v) => { setStatus(v); setNotice(null); }}
          />
        </div>
        <Button status="primary" text="新建开通" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={() => { setPrefill(null); setActiveTab("config"); }} />
      </div>

      <Table
        columns={columns}
        dataset={data}
        enablePagination
        enableAutoPaging
        pageSize={8}
      />
    </div>
  );
}
