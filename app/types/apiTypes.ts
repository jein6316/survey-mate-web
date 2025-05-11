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
  groupOption: string;
  groupName: string;
  groupCode: string;
  groupAuthCode: string;
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
  type: "error" | "warning" | "info"; // 모달 유형
}

export interface ResponseError {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

//메뉴
export interface MenuItem {
  menuNo: string;
  parentMenuNo: string | null;
  menuKorName: string;
  menuEngName: string;
  menuDescription: string;
  menuPath: string | null;
  sequence: number;
  memRole: string;
  useYn: string;
  subMenus: MenuItem[];
}

//그룹
export interface GroupData {
  groupId: string;
  groupCode: string;
  groupName: string;
  groupAuthCode: string;
}

//설문
export interface SurveyQuestionMstRequest {
  title?: string; // 설문 제목
  startDate?: string; // 시작일자
  endDate?: string; // 종료일자
  description?: string; // 설문 설명
  questions?: SurveyQuestionDtlRequest[]; // 질문 목록
  groupId?: string; // 그룹아이디
  size?: number;
  page?: number;
}
export interface SurveyQuestionMstResponse {
  sqMstId: string; // 설문 ID
  title: string; // 설문 제목
  description?: string; // 설문 설명
  questions?: SurveyQuestionDtlRequest[]; // 질문 목록
  groupId?: string; // 그룹아이디
  size?: number;
  page?: number;
  createDate?: string; // 생성일자
  updateDate?: string; // 수정일자
  createMemNum?: string; // 생성자
  updateMemNum?: string; // 수정자
}
export interface SurveyQuestionDtlRequest {
  typeId: string; // 질문 유형 ID
  questionText: string; // 질문 내용
  options?: SurveyQuestionSdtlRequest[]; // 선택지 목록
}

export interface SurveyQuestionSdtlRequest {
  optionText: string; // 선택지 내용
}
