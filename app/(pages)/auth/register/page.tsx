"use client"

import Link from "next/link";
import { RegisterForm } from "@/app/component/features/auth/RegisterForm";
import { SubmitButton } from "@/app/component/button/SubmitButton";
import "@/app/styles/common/Page.css";
import {useTranslation} from "react-i18next";

export default function Register() {

  const { t } = useTranslation("auth");

  return (
    <div className="page-background justify-center">
      <div className="page-container">
        <RegisterForm>
          <SubmitButton>{t("SIGN_UP")}</SubmitButton>
          <p className="page-description">
            {/*{"Already have an account? "}*/}
            {/*<Link*/}
            {/*  href={urlConstants.pages.LOGIN}*/}
            {/*  className="page-emphasis"*/}
            {/*>*/}
            {/*  {t("SIGN_UP")}*/}
            {/*</Link>*/}
            {/*{" instead."}*/}
          </p>
        </RegisterForm>
      </div>
    </div>
  );
}
