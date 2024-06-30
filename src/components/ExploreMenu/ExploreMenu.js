import React, { useEffect, useState, useCallback } from "react";
import "./ExploreMenu.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ScrollAnimation from "../Animation/ScrollAnimation";
const ExploreMenu = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const fetchAllFoodCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/food/allFoodCategories"
      );
      setFoods(response.data);
    } catch (error) {
      console.error("There was an error fetching the food categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllFoodCategories();
  }, [fetchAllFoodCategories]);
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array
      </p>
      <div className="explore-menu-list">
        {foods.map((item) => {
          return (
            <ScrollAnimation key={item.foodCategoryID}>
              <div
                className="explore-menu-list-item"
                onClick={() => handleCategoryClick(item.foodCategoryID)}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/${item.image}`}
                  alt=""
                />
                <p>{item.foodCategoryName}</p>
              </div>
            </ScrollAnimation>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMenu;
