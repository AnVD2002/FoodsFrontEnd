import React, { useState, useEffect } from "react";
import apiClient from "../Axios/AxiosService";
import { Box, Typography, CircularProgress } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const UserOrderDisplayBox = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard/useList");
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await apiClient.get("/admin/getTotalUser");

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
        backgroundImage: "linear-gradient(45deg, #FFD700, #FFFACD)",
      }}
    >
      <Typography variant="h5" color="black">
        {revenue} User
      </Typography>
      <ArrowUpwardIcon sx={{ mt: 1 }} onClick={handleNavigate} />
      <PersonIcon
        sx={{
          mt: 1,
          cursor: "pointer",
          fontSize: 48,
          background: "linear-gradient(45deg, #9575cd, #ba68c8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        onClick={handleNavigate}
      />{" "}
      {/* Biểu tượng Order */}
      <Typography variant="subtitle1" color="text.secondary" mt={1}>
        Total User
      </Typography>
    </Box>
  );
};

export default UserOrderDisplayBox;
