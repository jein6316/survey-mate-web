import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { LoginResponseData,LoginFormData, HandleSubmitParams } from '@/app/types/apiTypes';

//로그인
// 로그인 요청 함수
export const loginSubmit = async (formData: LoginFormData): Promise<LoginResponseData> => {
    try {
        debugger;
      const res = await axios.post<LoginResponseData>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data; // 서버 응답 데이터 반환
    } catch (error:any) {
      // 요청이 실패하면 에러를 처리
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

//회원가입
export const registerSubmit = async ({
    e,
    formData,
}: HandleSubmitParams) => {
    e.preventDefault();  // 폼 제출 시 새로 고침을 막음

    try {
        const res = await axios.post<LoginResponseData>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,  // 엔드포인트 URL
            formData,  // FormData 객체를 전송
            {
                headers: {
                    'Content-Type': 'multipart/form-data',  // 요청 헤더에 Content-Type 설정
                }
            }
        );

        // 회원가입 성공 처리
        const data = res.data;
        console.log('회원가입 성공:', data);

        return { success: true, data }; // 성공 시 data 포함 반환

    } catch (error: any) {

        return { success: false, error: error }; // 실패 시 에러 메시지 포함 반환
    }
};

//아이디중복체크
export const checkDuplicateIdAPI = async (userId: string) => {
    debugger;
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-duplicate-id`,
            {
                params: { userId }, // GET 요청의 쿼리 파라미터로 전달
            }
        );

        console.log('중복 체크 성공:', res.data);
        return { success: true, data: res.data };
    } catch (error: any) {
        console.error('중복 체크 실패:', error);
        return {
            success: false,
            error: error.response?.data || { message: '서버와의 통신에 실패했습니다.' },
        };
    }
};