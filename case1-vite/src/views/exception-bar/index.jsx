// Layer 4: ⑧ 底部异常提示条 — 超时未发货 / 物流异常计数，点击即筛选定位（再次点击取消）
import { IconPlusIcPublicAlarmClock, IconPlusIcPublicAlarmlight, IconPlusIcPublicWarning } from '@hui/icon-plus';
import "./index.css";

export default function ExceptionBar({ timeoutCount, logisticsCount, active, onApply }) {
  return (
    <div className="exc-bar">
      <div className="exc-inner">
        <span className="exc-label">
          <IconPlusIcPublicAlarmlight iconSize="1rem" iconColor={['currentcolor']} />
          异常待处理
        </span>
        <div className="exc-items">
          <a
            className={active === "timeout" ? "exc-item exc-timeout on" : "exc-item exc-timeout"}
            onClick={() => onApply("timeout")}
          >
            <IconPlusIcPublicAlarmClock iconSize="0.875rem" iconColor={['currentcolor']} />
            超时未发货 <b>{timeoutCount}</b> 单
          </a>
          <a
            className={active === "logistics" ? "exc-item exc-logistics on" : "exc-item exc-logistics"}
            onClick={() => onApply("logistics")}
          >
            <IconPlusIcPublicWarning iconSize="0.875rem" iconColor={['currentcolor']} />
            物流异常 <b>{logisticsCount}</b> 单
          </a>
        </div>
        <span className="exc-hint">点击异常项可快速筛选定位</span>
      </div>
    </div>
  );
}
