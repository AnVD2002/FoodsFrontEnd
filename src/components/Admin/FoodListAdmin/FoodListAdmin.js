import React, { useState, useEffect, useContext } from "react";
import { Add, Edit, Delete, Save, Cancel } from "@mui/icons-material";
import "./FoodListAdmin.css";
import { CssBaseline, Box } from "@mui/material";
import apiClient from "../Axios/AxiosService";
import { ShopContext } from "../../Context/ShopContext";
import ChartFoods from "../ChartAdmin/ChartFoods";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodListAdmin = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(30);
  const [categoryID, setCategoryID] = useState(null);
  const [rating, setRating] = useState(null);
  const [name, setName] = useState(null);
  const [page, setPage] = useState(1);
  const { allFood } = useContext(ShopContext);
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodFilter, setFoodFilter] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  const handleCategoryChange = (event) => setCategoryID(event.target.value);
  const handleRatingChange = (event) => setRating(event.target.value);
  const handleNameChange = (event) => setName(event.target.value);
  const handleChangePageSize = (event) => setPageSize(event.target.value);

  console.log(allFood);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.post("/admin/foodFilter", {
          categoryID: categoryID || null,
          rating: rating ? parseFloat(rating) : null,
          name: name || "",
          page: page,
          pageSize: pageSize,
        });
        if (!response.data || response.data.length === 0) {
          console.log("Không có dữ liệu phù hợp được tìm thấy");
          setFoodFilter([]);
        } else {
          setFoodFilter(response.data);
        }
        setTotalPages(Math.ceil(allFood.length / pageSize));
      } catch (error) {
        console.error("Error submitting filters:", error);
      }
    };

    fetchData();
  }, [accessToken, allFood.length, categoryID, name, page, pageSize, rating]);

  const calculateStock = (foodDetails) => {
    return foodDetails.reduce((total, detail) => total + detail.quantity, 0);
  };

  const calculateOrdered = (foodDetails) => {
    return foodDetails.reduce((total, detail) => total + detail.ordered, 0);
  };

  const calculateMinPrice = (foodDetails) => {
    return Math.min(...foodDetails.map((detail) => detail.price));
  };

  const navigate = useNavigate();
  const handleAddClick = (foodId) =>
    navigate(`/dashboard/food/${foodId}/property-detail`);

  const handleDeleteClick = async (foodID) => {
    try {
      const response = await apiClient.delete(
        `/admin/deleteFood?foodID=${foodID}`
      );
      if (response.data.statusCodeValue === 200) {
        setFoodFilter((prevFoodFilter) =>
          prevFoodFilter.filter((food) => food.foodID !== foodID)
        );
        toast.success(`Success: ${response.data.body}`);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      toast.error("There was an error deleting the food.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/admin/allFoodCategories");
        setFoodCategories(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleEditClick = (food) => setEditingFood(food);
  const handleCancelClick = () => setEditingFood(null);

  const handleInputChange = (e, field) => {
    setEditingFood((prevFood) => ({ ...prevFood, [field]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFileName(file.name);
      setEditingFood((prevFood) => ({ ...prevFood, foodImage: file.name }));
    }
  };

  const handleSaveClick = async () => {
    try {
      const updatedFood = {
        foodID: editingFood.foodID,
        foodName: editingFood.foodName || editingFood.foodName,
        foodDescription:
          editingFood.description !== null ? editingFood.description : "",
        foodImage: editingFood.image || editingFood.image,
      };
      const response = await apiClient.put("/admin/updateFoods", updatedFood);

      if (response.data.statusCodeValue === 200) {
        setFoodFilter((prevFoodFilter) =>
          prevFoodFilter.map((food) =>
            food.foodID === editingFood.foodID ? editingFood : food
          )
        );
        toast.success("Food updated successfully!");
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      toast.error("There was an error updating the food.");
    } finally {
      setEditingFood(null);
      setImageFileName("");
    }
  };

  const pageSizeOptions = [10, 20, 30, allFood.length];
  return (
    <div className="container">
      <ChartFoods />
      <CssBaseline />
      <Box component="main" sx={{ p: 3 }}>
        {/* Main content goes here */}
      </Box>
      <h2>Food Table</h2>
      <form>
        <select
          name="categoryID"
          value={categoryID}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {foodCategories.map((category) => (
            <option
              key={category.foodCategoryID}
              value={category.foodCategoryID}
            >
              {category.foodCategoryName}
            </option>
          ))}
        </select>
        <select name="rating" value={rating} onChange={handleRatingChange}>
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={name}
          onChange={handleNameChange}
        />
        <select value={pageSize} onChange={handleChangePageSize}>
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option === allFood.length ? "All" : option}
            </option>
          ))}
        </select>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Ordered</th>
            <th>Rating</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {foodFilter.length > 0 &&
            foodFilter.map((food) => (
              <tr key={food.foodID}>
                <td>{food.foodID}</td>
                <td>
                  {editingFood && editingFood.foodID === food.foodID ? (
                    <input
                      type="text"
                      value={editingFood.foodName}
                      onChange={(e) => handleInputChange(e, "foodName")}
                    />
                  ) : (
                    food.foodName
                  )}
                </td>
                <td>
                  {editingFood && editingFood.foodID === food.foodID ? (
                    <input
                      type="text"
                      value={editingFood.description}
                      onChange={(e) => handleInputChange(e, "description")}
                    />
                  ) : (
                    food.description
                  )}
                </td>
                <td>{food.foodCategoryID}</td>
                <td>${calculateMinPrice(food.foodDetails).toFixed(2)}</td>
                <td>{calculateStock(food.foodDetails)}</td>
                <td>{calculateOrdered(food.foodDetails)}</td>
                <td>{food.rating}</td>
                <td>
                  {editingFood && editingFood.foodID === food.foodID ? (
                    <input type="file" onChange={handleFileChange} />
                  ) : (
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/${food.image}`}
                      alt={food.foodName}
                      style={{ width: "40px", height: "40px" }}
                    />
                  )}
                </td>
                <td>
                  {editingFood && editingFood.foodID === food.foodID ? (
                    <>
                      <Save className="action-icon" onClick={handleSaveClick} />
                      <Cancel
                        className="action-icon"
                        onClick={handleCancelClick}
                      />
                    </>
                  ) : (
                    <>
                      <Add
                        className="action-icon"
                        onClick={() => handleAddClick(food.foodID)}
                      />
                      <Edit
                        className="action-icon"
                        onClick={() => handleEditClick(food)}
                      />
                      <Delete
                        className="action-icon"
                        onClick={() => handleDeleteClick(food.foodID)}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          {foodFilter.length === 0 && (
            <tr>
              <td colSpan="10">Không có dữ liệu phù hợp được tìm thấy</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => setPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodListAdmin;
