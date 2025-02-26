"use client";

import Link from "next/link";
import "@/app/styles/common/Page.css";
import { InfoView } from "@/app/component/features/group/InfoView";
import { EditButton } from "@/app/component/button/EditButton";
import { useTranslation } from "react-i18next";

export default function GroupInfo() {
  const { t } = useTranslation("common");

  return (
    <div className="page-background">
      <div className="page-container">
        <InfoView>
          <EditButton>{t("EDIT")}</EditButton>
        </InfoView>
      </div>
    </div>
  );
}
