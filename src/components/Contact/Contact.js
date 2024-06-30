import React from "react";
import "./Contact.css"; // Tạo file CSS riêng cho component Contact
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

const Contact = () => {
  return (
    <div className="floating-icons">
      <a
        href="https://m.me/yourpage"
        className="icon messenger-icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faFacebookMessenger} />
      </a>
      <a
        href="https://zalo.me/yourpage"
        className="icon zalo-icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`${process.env.PUBLIC_URL}/assets/zalo_icon.png`}
          alt="Zalo"
        />
      </a>
    </div>
  );
};

export default Contact;
