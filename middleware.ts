"use client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// API URL: Access Token 재발행을 위한 API 엔드포인트
const REFRESH_TOKEN_API = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`;

// 미들웨어 함수
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  console.log("미들웨어 체크 url" + url);
  if (url.startsWith("/main")) {
    return NextResponse.next(); // 미들웨어를 건너뜀
  }
  console.log(">>>>>>>>>>>>>>>>>>>>미들웨어 체크");

  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("미들웨어 체크 token:" + token);
  console.log("미들웨어 체크 refreshToken:" + refreshToken);
  // 1. Access Token이 존재하면 요청을 계속 진행
  if (token) {
    console.log("1. Access Token이 존재하면 요청을 계속 진행");
    return NextResponse.next();
  }

  // 2. Access Token이 없고 Refresh Token이 없으면 홈으로 리다이렉트
  if (!refreshToken) {
    console.log(
      "2. Access Token이 없고 Refresh Token이 없으면 홈으로 리다이렉트"
    );
    // 로그아웃 처리 및 메인 페이지로 리다이렉트
    const response = NextResponse.redirect(new URL("/", request.url));

    // 쿠키 삭제
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("social");
    response.cookies.delete("user_role");

    return response;
  }

  // 3. Refresh Token이 있는 경우 Access Token 재발행 시도
  try {
    console.log("3. Refresh Token이 있는 경우 Access Token 재발행 시도");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`, // 헤더에 Bearer 토큰 추가
        },
      }
    );

    console.log("4. response.data.result : " + response.data.result);
    console.log("4. response.data.data : " + response.data.data);
    console.log(
      "4. response.data.data accessToken : " + response.data.data.accessToken
    );
    // 응답 성공 시 Access Token 설정
    if (response.data.result) {
      // Access Token을 쿠키에 설정
      const responseWithToken = NextResponse.next();
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      console.log("4. accessToken : " + accessToken);
      console.log("4. refreshToken : " + refreshToken);
      const decodedAccess = jwtDecode(accessToken);
      const decodedRefresh = jwtDecode(refreshToken);
      console.log("4. decodedAccess : " + decodedAccess);
      console.log("4. decodedRefresh : " + decodedRefresh);
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
      /*expirationDate.setSeconds(expirationDate.getSeconds() + 10);
      refreshExpirationDate.setSeconds(refreshExpirationDate.getSeconds() + 20);
      */
      responseWithToken.cookies.set("accessToken", accessToken, {
        httpOnly: true, // 클라이언트에서 접근 불가
        secure: true, // HTTPS 환경에서만 전송
        sameSite: "strict", // CSRF 방어
        expires: expirationDate, // 만료 시간
      });

      responseWithToken.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: refreshExpirationDate,
      });
      console.log(
        "!!!!미들웨어 요청 재시도 responseWithToken" + responseWithToken
      );
      return responseWithToken;
    } else {
      // Refresh Token이 유효하지 않은 경우 홈으로 리다이렉트
      console.log("Refresh Token이 유효하지 않은 경우 홈으로 리다이렉트");
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    console.log("헤이헤이헤이");
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: ["/pages/dashboard/user/:path*"], // '/protected' 이하의 모든 경로에 미들웨어 적용
};
