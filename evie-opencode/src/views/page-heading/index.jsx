import Button from '@nce/eview-react/Button';
import { IconPlusIcPublicDownload, IconPlusIcPublicPlus } from '@nce/icon-plus';
import { useApp } from '../../context.jsx';

export default function PageHeading() {
  const { metrics, openCreate, notify } = useApp();
  const warningCount = metrics.filter((metric) => metric.status === 'warning').length;
  const abnormalCount = metrics.filter((metric) => metric.status === 'abnormal').length;

  return (
    <div className="page-heading">
      <div className="page-heading__text">
        <h1 className="page-heading__title">数据指标管理</h1>
        <p className="page-heading__desc">
          维护指标定义与统计口径，跟踪目标达成情况并指派责任人与数据来源。
        </p>
        <div className="page-heading__meta">
          <span className="page-heading__meta-item">
            指标总数 <b>{metrics.length}</b>
          </span>
          <span className="page-heading__meta-item page-heading__meta-item--critical">
            需关注 <b>{warningCount}</b>
          </span>
          <span className="page-heading__meta-item page-heading__meta-item--error">
            数据异常 <b>{abnormalCount}</b>
          </span>
        </div>
      </div>
      <div className="page-heading__actions">
        <Button text="导出指标" leftIcon={<IconPlusIcPublicDownload iconSize={14} />} onClick={() => notify('指标清单已加入导出队列')} />
        <Button status="primary" text="新建指标" leftIcon={<IconPlusIcPublicPlus iconSize={14} />} onClick={openCreate} />
      </div>
    </div>
  );
}
