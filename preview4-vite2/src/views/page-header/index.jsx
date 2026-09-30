import Crumbs from "@nce/eview-react/Crumbs";
import { IconPlusIcPublicSend, IconPlusIcPublicBrush, IconPlusIcPublicHistoryInformation, IconPlusIcPublicDisk } from '@nce/icon-plus';
import Button from "@nce/eview-react/Button";
import TipBox from "@nce/eview-react/TipBox";
import "./index.css";

// Layer 4: 页面标题区 — 面包屑 + 标题 + 操作
export default function PageHeader({ draftSaved, onSaveDraft, onOpenTemplate, onSubmit }) {
  return (
    <header className="page-head">
      <div className="page-head__main">
        <Crumbs
          data={[
            { title: "首页" },
            { title: "工单中心" },
            { title: "新建巡检工单" },
          ]}
        />
        <div className="page-head__title-row">
          <h1 className="page-head__title">新建巡检工单</h1>
          <span className="page-head__badge">
            <IconPlusIcPublicBrush iconSize="0.75rem" iconColor={['currentcolor']} />
            {draftSaved ? "草稿已保存" : "草稿未保存"}
          </span>
        </div>
        <p className="page-head__desc">
          按机房巡检规范填写工单信息，提交后进入班组审核流程；带 <em>*</em> 的字段为必填项。
        </p>
      </div>

      <div className="page-head__actions">
        <TipBox type="simple" content="套用已保存的填报模板" direction="top">
          <Button leftIcon={<IconPlusIcPublicHistoryInformation iconSize="0.875rem" iconColor={['currentcolor']} />} text="套用模板" onClick={onOpenTemplate} />
        </TipBox>
        <Button leftIcon={<IconPlusIcPublicDisk iconSize="0.875rem" iconColor={['currentcolor']} />} text="保存草稿" onClick={onSaveDraft} />
        <Button status="primary" leftIcon={<IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} />} text="提交工单" onClick={onSubmit} />
      </div>
    </header>
  );
}
