import React from "react";
import "./Footter.css";
const Footter = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="" />
          <p></p>
          <div className="footer-social-icons">
            <img
              src={`${process.env.PUBLIC_URL}/assets/facebook_icon.png`}
              alt=""
            />
            <img
              src={`${process.env.PUBLIC_URL}/assets/linkedin_icon.png`}
              alt=""
            />
            <img
              src={`${process.env.PUBLIC_URL}/assets/twitter_icon.png`}
              alt=""
            />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delively</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-212-456-7890</li>
            <li>contact@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 @ Tomato.com - All Right Reserved.
      </p>
    </div>
  );
};
export default Footter;
