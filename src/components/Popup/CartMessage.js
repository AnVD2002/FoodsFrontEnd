import React from "react";
import "./CartMessage.css";

const CartMessage = ({ show, message }) => {
  if (!show) return null;

  return <div className="popup">{message}</div>;
};

export default CartMessage;
