"use client";

import {useTranslation} from "react-i18next";
import "@/app/styles/common/Button.css";


interface EditButtonProps {
  children?: React.ReactNode; // children을 선택적(`optional`)으로 변경
  onClick?: () => void;
}

export function EditButton({ children, onClick }: EditButtonProps) {

  const { t } = useTranslation("common");

  return (
    <button
      className="button-edit"
      onClick={onClick}
    >
      {children ?? t("EDIT")}

    </button>
  );
}
