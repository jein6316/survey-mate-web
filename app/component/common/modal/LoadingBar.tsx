"use client";

import React from "react";
import { useRecoilValue } from "recoil";
import { loadingAtom } from "@/app/recoil/atoms/loadingAtom";
import "../../../styles/modal/LoadingBar.css";

const LoadingBar = () => {
  const { isLoading, loadingText } = useRecoilValue(loadingAtom);

  if (!isLoading) return null;

  return (
    <div className="modal-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-text">{loadingText}</div>
      </div>
    </div>
  );
};

export default LoadingBar;
