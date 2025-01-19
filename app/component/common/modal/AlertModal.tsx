import React, {useEffect} from 'react';
import '../../../styles/modal/AlertModal.css';
import {AlertModalProps} from "@/app/types/apiTypes";



const AlertModal = ({ isOpen, title, message, onClose, type }:AlertModalProps) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className={`modal-content modal-${type}`}>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="modal-button-close" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
