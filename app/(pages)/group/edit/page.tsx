
import "@/app/styles/common/Page.css";
import GroupEditForm from "@/app/component/features/group/GroupEditForm";
import {SaveButton} from "@/app/component/button/SaveButton";
import {CancelButton} from "@/app/component/button/CancelButton";

export default function GroupInfo() {

    return (
        <div className="page-background">
            <div className="page-container">
                <GroupEditForm>
                    <SaveButton />
                    <CancelButton />
                </GroupEditForm>
            </div>
        </div>
    );
}
