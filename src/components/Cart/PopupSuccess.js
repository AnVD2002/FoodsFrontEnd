import React from "react";
import "./SuccessModal.css";
import { useNavigate } from "react-router-dom";

const SuccessModal = () => {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thanh toán thành công</h2>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default SuccessModal;
