"use client";

import useLogout from "@/app/hooks/useLogout";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <button
      onClick={logout}
      className="flex h-10 w-full items-center justify-center rounded-md border bg-red-500 text-white text-sm transition-all hover:bg-red-600 focus:outline-none"
    >
      로그아웃
    </button>
  );
}
