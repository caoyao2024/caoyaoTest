import { useState } from "react";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicAlert } from '@hui/icon-plus';
import TextArea from "@/shared/TextArea";
import RadioGroup from "@nce/eview-react/RadioGroup";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Spinner from "@/shared/Spinner";
import Toggle from "@nce/eview-react/Toggle";
import Dialog from "@nce/eview-react/Dialog";
import DivMessage from "@nce/eview-react/DivMessage";
import StatusTag from "../../components/status-tag/index.jsx";
import {
  formatMoney,
  materialOptions,
  riskLevelOptions,
  riskLevelHint,
  QUICK_PHRASES,
} from "../../mock/casePool.js";
import "./index.css";

// ③ 中部当前步骤表单：审批决策
// 增强：快捷短语、高风险警示、风控报告弹窗、预计赔付实时联动
export default function StepApprove({
  formData,
  errors,
  onFormChange,
  locked,
  lockedText,
  assessInfo,
  riskReport,
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  const deductible =
    formData.deductible === null || formData.deductible === undefined ? 0 : formData.deductible;
  const expectedPayout = Math.max(
    assessInfo.totalAmount - assessInfo.residualValue - deductible,
    0
  );

  const applyQuickPhrase = (phrase) => {
    if (locked) return;
    const next = formData.opinion ? formData.opinion.trim() + phrase : phrase;
    if (next.length > 500) {
      setNotice({ type: "warn", text: "审批意见已达 500 字上限，无法追加该短语", key: Date.now() });
      return;
    }
    onFormChange("opinion", next);
  };

  const levelTypeMap = { critical: "critical", info: "info" };

  return (
    <section className="section-card step-approve">
      <div className="card-head">
        <h3 className="card-title">第三步 · 审批决策</h3>
        {locked ? <StatusTag type="neutral" text="已锁定" /> : <StatusTag type="brand" text="进行中" />}
        <div className="card-head-action">
          <span className="card-sub">审批专员 · 王思远</span>
        </div>
      </div>

      {locked && (
        <div className="approve-locked">
          <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} className="approve-locked-icon" />
          {lockedText}
        </div>
      )}

      <div className="card-scroll">
        <div className="approve-summary">
          <span className="as-item">
            定损总额 <b>{formatMoney(assessInfo.totalAmount)}</b>
          </span>
          <span className="as-item">
            残值扣除 <b>-{formatMoney(assessInfo.residualValue)}</b>
          </span>
          <span className="as-item">
            免赔额 <b>-{formatMoney(deductible)}</b>
          </span>
          <span className="as-item as-item--hl">
            预计赔付 <b>{formatMoney(expectedPayout)}</b>
          </span>
        </div>

        <form className="approve-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-field">
          <div className="opinion-head">
            <label className="form-label required" htmlFor="f-opinion">
              审批意见
            </label>
            <div className="quick-phrases">
              <span className="qp-label">快捷短语：</span>
              {QUICK_PHRASES.map((p) => (
                <button
                  type="button"
                  key={p}
                  className="qp-chip"
                  disabled={locked}
                  onClick={() => applyQuickPhrase(p)}
                  title="点击追加到审批意见"
                >
                  {p.slice(0, 12) + "…"}
                </button>
              ))}
            </div>
          </div>
          <div className="form-control">
            <TextArea
              id="f-opinion"
              rows={4}
              maxLength={500}
              value={formData.opinion}
              disabled={locked}
              onChange={(value) => { onFormChange("opinion", value); setNotice(null); }}
              placeholder="请综合单证核验、定损与风控结论填写审批意见（不少于 10 字），或点击上方快捷短语快速填写"
            />
            {errors.opinion && <div className="form-error">{errors.opinion}</div>}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label required">风险等级</label>
          <div className="form-control">
            <RadioGroup
              isControlled
              data={riskLevelOptions.map((o) => ({ value: o, text: o }))}
              value={formData.riskLevel}
              disabled={locked}
              onChange={(a, b, event) => {
                const next = a === formData.riskLevel ? b : a;
                onFormChange("riskLevel", next);
                setNotice(null);
              }}
            />
            <div className="form-hint">{riskLevelHint[formData.riskLevel]}</div>
            {formData.riskLevel === "高" && (
              <div className="high-risk-warn">
                <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} className="hr-icon" />
                高风险案件：提交后将自动转组长会签流程，请确认已核实关键材料与费用依据。
              </div>
            )}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">补充材料</label>
          <div className="form-control">
            <CheckboxGroup
              data={materialOptions.map((o) => ({ value: o, text: o }))}
              value={formData.materials}
              disabled={locked}
              onChange={(value) => { onFormChange("materials", value || []); setNotice(null); }}
            />
            <div className="form-hint">
              勾选确认已随卷并提交至下一环节的材料，当前已选 {formData.materials.length} 项
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label required" htmlFor="f-deductible">
              免赔额
            </label>
            <div className="form-control deduct-control">
              <Spinner
                id="f-deductible"
                min={0}
                max={20000}
                step={100}
                value={formData.deductible}
                disabled={locked}
                onChange={(v) => { onFormChange("deductible", v); setNotice(null); }}
                style={{ width: "10rem" }}
              />
              <span className="deduct-unit">元</span>
              {errors.deductible && <div className="form-error">{errors.deductible}</div>}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">是否涉及人伤</label>
            <div className="form-control injury-control">
              <Toggle
                data={[false, true]}
                toggled={formData.injuryInvolved}
                disabled={locked}
                taggledChildren="是"
                unTaggledChildren="否"
                onToggle={(v) => { onFormChange("injuryInvolved", v); setNotice(null); }}
              />
              <span className="injury-text">
                {formData.injuryInvolved ? "涉及人伤，提交后转人伤跟踪岗协办" : "不涉及人伤"}
              </span>
            </div>
          </div>
        </div>
        </form>
      </div>

      <div className="risk-notice">
        <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} className="risk-icon" />
        <div className="risk-body">
          <div className="risk-title-row">
            <span className="risk-title">风控提示</span>
            <a className="risk-report-link" onClick={() => setReportOpen(true)}>
              查看风控报告
            </a>
          </div>
          <div className="risk-text">
            风控评分 {riskReport.score} 分 · 命中规则 {riskReport.rules.length} 条 ·{" "}
            {riskReport.suggestion}
          </div>
        </div>
      </div>

      <Dialog
        title={"风控报告 · " + riskReport.time}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        size={[560, 'auto']}
        buttons={[
          { text: "知道了", status: "primary", onClick: () => setReportOpen(false) },
        ]}
      >
        <div className="risk-report">
          <div className={riskReport.score >= 70 ? "rr-score rr-score--high" : "rr-score"}>
            <span className="rr-score-num">{riskReport.score}</span>
            <span className="rr-score-unit">/ 100</span>
            <span className="rr-score-tag">
              <StatusTag
                type={riskReport.score >= 70 ? "critical" : "info"}
                text={riskReport.score >= 70 ? "中高风险" : "中低风险"}
                small
              />
            </span>
          </div>
          <div className="rr-section-title">命中规则（{riskReport.rules.length} 条）</div>
          <div className="rr-rules">
            {riskReport.rules.map((r) => (
              <div className="rr-rule" key={r.name}>
                <div className="rr-rule-head">
                  <span className="rr-rule-name">{r.name}</span>
                  <StatusTag type={levelTypeMap[r.level] || "info"} text={r.level === "critical" ? "关注" : "提示"} small dot={false} />
                </div>
                <div className="rr-rule-desc">{r.desc}</div>
              </div>
            ))}
          </div>
          <div className="rr-section-title">处置建议</div>
          <div className="rr-suggestion">{riskReport.suggestion}</div>
        </div>
      </Dialog>

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
    </section>
  );
}
