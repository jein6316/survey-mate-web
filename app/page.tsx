import {LoginForm} from "@/app/component/features/auth/LoginForm";
import LoadingBar from "@/app/component/common/modal/LoadingBar";
import {Suspense} from "react";

export default function App() {
    return (
        <Suspense fallback={<LoadingBar/>}>
            <LoginForm/>
        </Suspense>
    );
}
