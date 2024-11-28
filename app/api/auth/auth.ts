import axios from 'axios';
import { LoginResponseData, HandleSubmitParams } from '@/app/types/apiTypes';

//로그인
export const loginSubmit = async ({
    e,
    formData,
}: HandleSubmitParams) => {
    e.preventDefault();  // 폼 제출 시 새로 고침을 막음

    try {
        const res = await axios.post<LoginResponseData>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,  // 엔드포인트 URL
            formData,  // FormData 객체를 전송
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LOGIN_TOKEN}`,  // Authorization 헤더에 Bearer 토큰 포함                
                    'Content-Type': 'application/json',  // 요청 헤더에 Content-Type 설정
                }
            }
        );

        // 로그인 성공 처리
        const data = res.data;
        console.log('로그인 성공:', data);

        // 로그인 성공 후 추가 작업 (예: 토큰 저장, 페이지 이동 등)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        return { success: true, data }; // 성공 시 data 포함 반환
    } catch (error: any) {
        return { success: false, error: error }; // 실패 시 에러 메시지 포함 반환
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
    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-duplicate-id`,
            { userId }, // 요청 데이터에 userId 포함
            {
                headers: {
                    'Content-Type': 'application/json', // 요청 데이터 형식에 맞는 헤더 설정
                },
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