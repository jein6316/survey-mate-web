/*데이터 포맷팅 함수*/ 

// 오늘 날짜를 YYYYMMDD 형식으로 반환
export const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };
// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
export const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
};

// 현재 시간을 HH:mm:ss 형식으로 반환
export const getCurrentTime = (): string => {
    const now = new Date();
    return now.toTimeString().split(' ')[0]; // HH:mm:ss 형식
};

// 오늘 날짜와 시간을 YYYY-MM-DD HH:mm:ss 형식으로 반환
export const getTodayDateTime = (): string => {
    const now = new Date();
    return `${getTodayDate()} ${getCurrentTime()}`; // YYYY-MM-DD HH:mm:ss
};

// 특정 날짜를 YYYY-MM-DD 형식으로 포맷
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// 특정 날짜를 YYYY-MM-DD HH:mm:ss 형식으로 포맷
export const formatDateTime = (date: Date): string => {
const formattedDate = formatDate(date);
const formattedTime = date.toTimeString().split(' ')[0];
return `${formattedDate} ${formattedTime}`;
};

// 특정 날짜를 원하는 형식으로 포맷 (예: YYYY.MM.DD or DD/MM/YYYY)
export const formatCustomDate = (date: Date, format: string): string => {
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
const day = date.getDate().toString().padStart(2, '0');
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
const seconds = date.getSeconds().toString().padStart(2, '0');

return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};
  