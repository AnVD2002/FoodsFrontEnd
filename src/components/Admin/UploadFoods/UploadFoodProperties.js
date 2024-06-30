import React, { useState, useEffect } from "react";
import apiClient from "../Axios/AxiosService";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadFoodProperties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [foodCategoryID, setFoodCategoryID] = useState("");
  const [foodName, setFoodName] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get("admin/getAllProperty");
        setProperties(response.data.body);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("admin/getAllCategory");
        setCategories(response.data.body);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchProperties();
    fetchCategories();
  }, []);

  const handlePropertyChange = (propertyID) => {
    setSelectedProperties((prevSelected) =>
      prevSelected.includes(propertyID)
        ? prevSelected.filter((id) => id !== propertyID)
        : [...prevSelected, propertyID]
    );
  };

  const handleCategoryChange = (e) => {
    setFoodCategoryID(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImg(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      foodCategoryID: parseInt(foodCategoryID, 10),
      foodName,
      propertyID: selectedProperties,
      img,
      description,
    };

    try {
      const response = await apiClient.post("/food/createFoodProperty", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200)
        toast.success("Food property created successfully");
      setFoodCategoryID("");
      setFoodName("");
      setImg("");
      setDescription("");
      setSelectedProperties([]);
    } catch (error) {
      console.error("Error creating food property", error);
      toast.error("Failed to create food property");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Upload Food Properties
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <Typography variant="subtitle1">Select Food Category</Typography>
          <Select
            value={foodCategoryID}
            onChange={handleCategoryChange}
            variant="outlined"
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Food Name"
          variant="outlined"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ margin: "10px 0" }}
        />
        {img && (
          <img
            src={img}
            alt="Uploaded"
            style={{ maxWidth: "100%", marginBottom: 10 }}
          />
        )}
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <FormControl component="fieldset" sx={{ margin: "20px 0" }}>
          <Typography variant="h6" component="h3">
            Select Properties
          </Typography>
          <FormGroup>
            {properties.map((property) => (
              <FormControlLabel
                key={property.propertyID}
                control={
                  <Checkbox
                    checked={selectedProperties.includes(property.propertyID)}
                    onChange={() => handlePropertyChange(property.propertyID)}
                  />
                }
                label={property.propertyName}
              />
            ))}
          </FormGroup>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#388e3c" } }}
          fullWidth
        >
          Submit
        </Button>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default UploadFoodProperties;
