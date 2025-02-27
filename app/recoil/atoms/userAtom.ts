import { atom, selector } from "recoil";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// 사용자 정보 타입 정의
export interface UserState {
  isLoggedIn: boolean;
  userId: string;
  username: string;
  role: string;
  social: string;
  groupCode: string;
  email: string;
  exp: number;
}

export const userAtom = atom<UserState>({
  key: "userAtom",
  default: {
    isLoggedIn: false,
    userId: "",
    username: "",
    role: "guest",
    social: "homepage",
    groupCode: "",
    email: "",
    exp: 0,
  },
});
