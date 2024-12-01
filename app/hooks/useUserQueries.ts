import { useMutation } from '@tanstack/react-query';
import { loginSubmit } from '@/app/api/auth/auth';
import { useRouter } from 'next/navigation';
import { urlConstants } from '@/app/utils/urlConstants';
import { LoginResponseData,LoginFormData } from '@/app/types/apiTypes';

export const useLogin = () => {
    const router = useRouter();
    return useMutation<LoginResponseData, Error, LoginFormData>({
      mutationFn: loginSubmit,
      onSuccess: (data: LoginResponseData) => {
        // 로그인 성공 후 추가 작업 (예: 토큰 저장, 페이지 이동 등)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // 로그인 성공 후 리다이렉트 (예: 대시보드 페이지로 이동)
       
        router.push(urlConstants.pages.USERDASHBOARD); // 로그인 후 대시보드 페이지로 이동
      },
      onError: (error: Error) => {
        // 로그인 실패 시 처리할 로직
        console.error('Login failed:', error.message);
      },
    });
  };