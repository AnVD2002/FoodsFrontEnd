import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./LoginAdmin.css";

function LoginAdmin({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/account/login",
        {
          username,
          password,
        }
      );

      if (response.data && response.data.body) {
        const { accessToken, refreshToken, role, message } = response.data.body;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("role", role);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("refreshToken", refreshToken);
        if (role === "[ADMIN]") {
          setIsLoggedIn(true);
          navigate("/dashboard");
          toast.success(message);
        } else {
          toast.error("không có quyền");
        }
      } else {
        toast.error("Invalid response structure.");
      }
    } catch (error) {
      console.error("There was an error logging in:", error);
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Login failed! Please check your credentials."
        );
      } else {
        toast.error("Login failed! Please check your credentials.");
      }
    }
  };

  return (
    <Box
      className="login-admin"
      component="form"
      onSubmit={handleLoginSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
        maxWidth: 400,
        margin: "0 auto",
        mt: 5,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Login
      </Typography>
      <TextField
        margin="dense"
        name="username"
        label="Username"
        type="text"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        margin="dense"
        name="password"
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
      {/* <ToastContainer /> */}
    </Box>
  );
}

export default LoginAdmin;
