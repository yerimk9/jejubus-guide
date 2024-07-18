import React, { useState } from "react";
import Header from "../components/Header";
import mock from "../data/mock.json";
import BusScheduleLink from "../components/BusScheduleLInk";

export default function BusSchedulePage(props) {
  const [selectedBusType, setSelectedBusType] = useState("급행");
  const [selectedButtonType, setSelectedButtonType] = useState(null);

  const handleBusTypeClick = (busType) => {
    setSelectedBusType(busType);
    setSelectedButtonType(busType);
  };

  const renderBusSchduleItems = (type) => {
    const selectedBusData =
      type === "1st"
        ? mock["1st"][selectedBusType]
        : mock["2st"][selectedBusType];

    return selectedBusData
      ? selectedBusData.map((schedule) => (
          <BusScheduleLink key={schedule.id} scheduleId={schedule.id}>
            {schedule.number}
          </BusScheduleLink>
        ))
      : null;
  };

  return (
    <div className="notice-container">
      <Header />
      <div>
        <p>버스 시간표</p>
        <p>
          제주버스 시간표를 미리미리 확인하세요.
          <br />
          <span className="text-sm">
            ( 버스 노선을 클릭하시면 시간표가 다운로드됩니다. )
          </span>
        </p>
      </div>
      <div className="busScheduleContainer">
        <div className="busScheduleTitle">
          {Object.keys(mock["1st"]).map((busType) => (
            <button
              key={busType}
              className={`titleBtn ${
                selectedButtonType === busType ? "selectedBtn" : ""
              }`}
              type="button"
              onClick={() => handleBusTypeClick(busType)}
            >
              {busType}
            </button>
          ))}
        </div>
        <div className="busScheduleItems">{renderBusSchduleItems("1st")}</div>
        <div className="busScheduleTitle">
          {Object.keys(mock["2st"]).map((busType) => (
            <button
              key={busType}
              className={`titleBtn ${
                selectedButtonType === busType ? "selectedBtn" : ""
              }`}
              type="button"
              onClick={() => handleBusTypeClick(busType)}
            >
              {busType}
            </button>
          ))}
        </div>
        <div className="busScheduleItems">{renderBusSchduleItems("2st")}</div>
      </div>
    </div>
  );
}
