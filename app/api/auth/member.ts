import axios from 'axios';

//회원정보수정
export const checkDuplicateIdAPI = async (userId: string) => {
    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/member/modify`,
            { userId }, // 요청 데이터에 userId 포함
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // 요청 데이터 형식에 맞는 헤더 설정
                },
            }
        );

        console.log('회원정보수정 성공:', res.data);
        return { success: true, data: res.data };
    } catch (error: any) {
        console.error('회원정보수정 실패:', error);
        return {
            success: false,
            error: error.response?.data || { message: '서버와의 통신에 실패했습니다.' },
        };
    }
};