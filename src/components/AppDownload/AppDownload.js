import React from "react";
import "./AppDownload.css";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For Better Experience Download <br /> Tomato App{" "}
      </p>
      <div className="app-dowload-platforms">
        <img src={`${process.env.PUBLIC_URL}/assets/play_store.png`} alt="" />
        <img src={`${process.env.PUBLIC_URL}/assets/app_store.png`} alt="" />
      </div>
    </div>
  );
};

export default AppDownload;
