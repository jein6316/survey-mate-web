
import "@/app/styles/common/Page.css";
import {GroupUserList} from "@/app/component/features/group/GroupUserList";

export default function GroupUsers() {

    return (
        <div className="page-background">
            <div className="page-container">
                <GroupUserList>
                </GroupUserList>
            </div>
        </div>
    );
}
