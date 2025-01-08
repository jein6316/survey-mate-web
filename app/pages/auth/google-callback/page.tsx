"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const hash = window.location.hash;
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/auth/oauth/google",
            {
              headers: {
                Authorization: token, // 헤더에 토큰 추가
              },
            }
          );
          console.log("Token:", response.data.token);
          alert("Google login successful!");
        } catch (error: any) {
          console.error("Google login failed:", error.response.data);
        }
      } else {
        console.error("No token found in the callback URL.");
      }
    };

    handleGoogleCallback();
  }, []);

  return <div>Processing Google Login...</div>;
}
