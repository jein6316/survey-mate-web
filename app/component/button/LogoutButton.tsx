"use client";

export function LogoutButton() {
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/api/logout"; // 🚀 서버에서 로그아웃 처리
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex h-10 w-full items-center justify-center rounded-md border bg-red-500 text-white text-sm transition-all hover:bg-red-600 focus:outline-none"
    >
      로그아웃
    </button>
  );
}
