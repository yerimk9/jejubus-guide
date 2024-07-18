import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Pagination({
  totalItems, // 전체 아이템의 개수
  itemCountPerPage, // 페이지당 표시되는 아이템의 개수
  pageCount, // 한 번에 표시되는 페이지 버튼의 개수
  currentPage, // 현재 선택된 페이지 번호
  handlePageClick, // 페이지 버튼을 클릭할 때 호출되는 함수
}) {
  const totalPages = Math.ceil(totalItems / itemCountPerPage); // 총 페이지 개수
  const [start, setStart] = useState(1); // 시작 페이지
  const noPrev = start === 1; // 이전 페이지가 없는 경우
  const noNext = start + pageCount - 1 >= totalPages; // 다음 페이지가 없는 경우

  useEffect(() => {
    if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
    if (currentPage < start) setStart((prev) => prev - pageCount);
  }, [currentPage, pageCount, start]);
  return (
    <div className="wrapper">
      <ul>
        <li className={`move ${noPrev && "visible"}`}>
          <Link
            to={`?page=${start - 1}`}
            onClick={() => handlePageClick(start - 1)}
          >
            이전
          </Link>
        </li>
        {[...Array(pageCount)].map(
          (_, i) =>
            start + i <= totalPages && (
              <li key={i}>
                <Link
                  className={`page ${currentPage === start + i && "active"}`}
                  onClick={() => handlePageClick(start + i)}
                  to={`?page=${start + i}`}
                >
                  {start + i}
                </Link>
              </li>
            )
        )}
        <li className={`move ${noNext && "visible"}`}>
          <Link
            to={`?page=${start + pageCount}`}
            onClick={() => handlePageClick(start + pageCount)}
          >
            다음
          </Link>
        </li>
      </ul>
    </div>
  );
}
