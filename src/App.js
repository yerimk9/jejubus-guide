import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RouteSearchPage from "./pages/RouteSearchPage";
import PathSearchPage from "./pages/PathSearchPage";
import BusStopPage from "./pages/BusStopPage";
import NearbyStationPage from "./pages/NearbyStationPage";
import BusSchedulePage from "./pages/BusSchedulePage";
import NoticePage from "./pages/NoticePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ReviewPage from "./pages/ReviewPage";
import BusStopDetailPage from "./pages/BusStopDetailPage";
import BusRouteDetailPage from "./pages/BusRouteDetailPage";
import NoticeDetailPage from "./pages/NoticeDetailPage";
import FindPasswordPage from "./pages/FindPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<MainPage />} />
        <Route path={"/routeSearch"} element={<RouteSearchPage />} />
        <Route path={"/pathSearch"} element={<PathSearchPage />} />
        <Route path="/busStop" element={<BusStopPage />} />
        <Route path="/busStopDetail" element={<BusStopDetailPage />} />
        <Route path="/busRouteDetail" element={<BusRouteDetailPage />} />
        <Route path={"/nearByStation"} element={<NearbyStationPage />} />
        <Route path={"/busSchedule"} element={<BusSchedulePage />} />
        <Route path={"/notice"} element={<NoticePage />} />
        <Route path={"/notice/:noticeId"} element={<NoticeDetailPage />} />
        <Route path={"/review"} element={<ReviewPage />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route path={"/signup"} element={<SignupPage />} />
        <Route path={"/findPassword"} element={<FindPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
