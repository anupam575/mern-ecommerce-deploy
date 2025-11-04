import React from "react";
import  "./style/modal.css"; // only modal-specific styles

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="modal-btn confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="modal-btn cancel-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
