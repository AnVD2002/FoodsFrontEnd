import React, { useEffect, useState } from "react";
import apiClient from "../Axios/AxiosService";
import MonthlyRevenueChart from "../ChartAdmin/ChartOrderByMonth";
import "./OrderList.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import {
  Delete,
  Visibility,
  Payment as PaymentIcon,
  Sort,
} from "@mui/icons-material";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("admin/getAllOrder");
        if (response.data.statusCodeValue === 200) {
          setOrders(response.data.body);
        } else {
          console.error("Failed to fetch orders:", response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [accessToken]);

  const handleConfirmPayment = async (orderID, isPaid) => {
    try {
      const response = await apiClient.put("admin/confirmPayment", {
        orderID,
        isPaid,
      });
      if (response.data.statusCodeValue === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderID ? { ...order, isPaid } : order
          )
        );
        console.log("Payment status updated:", response.data);
      } else {
        console.error("Failed to update payment status:", response);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleViewOrder = async (orderID) => {
    try {
      const response = await apiClient.get(
        `admin/getOrderDetailByOrderID?orderID=${orderID}`
      );
      if (response.data.statusCodeValue === 200) {
        setOrderDetails(response.data.body);
        setOpen(true);
      } else {
        console.error("Failed to fetch order details:", response);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleDeleteOrder = async (orderID) => {
    try {
      const response = await apiClient.delete(
        `admin/deleteOrder?orderID=${orderID}`
      );
      if (response.data.statusCodeValue === 200) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderID !== orderID)
        );
        console.log("Order deleted:", response.data);
      } else {
        console.error("Failed to delete order:", response);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOrderDetails([]);
  };

  const sortOrdersByMonth = () => {
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(a.localDate) - new Date(b.localDate)
    );
    setOrders(sortedOrders);
    setSortOrder("month");
  };

  const sortOrdersByPayment = () => {
    const sortedOrders = [...orders].sort((a, b) =>
      a.isPaid === b.isPaid ? 0 : a.isPaid ? 1 : -1
    );
    setOrders(sortedOrders);
    setSortOrder("payment");
  };

  return (
    <div className="chart-order-month">
      <MonthlyRevenueChart />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" component="div" sx={{ padding: 2 }}>
          Order List
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={sortOrdersByMonth}
            startIcon={<Sort />}
          >
            Sort by Month
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={sortOrdersByPayment}
            startIcon={<Sort />}
          >
            Sort by Payment
          </Button>
        </Stack>
      </Stack>
      <TableContainer component={Paper} style={{ marginTop: "24px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Ordered</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderID}>
                <TableCell>{order.orderID}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.isOrdered ? "Yes" : "No"}</TableCell>
                <TableCell>{order.isPaid ? "Yes" : "No"}</TableCell>
                <TableCell>{order.localDate}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewOrder(order.orderID)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleConfirmPayment(order.orderID, !order.isPaid)
                    }
                  >
                    <PaymentIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteOrder(order.orderID)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Detail ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Ordered</TableCell>
                  <TableCell>Paid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetails.map((detail) => (
                  <TableRow key={detail.orderDetailID}>
                    <TableCell>{detail.orderDetailID}</TableCell>
                    <TableCell>{detail.name}</TableCell>
                    <TableCell>{detail.price}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/${detail.img}`}
                        alt={detail.name}
                        width={50}
                      />
                    </TableCell>
                    <TableCell>{detail.ordered ? "Yes" : "No"}</TableCell>
                    <TableCell>{detail.paid ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </div>
  );
};

export default OrderList;
