"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type MenuItem = {
  id: number;
  title: string;
  submenus: MenuItem[];
};

type OpenMenuState = Record<number, boolean>;

const NestedMenu: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([
    {
      id: 1,
      title: "설문조사",
      submenus: [
        {
          id: 2,
          title: "설문조사 만들기",
          submenus: [
            {
              id: 3,
              title: "고급 옵션",
              submenus: [
                { id: 4, title: "설정1", submenus: [] },
                { id: 7, title: "설정", submenus: [] },
              ],
            },
            {
              id: 33,
              title: "고급 옵션2",
              submenus: [
                { id: 4, title: "설정1", submenus: [] },
                { id: 7, title: "설정", submenus: [] },
              ],
            },
          ],
        },
      ],
    },
    { id: 5, title: "내가 만든 설문조사", submenus: [] },
    { id: 6, title: "설정", submenus: [] },
  ]);

  const [openMenu, setOpenMenu] = useState<OpenMenuState>({});
  const [newMenuTitle, setNewMenuTitle] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const toggleMenu = (id: number) => {
    setOpenMenu((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addMenu = (parentId: number) => {
    if (!newMenuTitle.trim()) return;
    const addSubmenu = (menu: MenuItem) => {
      if (menu.id === parentId) {
        menu.submenus = [
          ...menu.submenus,
          { id: Date.now(), title: newMenuTitle.trim(), submenus: [] },
        ];
      } else {
        menu.submenus.forEach(addSubmenu);
      }
    };
    setMenus((prev) => {
      const updatedMenus = JSON.parse(JSON.stringify(prev));
      updatedMenus.forEach(addSubmenu);
      return updatedMenus;
    });
    setNewMenuTitle("");
  };

  const editMenu = (id: number, newTitle: string) => {
    if (!newTitle.trim()) return;
    const updateMenu = (menu: MenuItem) => {
      if (menu.id === id) {
        menu.title = newTitle.trim();
      } else {
        menu.submenus.forEach(updateMenu);
      }
    };
    setMenus((prev) => {
      const updatedMenus = JSON.parse(JSON.stringify(prev));
      updatedMenus.forEach(updateMenu);
      return updatedMenus;
    });
  };

  const deleteMenu = (id: number) => {
    const filterMenus = (menuList: MenuItem[]): MenuItem[] => {
      return menuList
        .filter((menu) => menu.id !== id)
        .map((menu) => ({ ...menu, submenus: filterMenus(menu.submenus) }));
    };
    setMenus((prev) => filterMenus(prev));
  };

  const moveMenu = (id: number, direction: "up" | "down") => {
    const move = (menuList: MenuItem[]): MenuItem[] => {
      const index = menuList.findIndex((menu) => menu.id === id);
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

    const updateMenus = (menuList: MenuItem[]): MenuItem[] => {
      return menuList.map((menu) => {
        if (
          menu.id === id ||
          menu.submenus.some((submenu) => submenu.id === id)
        ) {
          return { ...menu, submenus: move(menu.submenus) };
        } else {
          return { ...menu, submenus: updateMenus(menu.submenus) };
        }
      });
    };

    setMenus((prev) => updateMenus(prev));
  };

  const selectMenu = (menu: MenuItem) => {
    setSelectedMenu(menu);
  };

  const renderMenu = (menu: MenuItem, level = 0): JSX.Element => (
    <li
      key={menu.id}
      className="mt-2"
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div
        className={`flex items-center justify-between text-gray-700 hover:bg-gray-100 p-2 rounded ${
          selectedMenu?.id === menu.id ? "bg-blue-100" : ""
        }`}
        onClick={() => selectMenu(menu)}
      >
        <span>{menu.title}</span>
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(menu.id);
            }}
          >
            {openMenu[menu.id] ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          <button
            className="text-green-500 hover:text-green-700"
            onClick={(e) => {
              e.stopPropagation();
              const newTitle = prompt("새 제목을 입력하세요", menu.title);
              if (newTitle) editMenu(menu.id, newTitle);
            }}
          >
            <Edit size={16} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              deleteMenu(menu.id);
            }}
          >
            <Trash size={16} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              moveMenu(menu.id, "up");
            }}
          >
            <ArrowUp size={16} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              moveMenu(menu.id, "down");
            }}
          >
            <ArrowDown size={16} />
          </button>
        </div>
      </div>
      {openMenu[menu.id] && (
        <ul className="mt-2">
          {menu.submenus.map((submenu) => renderMenu(submenu, level + 1))}
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
              onClick={() => addMenu(menu.id)}
            >
              <Plus size={16} />
            </button>
          </li>
        </ul>
      )}
    </li>
  );

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8 p-8">
      <div className="flex-grow bg-gray-50 p-6 border rounded-lg shadow-md">
        <ul className="space-y-2">{menus.map((menu) => renderMenu(menu))}</ul>
      </div>
      {selectedMenu && (
        <div className="flex-grow bg-white p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">선택된 메뉴 정보</h2>
          <p>
            <strong>ID:</strong> {selectedMenu.id}
          </p>
          <p>
            <strong>제목:</strong> {selectedMenu.title}
          </p>
          <p>
            <strong>하위 메뉴 수:</strong> {selectedMenu.submenus.length}
          </p>
          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              const newTitle = prompt(
                "새 제목을 입력하세요",
                selectedMenu.title
              );
              if (newTitle) editMenu(selectedMenu.id, newTitle);
            }}
          >
            제목 수정
          </button>
        </div>
      )}
    </div>
  );
};

export default NestedMenu;
