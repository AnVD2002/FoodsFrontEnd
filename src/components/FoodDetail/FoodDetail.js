import React from "react";
import "./FoodDetail.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import Comments from "../Comment/Comments";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import CartMessage from "../Popup/CartMessage";

const FoodDetail = () => {
  const { allFood } = useContext(ShopContext);
  const [food, setFood] = useState(null);
  const { categoryId, foodId } = useParams();
  useEffect(() => {
    const numCategoryId = Number(categoryId);
    const numFoodId = Number(foodId);
    const food = allFood.find(
      (food) =>
        food.foodCategoryID === numCategoryId && food.foodID === numFoodId
    );

    setFood(food);
  }, [categoryId, foodId, allFood]);
  const [sizes, setSizes] = useState([]);
  const [spicyLevels, setSpicyLevels] = useState([]);
  const [toppings, setToppings] = useState([]);
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/food/propertyDetailByFoodID?foodID=${foodId}`
        );
        const data = response.data;
        setSizes(data.filter((detail) => detail.propertyID === 1));
        setSpicyLevels(data.filter((detail) => detail.propertyID === 2));
        setToppings(data.filter((detail) => detail.propertyID === 3));
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [foodId]);
  //getPrice
  const [lowestPrice, setLowestPrice] = useState(null);
  const [highestPrice, setHighestPrice] = useState(null);

  useEffect(() => {
    if (food && food.foodDetails) {
      const prices = food.foodDetails.map((detail) => detail.price);
      setLowestPrice(Math.min(...prices));
      setHighestPrice(Math.max(...prices));
    }
  }, [food]);

  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedSpicyId, setSelectedSpicyId] = useState(null);
  const [selectedToppingId, setSelectedToppingId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSizeSelection = (sizeId) => {
    setSelectedSizeId(sizeId);
  };
  const handleSpicySelection = (spicyId) => {
    setSelectedSpicyId(spicyId);
  };
  const handleToppingSelection = (toppingId) => {
    setSelectedToppingId(toppingId);
  };

  const getUserIDFromToken = () => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.sub;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    } else {
      console.error("No token found");
      return null;
    }
  };
  const userID = getUserIDFromToken();
  const userNumberID = Number(userID);

  const handleAddToCart = () => {
    const propertyDetailIDs = [
      selectedSizeId,
      selectedSpicyId,
      selectedToppingId,
    ].filter((id) => id !== undefined);

    const data = {
      foodID: Number(foodId),
      propertyDetailID: propertyDetailIDs,
      userID: userNumberID,
      quantity: quantity,
    };

    axios
      .post("http://localhost:8080/api/v1/cart/addToCart", data)
      .then((response) => {
        if (response.data.statusCode === 200) {
          setPopupMessage("Item successfully added to cart!");
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 3000);
        } else {
          setPopupMessage(response.data.body);
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 3000);
        }
      })
      .catch((error) => {
        setPopupMessage("Error adding item to cart.");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        console.error("Error adding item to cart", error);
      });
  };

  if (!food) {
    return <p>Loading food details...</p>;
  }

  return (
    <div>
      <div className="food-detail">
        <div className="food-detail-left">
          <img src={`${process.env.PUBLIC_URL}/assets/${food.image}`} alt="" />
        </div>
        {showPopup &&
          (console.log(showPopup),
          (
            <CartMessage show={showPopup} message={popupMessage}></CartMessage>
          ))}
        <div className="food-detail-right">
          <h1>{food.foodName}</h1>
          <div className="food-display-star">
            <img
              src={`${process.env.PUBLIC_URL}/assets/star_icon.png`}
              alt=""
            />
            <img
              src={`${process.env.PUBLIC_URL}/assets/star_icon.png`}
              alt=""
            />
            <img
              src={`${process.env.PUBLIC_URL}/assets/star_icon.png`}
              alt=""
            />
            <img
              src={`${process.env.PUBLIC_URL}/assets/star_icon.png`}
              alt=""
            />
            <img
              src={`${process.env.PUBLIC_URL}/assets/star_icon.png`}
              alt=""
            />
          </div>
          <div className="food-detail-price">
            <div className="food-detail-prices">
              {lowestPrice !== null && (
                <div className="food-detail-lowest-price">
                  Lowest Price: ${lowestPrice}
                </div>
              )}
              {highestPrice !== null && (
                <div className="food-detail-highest-price">
                  Highest Price: ${highestPrice}
                </div>
              )}
            </div>
          </div>
          <div className="food-detail-description">{food.description}</div>
          <div className="food-detail-size">
            {sizes.map((size) => (
              <div
                key={size.propertyDetailID}
                className={`food-detail-sizes ${
                  selectedSizeId === size.propertyDetailID ? "selected" : ""
                }`}
                onClick={() => handleSizeSelection(size.propertyDetailID)}
              >
                {size.propertyDetailName}
              </div>
            ))}
          </div>
          <div className="food-detail-spicy">
            {spicyLevels.map((spicy) => (
              <div
                key={spicy.propertyDetailID}
                className={`food-detail-spicy ${
                  selectedSpicyId === spicy.propertyDetailID ? "selected" : ""
                }`}
                onClick={() => handleSpicySelection(spicy.propertyDetailID)}
              >
                {spicy.propertyDetailName}
              </div>
            ))}
          </div>
          <div className="food-detail-topping">
            {toppings.map((topping) => (
              <div
                key={topping.propertyDetailID}
                className={`food-detail-topping ${
                  selectedToppingId === topping.propertyDetailID
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleToppingSelection(topping.propertyDetailID)}
              >
                {topping.propertyDetailName}
              </div>
            ))}
          </div>
          <div className="food-detail-quantity">
            <button
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              -
            </button>
            <span className="quantity-number">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button onClick={handleAddToCart}>ADD TO CART</button>
        </div>
      </div>
      <Comments foodID={Number(foodId)}></Comments>
    </div>
  );
};

export default FoodDetail;
