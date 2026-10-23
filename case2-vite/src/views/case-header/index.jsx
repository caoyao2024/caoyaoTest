import { useState } from "react";
import { IconPlusIcCarUser, IconPlusIcPublicCar, IconPlusIcPublicClock, IconPlusIcPublicCopy, IconPlusIcPublicGenericFile, IconPlusIcPublicLeftArrow, IconPlusIcPublicMappinOnMap, IconPlusIcPublicMoon, IconPlusIcPublicRightArrow, IconPlusIcPublicSecurity, IconPlusIcPublicSun, IconPlusIcPublicTray } from '@hui/icon-plus';
import TipBox from "@nce/eview-react/TipBox";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import { useApp } from "../../context.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { formatMoney } from "../../mock/casePool.js";
import "./index.css";

// ① 顶部案件摘要条：案件号 / 被保险人 / 出险时间 / 报案渠道 Tag / 涉案金额 / 案件状态
// 增强：客户·车辆·保单画像 Popover、加急标记、案件切换、队列入口、剩余时限
function renderPopover(title, rows) {
  return (
    <div className="pop-detail">
      <div className="pop-title">{title}</div>
      {rows.map((pair) => (
        <div className="pop-row" key={pair[0]}>
          <span className="pop-key">{pair[0]}</span>
          <span className="pop-value">{pair[1]}</span>
        </div>
      ))}
    </div>
  );
}

export default function CaseHeader({
  claim,
  profile,
  vehicle,
  policy,
  caseStatusText,
  caseStatusType,
  urgent,
  remainingText,
  remainingHot,
  queueCount,
  caseIndex,
  caseTotal,
  prevTitle,
  nextTitle,
  onPrev,
  onNext,
  onOpenQueue,
}) {
  const { isDark, toggleDark } = useApp();
  const [notice, setNotice] = useState(null);

  const copyClaimNo = async () => {
    try {
      await navigator.clipboard.writeText(claim.claimNo);
      setNotice({ type: "success", text: "案件号已复制：" + claim.claimNo, key: Date.now() });
    } catch (e) {
      setNotice({ type: "default", text: "案件号：" + claim.claimNo, key: Date.now() });
    }
  };

  return (
    <header className="case-header">
      <div className="chrome-bar">
        <div className="chrome-left">
          <IconPlusIcPublicSecurity iconSize="1.25rem" iconColor={['currentcolor']} className="chrome-logo" />
          <span className="chrome-title">车险理赔审批工作台</span>
          <span className="chrome-divider" />
          <span className="chrome-org">理赔运营中心 · 审批一组</span>
          <span className="chrome-divider" />
          <div className="case-switcher">
            <TipBox type="simple" content={"上一件：" + prevTitle}>
              <IconPlusIcPublicLeftArrow iconSize="1rem" iconColor={['currentcolor']} onClick={onPrev} className="switch-btn" title="上一件案件" />
            </TipBox>
            <span className="switch-pos">
              {caseIndex} / {caseTotal}
            </span>
            <TipBox type="simple" content={"下一件：" + nextTitle}>
              <IconPlusIcPublicRightArrow iconSize="1rem" iconColor={['currentcolor']} onClick={onNext} className="switch-btn" title="下一件案件" />
            </TipBox>
          </div>
        </div>
        <div className="chrome-right">
          <Button leftIcon={<IconPlusIcPublicTray iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onOpenQueue} text={`案件队列 ${queueCount}`} />
          <span className="chrome-divider" />
          <span className="chrome-user">
            <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />
            {claim.handlerRole} · {claim.handler}
          </span>
          <TipBox type="simple" content={isDark ? "切换浅色模式" : "切换深色模式"}>
            {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} className="chrome-theme" /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} className="chrome-theme" />}
          </TipBox>
        </div>
      </div>

      <div className="summary-wrap">
        <div className="summary-card">
          <div className="summary-main">
            <div className="sum-field sum-field--no">
              <span className="sum-label">案件号</span>
              <span className="sum-value sum-claim-no">
                {claim.claimNo}
                <TipBox type="simple" content="点击复制案件号">
                  <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} onClick={copyClaimNo} className="sum-copy" title="复制案件号" />
                </TipBox>
              </span>
            </div>
            <TipBox content={renderPopover("客户画像", profile.rows)} direction="bottom" trigger="click">
              <div className="sum-field sum-field--hover">
                <span className="sum-label">被保险人</span>
                <span className="sum-value sum-pop-trigger">{claim.insuredName}</span>
              </div>
            </TipBox>
            <div className="sum-field">
              <span className="sum-label">出险时间</span>
              <span className="sum-value">{claim.incidentTime}</span>
              <span className="sum-label">报案 {claim.reportTime}</span>
            </div>
            <div className="sum-field">
              <span className="sum-label">报案渠道</span>
              <StatusTag type="info" text={claim.reportChannel} dot={false} />
            </div>
            <div className="sum-field sum-field--amount">
              <span className="sum-label">涉案金额</span>
              <span className="sum-value sum-amount">{formatMoney(claim.claimAmount)}</span>
            </div>
            <div className="sum-field sum-field--status">
              <span className="sum-label">案件状态</span>
              <span className="sum-status-group">
                {urgent && <StatusTag type="critical" text="加急" dot={false} />}
                <StatusTag type={caseStatusType} text={caseStatusText} />
              </span>
            </div>
          </div>

          <div className="summary-sub">
            <TipBox content={renderPopover("车辆信息", vehicle.rows)} direction="bottom" trigger="click">
              <span className="sub-item sub-item--hover">
                <IconPlusIcPublicCar iconSize="0.875rem" iconColor={['currentcolor']} />
                {claim.plateNo} · {claim.vehicleModel}
              </span>
            </TipBox>
            <span className="sub-item">
              <IconPlusIcPublicGenericFile iconSize="0.875rem" iconColor={['currentcolor']} />
              {claim.insuranceType}
            </span>
            <TipBox content={renderPopover("保单信息", policy.rows)} direction="bottom" trigger="click">
              <span className="sub-item sub-item--hover">保单号 {claim.policyNo}</span>
            </TipBox>
            <span className="sub-item">
              <IconPlusIcPublicMappinOnMap iconSize="0.875rem" iconColor={['currentcolor']} />
              {claim.incidentLocation}
            </span>
            <span className={remainingHot ? "sub-item sub-item--hot" : "sub-item"}>
              <IconPlusIcPublicClock iconSize="0.875rem" iconColor={['currentcolor']} />
              剩余处理时限 {remainingText}
            </span>
          </div>
        </div>
      </div>

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
    </header>
  );
}
