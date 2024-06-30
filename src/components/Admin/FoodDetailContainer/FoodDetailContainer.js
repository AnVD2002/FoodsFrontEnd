import React, { useState, useEffect } from "react";
import apiClient from "../Axios/AxiosService";
import FoodPropertyDetail from "../FoodPropertyDetailAdmin/FoodPropertyDetail";
import FoodDetailList from "../FoodDetailList/FoodDetailList";
import "./FoodDetailContainer.css";
import { useParams } from "react-router-dom";

const FoodContainer = () => {
  const [foodDetails, setFoodDetails] = useState([]);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { foodId } = useParams();

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await apiClient.get(
          `/admin/foodDetailByID?foodID=${foodId}`
        );

        if (response.data) {
          setFoodData(response.data.body);
          setFoodDetails(response.data.body.foodDetails);
          setLoading(false);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId]);

  const addFoodDetail = (newFoodDetail) => {
    const index = foodDetails.findIndex(
      (detail) => detail.foodDetailID === newFoodDetail.foodDetailID
    );
    if (index === -1) {
      setFoodDetails([...foodDetails, newFoodDetail]);
    } else {
      const updatedDetails = [...foodDetails];
      updatedDetails[index] = newFoodDetail;
      setFoodDetails(updatedDetails);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching food data: {error.message}</div>;
  }

  return (
    <div className="food-container">
      <FoodPropertyDetail foodId={foodId} addFoodDetail={addFoodDetail} />
      <FoodDetailList foodData={foodData} foodDetails={foodDetails} />
    </div>
  );
};

export default FoodContainer;
