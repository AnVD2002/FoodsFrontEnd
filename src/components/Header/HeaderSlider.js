import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./HeaderSlider.css";

const HeaderSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  return (
    <div className="header-slider">
      <Slider {...settings}>
        <div>
          <img src={`${process.env.PUBLIC_URL}/assets/banner1.jpg`} alt="" />
        </div>
        <div>
          <img src={`${process.env.PUBLIC_URL}/assets/banner2.jpg`} alt="" />
        </div>
        <div>
          <img src={`${process.env.PUBLIC_URL}/assets/banner3.jpg`} alt="" />
        </div>
      </Slider>
    </div>
  );
};

export default HeaderSlider;
