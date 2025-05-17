import { useTranslation } from "react-i18next";
export function LogoutButton() {
  const { t } = useTranslation("dashboard");

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/api/logout";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex h-10 w-full items-center justify-center rounded-md border bg-red-500 text-white text-sm transition-all hover:bg-red-600 focus:outline-none"
    >
      {t("LOGOUT")}
    </button>
  );
}
