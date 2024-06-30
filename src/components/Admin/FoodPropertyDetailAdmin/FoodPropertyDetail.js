import React, { useEffect, useState } from "react";
import apiClient from "../Axios/AxiosService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FoodPropertyDetail.css";

const FoodPropertyDetail = ({ foodId, addFoodDetail }) => {
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState({});
  const [isContainerVisible, setIsContainerVisible] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/food/propertyDetailByFoodID?foodID=${foodId}`
        );
        const data = response.data.body;

        const groupedProperties = data.reduce((acc, detail) => {
          if (!acc[detail.propertyID]) {
            acc[detail.propertyID] = {
              propertyName: detail.propertyName,
              details: [],
            };
          }
          acc[detail.propertyID].details.push(detail);
          return acc;
        }, {});

        setPropertyDetails(Object.values(groupedProperties));
      } catch (error) {
        console.error("Error fetching property details:", error);
        setError("Không thể lấy chi tiết tài sản");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [accessToken, foodId]);

  const handlePropertySelect = (propertyID, propertyDetailID) => {
    setSelectedProperties((prev) => ({
      ...prev,
      [propertyID]: propertyDetailID,
    }));
  };

  const handleAdd = async () => {
    if (
      Object.keys(selectedProperties).length !== propertyDetails.length ||
      !quantity ||
      !price
    ) {
      setError("Vui lòng chọn đầy đủ thuộc tính, số lượng và giá.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        "/admin/createFoodPropertyDetails",
        {
          foodID: foodId,
          quantity: parseInt(quantity),
          price: parseFloat(price),
          propertyDetailID: Object.values(selectedProperties),
        }
      );

      if (response.data.statusCodeValue === 200) {
        toast.success(response.data.body.message);
        const newFoodDetail = {
          foodDetailID: response.data.body.foodDetailID,
          foodDetailName: response.data.body.foodDetailName,
          price: parseFloat(response.data.body.price),
          quantity: parseInt(response.data.body.quantity),
          ordered: response.data.body.ordered,
        };
        addFoodDetail(newFoodDetail);
        setSelectedProperties({});
        setQuantity("");
        setPrice("");
        setError(null);
      } else {
        toast.error("Có lỗi xảy ra khi thêm sản phẩm.");
      }
    } catch (error) {
      setError(error.message);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="btn-add"
        onClick={() => setIsContainerVisible(!isContainerVisible)}
      >
        {isContainerVisible ? "Ẩn chi tiết đồ ăn" : "Thêm chi tiết đồ ăn"}
      </button>
      {isContainerVisible && (
        <div className="food-property-detail-container">
          <h2>Chi tiết tài sản thực phẩm</h2>
          {loading && <p>Đang tải...</p>}
          {error && <p>Lỗi: {error}</p>}
          {propertyDetails.map((property) => (
            <div key={property.propertyName} className="property-group">
              <h3 className="property-name">{property.propertyName}</h3>
              <div className="property-options">
                {property.details.map((detail) => (
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
          ))}
          <div className="quantity-section">
            <label htmlFor="quantity">Số lượng:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="price-section">
            <label htmlFor="price">Giá:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button onClick={handleAdd} disabled={loading}>
            {loading ? "Đang thêm vào giỏ hàng..." : "Thêm sản phẩm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodPropertyDetail;
