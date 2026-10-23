import Steps from "@/shared/Steps";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicClock } from '@hui/icon-plus';
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

const STEP_META = [
  { key: "verify", title: "资料核验", desc: "单证完整性与真实性核验" },
  { key: "assess", title: "定损评估", desc: "损伤项目定损与金额复核" },
  { key: "approve", title: "审批决策", desc: "审批意见与赔付方案确认" },
];

// ② 左侧流程导航：当前步高亮、完成步可回看、待办步置灰禁点
// 紧凑布局：小尺寸步骤条 + 案件速览，处理时限固定底部，不出滚动条
export default function ProcessNav({
  workflowStep,
  viewedStep,
  onStepClick,
  doneMeta,
  fastInfo,
  remainingText,
  remainingHot,
}) {
  const stepData = STEP_META.map((meta, idx) => {
    const done = idx < workflowStep;
    return {
      text: meta.title,
      value: String(idx + 1),
      description: (
        <div className="step-desc">
          <span className="step-desc-text">{meta.desc}</span>
          {done && doneMeta[idx] && (
            <span className="step-done">
              <IconPlusIcDigitalPowerDpCheck iconSize="0.75rem" iconColor={['currentcolor']} />
              {doneMeta[idx]}
            </span>
          )}
          {viewedStep === idx && <StatusTag type="brand" text="正在查看" small dot={false} />}
        </div>
      ),
    };
  });

  return (
    <nav className="section-card process-nav">
      <div className="card-head">
        <h3 className="card-title">审批流程</h3>
        <div className="card-head-action">
          <span className="card-sub">三步审核</span>
        </div>
      </div>

      <div className="card-scroll nav-scroll">
        <Steps
          direction="vertical"
          currentStep={String(workflowStep + 1)}
          onClick={onStepClick}
          data={stepData}
          labelPlacement="horizontal"
          className="process-steps ev_wizard_container_sm"
        />

        <div className="fast-view">
          <div className="fv-title">案件速览</div>
          {fastInfo.map((pair) => (
            <div className="fv-row" key={pair[0]}>
              <span className="fv-k">{pair[0]}</span>
              <span className="fv-v">{pair[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={remainingHot ? "process-deadline process-deadline--hot" : "process-deadline"}>
        <IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} className="deadline-icon" />
        <div>
          <div className="deadline-main">剩余处理时限 {remainingText}</div>
          <div className="deadline-sub">超时案件自动升级组长协办</div>
        </div>
      </div>
    </nav>
  );
}
