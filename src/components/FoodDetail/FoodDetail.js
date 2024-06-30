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
import FadeIn from "../Animation/FadeIn";

const FoodDetail = () => {
  const { allFood } = useContext(ShopContext);
  const [food, setFood] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState({});
  const { categoryId, foodId } = useParams();
  const numFoodId = Number(foodId);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const numCategoryId = Number(categoryId);
    const food = allFood.find(
      (food) =>
        food.foodCategoryID === numCategoryId && food.foodID === numFoodId
    );
    setFood(food);
  }, [categoryId, numFoodId, allFood]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/food/propertyDetailByFoodID?foodID=${foodId}`
        );
        const data = response.data.body;
        setPropertyDetails(data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [foodId]);

  const [lowestPrice, setLowestPrice] = useState(null);
  const [highestPrice, setHighestPrice] = useState(null);

  useEffect(() => {
    if (food && food.foodDetails) {
      const prices = food.foodDetails.map((detail) => detail.price);
      setLowestPrice(Math.min(...prices));
      setHighestPrice(Math.max(...prices));
    }
  }, [food]);

  const getUserNameFromToken = () => {
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
  const userName = getUserNameFromToken();

  const handleAddToCart = () => {
    const propertyDetailIDs = Object.values(selectedProperties);

    const data = {
      foodID: Number(foodId),
      propertyDetailID: propertyDetailIDs,
      userName: userName,
      quantity: 1,
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

  const [rating, setRating] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/food/rating?foodID=${numFoodId}`)
      .then((response) => {
        setRating(Math.round(response.data.body));
        console.log(response.data.body);
      })
      .catch((error) => console.error("Error fetching rating:", error));
  }, [numFoodId]);

  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(
      <img
        key={i}
        src={`${process.env.PUBLIC_URL}/assets/star_icon.png`}
        alt="star"
      />
    );
  }

  if (!food) {
    return <p>Loading food details...</p>;
  }

  const handlePropertySelect = (propertyID, propertyDetailID) => {
    setSelectedProperties((prev) => ({
      ...prev,
      [propertyID]: propertyDetailID,
    }));
  };

  const renderPropertyDetails = () => {
    const groupedProperties = propertyDetails.reduce((acc, detail) => {
      if (!acc[detail.propertyID]) {
        acc[detail.propertyID] = {
          propertyName: detail.propertyName,
          details: [],
        };
      }
      acc[detail.propertyID].details.push(detail);
      return acc;
    }, {});

    return Object.keys(groupedProperties).map((propertyID) => (
      <div key={propertyID} className="property-group">
        <h3 className="property-name">
          {groupedProperties[propertyID].propertyName}
        </h3>
        <div className="property-options">
          {groupedProperties[propertyID].details.map((detail) => (
            <div key={detail.propertyDetailID}>
              <button
                onClick={() =>
                  handlePropertySelect(
                    detail.propertyID,
                    detail.propertyDetailID
                  )
                }
                className={
                  selectedProperties[detail.propertyID] ===
                  detail.propertyDetailID
                    ? "selected"
                    : ""
                }
              >
                {detail.propertyDetailName}
              </button>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div>
      <FadeIn>
        <div className="food-detail-container">
          <div className="food-detail-image-container">
            <img
              src={`${process.env.PUBLIC_URL}/assets/${food.image}`}
              alt={food.foodName}
            />
          </div>
          <div className="food-detail-info">
            <h1 className="food-name">{food.foodName}</h1>
            <p className="food-description">{food.description}</p>
            <div className="food-prices">
              <div>Lowest Price: {lowestPrice}</div>
              <div>Highest Price: {highestPrice}</div>
            </div>
            <div className="food-rating">{stars}</div>
            <div className="food-property">
              <div className="property-options">{renderPropertyDetails()}</div>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <CartMessage show={showPopup} message={popupMessage} />
          </div>
        </div>
        <Comments foodID={Number(foodId)} />
      </FadeIn>
    </div>
  );
};
export default FoodDetail;
