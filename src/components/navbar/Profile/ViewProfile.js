import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";
import "./ViewProfile.css";

const ViewProfile = () => {
  const [userData, setUserData] = useState([]);

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

  const name = getUserNameFromToken();
  useEffect(() => {
    fetchUserProfile(name);
  }, [name]);

  const fetchUserProfile = async (name) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/account/getProfile?name=${name}`
      );
      setUserData(response.data.body);
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-title">User Profile</h2>
      <div className="user-profile-info">
        <div>
          <label>Username:</label>
          <span>{userData.userName}</span>
        </div>
        <div>
          <label>Phone:</label>
          <span>{userData.phone}</span>
        </div>
        <div>
          <label>Image URL:</label>
          <span>{userData.img}</span>
        </div>
        <div>
          <label>Email</label>
          <span>{userData.email}</span>
        </div>
        <div>
          <label>updateAt</label>
          <span>{userData.updateAt}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
