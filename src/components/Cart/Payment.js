import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import "./Payment.css";
import { useSearchParams } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkVNPay = async () => {
      const orderID = searchParams.get("vnp_OrderInfo");
      const code = searchParams.get("vnp_ResponseCode");

      if (orderID && code) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/v1/payment/process",
            {
              orderID,
              code,
            }
          );
          console.log(response.data);
          if (response.data.statusCodeValue === 200) {
            navigate("/payment/success");
            console.log("Payment processed successfully:", response.data);
          }
        } catch (error) {
          console.error("Error processing payment:", error);
        }
      }
    };

    checkVNPay();
  }, [navigate, searchParams]);

  const handleVNPay = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/payment/vn_pay",
        {
          amountParam: orderDetails.total,
          orderID: orderDetails.orderID,
        }
      );

      console.log("VN Pay payment successful:", response.data);

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No URL found in response data:", response.data);
      }
    } catch (error) {
      console.error("VN Pay payment failed:", error);
    }
  };

  if (!orderDetails) {
    return (
      <div>
        <p>No order details found. Please place an order first.</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  const handleOfflinePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/payment/pay_normal",
        {
          orderID: orderDetails.orderID,
          paymentID: 2,
        }
      );

      console.log("Offline payment successful:", response.data);

      navigate("/payment/success");
    } catch (error) {
      console.error("Offline payment failed:", error);
    }
  };

  return (
    <div className="payment">
      <h2>Payment Options</h2>
      <div>
        <p>Order ID: {orderDetails.orderID}</p>
        <p>User Name: {orderDetails.userName}</p>
        <p>Address: {orderDetails.address}</p>
        <p>Phone: {orderDetails.phone}</p>
        <p>Total: {orderDetails.total}</p>
      </div>
      <div className="payment-options">
        <button onClick={handleVNPay}>Pay with VN Pay</button>
        <button onClick={handleOfflinePayment}>Pay Offline</button>
      </div>
    </div>
  );
};

export default Payment;
