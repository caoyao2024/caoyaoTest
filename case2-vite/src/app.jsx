// App entry — 车险理赔审批台（流程工作台 · 多案件队列版）
// Layering convention:
//   Layer 1 global state  → src/context.jsx        (AppProvider: 主题切换)
//   Layer 2 mock data     → src/mock/casePool.js   (3 个全量案件 + 7 个队列案件)
//   Layer 3 reusable      → src/components/{name}/ (status-tag)
//   Layer 4 views         → src/views/{name}/      (case-header / process-nav / step-* / flow-timeline / history-table / action-bar / case-queue)
//   Layer 5 layout        → app.jsx                (多案件工作流状态 + 布局装配)

import { useState, useEffect } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import dayjs from "dayjs";
import { AppProvider } from "./context.jsx";
import CaseHeader from "./views/case-header/index.jsx";
import ProcessNav from "./views/process-nav/index.jsx";
import StepVerify from "./views/step-verify/index.jsx";
import StepAssess from "./views/step-assess/index.jsx";
import StepApprove from "./views/step-approve/index.jsx";
import FlowTimeline from "./views/flow-timeline/index.jsx";
import HistoryTable from "./views/history-table/index.jsx";
import ActionBar from "./views/action-bar/index.jsx";
import CaseQueue from "./views/case-queue/index.jsx";
import { casePool, otherQueueItems, formatMoney, formatRemaining } from "./mock/casePool.js";
import "./app.css";

const REJECT_TARGET_INDEX = { 定损评估: 1, 资料核验: 0 };

// 每个案件独立的工作流状态（切换案件时互不丢失）
function buildInitialStates() {
  const map = {};
  const now = Date.now();
  casePool.forEach((c) => {
    map[c.id] = {
      loadedAt: now,
      workflowStep: 2, // 0 资料核验 / 1 定损评估 / 2 审批决策 / 3 已全部完成
      viewedStep: 2,
      formData: { ...c.formDefaults, materials: [...c.formDefaults.materials] },
      errors: {},
      savedAt: c.initialSaved ? new Date() : null,
      result: null, // null | { type: "approved" } | { type: "rejected", target }
      flowNodes: c.flowNodes.map((n) => ({ ...n })),
      notes: c.initialNotes ? c.initialNotes.map((n) => ({ ...n })) : [],
      urgent: c.queue.priority === "urgent",
      transferred: null, // { to }
    };
  });
  return map;
}

export default function App() {
  const [activeId, setActiveId] = useState(1);
  const [queueOpen, setQueueOpen] = useState(false);
  const [nowTs, setNowTs] = useState(() => Date.now());
  const [caseStates, setCaseStates] = useState(buildInitialStates);
  const [notice, setNotice] = useState(null);

  // 剩余处理时限：每 30 秒刷新一次
  useEffect(() => {
    const timer = setInterval(() => setNowTs(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const caseData = casePool.find((c) => c.id === activeId) || casePool[0];
  const cs = caseStates[activeId];
  const locked = cs.result !== null;
  const poolIndex = casePool.findIndex((c) => c.id === activeId);

  const updateCaseState = (patch) =>
    setCaseStates((prev) => ({ ...prev, [activeId]: { ...prev[activeId], ...patch } }));

  // ── 剩余时限 ──
  const remainingMsOf = (c) =>
    Math.max(0, c.queue.deadlineHours * 3600000 - (nowTs - caseStates[c.id].loadedAt));
  const remainingLabelOf = (c) => formatRemaining(remainingMsOf(c));
  const isHotOf = (c) => remainingMsOf(c) < 2 * 3600000 || caseStates[c.id].urgent;
  const remainingText = remainingLabelOf(caseData);
  const remainingHot = isHotOf(caseData);

  // ── 案件状态（摘要条 / 操作栏 / 队列共用） ──
  const caseStatus = cs.result
    ? cs.result.type === "approved"
      ? { text: "审批通过", type: "success" }
      : { text: "已驳回", type: "error" }
    : { text: "审批中", type: "brand" };

  // ── 表单 ──
  const updateForm = (key, value) => {
    updateCaseState({
      formData: { ...cs.formData, [key]: value },
      errors: { ...cs.errors, [key]: undefined },
      ...(cs.savedAt ? { savedAt: null } : {}), // 暂存后再次编辑 → 暂存按钮恢复可用
    });
  };

  const validateOpinion = () => {
    if (!cs.formData.opinion || !cs.formData.opinion.trim()) {
      updateCaseState({
        errors: { ...cs.errors, opinion: "审批意见为必填项，请填写后再操作" },
        viewedStep: 2,
      });
      return false;
    }
    if (cs.formData.opinion.trim().length < 10) {
      updateCaseState({
        errors: { ...cs.errors, opinion: "审批意见不少于 10 字，请补充完整" },
        viewedStep: 2,
      });
      return false;
    }
    return true;
  };

  // ── 流程导航 ──
  const handleStepClick = (step) => {
    if (step > cs.workflowStep) return; // 待办步骤已禁用，双保险
    updateCaseState({ viewedStep: step });
  };

  // 追加流转节点（自动降级旧的「进行中」节点为「流转」）
  const appendFlowNodes = (nodes) => {
    const base = cs.flowNodes.map((n) =>
      n.actionType === "current" ? { ...n, actionType: "info" } : n
    );
    updateCaseState({ flowNodes: [...base, ...nodes.map((n, i) => ({ ...n, id: base.length + i + 1 }))] });
  };

  // ── 提交 / 驳回 / 暂存 ──
  const handleSubmit = () => {
    if (locked) return;
    if (!validateOpinion()) {
      setNotice({ type: "warn", text: "请填写审批意见后再提交", key: Date.now() });
      return;
    }
    const deductible =
      cs.formData.deductible === null || cs.formData.deductible === undefined
        ? 0
        : cs.formData.deductible;
    if (deductible < 0 || deductible > 20000) {
      updateCaseState({
        errors: { ...cs.errors, deductible: "请输入 0 – 20,000 元范围内的免赔额" },
        viewedStep: 2,
      });
      setNotice({ type: "warn", text: "请检查免赔额输入", key: Date.now() });
      return;
    }
    const now = dayjs().format("MM-DD HH:mm");
    const payout = Math.max(
      caseData.assess.summary.totalAmount - caseData.assess.summary.residualValue - deductible,
      0
    );
    const materialText =
      cs.formData.materials.length > 0 ? cs.formData.materials.join("、") : "无";
    appendFlowNodes([
      {
        time: now,
        title: "审批决策通过",
        operator: "审批专员 · 王思远",
        actionType: "pass",
        remark:
          "风险等级：" + cs.formData.riskLevel +
          "；随卷材料 " + cs.formData.materials.length + " 项（" + materialText +
          "）；免赔额 ¥" + deductible.toLocaleString("zh-CN") +
          "；预计赔付 ¥" + payout.toLocaleString("zh-CN") + "。",
      },
      {
        time: now,
        title: "流转至结案支付",
        operator: "系统 · 自动流转",
        actionType: "current",
        remark: "案件进入结案支付环节，由支付岗完成打款与归档。",
      },
    ]);
    updateCaseState({ result: { type: "approved" }, workflowStep: 3 });
    setNotice({
      type: "success",
      text: "提交成功：案件已流转至结案支付环节（风险等级：" + cs.formData.riskLevel +
        " · 随卷材料 " + cs.formData.materials.length + " 项 · 预计赔付 ¥" + payout.toLocaleString("zh-CN") + "）",
      key: Date.now(),
    });
  };

  const handleBeforeReject = () => {
    if (!validateOpinion()) {
      setNotice({ type: "warn", text: "请先填写审批意见，驳回记录需归档审批意见", key: Date.now() });
      return false;
    }
    return true;
  };

  const handleReject = ({ reason, target }) => {
    const now = dayjs().format("MM-DD HH:mm");
    appendFlowNodes([
      {
        time: now,
        title: "审批驳回",
        operator: "审批专员 · 王思远",
        actionType: "reject",
        remark: "驳回至「" + target + "」环节。原因：" + reason,
      },
      {
        time: now,
        title: "退回" + target + "重新处理",
        operator: "系统 · 自动流转",
        actionType: "current",
        remark: "处理人已收到整改通知，需在 48 小时内重新提交。",
      },
    ]);
    const targetIdx =
      REJECT_TARGET_INDEX[target] !== undefined ? REJECT_TARGET_INDEX[target] : 1;
    updateCaseState({ result: { type: "rejected", target }, workflowStep: targetIdx, viewedStep: targetIdx });
    setNotice({ type: "success", text: "已驳回：案件退回「" + target + "」环节，原因已通知处理人", key: Date.now() });
  };

  const handleSave = () => {
    updateCaseState({ savedAt: new Date() });
    setNotice({ type: "success", text: "暂存成功：当前审批意见已保存至草稿", key: Date.now() });
  };

  // ── 备注 / 加急 / 转交 ──
  const handleAddNote = (content) => {
    updateCaseState({
      notes: [
        ...cs.notes,
        { author: "审批专员 · 王思远", time: dayjs().format("MM-DD HH:mm"), content },
      ],
    });
  };

  const handleToggleUrgent = () => {
    updateCaseState({ urgent: !cs.urgent });
    setNotice({ type: "success", text: cs.urgent ? "已取消加急标记" : "已标记加急：案件将置顶展示并提醒优先处理", key: Date.now() });
  };

  const handleTransfer = ({ to, note }) => {
    const now = dayjs().format("MM-DD HH:mm");
    appendFlowNodes([
      {
        time: now,
        title: "转交会签",
        operator: "审批专员 · 王思远",
        actionType: "info",
        remark: "转交「" + to + "」会签。" + (note ? "备注：" + note : ""),
      },
    ]);
    updateCaseState({ transferred: { to } });
    setNotice({ type: "success", text: "已转交会签：" + to + "，会签完成后将回到本环节", key: Date.now() });
  };

  // ── 案件切换 ──
  const switchCase = (id) => {
    setQueueOpen(false);
    if (id === activeId) return;
    const target = casePool.find((c) => c.id === id);
    if (!target) return;
    setActiveId(id);
    setNotice({
      type: "success",
      text: "已切换至案件 " + target.summary.claimNo + "（被保险人：" + target.summary.insuredName + "）",
      key: Date.now(),
    });
  };

  const goAdjacent = (dir) => {
    const next = casePool[(poolIndex + dir + casePool.length) % casePool.length];
    switchCase(next.id);
  };

  const prevCase = casePool[(poolIndex - 1 + casePool.length) % casePool.length];
  const nextCase = casePool[(poolIndex + 1) % casePool.length];
  const caseLabel = (c) => c.summary.insuredName + " · " + formatMoney(c.summary.claimAmount);

  // ── 步骤内容（随查看步骤切换） ──
  const doneMeta = [
    "单证岗 " + caseData.verify.summary.verifier + " · " + caseData.verify.summary.finishTime + " 归档",
    "定损 " + caseData.assess.summary.assessor.split(" / ")[0] + " · " + caseData.assess.summary.finishTime + " 归档",
  ];

  // 左侧导航卡片补充内容：案件速览（随案件切换，保持精简不撑出滚动条）
  const fastInfo = [
    ["报案号", caseData.summary.reportNo],
    ["责任认定", caseData.summary.responsibility],
    ["出险地点", caseData.summary.incidentLocation],
  ];

  const stepViews = [
    <StepVerify
      key="verify"
      data={caseData.verify}
      summaryInfo={caseData.summary}
      completed={cs.workflowStep > 0}
      activeNote="案件已由审批岗驳回退回本环节，等待单证岗补充材料后重新提交（48 小时内）。"
    />,
    <StepAssess
      key="assess"
      data={caseData.assess}
      completed={cs.workflowStep > 1}
      activeNote="案件已由审批岗驳回退回本环节，等待定损员重新核定后提交（48 小时内）。"
    />,
    <StepApprove
      key="approve"
      formData={cs.formData}
      errors={cs.errors}
      onFormChange={updateForm}
      locked={locked}
      lockedText={
        cs.result && cs.result.type === "approved"
          ? "审批已通过并流转至结案支付环节，本表单已锁定归档。"
          : cs.result && cs.result.type === "rejected"
          ? "本案已驳回至「" + cs.result.target + "」环节，本表单已锁定归档。"
          : ""
      }
      assessInfo={{
        totalAmount: caseData.assess.summary.totalAmount,
        residualValue: caseData.assess.summary.residualValue,
      }}
      riskReport={caseData.riskReport}
    />,
  ];

  let lockStatus = { type: "brand", text: "审批中", hint: "" };
  if (cs.result && cs.result.type === "approved") {
    lockStatus = {
      type: "success",
      text: "审批通过",
      hint: "案件已流转至结案支付环节，进度见右侧流转记录",
    };
  } else if (cs.result && cs.result.type === "rejected") {
    lockStatus = {
      type: "error",
      text: "已驳回",
      hint: "案件已退回「" + cs.result.target + "」环节，等待处理人重新提交",
    };
  }

  return (
    <AppProvider>
      <div className="app-root">
        <CaseHeader
            claim={caseData.summary}
            profile={caseData.profile}
            vehicle={caseData.vehicle}
            policy={caseData.policy}
            caseStatusText={caseStatus.text}
            caseStatusType={caseStatus.type}
            urgent={cs.urgent}
            remainingText={remainingText}
            remainingHot={remainingHot}
            queueCount={casePool.length + otherQueueItems.length}
            caseIndex={poolIndex + 1}
            caseTotal={casePool.length}
            prevTitle={caseLabel(prevCase)}
            nextTitle={caseLabel(nextCase)}
            onPrev={() => goAdjacent(-1)}
            onNext={() => goAdjacent(1)}
            onOpenQueue={() => setQueueOpen(true)}
          />

          <main className="wb-main">
            <div className="wb-grid">
              <ProcessNav
                workflowStep={cs.workflowStep}
                viewedStep={cs.viewedStep}
                onStepClick={handleStepClick}
                doneMeta={doneMeta}
                fastInfo={fastInfo}
                remainingText={remainingText}
                remainingHot={remainingHot}
              />
              {stepViews[cs.viewedStep]}
              <FlowTimeline nodes={cs.flowNodes} notes={cs.notes} onAddNote={handleAddNote} />
            </div>
            <HistoryTable
              data={caseData.history.claims}
              insuredName={caseData.summary.insuredName}
              note={caseData.history.note}
            />
          </main>

          <ActionBar
            claim={caseData.summary}
            locked={locked}
            lockStatus={lockStatus}
            savedAt={cs.savedAt}
            remainingText={remainingText}
            remainingHot={remainingHot}
            urgent={cs.urgent}
            transferred={cs.transferred}
            onBeforeReject={handleBeforeReject}
            onReject={handleReject}
            onSave={handleSave}
            onSubmit={handleSubmit}
            onToggleUrgent={handleToggleUrgent}
            onTransfer={handleTransfer}
          />

          <CaseQueue
            open={queueOpen}
            onClose={() => setQueueOpen(false)}
            pool={casePool}
            others={otherQueueItems}
            activeId={activeId}
            caseStates={caseStates}
            onSwitch={switchCase}
            remainingLabelOf={remainingLabelOf}
            isHotOf={isHotOf}
          />

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
        </div>
    </AppProvider>
  );
}
