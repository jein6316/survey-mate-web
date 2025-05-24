"use client";

import { useState, useEffect } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

const HeaderRight = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [profileFilePath, setProfileFilePath] = useState<string | null>(null);
  const user = useRecoilValue(userAtom);
  const { t, i18n } = useTranslation("auth");

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
      return;
    }

    const browserLanguage = navigator.language;
    console.log(`Browser language: ${browserLanguage}`);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User's location: lat=${latitude}, lng=${longitude}`);

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              const countryCode = data.address?.country_code || "kr";
              console.log(`Country code: ${countryCode}`);
              selectLanguage(countryCode === "kr" ? "ko" : "en");
            })
            .catch((error) => {
              console.error("Error fetching location data:", error);
              selectLanguage(browserLanguage.startsWith("ko") ? "ko" : "en");
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          selectLanguage(browserLanguage.startsWith("ko") ? "ko" : "en");
        }
      );
    } else {
      selectLanguage(browserLanguage.startsWith("ko") ? "ko" : "en");
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = localStorage.getItem("profileImgPath");
      setProfileFilePath(path);
    }
  }, [user.isLoggedIn]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectLanguage = (lang: "ko" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    document.cookie = `language=${lang}; path=/; max-age=31536000`; // 1년 동안 저장
    setIsOpen(false);
  };

  // 로그아웃 핸들러 (서버에서 처리)
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/web-api/logout";
    }
  };

  return (
    <div className="relative flex items-center space-x-4">
      {/* 프로필 이미지 */}
      {user.isLoggedIn && profileFilePath && (
          <img
              src={`${profileFilePath}?t=${user.userId}`}
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover border"
          />
      )}

      {/* 로그아웃 버튼 */}
      {user.isLoggedIn && (
        <button
          className="text-gray-700 hover:text-gray-900 pr-4 py-2 rounded"
          onClick={handleLogout}
        >
          {t("LOGOUT")}
        </button>
      )}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <AiOutlineGlobal size={20} />
          <span>{language === "en" ? "English" : "한국어"}</span>
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
