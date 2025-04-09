import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//서버사이드 로그아웃 처리
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirectPath = url.searchParams.get("redirect");
  let redirectQueryString;
  if (redirectPath) {
    redirectQueryString = `/?redirect=${encodeURIComponent(redirectPath)}`;
  } else {
    redirectQueryString = "/";
  }
  const res = NextResponse.redirect(new URL(redirectQueryString, req.url)); // 기본적으로 홈(`/`)으로 이동

  //쿠키에서 `social` 값을 가져오기
  const socialType = req.cookies.get("social")?.value;

  // 모든 쿠키 삭제 (액세스 토큰, 리프레시 토큰, 소셜 타입)
  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");

  // 구글 로그인 사용자의 경우 구글 로그아웃 URL로 리디렉트
  if (socialType === "google") {
    res.cookies.delete("social");
    return NextResponse.redirect("https://accounts.google.com/Logout");
  }
  res.cookies.delete("social");
  return res;
}
