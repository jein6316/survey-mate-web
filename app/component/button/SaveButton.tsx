"use client";

import {useTranslation} from "react-i18next";
import "@/app/styles/common/Button.css";


interface SaveButtonProps {
    children?: React.ReactNode; // children을 선택적(`optional`)으로 변경
    onClick?: () => void;
}

export function SaveButton({ children, onClick }: SaveButtonProps) {

    const { t } = useTranslation("common");

    return (
        <button
            className="button-one-row"
            onClick={onClick}
        >
            {children ?? t("SAVE")}

        </button>
    );
}
