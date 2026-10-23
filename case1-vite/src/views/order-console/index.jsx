// Layer 4: 订单运营台容器 — 业务状态中枢，组装全部区块
// 状态联动：筛选/页签/异常筛选 → 表格数据；订单变更 → 概览卡 / 页签角标 / 售后队列 / 异常条 / 操作动态
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNotice } from "@/shared/Notice";
import TopNav from "../top-nav/index.jsx";
import OverviewCards from "../overview-cards/index.jsx";
import StatusTabs from "../status-tabs/index.jsx";
import FilterBar from "../filter-bar/index.jsx";
import OrderTable from "../order-table/index.jsx";
import AftersaleQueue from "../aftersale-queue/index.jsx";
import ActivityLog from "../activity-log/index.jsx";
import ExceptionBar from "../exception-bar/index.jsx";
import OrderDetailModal from "../order-detail-modal/index.jsx";
import LogisticsModal from "../logistics-modal/index.jsx";
import CreateOrderModal from "../create-order-modal/index.jsx";
import QuickCreateModals from "../quick-create-modals/index.jsx";
import { ORDER_STATUS_META } from "../../components/status-tag/index.jsx";
import {
  buildInitialOrders,
  fmtMoney,
  generateOrderNo,
  makeItem,
  ORDER_STATUS_KEYS,
  SEED_ACTIVITIES,
  STAT_SNAPSHOT,
  TODAY_KEY,
  YESTERDAY_KEY,
} from "../../mock/order.jsx";
import "./index.css";

const EMPTY_FILTERS = {
  keyword: "",
  payMethod: null,
  dateRange: null,
  amountMin: null,
  amountMax: null,
  deliveryRange: null,
};

function pctChange(cur, prev) {
  if (!prev) return 100;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
}

// 预约配送时段重叠判断（HH:mm 字符串可直接比较）
function slotOverlap(a, b) {
  return a[0] < b[1] && a[1] > b[0];
}

export default function OrderConsole() {
  const [notify, noticeEl] = useNotice();
  const [orders, setOrders] = useState(buildInitialOrders);
  const [tab, setTab] = useState("all");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [exception, setException] = useState(null); // null | "timeout" | "logistics"
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorter, setSorter] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [detailOrderNo, setDetailOrderNo] = useState(null);
  const [logisticsOrderNo, setLogisticsOrderNo] = useState(null);
  const [quickCreate, setQuickCreate] = useState(null); // null | "order" | "coupon" | "product"
  const [activities, setActivities] = useState(
    SEED_ACTIVITIES.map((a) => ({ ...a, id: `seed-${a.time}-${a.text}` }))
  );
  const tableCardRef = useRef(null);

  // ---- 操作动态 ----
  const pushActivity = (icon, tone, text) => {
    setActivities((prev) =>
      [
        { id: `${Date.now()}-${Math.random()}`, icon, tone, text, time: dayjs().format("HH:mm") },
        ...prev,
      ].slice(0, 12)
    );
  };

  // ---- 基础筛选（页签之外的全部条件；金额区间无效时忽略金额条件） ----
  const filtered = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase();
    const amountInvalid =
      filters.amountMin != null &&
      filters.amountMax != null &&
      filters.amountMin > filters.amountMax;
    return orders.filter((o) => {
      if (kw) {
        const hit =
          o.orderNo.toLowerCase().includes(kw) ||
          o.receiver.toLowerCase().includes(kw) ||
          o.phone.includes(kw);
        if (!hit) return false;
      }
      if (filters.payMethod && o.payMethod !== filters.payMethod) return false;
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const d = dayjs(o.createdAt);
        if (
          d.isBefore(filters.dateRange[0].startOf("day")) ||
          d.isAfter(filters.dateRange[1].endOf("day"))
        )
          return false;
      }
      if (!amountInvalid) {
        if (filters.amountMin != null && o.paidAmount < filters.amountMin) return false;
        if (filters.amountMax != null && o.paidAmount > filters.amountMax) return false;
      }
      if (filters.deliveryRange && filters.deliveryRange[0] && filters.deliveryRange[1]) {
        const s = filters.deliveryRange[0].format("HH:mm");
        const e = filters.deliveryRange[1].format("HH:mm");
        if (!slotOverlap(o.deliverySlot, [s, e])) return false;
      }
      if (exception === "timeout" && !(o.shippingTimeout && o.status === "pendingShipment"))
        return false;
      if (exception === "logistics" && !(o.logistics === "异常" && o.status === "shipped"))
        return false;
      return true;
    });
  }, [orders, filters, exception]);

  // ---- 页签数量角标（随筛选实时联动） ----
  const counts = useMemo(() => {
    const c = { all: filtered.length };
    ORDER_STATUS_KEYS.forEach((k) => {
      c[k] = filtered.filter((o) => o.status === k).length;
    });
    return c;
  }, [filtered]);

  const tabData = useMemo(
    () => (tab === "all" ? filtered : filtered.filter((o) => o.status === tab)),
    [filtered, tab]
  );

  const tabs = [
    { key: "all", label: "全部", count: counts.all },
    ...ORDER_STATUS_KEYS.map((k) => ({
      key: k,
      label: ORDER_STATUS_META[k].label,
      count: counts[k],
    })),
  ];

  // ---- 售后队列（与主表同源，等待时长倒序） ----
  const aftersaleQueue = useMemo(
    () =>
      orders
        .filter((o) => o.status === "aftersale" && o.aftersale)
        .map((o) => ({
          orderNo: o.orderNo,
          type: o.aftersale.type,
          reason: o.aftersale.reason,
          amount: o.paidAmount,
          receiver: o.receiver,
          waitingMinutes: o.aftersale.waitingMinutes,
          urgent: o.aftersale.waitingMinutes >= 1440,
        }))
        .sort((a, b) => b.waitingMinutes - a.waitingMinutes),
    [orders]
  );

  // ---- 今日概览（数据驱动，实时联动） ----
  const statsCards = useMemo(() => {
    const todayOrders = orders.filter((o) => o.day === TODAY_KEY);
    const yesterdayOrders = orders.filter((o) => o.day === YESTERDAY_KEY);
    const todayCount = todayOrders.length;
    const yesterdayCount = yesterdayOrders.length;
    const todayGmv = todayOrders
      .filter((o) => o.status !== "pendingPayment")
      .reduce((s, o) => s + o.paidAmount, 0);
    const yesterdayGmv = yesterdayOrders
      .filter((o) => o.status !== "pendingPayment")
      .reduce((s, o) => s + o.paidAmount, 0);
    const pendingCount = orders.filter((o) => o.status === "pendingShipment").length;
    const aftersaleCount = aftersaleQueue.length;
    const sign = (v) => (v >= 0 ? "+" : "");
    return [
      {
        key: "orders",
        title: "今日订单量",
        icon: "shopping-cart",
        tone: "info",
        value: String(todayCount),
        trendUp: todayCount >= yesterdayCount,
        trendGood: todayCount >= yesterdayCount,
        trendText: `${sign(todayCount - yesterdayCount)}${pctChange(todayCount, yesterdayCount)}%`,
      },
      {
        key: "pending",
        title: "待发货",
        icon: "package",
        tone: "alert",
        value: String(pendingCount),
        trendUp: pendingCount >= STAT_SNAPSHOT.pendingShipment,
        trendGood: pendingCount < STAT_SNAPSHOT.pendingShipment,
        trendText: `${sign(pendingCount - STAT_SNAPSHOT.pendingShipment)}${pctChange(
          pendingCount,
          STAT_SNAPSHOT.pendingShipment
        )}%`,
      },
      {
        key: "aftersale",
        title: "售后中",
        icon: "life-buoy",
        tone: "error",
        value: String(aftersaleCount),
        trendUp: aftersaleCount >= STAT_SNAPSHOT.aftersale,
        trendGood: aftersaleCount < STAT_SNAPSHOT.aftersale,
        trendText: `${sign(aftersaleCount - STAT_SNAPSHOT.aftersale)}${pctChange(
          aftersaleCount,
          STAT_SNAPSHOT.aftersale
        )}%`,
      },
      {
        key: "gmv",
        title: "今日 GMV",
        icon: "coins",
        tone: "success",
        value: `¥${fmtMoney(todayGmv)}`,
        trendUp: todayGmv >= yesterdayGmv,
        trendGood: todayGmv >= yesterdayGmv,
        trendText: `${sign(todayGmv - yesterdayGmv)}${pctChange(todayGmv, yesterdayGmv)}%`,
      },
    ];
  }, [orders, aftersaleQueue]);

  // ---- 异常计数（实时联动） ----
  const exceptionCounts = useMemo(
    () => ({
      timeout: orders.filter((o) => o.shippingTimeout && o.status === "pendingShipment").length,
      logistics: orders.filter((o) => o.logistics === "异常" && o.status === "shipped").length,
    }),
    [orders]
  );

  // 当前页超出结果范围时回到有效页
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(tabData.length / pageSize));
    if (page > maxPage) setPage(maxPage);
  }, [tabData.length, pageSize]);

  // ---- 交互：页签 / 筛选 / 重置 / 异常定位 / 概览卡跳转 ----
  const changeTab = (k) => {
    setTab(k);
    setPage(1);
  };

  const changeFilter = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const resetAll = () => {
    setFilters(EMPTY_FILTERS);
    setException(null);
    setTab("all");
    setPage(1);
    setSorter({});
    setSelectedRowKeys([]);
    notify("success", "已重置全部筛选条件");
  };

  const changePage = (p, ps) => {
    setPage(p);
    setPageSize(ps);
  };

  const scrollToTable = () => {
    if (tableCardRef.current) {
      tableCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const applyException = (type) => {
    if (exception === type) {
      setException(null);
      setPage(1);
      return;
    }
    setException(type);
    setTab(type === "timeout" ? "pendingShipment" : "shipped");
    setPage(1);
    setSelectedRowKeys([]);
    scrollToTable();
  };

  // 概览卡点击 → 跳转对应页签并定位表格
  const handleCardClick = (key) => {
    if (key === "pending") setTab("pendingShipment");
    else if (key === "aftersale") setTab("aftersale");
    else setTab("all");
    setPage(1);
    scrollToTable();
  };

  // ---- 快捷创建 ----
  const handleQuickCreateDone = (kind, summary) => {
    notify("success", summary);
    pushActivity(kind === "coupon" ? "ticket-percent" : "package-plus", "info", summary);
    setQuickCreate(null);
  };

  // 新建订单 → 生成真实订单进入主表
  const addOrder = (form) => {
    const orderNo = generateOrderNo(orders.map((o) => o.orderNo));
    const now = dayjs();
    const items = [makeItem(form.productKey, form.qty)];
    const paidAmount = items.reduce((s, x) => s + x.price * x.qty, 0);
    const order = {
      orderNo,
      createdAt: now.format("YYYY-MM-DD HH:mm"),
      day: now.format("YYYY-MM-DD"),
      status: "pendingPayment",
      payMethod: form.payMethod,
      logistics: "未发货",
      deliverySlot: form.slot.split("-"),
      items,
      paidAmount,
      receiver: form.receiver,
      phone: form.phone,
      address: form.address,
      remark: "",
      shippingTimeout: false,
      aftersale: null,
    };
    setOrders((prev) => [order, ...prev]);
    setTab("pendingPayment");
    setPage(1);
    notify("success", `订单 ${orderNo} 创建成功，实付 ¥${fmtMoney(paidAmount)}`);
    pushActivity("plus", "info", `新建订单 ${orderNo}（${form.receiver} · ¥${fmtMoney(paidAmount)}）`);
  };

  // ---- 订单变更（发货 / 取消 / 售后 / 地址 / 备注），全部写入操作动态 ----
  const shipOrders = (orderNos) => {
    const set = new Set(orderNos);
    setOrders((prev) =>
      prev.map((o) =>
        set.has(o.orderNo) && o.status === "pendingShipment"
          ? { ...o, status: "shipped", logistics: "运输中", shippingTimeout: false }
          : o
      )
    );
    pushActivity(
      "truck",
      "info",
      orderNos.length > 1
        ? `批量发货 ${orderNos.length} 单，物流单已生成`
        : `已发货订单 ${orderNos[0]}`
    );
  };

  const cancelOrders = (orderNos) => {
    const set = new Set(orderNos);
    setOrders((prev) => prev.filter((o) => !set.has(o.orderNo)));
    setSelectedRowKeys((keys) => keys.filter((k) => !set.has(k)));
    pushActivity(
      "circle-x",
      "error",
      orderNos.length > 1 ? `批量取消 ${orderNos.length} 单` : `已取消订单 ${orderNos[0]}`
    );
  };

  const resolveAftersale = (orderNo, approved, reason) => {
    const target = orders.find((o) => o.orderNo === orderNo);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderNo !== orderNo || !o.aftersale) return o;
        return {
          ...o,
          status: "completed",
          aftersale: null,
          remark: approved ? o.remark : `${o.remark ? `${o.remark}；` : ""}售后已拒绝：${reason}`,
        };
      })
    );
    if (approved) {
      pushActivity(
        "badge-check",
        "success",
        `同意售后退款 ${orderNo}（¥${fmtMoney(target ? target.paidAmount : 0)}）`
      );
    } else {
      pushActivity("circle-x", "error", `拒绝售后申请 ${orderNo}：${reason}`);
    }
  };

  const updateAddress = (orderNo, form) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNo === orderNo
          ? { ...o, receiver: form.receiver, phone: form.phone, address: form.address }
          : o
      )
    );
    pushActivity("map-pin", "info", `修改了 ${orderNo} 的收货地址`);
  };

  const updateRemark = (orderNo, remark) => {
    setOrders((prev) => prev.map((o) => (o.orderNo === orderNo ? { ...o, remark } : o)));
    pushActivity("sticky-note", "none", `更新了 ${orderNo} 的备注`);
  };

  const exportOrder = (orderNo) => {
    notify("success", `订单 ${orderNo} 已导出 Excel`);
    pushActivity("download", "info", `导出订单明细 ${orderNo}`);
  };

  const detailOrder = useMemo(
    () => orders.find((o) => o.orderNo === detailOrderNo) || null,
    [orders, detailOrderNo]
  );

  const logisticsOrder = useMemo(
    () => orders.find((o) => o.orderNo === logisticsOrderNo) || null,
    [orders, logisticsOrderNo]
  );

  return (
    <div className="console-page">
      {noticeEl}
      <TopNav onQuickCreate={setQuickCreate} />
      <main className="console-main">
        <div className="console-content">
          <OverviewCards cards={statsCards} onCardClick={handleCardClick} />
          <section className="console-card" ref={tableCardRef}>
            <StatusTabs tabs={tabs} active={tab} onChange={changeTab} />
            <FilterBar
              value={filters}
              onChange={changeFilter}
              onReset={resetAll}
              exception={exception}
              exceptionCount={exception ? exceptionCounts[exception] : 0}
              onClearException={() => {
                setException(null);
                setPage(1);
              }}
            />
            <OrderTable
              data={tabData}
              page={page}
              pageSize={pageSize}
              sorter={sorter}
              selectedRowKeys={selectedRowKeys}
              onPageChange={changePage}
              onSorterChange={setSorter}
              onSelectionChange={setSelectedRowKeys}
              onShipOrders={shipOrders}
              onCancelOrders={cancelOrders}
              onViewOrder={setDetailOrderNo}
              onOpenLogistics={(r) => setLogisticsOrderNo(r.orderNo)}
              onExportOrder={exportOrder}
              onUpdateAddress={updateAddress}
              onUpdateRemark={updateRemark}
            />
          </section>
        </div>
        <div className="console-aside">
          <AftersaleQueue
            items={aftersaleQueue}
            onResolve={resolveAftersale}
            onViewOrder={setDetailOrderNo}
          />
          <ActivityLog items={activities} />
        </div>
      </main>
      <ExceptionBar
        timeoutCount={exceptionCounts.timeout}
        logisticsCount={exceptionCounts.logistics}
        active={exception}
        onApply={applyException}
      />
      <OrderDetailModal order={detailOrder} onClose={() => setDetailOrderNo(null)} />
      <LogisticsModal order={logisticsOrder} onClose={() => setLogisticsOrderNo(null)} />
      <CreateOrderModal
        open={quickCreate === "order"}
        onClose={() => setQuickCreate(null)}
        onSubmit={addOrder}
      />
      <QuickCreateModals
        active={quickCreate}
        onClose={() => setQuickCreate(null)}
        onDone={handleQuickCreateDone}
      />
    </div>
  );
}
