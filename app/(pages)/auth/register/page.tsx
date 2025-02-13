import Link from "next/link";
import { RegisterForm } from "@/app/component/form/RegisterForm";
import { SubmitButton } from "@/app/component/button/SubmitButton";

export default function Register() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <RegisterForm>
          <SubmitButton>Sign Up</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {"Already have an account? "}
            <Link
              href={urlConstants.pages.LOGIN}
              className="font-semibold text-gray-800"
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
