
import Link from "next/link";
import "@/app/styles/common/Page.css";
import { InfoView } from "@/app/component/features/group/InfoView";
import { EditButton } from "@/app/component/button/EditButton";

export default function GroupInfo() {

  return (
    <div className="page-background">
      <div className="page-container">
        <InfoView>
          <EditButton />
        </InfoView>
      </div>
    </div>
  );
}
