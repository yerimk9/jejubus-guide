import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stationInfoState } from "../recoil/atoms/stationInfoState";
import Loading from "../components/Loading";
import noBusImg from "../assets/svgs/noBus.svg";

function BusStopDetailPage(props) {
  const [stationId, setStationId] = useRecoilState(stationInfoState);
  const [arrivalInfo, setArrivalInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stationInfoString = localStorage.getItem("stationInfo");
    if (stationInfoString) {
      const prevStationInfo = JSON.parse(stationInfoString);
      setStationId(prevStationInfo);
    }
  }, [setStationId]);

  const handleRouteInfo = (item) => {
    localStorage.setItem("routeInfo", JSON.stringify(item));
  };

  useEffect(() => {
    const fetchArrivalInfo = async () => {
      try {
        const response = await fetch(
          `/api2/api/searchArrivalInfoList.do?station_id=${stationId.stationId}` // 정류장 도착 예정 정보
        );
        const json = await response.json();
        setArrivalInfo(json);
        setLoading(false);
      } catch (error) {
        throw new Error(error);
      }
    };
    const timerId = setInterval(fetchArrivalInfo, 1000);
    return () => clearInterval(timerId);
  }, [stationId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="CheckedBusStop">
          <h2>
            {`${stationId.stationNm}${stationId.dirTp}(${stationId.stationId})`}
          </h2>
        </div>
        <div>
          {arrivalInfo.length > 0 ? (
            arrivalInfo.map((item) => (
              <Link
                to={"/busRouteDetail"}
                key={item["ROUTE_ID"]}
                onClick={() => handleRouteInfo(item)}
              >
                <div className="busDetailItem">
                  <div className="busInformation">
                    <p className="routeNumber">
                      {`${item["ROUTE_NUM"]}(${item["ROUTE_SUB_NM"]})`}
                    </p>
                    <p className="dirTipText">{`${item["ROUTE_SUB_NM"]} 방면`}</p>
                  </div>
                  <div className="timeArrivalContainer">
                    <div className="timeArrival">
                      <p className="time">{`${item["PREDICT_TRAV_TM"]}분`}</p>
                      <p className="prevStaion">{`${item["REMAIN_STATION"]}번째 전`}</p>
                    </div>
                    <div>
                      <p className="arrivalDirTip">{item["CURR_STATION_NM"]}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="noArrivalInfo">
              <div className="ml-10">
                <img src={noBusImg} alt="noBusImg" width={300} />
              </div>
              <h1>도착정보없음</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusStopDetailPage;
