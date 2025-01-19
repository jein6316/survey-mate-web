import Cookies from "js-cookie";

/* 쿠키 삭제 함수 */
const removeCookies = () => {
  if (typeof window !== "undefined") {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("social");
    Cookies.remove("user_role");
  }
};

/* 로그아웃 함수 */
export const logout = () => {
  // 브라우저 환경이 아닌 경우 종료
  if (typeof window === "undefined") {
    return;
  }

  const loginType = "google"; // 로그인 유형 (실제 로직에 따라 동적으로 설정)

  if (loginType === "google") {
    // 구글 로그아웃 처리
    removeCookies();

    // 구글 로그아웃 URL로 리다이렉트
    const googleLogoutUrl = "https://accounts.google.com/Logout";
    window.location.href = googleLogoutUrl;
    return; // 이후 코드 실행 방지
  }

  // 일반 로그아웃 처리
  removeCookies();

  // 메인 페이지로 리다이렉트
  window.location.href = "/";
};
