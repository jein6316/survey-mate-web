import Link from "next/link";
import "@/app/styles/common/Page.css";
import { InfoForm } from "@/app/component/form/group/InfoForm";
import {EditButton} from "@/app/component/button/EditButton";

export default function Register() {
    return (
        <div className="page-background">
            <div className="page-container">
                <InfoForm>
                    <EditButton>수정</EditButton>
                </InfoForm>
            </div>
        </div>
    );
}
