import Button from "@nce/eview-react/Button";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";

function PageHeading() {
  const { metrics, openCreate } = useApp();
  const warningCount = metrics.filter((metric) => metric.status === "warning").length;
  const abnormalCount = metrics.filter((metric) => metric.status === "abnormal").length;

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
        <Button leftIcon={<Icon name="download" size={14} />}>导出指标</Button>
        <Button status="primary" leftIcon={<Icon name="plus" size={14} />} onClick={openCreate}>
          新建指标
        </Button>
      </div>
    </div>
  );
}

export default PageHeading;
