import React, { useContext } from "react";
import "./navbar.css";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { ShopContext } from "../Context/ShopContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserEdit,
  faKey,
  faSignOutAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { allFood } = useContext(ShopContext);
  const location = useLocation();

  useEffect(() => {
    setSearchResults([]);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigate = (path) => {
    setMenu(path);
    navigate(`/${path}`);
    setSearchResults([]);
  };

  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const filteredFoods = allFood.filter((food) =>
      food.foodName.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredFoods);
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/assets/shopee.png`} alt="" />
      <ul className="navbar-menu">
        <li
          onClick={() => handleNavigate("")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </li>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a>
        <li
          onClick={() => setMenu("contact-us")}
          className={menu === "contact" ? "active" : ""}
        >
          contact-us
        </li>
      </ul>
      <div className="navbar-right">
        <img src={`${process.env.PUBLIC_URL}/assets/search_icon.png`} alt="" />
        <input
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
          placeholder="Tìm kiếm..."
        />
        <div className="search-results">
          {searchResults.map((food) => (
            <div
              key={food.foodID}
              onClick={() => navigate(`/${food.foodCategoryID}/${food.foodID}`)}
            >
              {food.foodName}
            </div>
          ))}
        </div>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img
              src={`${process.env.PUBLIC_URL}/assets/basket_icon.png`}
              alt=""
            />
          </Link>
          <div className="dot"></div>
        </div>
        {isLoggedIn ? (
          <div className="user-profile" ref={dropdownRef}>
            <div
              className="profile-icon"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/profile_icon.png`}
                alt="Profile"
              />
            </div>
            <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
              <div onClick={() => navigate("/view-profile")}>
                <FontAwesomeIcon icon={faUser} /> View Profile
              </div>
              <div onClick={() => navigate("/update-profile")}>
                <FontAwesomeIcon icon={faUserEdit} /> Update Profile
              </div>
              <div onClick={() => navigate("/change-password")}>
                <FontAwesomeIcon icon={faKey} /> Change Password
              </div>
              <div onClick={() => navigate("/purchase-history")}>
                <FontAwesomeIcon icon={faHistory} /> Purchase History
              </div>
              <div onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
