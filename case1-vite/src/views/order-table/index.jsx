// Layer 4: ⑤⑥ 主表格 + 工具栏 + 批量操作栏 + 分页
// 排序外部受控（跨页全局排序），选择/分页状态由容器 order-console 持有
import { useMemo, useState } from "react";
import { IconPlusIcCarShipping, IconPlusIcPublicCheckmark, IconPlusIcPublicCloseCircle, IconPlusIcPublicDownload, IconPlusIcPublicEllipsis, IconPlusIcPublicEye, IconPlusIcPublicLists, IconPlusIcPublicLocation, IconPlusIcPublicNotes, IconPlusIcPublicPrinter, IconPlusIcPublicRefreshClockwise } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Checkbox from "@nce/eview-react/Checkbox";
import Dropdown from "@/shared/Dropdown";
import Dialog from "@nce/eview-react/Dialog";
import MessageDialog from "@nce/eview-react/MessageDialog";
import Table from "@nce/eview-react/Table";
import TipBox from "@nce/eview-react/TipBox";
import TextField from "@/shared/TextField";
import TextArea from "@/shared/TextArea";
import { useNotice } from "@/shared/Notice";
import { CATEGORY_STYLE, fmtMoney, maskPhone } from "../../mock/order.jsx";
import { OrderStatusTag } from "../../components/status-tag/index.jsx";
// 表单骨架 .fm 定义于 order-console/index.css（页面级共享）
import "./index.css";

// 跨页排序比较器
const COMPARE = {
  orderNo: (a, b) => a.orderNo.localeCompare(b.orderNo),
  receiver: (a, b) => a.receiver.localeCompare(b.receiver, "zh"),
  paidAmount: (a, b) => a.paidAmount - b.paidAmount,
  payMethod: (a, b) => a.payMethod.localeCompare(b.payMethod, "zh"),
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
};

const canShip = (o) => o.status === "pendingShipment";
const canCancel = (o) => o.status === "pendingPayment" || o.status === "pendingShipment";

// 可隐藏的数据列（订单号 / 实付金额 / 订单状态 / 操作 始终保留）
const OPTIONAL_COLS = [
  { key: "items", label: "商品摘要" },
  { key: "receiver", label: "客户" },
  { key: "payMethod", label: "支付方式" },
  { key: "logistics", label: "物流状态" },
  { key: "createdAt", label: "下单时间" },
];

export default function OrderTable({
  data,
  page,
  pageSize,
  sorter,
  selectedRowKeys,
  onPageChange,
  onSorterChange,
  onSelectionChange,
  onShipOrders,
  onCancelOrders,
  onViewOrder,
  onOpenLogistics,
  onExportOrder,
  onUpdateAddress,
  onUpdateRemark,
}) {
  const [notify, noticeEl] = useNotice();
  // 修改地址弹窗（H5 表单骨架）
  const [addressTarget, setAddressTarget] = useState(null);
  const [addressForm, setAddressForm] = useState({ receiver: "", phone: "", address: "" });
  const [addressErrors, setAddressErrors] = useState({});
  // 备注弹窗
  const [remarkTarget, setRemarkTarget] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  // 工具栏：列显隐 + 刷新 loading
  const [hiddenCols, setHiddenCols] = useState([]);
  const [loading, setLoading] = useState(false);
  // 确认弹窗
  const [confirmState, setConfirmState] = useState(null);

  const selectedOrders = useMemo(
    () => data.filter((o) => selectedRowKeys.includes(o.orderNo)),
    [data, selectedRowKeys]
  );

  // 全局排序
  const sortedData = useMemo(() => {
    const arr = [...data];
    if (sorter && sorter.order && COMPARE[sorter.field]) {
      const cmp = COMPARE[sorter.field];
      arr.sort((a, b) => (sorter.order === "ascend" ? cmp(a, b) : -cmp(a, b)));
    }
    return arr;
  }, [data, sorter]);

  const pageData = useMemo(
    () => sortedData.slice((page - 1) * pageSize, page * pageSize),
    [sortedData, page, pageSize]
  );

  const so = (field) => (sorter && sorter.field === field ? sorter.order : undefined);

  // eview-react Table 行数据需要对象数组，key 与 columns[].key 对应
  const dataset = useMemo(
    () => pageData.map((o) => ({ ...o })),
    [pageData]
  );

  // selectedRowKeys（orderNo 字符串数组）→ eview 行序号数组
  const checkedRows = useMemo(
    () =>
      selectedRowKeys
        .map((key) => dataset.findIndex((o) => o.orderNo === key))
        .filter((i) => i >= 0),
    [selectedRowKeys, dataset]
  );

  // ---- 工具栏 ----
  const toggleCol = (key) => {
    setHiddenCols((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const columnMenu = {
    items: OPTIONAL_COLS.map((c) => ({
      key: c.key,
      label: (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={!hiddenCols.includes(c.key)}
            onChange={() => toggleCol(c.key)}
          >
            {c.label}
          </Checkbox>
        </div>
      ),
    })),
    onClick: ({ key }) => toggleCol(key),
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      notify("success", `列表已刷新，当前共 ${sortedData.length} 单`);
    }, 600);
  };

  const handleExportList = () => {
    notify("success", `已导出 ${sortedData.length} 条订单明细（Excel）`);
  };

  // ---- 行内操作 ----
  const confirmShipOne = (r) => {
    setConfirmState({
      type: "confirm",
      content: `确认发货订单 ${r.orderNo}？`,
      detail: `收货人 ${r.receiver}，实付 ¥${fmtMoney(r.paidAmount)}。发货后订单进入「已发货」状态。`,
      okText: "确认发货",
      onOk: () => {
        onShipOrders([r.orderNo]);
        notify("success", `订单 ${r.orderNo} 已发货，物流单已生成`);
      },
    });
  };

  const confirmCancelOne = (r) => {
    if (!canCancel(r)) {
      notify("warn", "当前订单状态不可取消");
      return;
    }
    setConfirmState({
      type: "risk",
      content: `确认取消订单 ${r.orderNo}？`,
      detail: "取消后订单将关闭，占用库存自动回滚，已付款项原路退回。",
      okText: "确认取消",
      onOk: () => {
        onCancelOrders([r.orderNo]);
        notify("success", `订单 ${r.orderNo} 已取消`);
      },
    });
  };

  const openAddress = (r) => {
    setAddressTarget(r);
    setAddressForm({ receiver: r.receiver, phone: r.phone, address: r.address });
    setAddressErrors({});
  };

  const saveAddress = () => {
    const errs = {};
    if (!addressForm.receiver.trim()) errs.receiver = "请输入收货人姓名";
    if (!/^1[3-9]\d{9}$/.test(addressForm.phone.trim())) errs.phone = "请输入 11 位有效手机号";
    if (!addressForm.address.trim()) errs.address = "请输入详细收货地址";
    setAddressErrors(errs);
    if (Object.keys(errs).length) return;
    onUpdateAddress(addressTarget.orderNo, {
      receiver: addressForm.receiver.trim(),
      phone: addressForm.phone.trim(),
      address: addressForm.address.trim(),
    });
    notify("success", `订单 ${addressTarget.orderNo} 收货地址已更新`);
    setAddressTarget(null);
  };

  const openRemark = (r) => {
    setRemarkTarget(r);
    setRemarkText(r.remark || "");
  };

  const saveRemark = () => {
    onUpdateRemark(remarkTarget.orderNo, remarkText.trim());
    notify("success", `订单 ${remarkTarget.orderNo} 备注已保存`);
    setRemarkTarget(null);
  };

  const handleMenu = (key, r) => {
    if (key === "detail") onViewOrder(r.orderNo);
    if (key === "logistics") onOpenLogistics(r);
    if (key === "address") openAddress(r);
    if (key === "cancel") confirmCancelOne(r);
    if (key === "export") onExportOrder(r.orderNo);
  };

  const renderOps = (r) => (
    <div className="ot-ops">
      <IconPlusIcCarShipping
        iconSize="0.875rem"
        iconColor={['currentcolor']}
        className={canShip(r) ? "ot-op" : "ot-op ot-op-disabled"}
        title={canShip(r) ? "发货" : "仅待发货订单可发货"}
        onClick={canShip(r) ? () => confirmShipOne(r) : undefined}
      />
      <IconPlusIcPublicNotes
        iconSize="0.875rem"
        iconColor={['currentcolor']}
        className="ot-op"
        title="备注"
        onClick={() => openRemark(r)}
      />
      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            { key: "detail", icon: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} />, label: "查看详情" },
            { key: "logistics", icon: <IconPlusIcCarShipping iconSize="0.875rem" iconColor={['currentcolor']} />, label: "物流轨迹" },
            { key: "address", icon: <IconPlusIcPublicLocation iconSize="0.875rem" iconColor={['currentcolor']} />, label: "修改地址" },
            { key: "cancel", icon: <IconPlusIcPublicCloseCircle iconSize="0.875rem" iconColor={['currentcolor']} />, label: "取消订单" },
            { type: "divider" },
            { key: "export", icon: <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />, label: "导出该单" },
          ],
          onClick: ({ key }) => handleMenu(key, r),
        }}
      >
        <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} className="ot-op" />
      </Dropdown>
    </div>
  );

  const columns = [
    {
      title: "订单号",
      key: "orderNo",
      width: 180,
      allowSort: true,
      sort: so("orderNo") === "ascend" ? "asc" : so("orderNo") === "descend" ? "desc" : "origin",
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <span className="ot-no">
            <a className="ot-link" onClick={() => onViewOrder(r?.orderNo)}>
              {v}
            </a>
            {r?.remark && (
              <IconPlusIcPublicNotes
                iconSize="0.75rem"
                iconColor={['currentcolor']}
                className="ot-flag"
                title={`备注：${r.remark}`}
              />
            )}
          </span>
        );
      },
    },
    {
      title: "商品摘要",
      key: "items",
      width: 268,
      allowSort: false,
      render: (items, _rowData, _options, row) => {
        const r = row?.rawData;
        const arr = r?.items || items || [];
        const first = arr[0];
        if (!first) return null;
        const cat = CATEGORY_STYLE[first.cat];
        const totalQty = arr.reduce((s, x) => s + x.qty, 0);
        const pop = (
          <div className="ot-pop">
            {arr.map((x) => (
              <div className="ot-pop-row" key={x.name}>
                <span className="ot-pop-name">
                  {x.name}（{x.spec}）
                </span>
                <span className="ot-pop-num">
                  ×{x.qty}　¥{fmtMoney(x.price * x.qty)}
                </span>
              </div>
            ))}
            <div className="ot-pop-total">
              共 {totalQty} 件商品 · 实付 ¥{fmtMoney(r?.paidAmount ?? 0)}
            </div>
          </div>
        );
        return (
          <TipBox type="simple" content={pop} direction="topLeft">
            <div className="ot-goods">
              <span className="ot-thumb" style={{ background: cat.bg, color: cat.text }}>
                {cat.icon}
              </span>
              <span className="ot-goods-info">
                <span className="ot-goods-name">{first.name}</span>
                <span className="ot-goods-sub">
                  ×{first.qty}
                  {arr.length > 1 ? ` 等 ${arr.length} 种共 ${totalQty} 件` : ` · ${first.spec}`}
                </span>
              </span>
            </div>
          </TipBox>
        );
      },
    },
    {
      title: "客户",
      key: "receiver",
      width: 128,
      allowSort: true,
      sort: so("receiver") === "ascend" ? "asc" : so("receiver") === "descend" ? "desc" : "origin",
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <div className="ot-cust">
            <span className="ot-cust-name">{v}</span>
            <span className="ot-cust-phone">{maskPhone(r?.phone)}</span>
          </div>
        );
      },
    },
    {
      title: "实付金额",
      key: "paidAmount",
      width: 112,
      align: "right",
      allowSort: true,
      sort: so("paidAmount") === "ascend" ? "asc" : so("paidAmount") === "descend" ? "desc" : "origin",
      render: (v) => <span className="ot-amount">¥{fmtMoney(v)}</span>,
    },
    {
      title: "支付方式",
      key: "payMethod",
      width: 100,
      allowSort: true,
      sort: so("payMethod") === "ascend" ? "asc" : so("payMethod") === "descend" ? "desc" : "origin",
    },
    {
      title: "物流状态",
      key: "logistics",
      width: 96,
      allowSort: false,
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <a
            className={v === "异常" ? "ot-logi-link ot-logi-error" : "ot-logi-link"}
            onClick={() => onOpenLogistics(r)}
            title="查看物流轨迹"
          >
            {v}
          </a>
        );
      },
    },
    {
      title: "订单状态",
      key: "status",
      width: 112,
      allowSort: false,
      render: (s, _rowData, _options, row) => {
        const r = row?.rawData;
        return <OrderStatusTag status={s} timeout={r?.shippingTimeout} />;
      },
    },
    {
      title: "下单时间",
      key: "createdAt",
      width: 150,
      allowSort: true,
      sort: so("createdAt") === "ascend" ? "asc" : so("createdAt") === "descend" ? "desc" : "origin",
      render: (v) => <span className="ot-time">{v}</span>,
    },
    {
      title: "操作",
      key: "ops",
      width: 132,
      allowSort: false,
      render: (_v, _rowData, _options, row) => {
        const r = row?.rawData;
        return renderOps(r);
      },
    },
  ].filter((c) => !hiddenCols.includes(c.key));

  // ---- 批量操作 ----
  const handleBatchShip = () => {
    const shippable = selectedOrders.filter(canShip);
    if (!shippable.length) {
      notify("warn", "选中订单中没有「待发货」订单，无法批量发货");
      return;
    }
    setConfirmState({
      type: "confirm",
      content: `确认批量发货 ${shippable.length} 个订单？`,
      detail: "发货后订单状态变更为「已发货」，物流单号将同步推送至买家。",
      okText: "确认发货",
      onOk: () => {
        onShipOrders(shippable.map((o) => o.orderNo));
        notify("success", `已批量发货 ${shippable.length} 单，物流单已生成`);
        onSelectionChange([]);
      },
    });
  };

  const handleBatchCancel = () => {
    const cancellable = selectedOrders.filter(canCancel);
    if (!cancellable.length) {
      notify("warn", "选中订单中没有可取消的订单（仅待付款/待发货可取消）");
      return;
    }
    const skipped = selectedOrders.length - cancellable.length;
    setConfirmState({
      type: "risk",
      content: `确认批量取消 ${cancellable.length} 个订单？`,
      detail: `取消后订单将关闭、库存回滚、款项原路退回。${
        skipped ? `另有 ${skipped} 单当前状态不可取消，将自动跳过。` : ""
      }`,
      okText: "确认取消",
      onOk: () => {
        onCancelOrders(cancellable.map((o) => o.orderNo));
        notify("success", `已批量取消 ${cancellable.length} 单${skipped ? `，跳过 ${skipped} 单` : ""}`);
        onSelectionChange([]);
      },
    });
  };

  const handleBatchPrint = () => {
    notify("success", `已将 ${selectedOrders.length} 个订单加入打印队列`);
    onSelectionChange([]);
  };

  return (
    <div className="order-table">
      {noticeEl}
      <div className="ot-toolbar">
        <span className="ot-result">
          共 <b>{sortedData.length}</b> 单
          {selectedRowKeys.length > 0 && (
            <span className="ot-result-sel"> · 已选 {selectedRowKeys.length} 单</span>
          )}
        </span>
        <div className="ot-tools">
          <IconPlusIcPublicRefreshClockwise
            iconSize="0.875rem"
            iconColor={['currentcolor']}
            className={loading ? "ot-tool ot-tool-spin" : "ot-tool"}
            title="刷新列表"
            onClick={handleRefresh}
          />
          <Dropdown menu={columnMenu} trigger={["click"]}>
            <IconPlusIcPublicLists iconSize="0.875rem" iconColor={['currentcolor']} className="ot-tool" title="列显示设置" />
          </Dropdown>
          <Button
            leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />}
            text="导出"
            onClick={handleExportList}
          />
        </div>
      </div>
      {selectedOrders.length > 0 && (
        <div className="ot-batch">
          <div className="ot-batch-left">
            <IconPlusIcPublicCheckmark iconSize="1rem" iconColor={['currentcolor']} />
            <span>
              已选 <b className="ot-batch-n">{selectedOrders.length}</b> 单
            </span>
            <a className="ot-batch-clear" onClick={() => onSelectionChange([])}>
              取消选择
            </a>
          </div>
          <div className="ot-batch-actions">
            <Button
              status="primary"
              leftIcon={<IconPlusIcCarShipping iconSize="0.875rem" iconColor={['currentcolor']} />}
              text="批量发货"
              onClick={handleBatchShip}
            />
            <Button
              leftIcon={<IconPlusIcPublicPrinter iconSize="0.875rem" iconColor={['currentcolor']} />}
              text="批量打印"
              onClick={handleBatchPrint}
            />
            <Button
              status="risk"
              leftIcon={<IconPlusIcPublicCloseCircle iconSize="0.875rem" iconColor={['currentcolor']} />}
              text="批量取消"
              onClick={handleBatchCancel}
            />
          </div>
        </div>
      )}
      <Table
        className="ot-table"
        width="unset"
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        enableLoading={loading}
        columns={columns}
        dataset={dataset}
        emptyTableMsg="暂无订单"
        enableCheckBox
        checkType="multi"
        preserveCheckedRows
        checkedRows={checkedRows}
        onRowCheck={(_row, checkedRowsArr) => {
          const newSelected = checkedRowsArr
            .map((i) => dataset[i]?.orderNo)
            .filter(Boolean);
          onSelectionChange(newSelected);
        }}
        onHeaderCheck={(checkedRowsArr) => {
          const newSelected = checkedRowsArr
            .map((i) => dataset[i]?.orderNo)
            .filter(Boolean);
          onSelectionChange(newSelected);
        }}
        enablePagination
        enableAutoPaging={false}
        recordCount={sortedData.length}
        pagingProps={{
          currentPage: page,
          pageSize,
          pageSizeOptions: [10, 20, 50],
          onPageSizeChange: (size) => onPageChange(1, size),
        }}
        onPageChange={(currentPage) => onPageChange(currentPage, pageSize)}
        disableEviewSort
        onColumnSort={(sortColumn, sortType) => {
          if (!sortColumn || sortType === "origin") {
            onSorterChange({});
          } else {
            onSorterChange({
              field: sortColumn,
              order: sortType === "asc" ? "ascend" : "descend",
            });
          }
        }}
      />

      {/* 确认弹窗 */}
      <MessageDialog
        type={confirmState?.type || "confirm"}
        isOpen={!!confirmState}
        content={confirmState?.content}
        detail={confirmState?.detail}
        onClose={() => setConfirmState(null)}
        buttons={{
          cancel: { text: "再想想", onClick: () => setConfirmState(null) },
          ok: {
            text: confirmState?.okText || "确认",
            focused: true,
            onClick: () => {
              if (confirmState?.onOk) confirmState.onOk();
              setConfirmState(null);
            },
          },
        }}
      />

      {/* 修改地址弹窗 — H5 表单骨架（标签居上 + 必填星号 + 控件下方校验文案） */}
      <Dialog
        isOpen={!!addressTarget}
        title={addressTarget ? `修改收货地址 · ${addressTarget.orderNo}` : ""}
        onClose={() => setAddressTarget(null)}
        size={[560, "auto"]}
        buttons={[
          { text: "取消", onClick: () => setAddressTarget(null) },
          { text: "保存地址", status: "primary", onClick: saveAddress },
        ]}
      >
        <form
          className="fm"
          onSubmit={(e) => {
            e.preventDefault();
            saveAddress();
          }}
        >
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="fm-receiver">
              收货人
            </label>
            <TextField
              id="fm-receiver"
              value={addressForm.receiver}
              className={addressErrors.receiver ? "fm-input-error" : undefined}
              defaultLabel="请输入收货人姓名"
              onChange={(val) => {
                setAddressForm({ ...addressForm, receiver: val });
                if (addressErrors.receiver) setAddressErrors({ ...addressErrors, receiver: "" });
              }}
            />
            {addressErrors.receiver && <div className="fm-error">{addressErrors.receiver}</div>}
          </div>
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="fm-phone">
              手机号
            </label>
            <TextField
              id="fm-phone"
              value={addressForm.phone}
              className={addressErrors.phone ? "fm-input-error" : undefined}
              defaultLabel="请输入 11 位手机号"
              onChange={(val) => {
                setAddressForm({ ...addressForm, phone: val });
                if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: "" });
              }}
            />
            {addressErrors.phone && <div className="fm-error">{addressErrors.phone}</div>}
          </div>
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="fm-address">
              详细地址
            </label>
            <TextField
              id="fm-address"
              value={addressForm.address}
              className={addressErrors.address ? "fm-input-error" : undefined}
              defaultLabel="省 / 市 / 区 + 街道门牌"
              onChange={(val) => {
                setAddressForm({ ...addressForm, address: val });
                if (addressErrors.address) setAddressErrors({ ...addressErrors, address: "" });
              }}
            />
            {addressErrors.address && <div className="fm-error">{addressErrors.address}</div>}
          </div>
        </form>
      </Dialog>

      {/* 备注弹窗 */}
      <Dialog
        isOpen={!!remarkTarget}
        title={remarkTarget ? `订单备注 · ${remarkTarget.orderNo}` : ""}
        onClose={() => setRemarkTarget(null)}
        size={[560, "auto"]}
        buttons={[
          { text: "取消", onClick: () => setRemarkTarget(null) },
          { text: "保存备注", status: "primary", onClick: saveRemark },
        ]}
      >
        <form
          className="fm"
          onSubmit={(e) => {
            e.preventDefault();
            saveRemark();
          }}
        >
          <div className="fm-field">
            <label className="fm-label" htmlFor="fm-remark">
              备注内容
            </label>
            <TextArea
              id="fm-remark"
              maxLength={80}
              value={remarkText}
              defaultLabel="输入发货 / 客服备注，保存后在详情中可见"
              onChange={(val) => setRemarkText(val)}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
