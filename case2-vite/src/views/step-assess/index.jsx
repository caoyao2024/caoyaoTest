import { useState } from "react";
import Table from "@nce/eview-react/Table";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Dialog from "@nce/eview-react/Dialog";
import Chart from "@nce/eview-react/Chart";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { formatMoney } from "../../mock/casePool.js";
import "./index.css";

const renderFee = (v) => (v > 0 ? formatMoney(v) : "—");

// 第二步内容区：定损评估（只读回看）
// 增强：三页签（维修明细 / 影像材料 / 定损意见）、影像点击放大预览
export default function StepAssess({ data, completed, activeNote }) {
  const [preview, setPreview] = useState(null);
  const { isDark } = useApp();
  const s = data.summary;
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  const statBlocks = [
    { label: "定损总额", value: formatMoney(s.totalAmount), hl: true },
    { label: "配件费", value: formatMoney(s.partsFee) },
    { label: "工时费", value: formatMoney(s.laborFee) },
  ];
  if (s.injuryMedicalFee) {
    statBlocks.push({ label: "人伤医疗费用", value: formatMoney(s.injuryMedicalFee) });
  }
  if (s.injuryCompensation) {
    statBlocks.push({ label: "误工护理补偿", value: formatMoney(s.injuryCompensation) });
  }
  statBlocks.push({ label: "残值扣除", value: "-" + formatMoney(s.residualValue) });

  const columns = [
    { title: "损伤项目", key: "damageItem", allowSort: false },
    { title: "维修方式", key: "repairWay", allowSort: false },
    { title: "配件费", key: "partsFee", align: "right", allowSort: false, render: renderFee },
    { title: "工时费", key: "laborFee", align: "right", allowSort: false, render: renderFee },
    {
      title: "小计",
      key: "subtotal",
      align: "right",
      render: (v) => <span className="fee-subtotal">{formatMoney(v)}</span>,
    },
  ];

  const detailTab = (
    <div className="assess-detail">
      <div className="assess-stats">
        {statBlocks.map((b) => (
          <div className={b.hl ? "as-block as-block--hl" : "as-block"} key={b.label}>
            <span className="as-label">{b.label}</span>
            <span className={b.hl ? "as-value as-value--hl" : "as-value"}>{b.value}</span>
          </div>
        ))}
      </div>

      <div className="assess-meta">
        <span>定损：{s.assessor}</span>
        <span>初次定损：{s.firstAssessTime}</span>
        <span>复核归档：{s.finishTime}</span>
        <span>维修厂：{s.repairFactory}</span>
      </div>

      <Table
        columns={columns}
        dataset={data.items}
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
      />

      <div className="assess-total-line">
        合计：配件 {formatMoney(s.partsFee)} + 工时 {formatMoney(s.laborFee)}
        {s.injuryMedicalFee ? " + 人伤医疗 " + formatMoney(s.injuryMedicalFee) : ""}
        {s.injuryCompensation ? " + 误工护理 " + formatMoney(s.injuryCompensation) : ""} =
        <b>{formatMoney(s.totalAmount)}</b>
      </div>

      <h4 className="assess-chart-title">定损项目金额分布</h4>
      <Chart name="BarChart" option={{ ...chartBase, ...data.chartOption }} style={{ height: "17rem" }} />
    </div>
  );

  const photosTab = (
    <div className="photo-grid">
      {data.images.map((img) => (
        <div className="photo-tile" key={img.id} onClick={() => setPreview(img)}>
          <div className="photo-frame">
            <img src="/uploads/image.jpg" alt={img.title} />
            <div className="photo-overlay">
              <span className="photo-overlay-text">
                <StatusTag type="neutral" text={img.category} small dot={false} className="photo-cat" />
                点击查看大图
              </span>
            </div>
          </div>
          <div className="photo-title">{img.title}</div>
          <div className="photo-meta">
            {img.uploader} · {img.uploadTime}
          </div>
        </div>
      ))}
    </div>
  );

  const opinionsTab = (
    <div className="assess-opinions">
      <div className="op-block">
        <div className="op-label">定损员意见</div>
        <div className="op-text">{data.opinions.assessorNote}</div>
      </div>
      <div className="op-block">
        <div className="op-label">复核意见</div>
        <div className="op-text">{data.opinions.reviewerNote}</div>
      </div>
      <div className="op-block">
        <div className="op-label">旧件与残值处理</div>
        <div className="op-text">{data.opinions.oldPartsNote}</div>
      </div>
    </div>
  );

  return (
    <section className="section-card step-assess">
      <div className="card-head">
        <h3 className="card-title">第二步 · 定损评估</h3>
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

      <Tab draggable={false}>
        <TabItem title="维修明细">{detailTab}</TabItem>
        <TabItem title={"影像材料 · " + data.images.length}>{photosTab}</TabItem>
        <TabItem title="定损意见">{opinionsTab}</TabItem>
      </Tab>

      <Dialog
        title={preview ? preview.title : "影像预览"}
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        size={[620, 'auto']}
        buttons={[
          { text: "关闭", status: "primary", onClick: () => setPreview(null) },
        ]}
      >
        {preview && (
          <div className="photo-preview">
            <div className="pp-image">
              <img src="/uploads/image.jpg" alt={preview.title} />
            </div>
            <div className="pp-meta">
              <span>
                <StatusTag type="info" text={preview.category} dot={false} small />
              </span>
              <span className="pp-uploader">
                {preview.uploader} · {preview.uploadTime}
              </span>
            </div>
            <div className="pp-tip">示例预览：完整影像与原图请通过影像系统调阅。</div>
          </div>
        )}
      </Dialog>
    </section>
  );
}
