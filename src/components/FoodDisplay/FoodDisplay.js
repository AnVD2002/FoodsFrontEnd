import "./FoodDisplay.css";
import FoodItem from "../FoodItems/FoodItem";
import { useMemo } from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useCallback } from "react";
import ScrollAnimation from "../Animation/ScrollAnimation";

const FoodDisplay = ({ categoryId }) => {
  const [foodData, setFoodData] = useState([]);
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const [selection, setSelection] = useState(0);
  const [rating, setRating] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [topOrderedFoods, setTopOrderedFoods] = useState([]);

  const fetchFoodData = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/food/foodFilterClient",
        {
          selectID: selection,
          categoryID: categoryId ? Number(categoryId) : null,
          rating: rating ? Number(rating) : null,
          startPrice: startPrice ? Number(startPrice) : null,
          endPrice: endPrice ? Number(endPrice) : null,
        }
      );
      setFoodData(response.data);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  }, [selection, categoryId, rating, startPrice, endPrice]);

  const fetchTopOrderedFoods = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/food/getTopOrder"
      );
      setTopOrderedFoods(response.data.body);
    } catch (error) {
      console.error("Error fetching top ordered foods:", error);
    }
  }, []);

  useEffect(() => {
    fetchFoodData();
    fetchTopOrderedFoods();
  }, [fetchFoodData, fetchTopOrderedFoods]);

  const filteredFoods = useMemo(() => {
    return foodData;
  }, [foodData]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredFoods.length / itemsPerPage);
  }, [filteredFoods]);

  const currentFoodItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFoods.slice(start, start + itemsPerPage);
  }, [currentPage, filteredFoods]);
  return (
    <div className="food-display" id="food-display">
      <div className="top-foods">
        <h2>Top Foods</h2>
        <div className="top-foods-list">
          {topOrderedFoods.map((item) => {
            const lowestPrice =
              item.foodDetails && item.foodDetails.length > 0
                ? Math.min(...item.foodDetails.map((detail) => detail.price))
                : null;

            return (
              <ScrollAnimation key={item.foodID}>
                <FoodItem
                  name={item.foodName}
                  description={item.description}
                  price={lowestPrice}
                  image={item.image}
                  categoryID={item.foodCategoryID}
                  foodID={item.foodID}
                  rating={item.rating}
                />
              </ScrollAnimation>
            );
          })}
        </div>
      </div>

      <div className="filter-form">
        <select
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
        >
          <option value="0">All</option>
          <option value="1">Sort By Name</option>
          <option value="2">Low To High</option>
          <option value="3">High to Low</option>
          <option value="4">Trending</option>
          {/* Add more options as needed */}
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <select
          value={`${startPrice}-${endPrice}`}
          onChange={(e) => {
            const [start, end] = e.target.value.split("-");
            setStartPrice(start);
            setEndPrice(end);
          }}
        >
          <option value="">Price Range</option>
          <option value="20000-50000">20000 - 50000</option>
          <option value="50000-100000">50000 - 100000</option>
          <option value="100000-200000">100000 - 200000</option>
        </select>
      </div>
      <h2>Top dishes</h2>

      <div className="food-display-list">
        {currentFoodItems.map((item) => {
          const lowestPrice =
            item.foodDetails && item.foodDetails.length > 0
              ? Math.min(...item.foodDetails.map((detail) => detail.price))
              : null;

          return (
            <ScrollAnimation key={item.foodID}>
              <FoodItem
                name={item.foodName}
                description={item.description}
                price={lowestPrice}
                image={item.image}
                categoryID={item.foodCategoryID}
                foodID={item.foodID}
                rating={item.rating}
              />
            </ScrollAnimation>
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
