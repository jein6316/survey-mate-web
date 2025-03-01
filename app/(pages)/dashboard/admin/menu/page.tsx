"use client";

import React, { useState, useEffect } from "react";
import { APIResponse, MenuItem } from "@/app/types/apiTypes";
import { useMutation } from "@tanstack/react-query";
import { getAllMenus } from "@/app/api/menu/menuApi";

import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type OpenMenuState = Record<string, boolean>;

const NestedMenu: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [openMenu, setOpenMenu] = useState<OpenMenuState>({});
  const [newMenuTitle, setNewMenuTitle] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  // API 호출 로직
  const { data, error, isError, isPending, mutate } = useMutation<
    APIResponse,
    Error,
    void
  >({
    mutationFn: getAllMenus,
    onSuccess: (data: APIResponse) => {
      setMenuData(data.data || []);
    },
    onError: (error: Error) => {
      console.error("API 호출 중 오류 발생:", error);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  // 메뉴 열기/닫기
  const toggleMenu = (menuNo: string) => {
    setOpenMenu((prev) => ({ ...prev, [menuNo]: !prev[menuNo] }));
  };

  // 메뉴 선택
  const selectMenu = (menu: MenuItem) => {
    setSelectedMenu(menu);
  };

  // 메뉴 추가
  const addMenu = (parentMenuNo: string) => {
    if (!newMenuTitle.trim()) return;

    const addSubmenu = (menu: MenuItem) => {
      if (menu.menuNo === parentMenuNo) {
        menu.subMenus = [
          ...menu.subMenus,
          {
            menuNo: Date.now().toString(),
            parentMenuNo: menu.menuNo,
            menuKorName: newMenuTitle.trim(),
            menuEngName: newMenuTitle.trim(),
            menuDescription: "",
            menuPath: null,
            sequence: menu.subMenus.length + 1,
            memRole: "",
            useYn: "Y",
            subMenus: [],
          },
        ];
      } else {
        menu.subMenus.forEach(addSubmenu);
      }
    };

    setMenuData((prev) => {
      const updatedMenus = JSON.parse(JSON.stringify(prev));
      updatedMenus.forEach(addSubmenu);
      return updatedMenus;
    });

    setNewMenuTitle("");
  };

  // 메뉴 삭제
  const deleteMenu = (menuNo: string) => {
    const filterMenus = (menuList: MenuItem[]): MenuItem[] => {
      return menuList
        .filter((menu) => menu.menuNo !== menuNo)
        .map((menu) => ({ ...menu, subMenus: filterMenus(menu.subMenus) }));
    };

    setMenuData((prev) => filterMenus(prev));
  };

  // 메뉴 이동
  const moveMenu = (menuNo: string, direction: "up" | "down") => {
    const move = (menuList: MenuItem[]): MenuItem[] => {
      const index = menuList.findIndex((menu) => menu.menuNo === menuNo);
      if (index < 0) return menuList;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= menuList.length) return menuList;

      const updatedList = [...menuList];
      [updatedList[index], updatedList[targetIndex]] = [
        updatedList[targetIndex],
        updatedList[index],
      ];
      return updatedList;
    };

    setMenuData((prev) => move(prev));
  };

  // 메뉴 렌더링
  const renderMenu = (menu: MenuItem, level = 0): JSX.Element => (
    <li
      key={menu.menuNo}
      className="mt-2"
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div
        className={`flex items-center justify-between text-gray-700 hover:bg-gray-100 p-2 rounded ${
          selectedMenu?.menuNo === menu.menuNo ? "bg-blue-100" : ""
        }`}
        onClick={() => selectMenu(menu)}
      >
        <span>{menu.menuKorName}</span>
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(menu.menuNo);
            }}
          >
            {openMenu[menu.menuNo] ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          <button
            className="text-green-500 hover:text-green-700"
            onClick={(e) => {
              e.stopPropagation();
              const newTitle = prompt("새 제목을 입력하세요", menu.menuKorName);
              if (newTitle) {
                menu.menuKorName = newTitle.trim();
                setMenuData([...menuData]);
              }
            }}
          >
            <Edit size={16} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              deleteMenu(menu.menuNo);
            }}
          >
            <Trash size={16} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              moveMenu(menu.menuNo, "up");
            }}
          >
            <ArrowUp size={16} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              moveMenu(menu.menuNo, "down");
            }}
          >
            <ArrowDown size={16} />
          </button>
        </div>
      </div>
      {openMenu[menu.menuNo] && (
        <ul className="mt-2">
          {menu.subMenus.map((submenu) => renderMenu(submenu, level + 1))}
          <li className="flex items-center mt-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded p-1"
              placeholder="하위 메뉴 추가"
              value={newMenuTitle}
              onChange={(e) => setNewMenuTitle(e.target.value)}
            />
            <button
              className="ml-2 text-blue-500 hover:text-blue-700"
              onClick={() => addMenu(menu.menuNo)}
            >
              <Plus size={16} />
            </button>
          </li>
        </ul>
      )}
    </li>
  );

  return (
    <div className="p-8">
      <ul>{menuData.map((menu) => renderMenu(menu))}</ul>
    </div>
  );
};

export default NestedMenu;
