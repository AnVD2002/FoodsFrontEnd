import React from "react";
import "./Cart.css";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Cart.css";
import { useCallback } from "react";
import CheckoutForm from "./ChechoutForm";

import { useState } from "react";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutFormVisible, setIsCheckoutFormVisible] = useState(false);

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

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/cart/getCartItems?userName=${userName}`
      );
      const items = response.data.body;
      if (Array.isArray(items)) {
        setCartItems(items);
      } else {
        setCartItems([]);
        console.error("Invalid response format:", items);
      }
    } catch (error) {
      console.error("Failed to load cart items:", error);
      setCartItems([]);
    }
  }, [userName]);

  useEffect(() => {
    if (userName) {
      fetchCartItems();
    }
  }, [userName, fetchCartItems]);

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

  const updateCartItemQuantity = async (cartItemID, quantity) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/cart/updateCartItems`, {
        cartItemID: cartItemID,
        quantity: quantity,
      });
      fetchCartItems();
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  };

  const totalPrice =
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
      : 0;

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
        {Array.isArray(cartItems) && cartItems.length > 0 ? (
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
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateCartItemQuantity(
                    item.cartItemID,
                    parseInt(e.target.value)
                  )
                }
                min="1"
              />
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

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart total</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>{totalPrice}$</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>{0.5}$</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>{totalPrice + 0.5}$</p>
            </div>
            <button onClick={() => setIsCheckoutFormVisible(true)}>
              CHECK OUT
            </button>
          </div>
        </div>
      </div>

      {isCheckoutFormVisible && (
        <CheckoutForm
          onClose={() => setIsCheckoutFormVisible(false)}
          totalPrice={totalPrice + 0.5}
        />
      )}
    </div>
  );
};

export default Cart;
