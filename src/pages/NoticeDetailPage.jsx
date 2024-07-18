import React from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";

function NoticeDetailPage(props) {
  const location = useLocation();
  const noticeItem = location.state.item;

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/notice");
  };
  return (
    <div className="notice-container">
      <Header />
      <div>
        <p>공 지 사 항</p>
        <p>제주버스 공지사항을 확인하실 수 있습니다.</p>
      </div>
      <div className="notice-detail-container">
        <div className="notice-head">
          <p className="notice-title">{noticeItem.noticeTitle}</p>
          <p className="notice-date">{noticeItem.dateOnlyStr}</p>
        </div>
        <div className="notice-body">
          <p>{noticeItem.noticeText}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="rectBtn" onClick={handleBack}>
          목록으로
        </button>
      </div>
    </div>
  );
}

export default NoticeDetailPage;
