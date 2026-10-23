import { useState } from "react";
import Drawer from "@nce/eview-react/Drawer";
import TextField from "@/shared/TextField";
import SelectCard from "@nce/eview-react/SelectCard";
import DivMessage from "@nce/eview-react/DivMessage";
import Icon from "@/shared/Icon";
import StatusTag from "../../components/status-tag/index.jsx";
import { formatMoney } from "../../mock/casePool.js";
import "./index.css";

// 案件队列抽屉：审批环节案件可切换处理，未到环节案件仅提示
export default function CaseQueue({
  open,
  onClose,
  pool,
  others,
  activeId,
  caseStates,
  onSwitch,
  remainingLabelOf,
  isHotOf,
}) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState(null); // all | pending | done

  const kw = keyword.trim();

  const matchPoolCase = (c) => {
    if (!kw) return true;
    const s = c.summary;
    return (
      s.claimNo.indexOf(kw) > -1 ||
      s.insuredName.indexOf(kw) > -1 ||
      c.queue.claimType.indexOf(kw) > -1 ||
      s.insuranceType.indexOf(kw) > -1 ||
      s.incidentLocation.indexOf(kw) > -1
    );
  };

  const matchOther = (o) =>
    !kw ||
    o.claimNo.indexOf(kw) > -1 ||
    o.insuredName.indexOf(kw) > -1 ||
    o.claimType.indexOf(kw) > -1 ||
    o.reportChannel.indexOf(kw) > -1;

  const poolCases = pool.filter((c) => {
    if (!matchPoolCase(c)) return false;
    if (filter === "pending") return !caseStates[c.id].result;
    if (filter === "done") return !!caseStates[c.id].result;
    return true;
  });

  const otherCases = others.filter((o) => filter === "all" && matchOther(o));

  const pendingCount = pool.filter((c) => !caseStates[c.id].result).length;
  const doneCount = pool.length - pendingCount;

  const handleOtherClick = (item) => {
    setNotice({ type: "default", text: "该案件尚在「" + item.currentStage + "」环节，流转至审批决策后即可处理", key: Date.now() });
  };

  return (
    <>
    <Drawer
      title="案件队列"
      placement="right"
      width={420}
      visible={open}
      onClose={onClose}
      className="case-queue-drawer"
    >
      <div className="cq-sub">
        共 {pool.length + others.length} 件 · 待审批 {pendingCount} 件 · 已办结 {doneCount} 件
      </div>

      <div className="cq-filter">
        <TextField
          value={keyword}
          onChange={(value) => setKeyword(value)}
          placeholder="搜索案件号 / 被保险人 / 类型"
        />
        <SelectCard
          value={filter}
          onChange={(v) => setFilter(v)}
          data={[
            { text: "全部", value: "all" },
            { text: "待审批", value: "pending" },
            { text: "已办结", value: "done" },
          ]}
        />
      </div>

      <div className="cq-section-title">审批环节案件 · {poolCases.length}</div>
      <div className="cq-list">
        {poolCases.map((c) => {
          const st = caseStates[c.id];
          const isActive = c.id === activeId;
          const resultTag = st.result
            ? st.result.type === "approved"
              ? { type: "success", text: "审批通过" }
              : { type: "error", text: "已驳回" }
            : { type: "brand", text: "待审批" };
          return (
            <div
              key={c.id}
              className={isActive ? "q-card q-card--active" : "q-card"}
              onClick={() => onSwitch(c.id)}
            >
              <div className="q-card-top">
                <span className="q-no">{c.summary.claimNo}</span>
                {st.urgent && <StatusTag type="critical" text="加急" small dot={false} />}
                {isActive && <StatusTag type="brand" text="当前处理" small dot={false} />}
                <span className="q-status">
                  <StatusTag type={resultTag.type} text={resultTag.text} small dot={false} />
                </span>
              </div>
              <div className="q-line">
                {c.summary.insuredName} · {c.queue.claimType} · {c.summary.reportChannel}
              </div>
              <div className="q-card-bottom">
                <span className="q-amount">{formatMoney(c.summary.claimAmount)}</span>
                <span className={isHotOf(c) ? "q-remaining q-remaining--hot" : "q-remaining"}>
                  剩余 {remainingLabelOf(c)}
                </span>
              </div>
            </div>
          );
        })}
        {poolCases.length === 0 && <div className="cq-empty">没有符合条件的审批环节案件</div>}
      </div>

      {otherCases.length > 0 && (
        <>
          <div className="cq-section-title">未到审批环节 · {otherCases.length}</div>
          <div className="cq-list">
            {otherCases.map((o) => (
              <div key={o.id} className="q-card q-card--dim" onClick={() => handleOtherClick(o)}>
                <div className="q-card-top">
                  <span className="q-no">{o.claimNo}</span>
                  <StatusTag type="neutral" text={o.currentStage} small dot={false} />
                </div>
                <div className="q-line">
                  {o.insuredName} · {o.claimType} · {o.reportChannel}
                </div>
                <div className="q-card-bottom">
                  <span className="q-amount">{formatMoney(o.claimAmount)}</span>
                  <span className="q-remaining">流转后可处理</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Drawer>

    {notice && (
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1050 }}>
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          onClose={() => setNotice(null)}
        />
      </div>
    )}
    </>
  );
}
