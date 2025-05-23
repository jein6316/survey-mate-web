"use client";

import React, {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {
    registerSubmit,
    checkUserEmailAPI,
    checkDuplicateIdAPI,
} from "@/app/web-api/auth/auth";
import {RegisterFormData, ResponseError} from "@/app/types/apiTypes";
import {getCurrentDate} from "@/app/utils/formatter";
import {APIResponse} from "@/app/types/apiTypes";
import useAlert from "@/app/recoil/hooks/useAlert";
import "@/app/styles/common/Form.css";
import "@/app/styles/common/Button.css";
import "@/app/styles/common/Common.css";
import {useRouter} from "next/navigation";
import useLoading from "@/app/recoil/hooks/useLoading";
import {useTranslation} from "react-i18next";

export const RegisterForm = ({
                                 action,
                                 children,
                             }: {
    action?: any;
    children: React.ReactNode;
}) => {
    //회원가입 데이터
    const [formData, setFormData] = useState<RegisterFormData>({
        userId: "",
        userEmail: "",
        password: "",
        passwordCheck: "",
        userName: "",
        profileImage: null,
        groupOption: "",
        groupName: "",
        groupCode: "",
        groupAuthCode: "",
        joinDate: getCurrentDate(), //오늘날짜
    });

    //변수선언
    const [verCode, setVerCode] = useState(""); //사용자가 입력가 이메일 인증코드
    const [resVerCode, setResVerCode] = useState(""); //받아온 인증코드
    const [isCheckedVerCode, setIsCheckedVerCode] = useState(false);
    const [errorId, setErrorId] = useState<string | null>(null); //아이디 에러
    const [errorPassword, setErrorPassword] = useState<string | null>(null); // 비밀번호 에러
    const [errorPasswordCheck, setErrorPasswordCheck] = useState<string | null>(
        null
    ); // 비밀번호 확인 에러
    const [errorRegister, setErrorRegister] = useState<string | null>(null); //회원가입 에러
    const router = useRouter();
    const {t} = useTranslation("auth");
    const openAlert = useAlert();
    const {setLoadingState, clearLoadingState} = useLoading();

    // 폼 입력 값 변경 처리
    const handleChange = (e: any) => {
        const {name, value} = e.target;

        setFormData((prevData) => {
            let updatedData = {...prevData, [name]: value};

            if (name === "groupOption") {
                if (value === "create") {
                    updatedData = {...updatedData, groupCode: "", groupAuthCode: ""};
                } else if (value === "select") {
                    updatedData = {...updatedData, groupName: "", groupAuthCode: ""};
                } else if (value === "none") {
                    updatedData = {
                        ...updatedData,
                        groupName: "",
                        groupCode: "",
                        groupAuthCode: "",
                    };
                }
            }
            return updatedData;
        });
    };

    // 파일 변경 처리
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prevData) => ({
            ...prevData,
            profileImage: file,
        }));
        e.target.value = '';
    };
    const removeImage = () => {
        setFormData((prevData) => ({
            ...prevData,
            profileImage: null,
        }));
    };
    //이메일 인증 코드 값 변경 처리
    const handleChangeVerCode = (e: any) => {
        const {name, value} = e.target;
        setVerCode(value);
    };

    const {
        mutate: mutateCheckDupId,
        isPending,
        isError,
        error,
    } = useMutation<APIResponse, Error, string>({
        mutationFn: checkDuplicateIdAPI, // mutationFn 속성에 checkDuplicateId 함수를 할당
        onSuccess: (data: APIResponse) => {
            if (!data.data) {
                openAlert(
                    "아이디 사용 가능",
                    data.message ? data.message : "사용 가능한 아이디 입니다.",
                    "info"
                );
            } else {
                openAlert(
                    "아이디 사용 불가",
                    data.message ? data.message : "이미 사용중인 아이디가 있습니다.",
                    "warning"
                );
            }
        },
        onError: (error: ResponseError) => {
            console.error("아이디 중복 체크 실패:", error.message);
            let message = error.response?.data?.message;
            if (!message) {
                message = error.message;
            }
            openAlert("아이디 중복 체크 실패", message, "error");
        },
    });

    const handleDuplicateId = async (e: any) => {
        setErrorId(""); // 에러 초기화

        // 아이디 입력값 확인
        if (formData.userId === "") {
            setErrorId("아이디를 입력하세요.");
            return;
        }
        if (!/^[a-zA-Z0-9]{6,12}$/.test(formData.userId)) {
            setErrorId("아이디는 6~12자의 영문자 또는 숫자만 사용 가능합니다.");
            return;
        }

        // 서버와 통신하여 중복 확인
        mutateCheckDupId(formData.userId);
    };

    // 회원가입 상태가 변경된 후에 alert 실행
    useEffect(() => {
        if (errorRegister) {
            alert(errorRegister);
        }
    }, [errorRegister]); // errorRegister 상태가 변경될 때마다 실행

    // 회원가입 폼 입력값 체크
    const validateForm = () => {
        if (formData.password.length < 8) {
            setErrorPassword("비밀번호는 최소 8자 이상이어야 합니다.");
            return;
        } else {
            setErrorPassword(null);
        }

        if (formData.passwordCheck !== formData.password) {
            setErrorPasswordCheck("비밀번호가 일치하지 않습니다.");
        } else {
            setErrorPasswordCheck(null);
        }
    };
    /*
     *이메일 검증
     *
     */
    const {mutate: mutateCheckEmail} = useMutation<APIResponse, Error, string>({
        mutationFn: checkUserEmailAPI, // mutationFn 속성에 checkDuplicateId 함수를 할당
        onSuccess: (data: APIResponse) => {
            clearLoadingState();
            openAlert("이메일 인증", "이메일로 인증번호가 전송되었습니다.", "info");
            setResVerCode(data.data);
        },
        onError: (error: ResponseError) => {
            clearLoadingState();
            openAlert(
                "이메일 인증 실패",
                error.response?.data?.message || error.message || "Unknown error",
                "error"
            );
            setResVerCode("");
        },
    });
    const handleCheckEmail = async () => {
        if (!formData.userEmail) {
            openAlert("이메일 인증", "이메일을 입력해 주세요.", "error");
            return;
        }
        setLoadingState("이메일 인증 중...");
        mutateCheckEmail(formData.userEmail);
    };
    // 이메일 인증번호 체크
    const checkVerCode = async () => {
        if (verCode == null || verCode == "") {
            openAlert("이메일 인증", "인증번호를 입력해 주세요.", "error");
            setIsCheckedVerCode(false);
        } else if (verCode != resVerCode) {
            openAlert("이메일 인증 실패", "인증번호가 일치하지 않습니다.", "error");
            setIsCheckedVerCode(false);
        } else {
            openAlert("이메일 인증 성공", "인증번호가 일치합니다.", "info");
            setIsCheckedVerCode(true);
        }
    };

    /*
     *회원가입 처리
     *
     */
    const {
        data: registerData,
        error: registerError,
        isError: isRegisterError,
        isIdle: isRegisterIdle,
        isPending: isRegisterPending,
        mutate: mutateRegister,
    } = useMutation<APIResponse, Error, RegisterFormData>({
        mutationFn: registerSubmit, // mutationFn 속성에 checkDuplicateId 함수를 할당
        onSuccess: (data: any) => {
            clearLoadingState();
            openAlert("회원가입 성공!", "회원가입 되었습니다.", "info", () => {
                router.replace("/");
            });
        },
        onError: (error: ResponseError) => {
            clearLoadingState();
            openAlert("회원가입 실패!", "회원가입에 실패했습니다.", "error");
            console.error("Login failed:", error.message);
        },
    });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //이메일인증 확인
        if (formData.userEmail && !isCheckedVerCode) {
            openAlert("이메일 인증", "이메일 인증 확인이 되지 않았습니다.", "error");
            return;
        }

        if(!formData.userEmail){
            let emailConfirm = confirm("이메일을 입력하지 않은 경우 아이디 찾기와 비밀번호 찾기가 제한됩니다. 가입하시겠습니까?");
            if(!emailConfirm) {
                return;
            }
        }

        // 데이터 유효성 체크
        validateForm();
        setErrorRegister(""); // 에러 초기화
        setLoadingState("Loading..");
        mutateRegister(formData); // 회원가입 요청 실행
    };
    return (
        <form onSubmit={handleSubmit} autoComplete="off" className="form-container">
            <h2 className="form-title">{t("SIGN_UP")}</h2>

            {/* User ID */}
            <div>
                <label htmlFor="userId" className="form-label">
                    * {t("USERID")}
                </label>
                <div className="form-button-group">
                    <input
                        id="userId"
                        name="userId"
                        type="text"
                        placeholder="Enter your ID"
                        onChange={handleChange}
                        value={formData.userId}
                        required
                        className="form-input"
                    />
                    <button
                        type="button"
                        onClick={handleDuplicateId}
                        className="button-check"
                    >
                        {t("CHECK")}
                    </button>
                </div>
                {errorId && <p className="error-msg">{errorId}</p>}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="userEmail" className="form-label">
                    {t("EMAIL")}
                </label>
                <div className="form-button-group">
                    <input
                        id="userEmail"
                        name="userEmail"
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        value={formData.userEmail}
                        className="form-input"
                    />
                    <button
                        type="button"
                        onClick={handleCheckEmail}
                        className="button-check"
                    >
                        {t("CHECK")}
                    </button>
                </div>
            </div>

            {/* Verification Code */}
            <div>
                <label htmlFor="verCode" className="form-label">
                    {t("EMAIL_VERIFICATION")}
                </label>
                <div className="form-button-group">
                    <input
                        id="verCode"
                        name="verCode"
                        type="text"
                        placeholder="Enter verification code"
                        onChange={handleChangeVerCode}
                        value={verCode}
                        className="form-input"
                    />
                    <button type="button" onClick={checkVerCode} className="button-auth">
                        {t("VERIFY")}
                    </button>
                </div>
            </div>

            {/* User Name */}
            <div>
                <label htmlFor="userName" className="form-label">
                    * {t("NAME")}
                </label>
                <input
                    id="userName"
                    name="userName"
                    type="text"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    value={formData.userName}
                    required
                    className="form-input-full"
                />
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="form-label">
                    * {t("PASSWORD")}
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                    className="form-input-full"
                />
            </div>

            {/* Password Check */}
            <div>
                <label htmlFor="passwordCheck" className="form-label">
                    * {t("PASSWORD_CONFIRM")}
                </label>
                <input
                    id="passwordCheck"
                    name="passwordCheck"
                    type="password"
                    placeholder="Confirm your password"
                    onChange={handleChange}
                    value={formData.passwordCheck}
                    required
                    className="form-input-full"
                />
                {errorPasswordCheck && (
                    <p className="error-msg">{errorPasswordCheck}</p>
                )}
            </div>

            {/* Profile Image */}
            <div>
                <label htmlFor="profileImageLabel" className="form-label">
                    {t("PROFILE_IMAGE")}
                </label>
                <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-input-file"
                    style={{display: 'none'}}
                />
                <label
                    htmlFor="profileImage"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                    {t("UPLOAD_IMAGE")}
                </label>
                <br/>
                {formData.profileImage && (
                    <div className="relative inline-block mt-4">
                        <img
                            src={URL.createObjectURL(formData.profileImage)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded border"
                        />
                        {/* X 버튼 */}
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-opacity-80"
                            title="Remove Image"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="groupSelect" className="form-label">
                    {t("SELECT_GROUP")}
                </label>
                <select
                    id="groupOption"
                    name="groupOption"
                    onChange={handleChange}
                    value={formData.groupOption}
                    className="form-input-full"
                >
                    <option value="none">{t("NO_GROUP")}</option>
                    <option value="create">{t("CREATE_GROUP")}</option>
                    <option value="select">{t("ENTER_GROUP")}</option>
                </select>

                {/* 그룹 생성 필드 */}
                {formData.groupOption === "create" && (
                    <div className="mt-4">
                        <div>
                            <label htmlFor="groupName" className="form-label">
                                {t("GROUP_NAME")}
                            </label>
                            <input
                                id="groupName"
                                name="groupName"
                                type="text"
                                placeholder="Enter group name"
                                value={formData.groupName}
                                onChange={handleChange}
                                className="form-input-full"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center">
                                <label htmlFor="groupAuthCode" className="form-label">
                                    {t("GROUP_AUTH_CODE")}
                                </label>
                                <div className="ml-2 -mt-2 relative group">
                                    <span className="question-circle">?</span>
                                    <div
                                        className="absolute top-10 left-0 hidden w-52 text-xs text-white bg-gray-700 rounded-lg p-2 group-hover:block shadow-lg">
                                        {t("GROUP_AUTH_CODE_DESCRIPTION")}
                                    </div>
                                </div>
                            </div>
                            <input
                                id="groupAuthCodeCreate"
                                name="groupAuthCode"
                                type="text"
                                placeholder="Enter group authentication code"
                                value={formData.groupAuthCode}
                                onChange={handleChange}
                                className="form-input-full"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* 그룹 입력 필드 */}
                {formData.groupOption === "select" && (
                    <div className="mt-4">
                        <div className="form-group">
                            <label htmlFor="groupCode" className="form-label">
                                {t("GROUP_CODE")}
                            </label>
                            <input
                                id="groupCode"
                                name="groupCode"
                                type="text"
                                placeholder="Enter group code"
                                value={formData.groupCode}
                                onChange={handleChange}
                                className="form-input-full"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="groupAuthCode" className="form-label">
                                {t("GROUP_AUTH_CODE")}
                            </label>
                            <input
                                id="groupAuthCodeSelect"
                                name="groupAuthCode"
                                type="text"
                                placeholder="Enter group verification code"
                                value={formData.groupAuthCode}
                                onChange={handleChange}
                                className="form-input-full"
                                required
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Children */}
            {children}
        </form>
    );
};
