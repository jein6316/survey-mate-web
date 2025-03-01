"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { getMenusByRole } from "@/app/api/menuApi";
import { useMutation } from "@tanstack/react-query";
import { APIResponse, MenuItem } from "@/app/types/apiTypes";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import useUser from "@/app/recoil/hooks/useUser";
import LoadingBar from "@/app/component/common/modal/LoadingBar";
import { userAtom } from "@/app/recoil/atoms/userAtom";

interface MenuLayoutProps {
  children: React.ReactNode;
}

const MenuLayout: React.FC<MenuLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const user = useRecoilValue(userAtom);

  // API 호출 로직
  const { data, error, isError, isPending, mutate } = useMutation<
    APIResponse,
    Error,
    string
  >({
    mutationFn: getMenusByRole,
    onSuccess: (data: any) => {
      debugger;
      setMenuData(data.data || []); // 데이터를 상태에 저장
    },
    onError: (error: Error) => {
      console.error("API 호출 중 오류 발생:", error);
    },
  });

  useEffect(() => {
    mutate("ROLE_USER");
  }, [mutate]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  const renderMenu = (menuItems: MenuItem[]) => (
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

  return (
    <div className="relative min-h-screen">
      {user.isLoggedIn ? (
        <>
          <div
            className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform z-50 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } w-64`}
          >
            <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
              <h1 className="text-lg font-bold">Survey Mate</h1>
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
              >
                <FiX size={24} />
              </button>
            </div>
            <nav className="mt-4">{renderMenu(menuData)}</nav>
          </div>

          <div className={`transition-all ${isOpen ? "ml-64" : "ml-0"}`}>
            <div className="p-4">{children}</div>
          </div>

          {!isOpen && (
            <button
              onClick={toggleMenu}
              className="fixed top-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow-md z-50"
            >
              <FiMenu size={24} />
            </button>
          )}
        </>
      ) : (
        <div className="p-4">{children}</div>
      )}
    </div>
  );
};

export default MenuLayout;
