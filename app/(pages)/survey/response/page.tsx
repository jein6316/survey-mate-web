import {SurveyFormMst} from "@/app/component/features/survey/response/SurveyFormMst";
import LoadingBar from "@/app/component/common/modal/LoadingBar";
import {Suspense} from "react";

export default function SurveyResponseForm() {
    return (
        <Suspense fallback={<LoadingBar/>}>
            <SurveyFormMst/>
        </Suspense>

    );
}
