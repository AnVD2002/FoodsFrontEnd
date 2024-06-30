import React, { useState, useEffect } from "react";
import apiClient from "../Axios/AxiosService";
import { Box, Typography, CircularProgress } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useNavigate } from "react-router-dom";

const RevenueDisplayBox = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard/orderList");
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await apiClient.get("/admin/getTotalInThisMonth");

        if (response.status === 200) {
          setRevenue(response.data.body);
        } else {
          setError("Failed to fetch revenue data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Kiểm tra nếu revenue không phải là số hoặc null
  if (typeof revenue !== "number" || isNaN(revenue)) {
    return <Typography color="error">Invalid revenue data</Typography>;
  }

  return (
    <Box
      sx={{
        width: 350,
        height: 200,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 4,
        ml: 10,
        border: "1px solid #ddd",
        backgroundImage: "linear-gradient(to right, #a1c4fd, #c2e9fb)",
      }}
    >
      <Typography variant="h5" color="primary">
        {revenue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")} VND
      </Typography>
      <ArrowUpwardIcon sx={{ mt: 1 }} onClick={handleNavigate} />
      <ShoppingBasketIcon
        sx={{ mt: 1, cursor: "pointer", fontSize: 48, color: "#3f51b5" }}
        onClick={handleNavigate}
      />{" "}
      {/* Biểu tượng Order */}
      <Typography variant="subtitle1" color="text.secondary" mt={1}>
        Total Revenue This Month
      </Typography>
    </Box>
  );
};

export default RevenueDisplayBox;
