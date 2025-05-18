import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//서버사이드 로그아웃 처리
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirectPath = url.searchParams.get("redirect");
  let redirectQueryString;
  if (redirectPath) {
    redirectQueryString = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/?redirect=${encodeURIComponent(redirectPath)}`;
  } else {
    redirectQueryString = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/`;
  }
  const res = NextResponse.redirect(new URL(redirectQueryString, req.url));

  const socialType = req.cookies.get("social")?.value;
  // 쿠키에서 accessToken과 refreshToken 삭제
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
