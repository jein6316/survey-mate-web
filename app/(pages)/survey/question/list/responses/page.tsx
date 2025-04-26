import {ResponsesBySurvey} from "@/app/component/features/survey/question/ResponsesBySurvey";
import LoadingBar from "@/app/component/common/modal/LoadingBar";
import {Suspense} from "react";

export default function ResponsesBySurveyPage() {
    return (
        <Suspense fallback={<LoadingBar/>}>
            <ResponsesBySurvey/>
        </Suspense>
    );
}
