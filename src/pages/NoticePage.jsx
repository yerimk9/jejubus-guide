import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getNotice, getNoticeTotalCount } from "../services/getNotice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";

function NoticePage(props) {
  const [noticeData, setNoticeData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // 기본값 1로 설정
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();

  const handlePageClick = async (pageNumber) => {
    try {
      navigate(`?page=${pageNumber}`); // 새로운 URL로 이동
    } catch (error) {
      console.error("데이터를 가져오는 중 에러 발생:", error);
    } finally {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentPage === 1) {
          const total = await getNoticeTotalCount();
          setTotalCount(total);
        }
        const data = await getNotice((currentPage - 1) * 10, currentPage * 10);
        setNoticeData(data);
        // 페이지가 1일 때만 전체 공지사항 개수를 가져오도록 수정
        setLoading(false);
      } catch (error) {
        console.error("데이터를 가져오는 중 에러 발생:", error);
      }
    }

    fetchData();
  }, [currentPage, location.search]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="notice-container">
      <Header />
      <div>
        <p>공 지 사 항</p>
        <p>제주버스 공지사항을 확인하실 수 있습니다.</p>
      </div>

      <div className="noticeItem-container">
        <div className="notice-title">
          <div>제목</div>
          <div>등록일</div>
        </div>
        {noticeData.map((item) => (
          <Link
            to={`/notice/${item.noticeId}`}
            state={{ item: item }}
            key={item.noticeId}
            className="noticeItem"
          >
            <div>{item.noticeTitle}</div>
            <div>{item.dateOnlyStr}</div>
          </Link>
        ))}
        <Pagination
          totalItems={totalCount}
          itemCountPerPage={10}
          pageCount={5}
          currentPage={currentPage}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
}

export default NoticePage;
