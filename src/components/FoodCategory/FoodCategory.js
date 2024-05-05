import React from "react";
import "./FoodCategory.css";
import Header from "../Header/Header";
import ExploreMenu from "../ExploreMenu/ExploreMenu";
import { useParams } from "react-router-dom";
import FoodDisplay from "../FoodDisplay/FoodDisplay";
const FoodCategory = () => {
  const { categoryId } = useParams();
  return (
    <div>
      <Header></Header>
      <ExploreMenu></ExploreMenu>
      <FoodDisplay categoryId={categoryId} />
    </div>
  );
};

export default FoodCategory;
