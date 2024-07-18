import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LinkToPage from "../components/LinkToPage";
import { Link } from "react-router-dom";
import busStopImg from "../assets/pngs/busStop.png";
import locationImg from "../assets/pngs/location.png";
import pathSearchImg from "../assets/pngs/pathSearch.png";
import routeImg from "../assets/pngs/route.png";
import scheduleImg from "../assets/pngs/schedule.png";
import { getNotice } from "../services/getNotice";

function MainPage(props) {
  const [noticeData, setNoticeData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getNotice(0, 6);
        setNoticeData(data);
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    }

    fetchData();
  }, []);
  return (
    <div>
      <Header />
      <div className="bg-[#FDE49E]">
        <div className="wrap1-head">
          <div className="text-3xl text-[ #274356]">
            버스 정보가 필요할 때, 쉽고 빠른
          </div>
          <div className="text-5xl font-bold">제주버스</div>
        </div>
        <div className="wrap-1">
          <LinkToPage link={"/busStop"}>
            <div>
              <div>정류소에 버스 몇 분 남았지?</div>
              <div className="text-[28px] font-bold">정류소 검색 바로가기</div>
            </div>
            <img src={busStopImg} alt="busStopImg" width={200} />
          </LinkToPage>
          <LinkToPage imgUrl={routeImg} link={"/routeSearch"}>
            <div>
              편리한 대중교통 이용을 위한
              <br /> 노선 검색 서비스
            </div>
            <div>노선 검색</div>
          </LinkToPage>
          <LinkToPage imgUrl={pathSearchImg} link={"/pathSearch"}>
            <div>
              출발지부터 도착지까지,
              <br /> 스마트한 노선 검색
            </div>
            <div>경로 검색</div>
          </LinkToPage>
          <LinkToPage imgUrl={locationImg} link={"/nearByStation"}>
            <div>
              길 잃지 마세요,
              <br />
              주변 정류소 알려드릴께요
            </div>
            <div>주변 정류소</div>
          </LinkToPage>
          <LinkToPage imgUrl={scheduleImg} link={"/busSchedule"}>
            <div>
              시간을 절약하는
              <br /> 스마트한 버스 시간표
            </div>
            <div>버스시간표</div>
          </LinkToPage>
        </div>
      </div>
      <div>
        <div className="wrap-2">
          <div>
            <div className="flex justify-between items-center border-[#eaeaea] border-b-[1px] pb-4 ">
              <div className="text-2xl font-bold">공지사항</div>
              <Link to={"/notice"} className="link">
                &nbsp;&nbsp;&nbsp;&nbsp;
              </Link>
            </div>
            <div className="mt-12">
              <ul className="flex flex-col gap-6">
                {noticeData.map((item, idx) => (
                  <Link
                    to={`/notice/${item.noticeId}`}
                    key={item["noticeId"]}
                    state={{ item: item }}
                  >
                    <li className="flex justify-between items-center cursor-pointer">
                      <div>{item["noticeTitle"]}</div>
                      <div
                        className="text-sm text-[#909090]
"
                      >
                        {item["dateOnlyStr"]}
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="wrap-3 text-white">
          <div>
            제주 버스오맨 앱을 통해 <br />
            쉽고 빠른 대중교통을 이용해본 경험을 이야기해주세요.
          </div>
          <div className="mt-2.5 text-base text-[#c7d2dd] mb-16">
            욕설, 비방 금지 ( 조언 환영 )
          </div>
          <Link to={"/review"} className="reviewBtn">
            리뷰 바로가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
