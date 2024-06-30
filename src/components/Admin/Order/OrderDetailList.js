import React, { useEffect, useState } from "react";
import apiClient from "../Axios/AxiosService";
import "./OrderDetailList.css";

const OrderDetailList = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedField, setSortedField] = useState("userID");
  const [sortOrder, setSortOrder] = useState("asc");

  const recordsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("admin/getAllOrderDetail");
        setOrderDetails(response.data.body);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const sortedData = [...orderDetails].sort((a, b) => {
    if (sortedField === "userID") {
      return (a.userID - b.userID) * (sortOrder === "asc" ? 1 : -1);
    } else if (sortedField === "cancelled") {
      return (a.cancelled - b.cancelled) * (sortOrder === "asc" ? 1 : -1);
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(orderDetails.length / recordsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (field) => {
    const order = sortedField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortedField(field);
    setSortOrder(order);
  };

  const handleDelete = async (orderDetailID) => {
    try {
      await apiClient.delete("/admin/deleteOrderDetails", {
        params: { orderDetailID },
      });
      setOrderDetails((prevDetails) =>
        prevDetails.filter((detail) => detail.orderDetailID !== orderDetailID)
      );
    } catch (error) {
      console.error("Error deleting order detail:", error);
    }
  };

  const handleCancel = async (orderDetailID) => {
    try {
      await apiClient.delete("/admin/cancelOrderDetailClient", {
        params: { orderDetailID },
      });
      setOrderDetails((prevDetails) =>
        prevDetails.filter((detail) => detail.orderDetailID !== orderDetailID)
      );
    } catch (error) {
      console.error("Error cancelling order detail:", error);
    }
  };

  return (
    <div className="order-detail-table">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("orderDetailID")}>Order Detail ID</th>
            <th onClick={() => handleSort("userID")}>User ID</th>
            <th>Order ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Reason</th>
            <th>Ordered</th>
            <th onClick={() => handleSort("cancelled")}>Cancelled</th>
            <th>Paid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((detail) => (
            <tr key={detail.orderDetailID}>
              <td>{detail.orderDetailID}</td>
              <td>{detail.userID}</td>
              <td>{detail.orderID}</td>
              <td>{detail.name}</td>
              <td>{detail.price}</td>
              <td>{detail.quantity}</td>
              <td>
                <img src={detail.img} alt={detail.name} />
              </td>
              <td>{detail.reason}</td>
              <td>{detail.ordered ? "Yes" : "No"}</td>
              <td>{detail.cancelled ? "Yes" : "No"}</td>
              <td>{detail.paid ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleDelete(detail.orderDetailID)}>
                  Delete
                </button>
                {detail.cancelled && (
                  <button onClick={() => handleCancel(detail.orderDetailID)}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => changePage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailList;
