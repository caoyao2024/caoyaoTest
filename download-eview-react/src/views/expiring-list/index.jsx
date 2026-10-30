// Layer 4: 右侧栏 — 30 天内到期客户榜单：公司可点开详情抽屉，跟进为链接式文本；随行业 / 关键词联动
import { useState } from "react";
import Empty from "@nce/eview-react/Empty";
import DivMessage from "@nce/eview-react/DivMessage";
import dayjs from "dayjs";
import SectionCard from "../../components/section-card/index.jsx";
import { useApp } from "../../context.jsx";
import { getExpiringCustomers } from "../../mock/dashboard.jsx";
import "./index.css";

function daysToneClass(daysLeft) {
  if (daysLeft <= 7) return "is-urgent";
  if (daysLeft <= 15) return "is-soon";
  return "is-normal";
}

export default function ExpiringList() {
  const { industry, keyword, openCustomerDrawer, openFollowUpModal } = useApp();
  const [notice, setNotice] = useState(null);
  const items = getExpiringCustomers(industry, keyword);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  return (
    <>
      <SectionCard
        className="expiring-card"
        title="30 天内到期客户"
        subtitle={`${items.length} 个续约窗口临近，建议优先跟进`}
        actions={
          <a className="table-link" onClick={() => notify("default", "已打开续约日历（演示）")}>查看全部</a>
        }
      >
        {items.length === 0 ? (
          <Empty
            type="success"
            description="暂无符合条件的到期客户"
            style={{ padding: "1.5rem 0" }}
          />
        ) : (
          <ul className="expiring-list">
            {items.map((item) => (
              <li key={item.id} className="expiring-item">
                <div className="expiring-item-top">
                  <div className="expiring-item-title">
                    <a
                      className="expiring-company-link"
                      title="查看客户详情"
                      onClick={() => openCustomerDrawer(item.id)}
                    >
                      {item.companyName}
                    </a>
                    <span className="expiring-industry">{item.industry}</span>
                  </div>
                  <a
                    className="expiring-follow-link"
                    onClick={() => openFollowUpModal({ mode: "follow", customerId: item.id })}
                  >
                    跟进
                  </a>
                </div>
                <div className="expiring-item-meta">
                  <span className={`expiring-days ${daysToneClass(item.daysLeft)}`}>剩 {item.daysLeft} 天</span>
                  <span className="expiring-meta-text">{dayjs(item.renewalDate).format("MM-DD")} 到期</span>
                  <span className="expiring-meta-text">¥{item.amount.toFixed(1)}万</span>
                  <span className="expiring-owner">
                    <img className="expiring-owner-avatar" src="/uploads/user.png" alt={item.owner} />
                    {item.owner}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </>
  );
}
