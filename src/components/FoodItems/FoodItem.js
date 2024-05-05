import React from "react";
import "./FoodItem.css";
import { useNavigate } from "react-router-dom";

const FoodItem = (props) => {
  const navigate = useNavigate();

  const handleOnclick = () => {
    if (props.categoryID && props.foodID) {
      navigate(`/${props.categoryID}/${props.foodID}`);
    } else {
      console.error("Missing foodCategoryID or foodID in props:", props);
    }
  };

  return (
    <div className="food-item" onClick={() => handleOnclick()}>
      <div className="food-item-image-container">
        <img
          className="food-item-image"
          src={`${process.env.PUBLIC_URL}/assets/${props.image}`}
          alt=""
        />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{props.name}</p>
          <img src="" alt="" />
        </div>
        <p className="food-item-desc">{props.description}</p>
        <p className="food-item-price">${props.price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
