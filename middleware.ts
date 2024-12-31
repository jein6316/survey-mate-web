import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// API URL: Access Token 재발행을 위한 API 엔드포인트
const REFRESH_TOKEN_API = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`;

// 미들웨어 함수
export async function middleware(request: NextRequest) {
  debugger;
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. Access Token이 존재하면 요청을 계속 진행
  if (token) {
    return NextResponse.next();
  }

  // 2. Access Token이 없고 Refresh Token이 없으면 홈으로 리다이렉트
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Refresh Token이 있는 경우 Access Token 재발행 시도
  try {
    const response = await axios.post(REFRESH_TOKEN_API, {
      params: { refreshToken }, // GET 요청의 쿼리 파라미터로 전달
    });

    // 응답 성공 시 Access Token 설정
    if (response.data.result) {
      // Access Token을 쿠키에 설정
      const responseWithToken = NextResponse.next();
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const decodedAccess = jwtDecode(accessToken);
      const decodedRefresh = jwtDecode(accessToken);
      let expirationDate = new Date();
      let refreshExpirationDate = new Date();
      if (decodedAccess.exp && decodedRefresh.exp) {
        expirationDate = new Date(decodedAccess.exp * 1000);
        refreshExpirationDate = new Date(decodedRefresh.exp * 1000);
        console.log("토큰 만료 시간:", expirationDate);
      } else {
        console.error("토큰에 만료 시간(exp)이 포함되지 않았습니다.");
        alert("토큰갱신 실패하였습니다.");
        return;
      }
      Cookies.set("accessToken", accessToken, {
        httpOnly: false, // 클라이언트에서 접근 가능 (httpOnly는 서버에서만 설정 가능)
        secure: true, // HTTPS 환경에서만 전송
        sameSite: "Strict", // CSRF 방어
        expires: expirationDate, // 유효시간
      });
      Cookies.set("refreshToken", refreshToken, {
        httpOnly: false, // 클라이언트에서 접근 가능 (httpOnly는 서버에서만 설정 가능)
        secure: true, // HTTPS 환경에서만 전송
        sameSite: "Strict", // CSRF 방어
        expires: refreshExpirationDate, // 유효 시간
      });

      return responseWithToken;
    } else {
      // Refresh Token이 유효하지 않은 경우 홈으로 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: ["/pages/dashboard/user/:path*"], // '/protected' 이하의 모든 경로에 미들웨어 적용
};
