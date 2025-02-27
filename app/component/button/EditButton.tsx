"use client";

import { useFormStatus } from "react-dom";
import {useTranslation} from "react-i18next";

interface EditButtonProps {
  children?: React.ReactNode; // children을 선택적(`optional`)으로 변경
}

export function EditButton({ children }: EditButtonProps) {
  const { pending } = useFormStatus();

  const { t } = useTranslation("common");

  return (
    <button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className="w-1/4 mx-auto rounded-md bg-[#528cff] py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      {children ?? t("EDIT")}
      {pending && (
        <svg
          className="animate-spin ml-2 h-4 w-4 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit form"}
      </span>
    </button>
  );
}
