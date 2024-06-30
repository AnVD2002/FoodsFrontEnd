import React, { useEffect, useState } from "react";
import apiClient from "../Axios/AxiosService";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback } from "react";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEditDetail, setOpenEditDetail] = useState(false);
  const [currentProperty, setCurrentProperty] = useState({
    propertyID: null,
    propertyName: "",
  });
  const [currentPropertyDetail, setCurrentPropertyDetail] = useState({
    propertyDetailID: null,
    propertyDetailName: "",
  });
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [selectedPropertyID, setSelectedPropertyID] = useState(null);

  const fetchProperties = useCallback(() => {
    apiClient
      .get("/admin/getAllProperty")
      .then((response) => {
        if (response.data && response.data.body) {
          setProperties(response.data.body);
        }
      })
      .catch((error) => {
        toast.error("There was an error fetching the properties!");
        console.error("There was an error fetching the properties!", error);
      });
  }, []);
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const fetchPropertyDetails = (propertyID) => {
    apiClient
      .get(`/admin/getPropertyDetailByID?propertyID=${propertyID}`)
      .then((response) => {
        if (response.data && response.data.body) {
          setPropertyDetails(response.data.body);
          console.log(response.data.body);
          setSelectedPropertyID(propertyID);
          setOpenView(true);
        }
      })
      .catch((error) => {
        toast.error("There was an error fetching the property details!");
        console.error(
          "There was an error fetching the property details!",
          error
        );
      });
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProperty({ propertyID: null, propertyName: "" });
  };

  const handleDetailClose = () => {
    setOpenDetail(false);
    setCurrentPropertyDetail({
      propertyDetailID: null,
      propertyDetailName: "",
    });
  };

  const handleViewClose = () => {
    setOpenView(false);
    setPropertyDetails([]);
  };

  const handleEditDetailClose = () => {
    setOpenEditDetail(false);
    setCurrentPropertyDetail({
      propertyDetailID: null,
      propertyDetailName: "",
    });
  };

  const handleSubmit = () => {
    const isUpdating = !!currentProperty.propertyID;
    const apiUrl = isUpdating ? "/admin/updateProperties" : "admin/addProperty";

    const request = isUpdating
      ? apiClient.put(apiUrl, currentProperty)
      : apiClient.post(apiUrl, currentProperty);

    request
      .then((response) => {
        fetchProperties();
        handleClose();
        toast.success(
          isUpdating
            ? "Property updated successfully!"
            : "Property added successfully!"
        );
      })
      .catch((error) => {
        toast.error(
          isUpdating
            ? "There was an error updating the property!"
            : "There was an error adding the property!"
        );
        console.error(
          isUpdating
            ? "There was an error updating the property!"
            : "There was an error adding the property!",
          error
        );
      });
  };

  const handleDetailSubmit = () => {
    apiClient
      .post("/admin/addPropertyDetail", currentPropertyDetail)
      .then((response) => {
        handleDetailClose();
        fetchPropertyDetails(selectedPropertyID);
        toast.success("Property detail added successfully!");
      })
      .catch((error) => {
        toast.error("There was an error adding the property detail!");
        console.error("There was an error adding the property detail!", error);
      });
  };

  const handleEditDetailSubmit = () => {
    apiClient
      .put("/admin/updatePropertyDetail", currentPropertyDetail)
      .then((response) => {
        handleEditDetailClose();
        fetchPropertyDetails(selectedPropertyID);
        toast.success("Property detail updated successfully!");
      })
      .catch((error) => {
        toast.error("There was an error updating the property detail!");
        console.error(
          "There was an error updating the property detail!",
          error
        );
      });
  };

  const handleEdit = (property) => {
    setCurrentProperty(property);
    setOpen(true);
  };

  const handleAddDetail = (propertyID) => {
    setCurrentPropertyDetail({
      propertyDetailID: null,
      propertyDetailName: "",
      propertyID,
    });
    setOpenDetail(true);
  };

  const handleEditDetail = (detail) => {
    setCurrentPropertyDetail(detail);
    setOpenEditDetail(true);
  };

  const handleDeleteDetail = (propertyDetailID) => {
    apiClient
      .delete(
        `/admin/deletePropertyDetail?propertyDetailID=${propertyDetailID}`
      )
      .then((response) => {
        fetchPropertyDetails(selectedPropertyID);
        toast.success("Property detail deleted successfully!");
      })
      .catch((error) => {
        toast.error("There was an error deleting the property detail!");
        console.error(
          "There was an error deleting the property detail!",
          error
        );
      });
  };

  const handleViewDetails = (propertyID) => {
    fetchPropertyDetails(propertyID);
  };

  const handleDelete = (propertyID) => {
    apiClient
      .delete(`/deleteProperties?propertyID=${propertyID}`)
      .then((response) => {
        fetchProperties();
        toast.success("Property deleted successfully!");
      })
      .catch((error) => {
        toast.error("There was an error deleting the property!");
        console.error("There was an error deleting the property!", error);
      });
  };

  return (
    <Container>
      <ToastContainer />
      <h1>Properties</h1>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
      >
        Add Property
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property ID</TableCell>
              <TableCell>Property Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.propertyID}>
                <TableCell>{property.propertyID}</TableCell>
                <TableCell>{property.propertyName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleAddDetail(property.propertyID)}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    onClick={() => handleViewDetails(property.propertyID)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(property)}>
                    <Edit />
                  </IconButton>
                  <IconButton>
                    <Delete onClick={() => handleDelete(property.propertyID)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentProperty.propertyID ? "Edit Property" : "Add Property"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="propertyName"
            label="Property Name"
            type="text"
            fullWidth
            value={currentProperty.propertyName}
            onChange={(e) =>
              setCurrentProperty({
                ...currentProperty,
                propertyName: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {currentProperty.propertyID ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDetail} onClose={handleDetailClose}>
        <DialogTitle>Add Property Detail</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="propertyDetailName"
            label="Property Detail Name"
            type="text"
            fullWidth
            value={currentPropertyDetail.propertyDetailName}
            onChange={(e) =>
              setCurrentPropertyDetail({
                ...currentPropertyDetail,
                propertyDetailName: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDetailSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDetail} onClose={handleEditDetailClose}>
        <DialogTitle>Edit Property Detail</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="propertyDetailName"
            label="Property Detail Name"
            type="text"
            fullWidth
            value={currentPropertyDetail.propertyDetailName}
            onChange={(e) =>
              setCurrentPropertyDetail({
                ...currentPropertyDetail,
                propertyDetailName: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDetailClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditDetailSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openView} onClose={handleViewClose} fullWidth maxWidth="md">
        <DialogTitle>Property Details</DialogTitle>
        <DialogContent>
          <List>
            {propertyDetails.map((detail) => (
              <ListItem key={detail.propertyDetailID}>
                <ListItemText
                  primary={detail.propertyDetailName}
                  secondary={`Property Detail ID: ${detail.propertyDetailID}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleEditDetail(detail)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteDetail(detail.propertyDetailID)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Properties;
