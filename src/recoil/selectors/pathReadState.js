import { selector } from "recoil";
import { pathState } from "../atoms/pathState";

export const pathReadState = selector({
  key: "pathReadState",
  get: ({ get }) => {
    const pathInfo = get(pathState);

    return pathInfo;
  },
});
