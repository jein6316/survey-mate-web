"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { getMenusByRole } from "@/app/api/menuApi";
import { useMutation } from "@tanstack/react-query";
import { APIResponse, MenuItem } from "@/app/types/apiTypes";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useUser from "@/app/recoil/hooks/useUser";
import LoadingBar from "@/app/component/common/modal/LoadingBar";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true); // 사이드바 열림/닫힘 상태 관리
  const [menuData, setMenuData] = useState<MenuItem[]>([]); // 메뉴 데이터 상태
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // 확장된 메뉴 상태
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { setUserFromToken } = useUser();
  // API 호출 로직
  const { data, error, isError, isPending, mutate } = useMutation<
    APIResponse,
    Error,
    string
  >({
    mutationFn: getMenusByRole,
    onSuccess: (data: any) => {
      setMenuData(data.data || []); // 데이터를 상태에 저장
    },
    onError: (error: Error) => {
      console.error("API 호출 중 오류 발생:", error);
    },
  });

  useEffect(() => {
    mutate("ROLE_USER"); // API 자동 호출
  }, [mutate]);

  useEffect(() => {
    setUserFromToken(); // ✅ 쿠키에서 유저 정보 업데이트

    setTimeout(() => {
      const accessToken = Cookies.get("accessToken"); // ✅ 토큰 확인
      if (!accessToken) {
        console.log("🚨 로그인 안 됨! 로그인 페이지로 이동");
        router.push("/login");
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen); // 메뉴 열기/닫기 토글

  const toggleExpand = (key: string) => {
    // 메뉴 확장/축소 토글
    if (expandedKeys.includes(key)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== key));
    } else {
      setExpandedKeys([...expandedKeys, key]);
    }
  };

  const renderMenu = (menuItems: MenuItem[]) => {
    return (
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.menuNo}>
            <div
              onClick={() => toggleExpand(item.menuNo)}
              className="cursor-pointer flex items-center justify-between px-4 py-2 hover:bg-gray-100"
            >
              {item.menuPath ? (
                <a href={item.menuPath} className="flex-1">
                  {item.menuKorName}
                </a>
              ) : (
                <span className="flex-1">{item.menuKorName}</span>
              )}
              {item.subMenus && item.subMenus.length > 0 && (
                <span className="transition-transform duration-200">
                  {expandedKeys.includes(item.menuNo) ? (
                    <FiChevronDown size={18} className="text-gray-600" />
                  ) : (
                    <FiChevronRight size={18} className="text-gray-600" />
                  )}
                </span>
              )}
            </div>
            {item.subMenus &&
              item.subMenus.length > 0 &&
              expandedKeys.includes(item.menuNo) && (
                <div className="pl-4 border-l ml-2">
                  {renderMenu(item.subMenus)}
                </div>
              )}
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    return <LoadingBar />;
  }
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
        <nav className="mt-4">{renderMenu(menuData)}</nav>
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
