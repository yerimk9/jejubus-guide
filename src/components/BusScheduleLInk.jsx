import React from "react";

export default function BusScheduleLink({ scheduleId, children }) {
  const downloadLink = `https://bus.jeju.go.kr/data/schedule/downScheduleExcel?gscheduleId=${scheduleId}`;

  return (
    <a className="busScheduleItem" href={downloadLink} download>
      {children}
    </a>
  );
}
