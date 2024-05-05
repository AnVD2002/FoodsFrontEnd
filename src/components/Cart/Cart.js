import React from "react";
import "./Cart.css";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { useState } from "react";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

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

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/cart/getCartItems?userID=${userNumberID}`
      );
      setCartItems(response.data.body);
    } catch (error) {
      console.error("Failed to load cart items:", error);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchCartItems();
    }
  }, [userID, userNumberID]);

  const removeCartItem = async (cartItemID) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/cart/removeCartItem?cartItemID=${cartItemID}`
      );
      fetchCartItems();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-item-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.cartItemID}
              className="cart-items-title cart-items-item"
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/${item.img}`}
                alt={item.foodDetailName}
                style={{ width: 50, height: 50 }}
              />
              <p>{item.foodDetailName}</p>
              <p>${item.price}</p>
              <p>{item.quantity}</p>
              <p>${item.price * item.quantity}</p>
              <button onClick={() => removeCartItem(item.cartItemID)}>
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>No items in the cart.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
