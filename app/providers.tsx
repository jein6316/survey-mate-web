"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, ReactNode } from "react";
import { setupGlobals } from "@/app/utils/global";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import i18n from "@/app/libs/i18n";
import { I18nextProvider } from "react-i18next";

interface ProvidersProps {
  children: ReactNode;
}

const AuthInitializer = () => {
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    const getUserFromToken = () => {
      const token = Cookies.get("accessToken");

      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          return {
            isLoggedIn: true,
            userId: decoded.sub || "",
            username: decoded.username || "",
            role: decoded.role || "guest",
            social: decoded.social === 0 ? "homepage" : "google",
            email: decoded.email || "",
            exp: decoded.exp || 0,
          };
        } catch (error) {
          console.error("JWT 디코딩 실패:", error);
        }
      }

      return {
        isLoggedIn: false,
        userId: "",
        username: "",
        role: "guest",
        social: "homepage",
        email: "",
        exp: 0,
      };
    };

    setUser(getUserFromToken()); // 로그인 상태 자동 반영
  }, []);

  return null;
};

function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  setupGlobals();

  return (
    <I18nextProvider i18n={i18n}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer />
          {children}
        </QueryClientProvider>
      </RecoilRoot>
    </I18nextProvider>
  );
}

// export default appWithTranslation(Providers);
export default Providers;
