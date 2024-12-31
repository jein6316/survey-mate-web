/*입력값 검증 함수*/


declare global {
    interface Window {
      isNullOrEmpty: typeof isNullOrEmpty;
      isInvalidFileType: typeof isInvalidFileType;
    }
  }
//문자열 검증
export const isNullOrEmpty = (value: string | null | undefined): boolean => {
    return value === null || value === undefined || value.trim() === '';
  };

//파일형식 검증
export const isInvalidFileType = (fileType: File |string | null | undefined): boolean => {
 return fileType === null || fileType === undefined ;
};