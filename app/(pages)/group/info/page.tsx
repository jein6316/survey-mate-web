import Link from "next/link";
import "@/app/styles/common/Page.css";
import { InfoForm } from "@/app/component/form/group/InfoForm";
import {SubmitButton} from "@/app/component/button/SubmitButton";

export default function Register() {
    return (
        <div className="page-background">
            <div className="page-container">
                <InfoForm>
                    <SubmitButton>수정하기</SubmitButton>
                </InfoForm>
            </div>
        </div>
    );
}
