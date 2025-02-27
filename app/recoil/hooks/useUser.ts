import { useSetRecoilState } from "recoil";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { UserState } from "@/app/recoil/atoms/userAtom";

/* 쿠키에서 토큰을 가져와 유저 정보를 반환하는 함수 */
export const getUserFromToken = (): UserState => {
  const token = Cookies.get("accessToken");

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      return {
        isLoggedIn: true,
        userId: decoded.sub || "",
        username: decoded.username || "",
        role: decoded.role || "guest",
        social: decoded.social === 0 ? "homepage" : "google",
        groupCode: decoded.groupCode,
        email: decoded.email || "",
        exp: decoded.exp || 0,
      };
    } catch (error) {
      console.error("JWT 디코딩 실패:", error);
    }
  }

  return {
    isLoggedIn: false,
    userId: "",
    username: "",
    role: "guest",
    social: "homepage",
    groupCode:"",
    email: "",
    exp: 0,
  };
};

const useUser = () => {
  const setUser = useSetRecoilState(userAtom);

  /*  쿠키에서 토큰을 읽고 userAtom을 업데이트하는 함수 */
  const setUserFromToken = () => {
    setUser(getUserFromToken()); // 최신 로그인 상태 반영
  };

  return { setUserFromToken };
};

export default useUser;
