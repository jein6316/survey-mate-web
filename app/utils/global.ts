/**
 * global.ts
 *
 * 이 파일은 프로젝트 전역에서 사용되는 객체 및 설정을 초기화하는 역할을 합니다.
 * 전역적으로 참조해야 하는 상수, 함수 또는 설정을 `globalThis`에 추가하여
 * 어디서든 쉽게 접근할 수 있도록 설정합니다.
 *
 * 사용 예:
 * - urlConstants: 전역 URL 상수
 * - 기타 전역 함수나 설정
 *
 * 주의:
 * - 브라우저 환경에서만 동작하는 `globalThis`를 사용하는 경우,
 *   반드시 브라우저 환경인지 확인한 후 초기화해야 합니다.
 * - 전역 선언을 남용하지 않도록 필요 최소한의 설정만 추가하십시오.
 */

import { isNullOrEmpty, isInvalidFileType } from "./validators";
import { urlConstants } from "../constants/urls/auth/urlConstants";

declare global {
  interface Window {
    isNullOrEmpty: typeof isNullOrEmpty;
    isInvalidFileType: typeof isInvalidFileType;
  }
  var urlConstants: typeof urlConstants; // 전역 타입 선언
}

export const setupGlobals = () => {
  if (typeof window !== "undefined") {
    window.isNullOrEmpty = isNullOrEmpty;
    window.isInvalidFileType = isInvalidFileType;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.urlConstants = urlConstants;
  }
};
