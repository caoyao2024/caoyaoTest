// Layer 4: 产品公告 — 右下角悬浮组件：收起为胶囊按钮，展开为公告面板（轮播 + 左右切换 + 指示点），点击公告查看详情
import { useEffect, useRef, useState } from "react";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicHorn, IconPlusIcPublicLeftArrow, IconPlusIcPublicRightArrow } from '@hui/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import Tag from "@/shared/Tag";
import { ANNOUNCEMENTS } from "../../mock/dashboard.jsx";
import "./index.css";

export default function AnnouncementBar() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const autoplayRef = useRef(null);

  const total = ANNOUNCEMENTS.length;

  const goPrev = () => setSlideIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setSlideIndex((prev) => (prev + 1) % total);

  useEffect(() => {
    if (!isExpanded || total <= 1) return undefined;
    autoplayRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [isExpanded, total]);

  const currentAnnounce = ANNOUNCEMENTS[slideIndex];

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
              <div key={slideIndex} className="announce-slide" onClick={() => setDetail(currentAnnounce)}>
                <div className="announce-slide-top">
                  <Tag color={currentAnnounce.tagColor} className="announce-tag">{currentAnnounce.tag}</Tag>
                  <span className="announce-slide-date">{currentAnnounce.date}</span>
                </div>
                <p className="announce-slide-title">{currentAnnounce.title}</p>
                <p className="announce-slide-desc">{currentAnnounce.description}</p>
              </div>
              <div className="announce-dots">
                {ANNOUNCEMENTS.map((_, index) => (
                  <span
                    key={index}
                    className={`announce-dot ${index === slideIndex ? "is-active" : ""}`}
                    onClick={() => setSlideIndex(index)}
                  />
                ))}
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
        size={[512, "auto"]}
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
