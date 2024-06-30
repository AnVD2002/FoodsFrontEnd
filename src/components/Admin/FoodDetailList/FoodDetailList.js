import React from "react";
import "./FoodDetailList.css";
import { useEffect, useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import apiClient from "../Axios/AxiosService";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const FoodDetailList = ({ foodData, foodDetails }) => {
  const { foodName, description, image, foodCategoryID, rating } = foodData;
  const [details, setDetails] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedDetail, setEditedDetail] = useState({});

  useEffect(() => {
    setDetails(foodDetails);
  }, [foodDetails]);

  const handleEditClick = (detail) => {
    setEditMode(detail.foodDetailID);
    setEditedDetail({ ...detail });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const response = await apiClient.put("/admin/updateFoodDetail", {
        foodDetailID: editedDetail.foodDetailID,
        quantity: parseInt(editedDetail.quantity),
        price: parseFloat(editedDetail.price),
      });

      if (response.data.statusCodeValue === 200) {
        toast.success("Chi tiết đồ ăn đã được cập nhật thành công!");
        const updatedDetails = details.map((detail) =>
          detail.foodDetailID === editedDetail.foodDetailID
            ? editedDetail
            : detail
        );
        setDetails(updatedDetails);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật chi tiết đồ ăn.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật chi tiết đồ ăn.");
    } finally {
      setEditMode(null);
    }
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setEditedDetail({});
  };

  const handleDeleteClick = async (foodDetailID) => {
    try {
      const response = await apiClient.delete(
        `/admin/deleteFoodDetail?foodDetailID=${foodDetailID}`
      );

      if (response.data.statusCodeValue === 200) {
        console.log("Delete successful:", response);
        setDetails((prevFoodDetails) =>
          prevFoodDetails.filter(
            (foodDetail) => foodDetail.foodDetailID !== foodDetailID
          )
        );
        toast.success(`Success: ${response.data.body}`);
      } else {
        toast.error("Unexpected response format");
        console.log(response.data.body);
      }
    } catch (error) {
      toast.error("There was an error deleting the food detail.");
    }
  };

  return (
    <div className="food-details-container">
      <div className="food-general-info">
        <h1>{foodName}</h1>
        <img src={`${process.env.PUBLIC_URL}/assets/${image}`} alt={foodName} />
        <p>{description}</p>
        <p>Category ID: {foodCategoryID}</p>
        <p>Rating: {rating}</p>
      </div>
      <table className="food-details-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Ordered</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => (
            <tr key={detail.foodDetailID}>
              <td>{detail.foodDetailID}</td>
              <td>{detail.foodDetailName}</td>
              <td>
                {editMode === detail.foodDetailID ? (
                  <input
                    type="number"
                    name="price"
                    value={editedDetail.price}
                    onChange={handleInputChange}
                  />
                ) : (
                  detail.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "VND",
                  })
                )}
              </td>
              <td>
                {editMode === detail.foodDetailID ? (
                  <input
                    type="number"
                    name="quantity"
                    value={editedDetail.quantity}
                    onChange={handleInputChange}
                  />
                ) : (
                  detail.quantity
                )}
              </td>
              <td>{detail.ordered !== null ? detail.ordered : "N/A"}</td>
              <td>
                {editMode === detail.foodDetailID ? (
                  <>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <>
                    <Edit
                      onClick={() => handleEditClick(detail)}
                      className="action-icon"
                    />
                    <Delete
                      onClick={() => handleDeleteClick(detail.foodDetailID)}
                      className="action-icon"
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default FoodDetailList;
