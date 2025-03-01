import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const REFRESH_TOKEN_API = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`;

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  console.log("🚀 미들웨어 실행 - URL:", url);

  // ✅ 특정 페이지 (`/main`)는 미들웨어 적용 제외
  if (url.startsWith("/main")) {
    return NextResponse.next();
  }

  console.log("🔍 미들웨어 검사 시작");

  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  console.log("🔑 Access Token:", token);
  console.log("🔄 Refresh Token:", refreshToken);

  // ✅ 1. Access Token이 존재하면 요청을 계속 진행
  if (token) {
    console.log("✅ 유효한 Access Token 존재 → 요청 계속 진행");
    return NextResponse.next();
  }

  // ✅ 2. Access Token과 Refresh Token이 모두 없으면 로그아웃 처리
  if (!refreshToken) {
    console.log("❌ 토큰 없음 → 로그아웃 처리");
    return NextResponse.redirect(new URL("/api/logout", request.url)); // 🚀 서버에서 로그아웃 처리
  }

  // ✅ 3. Refresh Token이 있는 경우 Access Token 갱신 시도
  try {
    console.log("🔄 Refresh Token을 사용하여 Access Token 갱신 시도...");

    const response = await axios.post(
      REFRESH_TOKEN_API,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );

    // ✅ Access Token 재발행 성공
    if (response.data.result) {
      console.log("✅ 새로운 Access Token 발급 완료");

      const newAccessToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken;

      // ✅ 토큰 만료 시간 설정
      const decodedAccess = jwtDecode(newAccessToken);
      const decodedRefresh = jwtDecode(newRefreshToken);

      let expirationDate = decodedAccess.exp
        ? new Date(decodedAccess.exp * 1000)
        : new Date();
      let refreshExpirationDate = decodedRefresh.exp
        ? new Date(decodedRefresh.exp * 1000)
        : new Date();

      // ✅ 새로운 토큰을 설정한 응답 반환
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

      console.log("✅ 새로운 Access Token이 설정되었습니다.");
      return responseWithToken;
    } else {
      console.log("❌ Refresh Token이 유효하지 않음 → 로그아웃 처리");
      return NextResponse.redirect(new URL("/api/logout", request.url)); // 🚀 서버에서 로그아웃 처리
    }
  } catch (error) {
    console.error("🚨 토큰 갱신 중 오류 발생:", error);
    return NextResponse.redirect(new URL("/api/logout", request.url)); // 🚀 서버에서 로그아웃 처리
  }
}

// ✅ 미들웨어 적용 경로 설정
export const config = {
  matcher: ["/dashboard/:path*", "/protected/:path*"], // 🚀 보호된 경로에만 미들웨어 적용
};
