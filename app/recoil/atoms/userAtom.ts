import { atom, selector } from "recoil";

// 사용자 정보 타입 정의
export interface UserState {
  isLoggedIn: boolean;
  userId: string;
  username: string;
  roles: string;
  social: string;
  groupId: string;
  email: string;
  exp: number;
}

export const userAtom = atom<UserState>({
  key: "userAtom",
  default: {
    isLoggedIn: false,
    userId: "",
    username: "",
    roles: "guest",
    social: "homepage",
    groupId: "",
    email: "",
    exp: 0,
  },
});
