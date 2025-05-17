"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, ReactNode } from "react";
import { setupGlobals } from "@/app/utils/global";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import i18n from "@/app/libs/i18n";
import { I18nextProvider } from "react-i18next";
import { getUserFromToken } from "@/app/recoil/hooks/useUser";

const AuthInitializer = () => {
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
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

export default Providers;
