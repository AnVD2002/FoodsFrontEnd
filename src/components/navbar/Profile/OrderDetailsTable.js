import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OrderDetailsTable.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const OrderDetailsTable = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [cancelOrderDetailID, setCancelOrderDetailID] = useState(null);
  const [reason, setReason] = useState("");

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

  const username = getUserNameFromToken();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/order/getOrderDetail?username=${username}`
        );
        const data = response.data.body;
        if (response.data.statusCodeValue === 200) {
          const filteredData = data.filter(
            (order) => !(order.ordered === false && order.paid === false)
          );
          setOrderDetails(filteredData);
        } else {
          toast(data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [username]);

  const handleCancel = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/order/cancelOrderDetail",
        {
          orderDetailID: cancelOrderDetailID,
          reason: reason,
        }
      );

      if (response.data.statusCodeValue === 200) {
        toast.success("Đang chờ xử lí");
        setOrderDetails((prevDetails) =>
          prevDetails.map((order) =>
            order.orderDetailID === cancelOrderDetailID
              ? { ...order, cancelled: true }
              : order
          )
        );
        setCancelOrderDetailID(null);
        setReason("");
      } else {
        toast.error("Có lỗi xảy ra khi hủy đơn hàng.");
      }
    } catch (error) {
      console.error("Error cancelling order detail:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      <table className="order-details-table">
        <thead>
          <tr>
            <th>Order Detail ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((order) => (
            <tr key={order.orderDetailID} className="order-detail-row">
              <td>{order.orderDetailID}</td>
              <td>{order.name}</td>
              <td>{order.price}</td>
              <td>{order.quantity}</td>
              <td>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/${order.img}`}
                  alt={order.name}
                  width="50"
                  height="50"
                />
              </td>
              <td>
                {order.status ||
                  (order.ordered && order.paid ? "Đã thanh toán" : "Đã order")}
              </td>
              <td className="center-btn">
                <button
                  onClick={() => setCancelOrderDetailID(order.orderDetailID)}
                  disabled={order.cancelled}
                >
                  {order.cancelled ? "Đang xử lí" : "Hủy"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cancelOrderDetailID && (
        <div className="cancel-order-modal">
          <div className="cancel-order-content">
            <h3>Hủy đơn hàng</h3>
            <label>
              Lý do:
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
            <div className="cancel-order-actions">
              <button onClick={handleCancel}>Xác nhận hủy</button>
              <button onClick={() => setCancelOrderDetailID(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderDetailsTable;
