/*폼 전송*/
export interface HandleSubmitParams {
    e: React.FormEvent;
    formData: LoginFormData;
}

// 로그인 성공 후 데이터를 처리하는 타입
export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
}

// 로그인 폼에서 보내는 데이터 구조에 맞는 타입
export interface LoginFormData {
    userId: string;
    password: string;
}

// 회원가입 폼에서 보내는 데이터 구조에 맞는 타입
export interface RegisterFormData {
    userId: string;            // 사용자 ID
    password: string;          // 비밀번호
    passwordCheck: string;     // 비밀번호확인
    userName: string;          // 사용자 이름
    profileImage: File | null; // 파일 첨부 (이미지 등)
    joinDate: string;          // 가입 날짜 (예: "20241120")
    memStatus: string;         // 회원 상태 (예: "1" 또는 "0")
}


