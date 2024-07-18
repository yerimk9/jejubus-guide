import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";

function RouteSearchPage(props) {
  const [allRoute, setAllRoute] = useState([]);
  const [filteredAllRoute, setFilteredAllRoute] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleRouteInfo = (item) => {
    localStorage.setItem("routeInfo", JSON.stringify(item));

    const existingHistory =
      JSON.parse(localStorage.getItem("routeSearchHistory")) || [];

    const isDuplicate = existingHistory.some(
      (historyItem) => historyItem["ROUTE_ID"] === item["ROUTE_ID"]
    );

    if (!isDuplicate) {
      const updatedHistory = [...existingHistory, item];
      localStorage.setItem(
        "routeSearchHistory",
        JSON.stringify(updatedHistory)
      );
      setHistoryItems(updatedHistory);
    }
  };

  const handleSearch = useCallback(
    (searchTerm) => {
      const filteredData = searchTerm
        ? allRoute.filter((item) => item["ROUTE_NUM"].includes(searchTerm))
        : [];

      setFilteredAllRoute(filteredData);
    },
    [allRoute]
  );

  const handleHistoryEditor = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleRemoveItem = (index, e) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");

    if (isConfirmed) {
      // 로컬 스토리지에서 데이터 읽어오기
      const existingHistory =
        JSON.parse(localStorage.getItem("routeSearchHistory")) || [];

      // 복제본 생성
      const updatedHistory = [...existingHistory];
      // 해당 인덱스의 아이템 삭제
      updatedHistory.splice(index, 1);
      // 로컬 스토리지 업데이트
      localStorage.setItem(
        "routeSearchHistory",
        JSON.stringify(updatedHistory)
      );
      // 상태 업데이트
      setHistoryItems(updatedHistory);
    }

    e.preventDefault();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api2/api/searchBusRouteList.do");
        const json = await response.json();
        setAllRoute(json);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("routeSearchHistory"));
    setHistoryItems(history);
  }, []);

  return (
    <div className="notice-container">
      <Header />
      <div className="mb-10">
        <p>노선 검색</p>
        <p>노선 검색 서비스를 이용해보세요.</p>
      </div>
      <SearchBar onSearch={handleSearch}>노선 번호를 검색해주세요</SearchBar>
      <div className="routeItems">
        {filteredAllRoute && filteredAllRoute.length > 0
          ? filteredAllRoute.map((item, idx) => (
              <Link
                to={"/busRouteDetail"} // 링크 URL 설정 필요
                className="routeItem"
                key={idx}
                onClick={() => handleRouteInfo(item)}
              >
                <div>{`${item["ROUTE_NUM"]} (${item["DST_NM"]})`}</div>
                <div className="dirTip">{`${item["ORGT_NM"]} ~ ${item["DST_NM"]}`}</div>
              </Link>
            ))
          : historyItems && historyItems.length > 0
          ? historyItems.map((item, idx) =>
              isEditing ? (
                <div
                  className={`routeItem ${isEditing ? "removeHistory" : ""}`}
                  key={idx}
                >
                  <div>
                    <div>{`${item["ROUTE_NUM"]} (${item["DST_NM"]})`}</div>
                    <div
                      className={"dirTip"}
                    >{`${item["ORGT_NM"]} ~ ${item["DST_NM"]}`}</div>
                  </div>
                  <div
                    className="removeBtn"
                    onClick={(e) => handleRemoveItem(idx, e)}
                  >
                    X
                  </div>
                </div>
              ) : (
                <Link
                  to={"/busRouteDetail"}
                  className={`routeItem ${isEditing ? "removeHistory" : ""}`}
                  key={idx}
                  onClick={() => handleRouteInfo(item)}
                >
                  <div>
                    <div>{`${item["ROUTE_NUM"]} (${item["DST_NM"]})`}</div>
                    <div
                      className={"dirTip"}
                    >{`${item["ORGT_NM"]} ~ ${item["DST_NM"]}`}</div>
                  </div>
                </Link>
              )
            )
          : null}
        <div className="flex justify-end">
          <button className="rectBtn" onClick={handleHistoryEditor}>
            {isEditing ? "편집 완료" : "검색기록 편집"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RouteSearchPage;
