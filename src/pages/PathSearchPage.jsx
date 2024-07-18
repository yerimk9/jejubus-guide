import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useRecoilState } from "recoil";
import { pathState } from "../recoil/atoms/pathState";

function PathSearchPage(props) {
  const [departure, setDeparture] = useState(""); // 출발지
  const [destination, setDestination] = useState(""); // 도착지
  const [pathInfo, setPathInfo] = useRecoilState(pathState);
  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate("/busStop");
    if (name === "departure") {
      setPathInfo("departure");
    } else if (name === "destination") {
      setPathInfo("destination");
    }
  };
  const handleFindPath = () => {
    window.open(
      `http://m.map.naver.com/route.nhn?menu=route&sname=${departure.stationNm}&sx=${departure.localX}&sy=${departure.localY}&ename=${destination.stationNm}&ex=${destination.localX}&ey=${destination.localY}&pathType=0&showMap=true`
    );
    localStorage.removeItem("selectedDeparture");
    localStorage.removeItem("selectedDestination");
  };
  useEffect(() => {
    const selectedDeparture = JSON.parse(
      localStorage.getItem("selectedDeparture")
    );
    const selectedDestination = JSON.parse(
      localStorage.getItem("selectedDestination")
    );
    if (selectedDeparture) {
      const { localX, localY, stationNm } = selectedDeparture;
      setDeparture({
        localX: localX["#text"],
        localY: localY["#text"],
        stationNm: stationNm["#text"],
      });
    }
    if (selectedDestination) {
      const { localX, localY, stationNm } = selectedDestination;
      setDestination({
        localX: localX["#text"],
        localY: localY["#text"],
        stationNm: stationNm["#text"],
      });
    }
  }, [pathInfo]);

  return (
    <div className="notice-container">
      <Header />
      <div>
        <p>경로 검색</p>
        <p>빠른 길찾기를 이용해보세요.</p>
      </div>
      <div className="inputContainer">
        <div className="input">
          <input
            name="departure"
            type="text"
            placeholder="출발지"
            defaultValue={departure.stationNm}
            onClick={() => handleClick("departure")}
          />
        </div>

        <div className="input">
          <input
            name="destination"
            type="text"
            placeholder="도착지"
            defaultValue={destination.stationNm}
            onClick={() => handleClick("destination")}
          />
        </div>

        <div>
          <button className="rectBtn" type="button" onClick={handleFindPath}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
}

export default PathSearchPage;
