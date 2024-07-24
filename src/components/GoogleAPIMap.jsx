import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import React, { useState } from "react";
import Loading from "./Loading";
import Modal from "./Modal";

function GoogleAPIMap() {
  const [center, setCenter] = useState({ lat: 37.7937, lng: -122.3965 });
  const [busStops, setBusStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);
  const [modalVisible, setModalVisible] = useState(true); // 모달 상태 추가

  const fetchBusStops = async (location) => {
    try {
      const response = await fetch(
        `/googleMap/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=2000&type=bus_station&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBusStops(data.results);
    } catch (error) {
      console.error("Error fetching bus stops:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = ({ coords }) => {
    const userLocation = {
      lat: coords.latitude,
      lng: coords.longitude,
    };
    setCenter(userLocation);
    fetchBusStops(userLocation);
    setLocationFetched(true);
  };

  const onError = (error) => {
    console.error("Error getting geolocation:", error);
    setLoading(false);
  };

  const handleGetLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  const handleModalConfirm = () => {
    setModalVisible(false);
    handleGetLocation();
  };

  const handleModalCancel = () => {
    setModalVisible(false); // 모달 숨기기
    setLocationFetched(false); // 구글 맵을 표시하지 않음
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {modalVisible && (
        <Modal onConfirm={handleModalConfirm} onCancel={handleModalCancel} />
      )}
      {locationFetched && (
        <Map
          defaultZoom={15}
          center={center}
          mapId={process.env.REACT_APP_GOOGLE_API_KEY}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {busStops.map((poi, idx) => (
            <AdvancedMarker
              key={idx}
              position={{
                lat: poi.geometry.location.lat,
                lng: poi.geometry.location.lng,
              }}
            >
              <Pin
                background={"#1e4066"}
                glyphColor={"#fff"}
                borderColor={"#000"}
              />
            </AdvancedMarker>
          ))}
          <div className="pb-20">
            <div className="flex gap-2 md:gap-20 lg:gap-40 text-left px-4 py-2 mt-10 bg-[#1e4066] text-white">
              <div className="w-16 lg:w-10">번호</div>
              <div className="w-96 lg:w-96">정류소 명</div>
              <div className="w-20 lg:w-60">평점</div>
            </div>
            <ul className="h-80 overflow-scroll">
              {busStops.map((busStop, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 md:gap-20 lg:gap-40 text-left border-b-[1px] border-[#e6e6e6] px-4 py-2"
                >
                  <div className="w-16 lg:w-10">{idx + 1}</div>
                  <div className="w-96 lg:w-96">{busStop.name} 정류장</div>
                  <div className="w-20 lg:w-60">{busStop.rating ?? "X"}</div>
                </li>
              ))}
            </ul>
          </div>
        </Map>
      )}
    </>
  );
}

export default GoogleAPIMap;
