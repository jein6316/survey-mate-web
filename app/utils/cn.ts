import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스명을 조건에 따라 조합하고 중복 속성을 정리해주는 함수
 * 예: cn("p-2", isActive && "text-blue-500", "p-4") → "text-blue-500 p-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
