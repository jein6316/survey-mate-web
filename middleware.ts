import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const REFRESH_TOKEN_API = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`;

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const { pathname, search } = new URL(request.url);

  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. Access Token이 존재하면 요청을 계속 진행
  if (token) {
    return NextResponse.next();
  }

  // 2. Access Token과 Refresh Token이 모두 없으면 로그아웃 처리
  if (!refreshToken) {
    const redirectUrl = encodeURIComponent(`${pathname}${search}`);
    const logoutUrl = `/web-api/logout?redirect=${redirectUrl}`;
    return NextResponse.redirect(new URL(logoutUrl, request.url)); //서버에서 로그아웃 시 원래 가려던 주소 파라미터 보냄

    // return NextResponse.redirect(new URL("/api/logout", request.url)); //서버에서 로그아웃 처리
  }

  //  3. Refresh Token이 있는 경우 Access Token 갱신 시도
  try {
    const response = await axios.post(
      REFRESH_TOKEN_API,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );

    // Access Token 재발행 성공
    if (response.data.result) {
      const newAccessToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken;

      //  토큰 만료 시간 설정
      const decodedAccess = jwtDecode(newAccessToken);
      const decodedRefresh = jwtDecode(newRefreshToken);

      let expirationDate = decodedAccess.exp
        ? new Date(decodedAccess.exp * 1000)
        : new Date();
      let refreshExpirationDate = decodedRefresh.exp
        ? new Date(decodedRefresh.exp * 1000)
        : new Date();

      // 새로운 토큰을 설정한 응답 반환
      const responseWithToken = NextResponse.next();

      responseWithToken.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: expirationDate,
      });

      responseWithToken.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: refreshExpirationDate,
      });

      return responseWithToken;
    } else {
      return NextResponse.redirect(new URL("/web-api/logout", request.url)); // 서버에서 로그아웃 처리
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/web-api/logout", request.url)); // 서버에서 로그아웃 처리
  }
}

// 미들웨어 적용 경로 설정
export const config = {
  matcher: ["/dashboard/:path*", "/group/:path*", "/survey/:path*"], //보호된 경로에만 미들웨어 적용
};
