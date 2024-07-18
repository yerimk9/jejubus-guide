import { selector } from "recoil";
import { stationInfoState } from "../atoms/stationInfoState";

export const stationInfoReadState = selector({
  key: "stationidReadState",
  get: ({ get }) => {
    const stationInfo = get(stationInfoState);

    return stationInfo;
  },
});
