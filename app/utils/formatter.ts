/*데이터 포맷팅 함수*/

// 오늘 날짜를 YYYYMMDD 형식으로 반환
export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};
// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
};

// 현재 시간을 HH:mm:ss 형식으로 반환
export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toTimeString().split(" ")[0]; // HH:mm:ss 형식
};

// 오늘 날짜와 시간을 YYYY-MM-DD HH:mm:ss 형식으로 반환
export const getTodayDateTime = (): string => {
  const now = new Date();
  return `${getTodayDate()} ${getCurrentTime()}`; // YYYY-MM-DD HH:mm:ss
};

// 특정 날짜를 YYYY-MM-DD 형식으로 포맷
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// 특정 날짜를 YYYY-MM-DD 형식으로 포맷
export const formatDateFromString = (dateStr: string | number): string => {
  const date = new Date(Number(dateStr));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

/**
 * 날짜 배열에서 마지막 요소를 제외하고 처리하는 함수
 * @param {Array} dateArray - 날짜 요소들이 있는 배열 (예: [2025, 4, 9, 23, 28, 48, 306382000])
 * @returns {string} 날짜 문자열 (ISO 형식)
 */
export const parseDateArrayToStringWithoutLast = (
  dateStr: string[]
): string => {
  // 마지막 요소를 제외한 배열을 생성
  const dateWithoutLast = dateStr.slice(0, -1);

  // 배열을 -로 결합하여 문자열로 변환
  const dateString = dateWithoutLast.join("-"); // "2025-04-09-23-28-48" 형태

  // 년, 월, 일 추출
  const [year, month, day, hour, minute, second] = dateWithoutLast.map(Number);

  // ISO 형식으로 날짜를 조합
  const isoDateString = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}:${String(second).padStart(2, "0")}`;

  // Date 객체 생성
  const date = new Date(isoDateString);

  // 원하는 형식으로 반환 (yyyy.mm.dd 형식)
  const formattedDate = `${date.getFullYear()}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

  return formattedDate;
};

// 특정 날짜를 YYYY-MM-DD HH:mm:ss 형식으로 포맷
export const formatDateTime = (date: Date): string => {
  const formattedDate = formatDate(date);
  const formattedTime = date.toTimeString().split(" ")[0];
  return `${formattedDate} ${formattedTime}`;
};

// 날짜를 "yyyy-MM-ddTHH:mm:ss" 형식으로 변환하는 함수(시작/종료시간)
export const formatDateStartEndDate = (date: Date, isEndDate: boolean) => {
  // 시간을 자정(00:00:00) 또는 끝나는 시간(23:59:59)으로 설정
  const newDate = new Date(date);
  if (isEndDate) {
    newDate.setHours(23, 59, 59, 999); // endDate는 23:59:59.999
  } else {
    newDate.setHours(0, 0, 0, 0); // startDate는 00:00:00.000
  }
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const hours = String(newDate.getHours()).padStart(2, "0");
  const minutes = String(newDate.getMinutes()).padStart(2, "0");
  const seconds = String(newDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// 특정 날짜를 원하는 형식으로 포맷 (예: YYYY.MM.DD or DD/MM/YYYY)
export const formatCustomDate = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return format
    .replace("yyyy", year.toString())
    .replace("MM", month)
    .replace("dd", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

export const formatDateTimeString = (
    isoString: string | null | undefined,
    format: string = 'yyyy-MM-dd HH:mm',
    hourFormat: '24h' | '12h' = '24h'
): string => {

  if (!isoString) {
    return '';
  }

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.warn(`[formatDateTimeString] 유효하지 않은 날짜 형식입니다: ${isoString}`);
      return '';
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours24 = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    let displayHours = hours24;
    let ampm = '';

    if (hourFormat === '12h') {
      ampm = hours24 >= 12 ? 'PM' : 'AM';
      displayHours = hours24 % 12;
      if (displayHours === 0) { // 자정(0시)과 정오(12시)를 12로 표시
        displayHours = 12;
      }
    }

    // 4. 포맷 문자열의 토큰을 실제 값으로 교체
    let formattedString = format;

    // replace는 첫 번째 발견된 문자열만 바꾸므로, 정규식 /YYYY/g 를 사용하거나,
    // 포맷 토큰은 한 번만 쓴다고 가정하고 단순 replace를 사용합니다. 여기서는 후자를 선택.
    formattedString = formattedString.replace('yyyy', String(year));
    formattedString = formattedString.replace('MM', String(month).padStart(2, '0'));
    formattedString = formattedString.replace('dd', String(day).padStart(2, '0'));
    formattedString = formattedString.replace('HH', String(displayHours).padStart(2, '0'));
    formattedString = formattedString.replace('mm', String(minutes).padStart(2, '0'));
    formattedString = formattedString.replace('ss', String(seconds).padStart(2, '0'));

    // 'A' 토큰이 있을 경우에만 오전/오후로 교체
    if (format.includes('A')) {
      formattedString = formattedString.replace('A', ampm);
    }

    return formattedString;

  } catch (error) {
    console.error(`[formatDateTimeString] 날짜 포맷팅 중 에러 발생: ${isoString}`, error);
    return '';
  }
};
