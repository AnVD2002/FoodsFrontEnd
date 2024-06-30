import React, { useState, useEffect } from "react";
import apiClient from "../Axios/AxiosService";
import { Box, Typography, CircularProgress } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router-dom";

const QuantityDisplayBox = () => {
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
        const response = await apiClient.get("/admin/getQuantityInThisMonth");

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
        ml: 15,
        border: "1px solid #ddd",
        backgroundImage: "linear-gradient(45deg, #9575cd, #ba68c8)",
      }}
    >
      <Typography variant="h5" color="black">
        {revenue} Ordered
      </Typography>
      <ArrowUpwardIcon sx={{ mt: 1 }} onClick={handleNavigate} />
      <StorefrontIcon
        sx={{
          mt: 1,
          cursor: "pointer",
          fontSize: 48,
          color: "linear-gradient(45deg, #9575cd, #ba68c8)",
        }}
        onClick={handleNavigate}
      />{" "}
      {/* Biểu tượng Order */}
      <Typography variant="subtitle1" color="text.secondary" mt={1}>
        Total Quantity This Month
      </Typography>
    </Box>
  );
};

export default QuantityDisplayBox;
