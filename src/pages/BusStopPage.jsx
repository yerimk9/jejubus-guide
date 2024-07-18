import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";
import xmlToJson from "../utils/xmlToJson";
import mapDirection from "../utils/mapDirection";
import { useRecoilState } from "recoil";
import { pathState } from "../recoil/atoms/pathState";
import { stationInfoState } from "../recoil/atoms/stationInfoState";

function BusStopPage(props) {
  const [busStopData, setBusStopData] = useState([]);
  const [filteredBusStopData, setFilteredBusStopData] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [stationId, setStationId] = useRecoilState(stationInfoState);
  const [pathInfo, setPathInfo] = useRecoilState(pathState);

  const handleSearch = useCallback(
    (searchTerm) => {
      const filteredData = searchTerm
        ? busStopData.filter((item) =>
            item.stationNm["#text"].includes(searchTerm)
          )
        : [];

      setFilteredBusStopData(filteredData);
    },
    [busStopData]
  );

  const handleStationInfo = (item) => {
    console.log(item);
    const stationInfo = {
      stationId: item.stationId["#text"],
      stationNm: item.stationNm["#text"],
      dirTp:
        item.dirTp["#text"] !== "null"
          ? `[${mapDirection(item.dirTp["#text"])}]`
          : "",
    };
    localStorage.setItem("stationInfo", JSON.stringify(stationInfo));

    setStationId(stationInfo);

    const existingHistory =
      JSON.parse(localStorage.getItem("busStopSearchHistory")) || [];

    const isDuplicate = existingHistory.some(
      (historyItem) =>
        historyItem.stationId["#text"] === item.stationId["#text"]
    );

    if (!isDuplicate) {
      const updatedHistory = [...existingHistory, item];
      localStorage.setItem(
        "busStopSearchHistory",
        JSON.stringify(updatedHistory)
      );
      setHistoryItems(updatedHistory);
    }

    if (pathInfo) {
      if (pathInfo === "departure") {
        localStorage.setItem("selectedDeparture", JSON.stringify(item));
      } else if (pathInfo === "destination") {
        localStorage.setItem("selectedDestination", JSON.stringify(item));
      }
      window.location.href = "/pathSearch";
      setPathInfo();
    }
  };

  const handleHistoryEditor = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleRemoveItem = (index, e) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");

    if (isConfirmed) {
      // 로컬 스토리지에서 데이터 읽어오기
      const existingHistory =
        JSON.parse(localStorage.getItem("busStopSearchHistory")) || [];

      // 복제본 생성
      const updatedHistory = [...existingHistory];
      // 해당 인덱스의 아이템 삭제
      updatedHistory.splice(index, 1);
      // 로컬 스토리지 업데이트
      localStorage.setItem(
        "busStopSearchHistory",
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
        const response = await fetch("/api1/OpenAPI/service/bis/Station"); // 모든 버스정류장 목록정보
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const json = xmlToJson(xmlDoc);
        const filteredData = json.response.body.items.item.filter(
          (item) => item.useYn["#text"] !== "N"
        );

        setBusStopData(filteredData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 합니다.

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("busStopSearchHistory"));
    setHistoryItems(history);
  }, []);

  return (
    <div className="notice-container">
      <Header />
      <div className="mb-10">
        <p>정류소 검색</p>
        <p>정류소 검색 서비스를 이용해보세요.</p>
      </div>
      <SearchBar onSearch={handleSearch}>정류소명을 검색해주세요</SearchBar>
      <div className="busStopItems">
        {filteredBusStopData && filteredBusStopData.length > 0
          ? filteredBusStopData.map((item, idx) => (
              <Link
                to={"/busStopDetail"}
                className="busStopItem"
                key={idx}
                onClick={() => handleStationInfo(item)}
              >
                <div>
                  {`${item.stationNm["#text"]} ${
                    item.dirTp["#text"] !== "null"
                      ? `[${mapDirection(item.dirTp["#text"])}]`
                      : ""
                  }`}
                  {`(${item.stationId["#text"]})`}
                </div>
              </Link>
            ))
          : historyItems && historyItems.length > 0
          ? historyItems.map((item, idx) =>
              isEditing ? (
                <div
                  className={`busStopItem ${isEditing ? "removeHistory" : ""}`}
                  key={idx}
                >
                  <div className="flex items-center">
                    {`${item.stationNm["#text"]} ${
                      item.dirTp["#text"] !== "null"
                        ? `[${mapDirection(item.dirTp["#text"])}]`
                        : ""
                    }`}
                    <span className="busNum">{`(${item.stationId["#text"]})`}</span>
                  </div>
                  <div
                    className="removeBtn"
                    onClick={(e) =>
                      isEditing
                        ? handleRemoveItem(idx, e)
                        : handleStationInfo(item)
                    }
                  >
                    X
                  </div>
                </div>
              ) : (
                <Link
                  to={"/busStopDetail"}
                  className={`busStopItem ${isEditing ? "removeHistory" : ""}`}
                  key={idx}
                  onClick={() => handleStationInfo(item)}
                >
                  <div className="flex items-center">
                    {`${item.stationNm["#text"]} ${
                      item.dirTp["#text"] !== "null"
                        ? `[${mapDirection(item.dirTp["#text"])}]`
                        : ""
                    }`}
                    <span className="busNum">{`(${item.stationId["#text"]})`}</span>
                  </div>
                </Link>
              )
            )
          : null}
        <div className="historyeditorBtn">
          <button className="rectBtn" onClick={handleHistoryEditor}>
            {isEditing ? "편집 완료" : "검색기록 편집"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BusStopPage;
