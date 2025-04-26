import "@/app/styles/common/Page.css";
import {GroupEditForm} from "@/app/component/features/group/GroupEditForm";
import {SaveButton} from "@/app/component/button/SaveButton";
import {CancelButton} from "@/app/component/button/CancelButton";
import {Suspense} from "react";
import LoadingBar from "@/app/component/common/modal/LoadingBar";

export default function GroupInfo() {

    return (
        <div className="page-background">
            <div className="page-container">
                <Suspense fallback={<LoadingBar/>}>
                    <GroupEditForm>
                        <SaveButton/>
                        <CancelButton/>
                    </GroupEditForm>
                </Suspense>
            </div>
        </div>
    );
}
