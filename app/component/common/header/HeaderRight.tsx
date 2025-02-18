"use client";

import { useState, useEffect } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import useLogout from "@/app/hooks/useLogout";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

const HeaderRight = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const user = useRecoilValue(userAtom);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = document.cookie
      .split("; ")
      .find((row) => row.startsWith("language="))
      ?.split("=")[1];

    if (savedLanguage) {
      console.log(`Using language from cookie: ${savedLanguage}`);
      if (savedLanguage === "ko" || savedLanguage === "en") {
        selectLanguage(savedLanguage); // 쿠키 값이 있으면 사용
      }
      return; // 위치 정보 가져오지 않음
    }

    const browserLanguage = navigator.language; // ex: "en-US", "ko-KR"
    console.log(`Browser language: ${browserLanguage}`);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User's location: lat=${latitude}, lng=${longitude}`);

          // 예: OpenStreetMap Nominatim API 사용
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              const countryCode = data.address?.country_code || "en"; // "ko", "us", 등
              console.log(`Country code: ${countryCode}`);
              setLanguage(countryCode === "ko" ? "ko" : "en"); // 한국이면 "ko", 그 외는 "en"
            })
            .catch((error) => {
              console.error("Error fetching location data:", error);
              // 오류 발생 시 브라우저 언어로 기본 설정
              setLanguage(browserLanguage.startsWith("ko") ? "ko" : "en");
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          // 위치 권한 거부 시 브라우저 언어로 기본 설정
          selectLanguage(browserLanguage.startsWith("ko") ? "ko" : "en");
        }
      );
    } else {
      // Geolocation API를 사용할 수 없는 경우 브라우저 언어로 설정
      selectLanguage(browserLanguage.startsWith("ko") ? "ko" : "en");
    }
  }, [language]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectLanguage = (lang: "ko" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    document.cookie = `language=${lang}; path=/; max-age=31536000`; // 1년 동안 저장
    setIsOpen(false);
  };

  const handleLogout = useLogout();

  return (
    <div className="relative flex items-center space-x-4">
      {/* 로그아웃 버튼 */}
      {user.isLoggedIn && (
        <button
          className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <AiOutlineGlobal size={20} />
          <span>{language === "ko" ? "한국어" : "English"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isOpen && (
          <ul className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
            <li
              onClick={() => selectLanguage("en")}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              English
            </li>
            <li
              onClick={() => selectLanguage("ko")}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              한국어
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeaderRight;
