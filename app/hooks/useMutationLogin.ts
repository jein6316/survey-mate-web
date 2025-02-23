import { useRouter } from "next/navigation";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { APIResponse } from "../types/apiTypes";
import useUser from "../recoil/hooks/useUser";

const useMutationLogin = <TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) => {
  const router = useRouter();
  const { setUserFromToken } = useUser();

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data: TData, variables, context) => {
      try {
        // 액세스 및 리프레시 토큰 추출
        const { accessToken, refreshToken } = (data as APIResponse).data;

        // 토큰 디코딩
        const decodedAccess = jwt.decode(accessToken) as JwtPayload | null;
        const decodedRefresh = jwt.decode(refreshToken) as JwtPayload | null;
        if (
          !decodedAccess ||
          !decodedAccess.exp ||
          !decodedRefresh ||
          !decodedRefresh.exp
        ) {
          throw new Error(
            "유효하지 않은 토큰 또는 만료 시간이 존재하지 않습니다."
          );
        }

        // 만료 날짜 계산
        const expirationDate = new Date(decodedAccess.exp * 1000);
        const refreshExpirationDate = new Date(decodedRefresh.exp * 1000);

        //권한
        const user_role = decodedAccess.roles[0];

        //로그인 타입
        const social = decodedAccess.social; //0:홈페이지, 1:구글

        // 쿠키에 저장
        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "Strict",
          expires: expirationDate,
        });
        Cookies.set("refreshToken", refreshToken, {
          secure: true,
          sameSite: "Strict",
          expires: refreshExpirationDate,
        });

        setUserFromToken(); // 로그인 상태 반영
        // Cookies.set("user_role", user_role, {
        //   secure: true,
        //   sameSite: "Strict",
        //   expires: expirationDate,
        // });
        // Cookies.set("social", social, {
        //   secure: true,
        //   sameSite: "Strict",
        //   expires: expirationDate,
        // });

        // 성공적으로 처리 후 리다이렉트
        router.push(urlConstants.pages.USERDASHBOARD); // 로그인 후 대시보드 페이지로 이동
      } catch (error) {
        console.error("토큰 처리 오류:", error);
        alert("로그인 처리 중 오류가 발생하였습니다.");
      }

      // 사용자 정의 onSuccess 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: Error, variables, context) => {
      // 공통 에러 처리
      console.error("Mutation Error:", error.message);
      alert("요청 처리 중 오류가 발생하였습니다.");

      // 사용자 정의 onError 호출
      if (options?.onError) {
        options.onError(error, variables, context); // 모든 인수 전달
      }
    },
    ...options, // 사용자가 정의한 옵션 병합
  });
};

export default useMutationLogin;
