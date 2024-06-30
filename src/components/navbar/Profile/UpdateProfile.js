import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./UpdateProfile.css";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [newUserName, setNewUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [img, setImg] = useState("");
  const navigate = useNavigate();

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

  const userName = getUserNameFromToken();

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/account/updateProfile",
        {
          username: userName,
          newUserName,
          phone,
          img,
        }
      );
      console.log("Profile updated successfully:", response.data);
      if (response.data.statusCodeValue === 200) {
        navigate(`/`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="update-profile-container">
      <h2 className="update-profile-title">Update Profile</h2>
      <form
        className="update-profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateProfile();
        }}
      >
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="text"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
