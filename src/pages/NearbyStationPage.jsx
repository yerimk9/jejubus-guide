import React from "react";
import Header from "../components/Header";
import GoogleAPIMap from "../components/GoogleAPIMap";

function NearbyStationPage(props) {
  return (
    <div className="notice-container">
      <Header />
      <div>
        <p>주변 정류소</p>
        <p>현재 위치의 2000m(2km)내의 버스정류장이 표시됩니다.</p>
      </div>
      <div className="w-full h-96 mt-10">
        <GoogleAPIMap />
      </div>
    </div>
  );
}

export default NearbyStationPage;
