"use client";

import {useTranslation} from "react-i18next";
import "@/app/styles/common/Button.css";


interface EditButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
}

export function SurveySubmitButton({children, onClick}: EditButtonProps) {

    const {t} = useTranslation("common");

    return (
        <button
            className="button-one-row"
            onClick={onClick}
        >
            {children ?? t("SUBMIT")}
        </button>
    );
}
