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
  userId: string; // 사용자 ID
  userEmail: string; // 사용자이메일
  password: string; // 비밀번호
  passwordCheck: string; // 비밀번호확인
  userName: string; // 사용자 이름
  profileImage: File | null; // 파일 첨부 (이미지 등)
  joinDate: string; // 가입 날짜 (예: "20241120")
}

export interface modifyMemberPayload {
  userName?: string; // 변경할 이름
  profileImageUuid: File | null; // 변경할 프로필 파일 (이미지 등)
}

//이메일 인증 성공 후 데이터를 처리하는 타입
export interface verCodeResponseData {
  verCode: String;
  statusCode: number;
  message: string;
}

export interface changePasswordResData {
  oldPassword: String;
  newPassword: String;
}
// API 공통 응답 형식
export interface APIResponse {
  result?: boolean; // 성공 여부
  data?: any; // 성공 시 반환될 데이터 (optional)
  message?: string; // 성공/실패 시 메시지 (optional)
}


export interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type: 'error' | 'warning' | 'info'; // 모달 유형
}

export interface ResponseError {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}
