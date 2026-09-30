// Layer 4 — 页面标题与操作区

import Button from '@nce/eview-react/Button';
import { IconPlusIcPublicClock, IconPlusIcPublicDisk, IconPlusIcPublicEraser, IconPlusIcPublicIdcard, IconPlusIcPublicRightArrow, IconPlusIcPublicSend, IconPlusIcPublicStar } from '@nce/icon-plus';
import "./index.css";

export default function PageHeader({ onFill, onReset, onSave, onSubmit, onSubmitAndNew }) {
  return (
    <header className="page-header">
      <div className="page-header__main">
        <nav className="page-header__crumb">
          <span>运维中心</span>
          <IconPlusIcPublicRightArrow iconSize="0.75rem" iconColor={['currentcolor']} />
          <span>工单管理</span>
          <IconPlusIcPublicRightArrow iconSize="0.75rem" iconColor={['currentcolor']} />
          <span className="page-header__crumb-current">新建工单</span>
        </nav>
        <h1 className="page-header__title">新建运维工单</h1>
        <div className="page-header__meta">
          <span className="page-header__no">
            <IconPlusIcPublicIdcard iconSize="0.75rem" iconColor={['currentcolor']} />
            工单号提交后自动生成
          </span>
          <span className="page-header__sep" />
          <span className="page-header__no">
            <IconPlusIcPublicClock iconSize="0.75rem" iconColor={['currentcolor']} />
            草稿自动保存于 09-29 10:24
          </span>
        </div>
      </div>

      <div className="page-header__actions">
        <Button text="智能填充" leftIcon={<IconPlusIcPublicStar iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onFill} />
        <Button text="清空重填" leftIcon={<IconPlusIcPublicEraser iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onReset} />
        <Button text="暂存草稿" leftIcon={<IconPlusIcPublicDisk iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onSave} />
        <Button status="primary" text="提交工单" leftIcon={<IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onSubmit} />
        <Button status="primary" text="提交并新建" onClick={onSubmitAndNew} />
      </div>
    </header>
  );
}
