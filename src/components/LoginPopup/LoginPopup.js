import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (currState === "Sign Up") {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/account/createAccount",
          { email, username, password }
        );
        if (response.status === 200) {
          setShowLogin(false);
          navigate("/confirmSignUp", {
            state: { accountInfo: response.data },
          });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to create account. Please try again.");
      }
    } else if (currState === "Login") {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/account/login",
          { username, password }
        );

        if (response.data.statusCodeValue === 200) {
          login(
            response.data.body.accessToken,
            response.data.body.refreshToken,
            rememberMe
          );
          setShowLogin(false);
          navigate("/");
        } else {
          toast.error(response.data.body.message);
        }
      } catch (error) {
        toast.error(
          "Failed to login. Please check your credentials and try again."
        );
      }
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setShowLogin(false), 300);
  };

  return (
    <div className={`login-popup ${closing ? "closing" : ""}`}>
      <form onSubmit={handleFormSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={handleClose}
            src={`${process.env.PUBLIC_URL}/assets/cross_icon.png`}
            alt="Close"
            className="close-icon"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {currState === "Login" && (
          <div className="login-popup-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <p>Remember password</p>
          </div>
        )}

        {currState === "Login" ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrState("Sign Up")}> Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={() => setCurrState("Login")}> Login</span>
          </p>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPopup;
