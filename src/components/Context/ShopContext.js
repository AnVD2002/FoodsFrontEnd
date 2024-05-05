import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const ShopContext = createContext(null);

const StoreContextProvider = (props) => {
  const [allFood, setAllFood] = useState([]);
  useEffect(() => {
    const fetchAllFood = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/food/allFood"
        );
        setAllFood(response.data);
      } catch (error) {
        console.log("...", error);
      }
    };
    fetchAllFood();
  }, []);

  const contextValue = {
    allFood,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default StoreContextProvider;
