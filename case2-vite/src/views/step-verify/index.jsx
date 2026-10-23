import { useState } from "react";
import Table from "@nce/eview-react/Table";
import Panel, { PanelItem } from "@nce/eview-react/Panel";
import Dialog from "@nce/eview-react/Dialog";
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

const RESULT_TYPE = {
  通过: "success",
  补充后通过: "critical",
  存疑: "error",
};

// 第一步内容区：资料核验（只读回看）
// 增强：事故经过折叠面板、材料行点击预览
export default function StepVerify({ data, summaryInfo, completed, activeNote }) {
  const [preview, setPreview] = useState(null);

  const columns = [
    { title: "材料名称", key: "materialName", allowSort: false },
    { title: "材料类型", key: "materialType", allowSort: false },
    {
      title: "核验结果",
      key: "verifyResult",
      allowSort: false,
      render: (v) => <StatusTag type={RESULT_TYPE[v] || "neutral"} text={v} small />,
    },
    { title: "核验人", key: "verifier", allowSort: false },
    { title: "核验时间", key: "verifyTime", allowSort: false },
  ];

  return (
    <section className="section-card step-verify">
      <div className="card-head">
        <h3 className="card-title">第一步 · 资料核验</h3>
        {completed ? (
          <StatusTag type="success" text="已完成" />
        ) : (
          <StatusTag type="brand" text="重新处理中" />
        )}
        <div className="card-head-action">
          <span className="card-sub">{completed ? "本环节已归档 · 数据只读" : "案件已退回本环节"}</span>
        </div>
      </div>

      {!completed && activeNote && <div className="step-active-note">{activeNote}</div>}

      <div className="card-scroll">
        <Panel
          enableMultiExpand
          className="incident-collapse"
        >
          <PanelItem title={<span className="incident-label">事故经过与责任认定</span>} closable={false} expanded>
            <div className="incident-body">
              <div className="incident-desc">{summaryInfo.incidentDescription}</div>
              <div className="incident-meta">
                <span className="im-item">
                  <span className="im-label">责任认定</span>
                  <StatusTag type="info" text={summaryInfo.responsibility} dot={false} small />
                </span>
                <span className="im-item">
                  <span className="im-label">出险时间</span>
                  <span className="im-value">{summaryInfo.incidentTime}</span>
                </span>
                <span className="im-item">
                  <span className="im-label">出险地点</span>
                  <span className="im-value">{summaryInfo.incidentLocation}</span>
                </span>
              </div>
            </div>
          </PanelItem>
        </Panel>

      <div className="verify-stats">
        <div className="vs-item">
          <span className="vs-label">核验结论</span>
          <StatusTag type="success" text={data.summary.conclusion} />
        </div>
        <div className="vs-item">
          <span className="vs-label">单证份数</span>
          <span className="vs-value">{data.summary.materialCount} 项</span>
        </div>
        <div className="vs-item">
          <span className="vs-label">核验人</span>
          <span className="vs-value">单证岗 · {data.summary.verifier}</span>
        </div>
        <div className="vs-item">
          <span className="vs-label">归档时间</span>
          <span className="vs-value">{data.summary.finishTime}</span>
        </div>
      </div>

      <Table
        columns={columns}
        dataset={data.records}
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
        onRowClick={(row) => setPreview(row?.rawData)}
      />

      <div className="verify-remark">核验说明：{data.summary.remark}</div>
        <div className="verify-tip">点击材料行可预览影像件摘要。</div>
      </div>

      <Dialog
        title={preview ? "材料预览 · " + preview.materialName : "材料预览"}
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        size={[520, 'auto']}
        buttons={[
          { text: "关闭", status: "primary", onClick: () => setPreview(null) },
        ]}
      >
        {preview && (
          <div className="material-preview">
            <div className="mp-image">
              <img src="/uploads/image.jpg" alt={preview.materialName} />
            </div>
            <div className="mp-meta">
              <div className="mp-row">
                <span className="mp-key">材料类型</span>
                <span className="mp-value">{preview.materialType}</span>
              </div>
              <div className="mp-row">
                <span className="mp-key">核验结果</span>
                <span className="mp-value">
                  <StatusTag type={RESULT_TYPE[preview.verifyResult] || "neutral"} text={preview.verifyResult} small />
                </span>
              </div>
              <div className="mp-row">
                <span className="mp-key">核验人</span>
                <span className="mp-value">{preview.verifier}</span>
              </div>
              <div className="mp-row">
                <span className="mp-key">核验时间</span>
                <span className="mp-value">{preview.verifyTime}</span>
              </div>
            </div>
            <div className="mp-tip">示例预览：完整影像件请通过影像系统调阅。</div>
          </div>
        )}
      </Dialog>
    </section>
  );
}
