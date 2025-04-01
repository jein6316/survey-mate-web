import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((newToken: string) => void)[] = [];

const redirectToLogout = () => {
  if (typeof window !== "undefined") {
    // window.location.href = "/api/logout"; // 🚀 서버에서 로그아웃 처리
      window.location.href = `/api/logout?redirect=${encodeURIComponent(window.location.href.replace(window.location.origin, ""))}`;
  }
};

api.interceptors.request.use(

  async (config) => {
    let accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (!accessToken && refreshToken) {
      console.log("🔄 accessToken 없음, refreshToken으로 재발급 시도");

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        accessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        if (accessToken) {
          Cookies.set("accessToken", accessToken, {
            secure: true,
            sameSite: "Strict",
          });
        }
        Cookies.set("refreshToken", newRefreshToken, {
          secure: true,
          sameSite: "Strict",
        });

        console.log("✅ 새로운 accessToken 발급 완료");
      } catch (refreshError) {
        console.error(
          "🚨 리프레시 토큰 갱신 실패! 로그아웃 실행",
          refreshError
        );
        redirectToLogout(); // 🚀 `/api/logout`으로 이동하여 서버에서 로그아웃 처리
        return Promise.reject(refreshError);
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ `response` 인터셉터에서 403 또는 401을 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ 액세스 토큰 만료 (403 Forbidden)
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.log("🔄 accessToken 만료됨, refreshToken으로 재발급 시도");

          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${Cookies.get("refreshToken")}`,
              },
            }
          );

          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          Cookies.set("accessToken", newAccessToken, {
            secure: true,
            sameSite: "Strict",
          });
          Cookies.set("refreshToken", newRefreshToken, {
            secure: true,
            sameSite: "Strict",
          });

          console.log("✅ 새로운 accessToken 발급 완료");

          refreshSubscribers.forEach((callback) => callback(newAccessToken));
          refreshSubscribers = [];
          isRefreshing = false;

          return api(originalRequest);
        } catch (refreshError) {
          console.error(
            "🚨 리프레시 토큰 갱신 실패! 로그아웃 실행",
            refreshError
          );
          redirectToLogout(); // 🚀 `/api/logout`으로 이동하여 서버에서 로그아웃 처리
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    // ✅ 리프레시 토큰도 만료된 경우 (401 Unauthorized)
    if (error.response?.status === 401) {
      console.error("🚨 리프레시 토큰 만료됨! 로그아웃 실행");
      redirectToLogout(); // 🚀 `/api/logout`으로 이동하여 서버에서 로그아웃 처리
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
