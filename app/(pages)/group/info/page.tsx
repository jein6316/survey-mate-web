
import "@/app/styles/common/Page.css";
import { GroupInfoView } from "@/app/component/features/group/GroupInfoView";
import { EditButton } from "@/app/component/button/EditButton";

export default function GroupInfo() {

  return (
    <div className="page-background">
      <div className="page-container">
        <GroupInfoView>
          <EditButton />
        </GroupInfoView>
      </div>
    </div>
  );
}
