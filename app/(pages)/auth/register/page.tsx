import Link from "next/link";
import { RegisterForm } from "@/app/component/form/auth/RegisterForm";
import { SubmitButton } from "@/app/component/button/SubmitButton";
import "@/app/styles/common/Page.css";

export default function Register() {
  return (
    <div className="page-background">
      <div className="page-container">
        <RegisterForm>
          <SubmitButton>Sign Up</SubmitButton>
          <p className="page-description">
            {"Already have an account? "}
            <Link
              href={urlConstants.pages.LOGIN}
              className="page-emphasis"
            >
              Sign in
            </Link>
            {" instead."}
          </p>
        </RegisterForm>
      </div>
    </div>
  );
}
