import React, { useState } from "react";
import "./LoginPopup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const LoginPopup = ({ setShowLogin }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        }
      } catch (error) {
        console.error(
          "Failed to create account:",
          error.response?.data?.message || error.message
        );
      }
    } else if (currState === "Login") {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/account/login",
          { username, password }
        );
        login(response.data.accessToken, response.data.expiryToken);
        setShowLogin(false);
        navigate("/");
      } catch (error) {
        console.error("Failed to login:", error);
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleFormSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={`${process.env.PUBLIC_URL}/assets/cross_icon.png`}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {currState === "Login" ? (
          <div className="login-popup-remember">
            <input type="checkbox" required />
            <p>Remember password</p>
          </div>
        ) : (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the Terms of Use & Privacy Policy</p>
          </div>
        )}

        {currState === "Login" ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={() => setCurrState("Login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
