/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 프론트에서 사용할 환경변수 선언
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  },
};

module.exports = nextConfig;
