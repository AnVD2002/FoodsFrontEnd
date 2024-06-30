import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Confirm.css";

const ConfirmSignUp = () => {
  const location = useLocation();
  const [code, setCode] = useState("");
  const [accountInfo, setAccountInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.accountInfo) {
      console.log(location.state.accountInfo);
      setAccountInfo(location.state.accountInfo);
    }
  }, [location.state]);

  const handleCloseForm = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountInfo) {
      console.error("Account information is not available.");
      return;
    }

    const confirmRequest = {
      registerResponse: accountInfo,
      code: code,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/account/confirmAccount",
        confirmRequest
      );
      if (response.status === 200) {
        console.log("Registration confirmed successfully.");
        navigate("/");
      } else {
        console.log(response.data.body);
      }
    } catch (error) {
      console.error(
        "Failed to confirm registration:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="confirm-signup">
      <form
        action=""
        onSubmit={handleSubmit}
        className="confirm-signup-container"
      >
        <div className="confirm-signup-title">
          <h2>Confirm SignUp</h2>
          <img
            onClick={handleCloseForm}
            src={`${process.env.PUBLIC_URL}/assets/cross_icon.png`}
            alt="Close"
          />
        </div>
        <div className="confirm-signup-input">
          <input
            type="text"
            placeholder="code"
            value={code}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default ConfirmSignUp;
