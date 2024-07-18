import React from "react";
import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="container flex flex-col gap-10 items-center justify-center mt-[80px]">
      <ClipLoader
        color="#1e4066"
        cssOverride={{
          "border-width": "10px",
        }}
        loading
        size={190}
        speedMultiplier={1}
      />
      <div className="text-[#1e4066]">데이터를 불러오는 중입니다...</div>
    </div>
  );
}
