import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";

function BusRouteDetailPage(props) {
  const [routeInfo, setRouteInfo] = useState([]);
  const [routeInfoList, setRouteInfoList] = useState([]);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api2/api/searchBusAllocList.do");
        const json = await response.json();

        // 로컬 스토리지에서 routeInfoString 가져오기
        const routeInfoString = localStorage.getItem("routeInfo");

        if (routeInfoString !== "undefined") {
          const prevRouteInfo = JSON.parse(routeInfoString);

          // busLocation에서 PLATE_NO와 일치하는 항목 찾기
          const matchingItem = json.filter(
            (item) =>
              item.PLATE_NO === prevRouteInfo.PLATE_NO ||
              (item.ROUTE_ID === prevRouteInfo.ROUTE_ID &&
                item.ROUTE_NUM === prevRouteInfo.ROUTE_NUM &&
                item.ROUTE_SUB_NM === prevRouteInfo.ROUTE_SUB_NM)
          );

          setRouteInfo(prevRouteInfo);

          if (matchingItem.length > 0) {
            // 찾았으면 routeInfo 설정
            setRouteInfo(matchingItem.length > 0 ? matchingItem[0] : []);
            setOperations(matchingItem);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // 1초에 한 번씩 busLocation 호출
    const intervalId = setInterval(fetchData, 1000);

    // 컴포넌트가 언마운트될 때 clearInterval로 interval 정리
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api2/api/searchBusRouteStationList.do?route_id=${routeInfo["ROUTE_ID"]}` // 버스가 어디어디 들르는지
        );
        const json = await response.json();
        setRouteInfoList(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [routeInfo]);

  return (
    <div>
      <Header />
      <div className="container">
        {routeInfo["ROUTE_NUM"] !== undefined && routeInfoList.length > 1 ? (
          <div className={"CheckedBusRoute"}>
            <h2>{`${routeInfo["ROUTE_NUM"]} (${routeInfo["ROUTE_SUB_NM"]})`}</h2>
            <p className={"dirTipText"}>
              {`${routeInfoList[0]["STATION_NM"]} ~ ${
                routeInfoList[routeInfoList.length - 1]["STATION_NM"]
              }`}
            </p>
          </div>
        ) : (
          <div className={"CheckedBusRoute"}>
            <h2>잠시만 기다려주세요 ...</h2>
          </div>
        )}

        <div className={"RouteStationList"}>
          <div className={"operation"}>{`운행중 ${operations.length}대`}</div>
          {routeInfoList.length > 1 ? (
            routeInfoList.map((item) => (
              <div key={item["STATION_ORD"]}>
                <div className={"RouteStationItem"}>
                  {`${item["STATION_ORD"]}. ${item["STATION_NM"]} (${item["STATION_ID"]})`}
                  {operations.map((busInfo, idx) =>
                    busInfo["CURR_STATION_NM"] === item["STATION_NM"] &&
                    busInfo["CURR_STATION_ID"] === item["STATION_ID"] ? (
                      <div className={"realTiemBusContainer"} key={idx}>
                        {/* <img
                          src={bus}
                          alt="realTimeBus"
                          className={realTiemBus}
                        /> */}
                        {/* <p>⬇️</p> */}
                        <p>{busInfo["PLATE_NO"]}</p>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>
  );
}

export default BusRouteDetailPage;
