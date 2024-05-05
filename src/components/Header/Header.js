import React from "react";
import "./Header.css";
import HeaderSlider from "./HeaderSlider";
const Header = () => {
  return (
    <div className="header">
      <HeaderSlider></HeaderSlider>
      <div className="header-contents"></div>
    </div>
  );
};

export default Header;
