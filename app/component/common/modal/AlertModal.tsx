"use client";

import React from "react";
import "../../../styles/modal/AlertModal.css";
import { alertModalState } from "@/app/recoil/atoms/alertModalAtom";
import { useRecoilState } from "recoil";

const AlertModal = () => {
  const [modalState, setModalState] = useRecoilState(alertModalState);

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (modalState.onClose) {
      modalState.onClose(); // 콜백 함수 실행
    }
  };

  if (!modalState.isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content modal-${modalState.type}`}>
        <h2 className="modal-title">{modalState.title}</h2>
        <p className="modal-message">{modalState.message}</p>
        <div className="modal-actions">
          <button className="modal-button-close" onClick={handleClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
