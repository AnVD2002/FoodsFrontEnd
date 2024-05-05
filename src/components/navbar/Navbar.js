import React, { useContext } from "react";
import "./navbar.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { ShopContext } from "../Context/ShopContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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

  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="" />
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
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
