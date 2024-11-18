import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
//import { getUser } from 'app/db';
import { authConfig } from 'app/auth.config';
import axios from 'axios';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        debugger;
        /*let user = await getUser(email);
        if (user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0].password!);
        if (passwordsMatch) return user[0] as any;*/


        // 외부 서버와의 통신을 통해 유저 정보와 토큰을 가져옵니다.
        const response : any = await axios.post('https://localhost:8080/api/auth/login', {
          email,
          password
        });
        debugger;
        const data : any = response.data;
        debugger;
        if (data) {
          // 유저 정보와 토큰을 NextAuth.js 세션에 저장합니다.
          return {
            name: data.name,
            email: data.email,
            token: data.token
          };
        } else {
          // 로그인 실패 시 null을 반환합니다.4
          debugger;
          return null;
        }
      },
    }),
  ],
});
