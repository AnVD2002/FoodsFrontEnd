import React, { useContext } from "react";
import "./FoodDisplay.css";
import { ShopContext } from "../Context/ShopContext";
import FoodItem from "../FoodItems/FoodItem";
import { useMemo } from "react";
import { useState } from "react";
const FoodDisplay = ({ categoryId }) => {
  const { allFood } = useContext(ShopContext);
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFoods = useMemo(() => {
    if (!categoryId) {
      return allFood;
    }
    return allFood.filter((food) => food.foodCategoryID === Number(categoryId));
  }, [allFood, categoryId]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredFoods.length / itemsPerPage);
  }, [filteredFoods]);

  const currentFoodItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFoods.slice(start, start + itemsPerPage);
  }, [currentPage, filteredFoods]);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes</h2>
      <div className="food-display-list">
        {currentFoodItems.map((item) => {
          const lowestPrice =
            item.foodDetails && item.foodDetails.length > 0
              ? Math.min(...item.foodDetails.map((detail) => detail.price))
              : null;

          return (
            <FoodItem
              key={item.foodID}
              name={item.foodName}
              description={item.description}
              price={lowestPrice}
              image={item.image}
              categoryID={item.foodCategoryID}
              foodID={item.foodID}
            />
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
