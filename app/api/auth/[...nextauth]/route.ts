export { GET, POST } from 'app/auth';
export const authOptions = {
    pages: {
      signIn: '/login',
      error: '/auth/error',
      // 로그인 후 리디렉션할 URL을 설정
      redirect: '/dashboard', // 또는 dynamic URL을 설정할 수 있음
    },
  };