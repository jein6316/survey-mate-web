"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true); // 사이드바 열림/닫힘 상태 관리

  const toggleMenu = () => setIsOpen(!isOpen); // 메뉴 열기/닫기 토글

  return (
    <div className="relative min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
          <h1 className="text-lg font-bold">MyApp</h1>
          {/* 사이드바 닫기 버튼 */}
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className="mt-4 space-y-2">
          <a href="/mypage" className="block px-4 py-2 hover:bg-gray-100">
            나의 페이지
          </a>
          <a
            href="/create-survey"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            설문조사 만들기
          </a>
          <a href="/my-surveys" className="block px-4 py-2 hover:bg-gray-100">
            내가 만든 설문조사
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`transition-all ${isOpen ? "ml-64" : "ml-0"}`}
        style={{ minHeight: "100vh", position: "relative" }}
      >
        <div className="p-4">{children}</div>
      </div>

      {/* 숨기기 버튼 (사이드바 외부) */}
      {!isOpen && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow-md z-50"
        >
          <FiMenu size={24} />
        </button>
      )}
    </div>
  );
};

export default Layout;
