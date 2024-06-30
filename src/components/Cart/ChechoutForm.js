import React, { useState } from "react";
import axios from "axios";
import "./CheckoutForm.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CheckoutForm = ({ onClose, totalPrice }) => {
  const getUserNameFromToken = () => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.sub;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    } else {
      console.error("No token found");
      return null;
    }
  };

  const userName = getUserNameFromToken();
  const [formData, setFormData] = useState({
    name: "",
    userName: userName,
    address: "",
    phone: "",
    promoteCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/order/orderFood",
        {
          ...formData,
          totalPrice,
        }
      );
      console.log("Order placed successfully:", response.data);
      onClose();
      navigate("/payment", { state: { orderDetails: response.data.body } });
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className="checkout-form-overlay">
      <div className="checkout-form">
        <button className="close" onClick={onClose}>
          &times;
        </button>
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <label>Promote Code:</label>
          <input
            type="text"
            name="promoteCode"
            value={formData.promoteCode}
            onChange={handleChange}
          />
          <button type="submit">Submit Order</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
