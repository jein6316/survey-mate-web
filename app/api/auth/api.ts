import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
/**************************
토큰 검증
***************************/

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`, // API 서버 주소
  withCredentials: true, // HttpOnly 쿠키 전송 활성화
});

let isRefreshing = false; // 현재 토큰 갱신 중인지 확인
let refreshSubscribers: ((newToken: any) => void)[] = []; // 실패한 요청을 대기열에 저장

// 모든 요청에 Authorization 헤더 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken"); // 쿠키에서 토큰 읽기
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 시 처리
api.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // 중복 요청 방지 플래그
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // 리프레시 토큰으로 새 액세스 토큰 발급 요청
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
            {
              withCredentials: true, // 쿠키 자동 전송
            }
          );
          const accessToken = data.data.accessToken;
          const refreshToken = data.data.refreshToken;
          const decodedAccess = jwtDecode(accessToken);
          const decodedRefresh = jwtDecode(refreshToken);
          let expirationDate = new Date();
          let refreshExpirationDate = new Date();

          if (decodedAccess.exp && decodedRefresh.exp) {
            expirationDate = new Date(decodedAccess.exp * 1000);
            refreshExpirationDate = new Date(decodedRefresh.exp * 1000);
            console.log("토큰 만료 시간:", expirationDate);
          } else {
            console.error("토큰에 만료 시간(exp)이 포함되지 않았습니다.");
            alert("로그인 실패하였습니다.");
            return;
          }

          const newAccessToken = data.accessToken;
          Cookies.set("accessToken", data.accessToken, {
            httpOnly: false, // 클라이언트에서 접근 가능 (httpOnly는 서버에서만 설정 가능)
            secure: true, // HTTPS 환경에서만 전송
            sameSite: "Strict", // CSRF 방어
            expires: expirationDate, // 유효시간
          });
          Cookies.set("refreshToken", data.refreshToken, {
            httpOnly: false, // 클라이언트에서 접근 가능 (httpOnly는 서버에서만 설정 가능)
            secure: true, // HTTPS 환경에서만 전송
            sameSite: "Strict", // CSRF 방어
            expires: refreshExpirationDate, // 유효 시간
          });

          // 대기 중인 요청에 새로운 토큰 적용
          refreshSubscribers.forEach((callback) => callback(newAccessToken));
          refreshSubscribers = []; // 대기열 초기화
          isRefreshing = false;

          // 실패한 요청 재시도
          return api(originalRequest);
        } catch (refreshError) {
          // 리프레시 토큰도 만료되었을 경우 처리 (예: 로그아웃)
          console.error("Refresh token expired:", refreshError);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          window.location.href = "/"; // 로그인 페이지로 리다이렉트
          return Promise.reject(refreshError);
        }
      }

      // 리프레시 토큰이 갱신될 때까지 대기
      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error); // 다른 에러는 그대로 처리
  }
);

export default api;
