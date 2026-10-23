// Layer 4: 产品公告 — 右下角悬浮组件：收起为胶囊按钮，展开为公告面板（轮播 + 左右切换 + 指示点），点击公告查看详情
import { useState, useEffect } from "react";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicHorn, IconPlusIcPublicLeftArrow, IconPlusIcPublicRightArrow } from '@hui/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import Tag from "@/shared/Tag";
import { ANNOUNCEMENTS } from "../../mock/dashboard.jsx";
import "./index.css";

export default function AnnouncementBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const total = ANNOUNCEMENTS.length;

  // TODO(eview-react): Carousel 未覆盖，当前手写最小可用版
  useEffect(() => {
    if (!isExpanded || total <= 1) return undefined;
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [isExpanded, total]);

  const goPrev = () => setSlideIndex((i) => (i - 1 + total) % total);
  const goNext = () => setSlideIndex((i) => (i + 1) % total);

  return (
    <div className="announce-float">
      {isExpanded ? (
        <div className="announce-panel">
          <div className="announce-panel-head">
            <span className="announce-icon">
              <IconPlusIcPublicHorn iconSize="0.875rem" iconColor={['currentcolor']} />
            </span>
            <span className="announce-panel-title">产品公告</span>
            <button
              type="button"
              className="announce-collapse"
              title="收起公告"
              aria-label="收起公告"
              onClick={() => setIsExpanded(false)}
            >
              <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
            </button>
          </div>
          <div className="announce-panel-body">
            <button type="button" className="announce-arrow" title="上一条" aria-label="上一条" onClick={goPrev}>
              <IconPlusIcPublicLeftArrow iconSize="0.875rem" iconColor={['currentcolor']} />
            </button>
            <div className="announce-carousel">
              <div style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", transition: "transform 0.3s ease", transform: `translateX(-${slideIndex * 100}%)` }}>
                  {ANNOUNCEMENTS.map((item) => (
                    <div key={item.id} style={{ flex: "0 0 100%", minWidth: 0 }}>
                      <div className="announce-slide" onClick={() => setDetail(item)}>
                        <div className="announce-slide-top">
                          <Tag color={item.tagColor} className="announce-tag">{item.tag}</Tag>
                          <span className="announce-slide-date">{item.date}</span>
                        </div>
                        <p className="announce-slide-title">{item.title}</p>
                        <p className="announce-slide-desc">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "8px" }}>
                  {ANNOUNCEMENTS.map((_, i) => (
                    <span
                      key={i}
                      style={{
                        width: i === slideIndex ? "16px" : "6px",
                        height: "6px",
                        borderRadius: "3px",
                        background: i === slideIndex ? "var(--primary, #0067D1)" : "var(--divider, #e0e0e0)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() => setSlideIndex(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button type="button" className="announce-arrow" title="下一条" aria-label="下一条" onClick={goNext}>
              <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="announce-fab-btn"
          title="展开产品公告"
          aria-label="展开产品公告"
          onClick={() => setIsExpanded(true)}
        >
          <IconPlusIcPublicHorn iconSize="1rem" iconColor={['currentcolor']} className="announce-fab-icon" />
          <span>产品公告</span>
          <span className="announce-fab-count">{ANNOUNCEMENTS.length}</span>
        </button>
      )}

      <Dialog
        isOpen={Boolean(detail)}
        title={
          detail ? (
            <span className="announce-detail-title">
              <Tag color={detail.tagColor} className="announce-tag">{detail.tag}</Tag>
              {detail.title}
            </span>
          ) : (
            ""
          )
        }
        onClose={() => setDetail(null)}
        size={["32rem", "auto"]}
      >
        {detail ? (
          <div className="announce-detail">
            <p className="announce-detail-date">发布于 {detail.date}</p>
            <p className="announce-detail-text">{detail.description}</p>
            <p className="announce-detail-note">如需了解升级节奏与影响范围，请联系产品团队或在团队管理页查看排期。</p>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
