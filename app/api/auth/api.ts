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
    window.location.href = `/api/logout?redirect=${encodeURIComponent(
      window.location.href.replace(window.location.origin, "")
    )}`;
  }
};

api.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (!accessToken && refreshToken) {
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
      } catch (refreshError) {
        redirectToLogout();
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

// response 인터셉터에서 403 또는 401을 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 액세스 토큰 만료 (403 Forbidden)
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // 리프레시 토큰을 사용하여 새로운 액세스 토큰을 요청
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
          refreshSubscribers.forEach((callback) => callback(newAccessToken));
          refreshSubscribers = [];
          isRefreshing = false;

          return api(originalRequest);
        } catch (refreshError) {
          redirectToLogout();
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

    //리프레시 토큰도 만료된 경우 (401 Unauthorized)
    if (error.response?.status === 401) {
      redirectToLogout();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
