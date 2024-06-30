import React, { useState } from "react";
import { useEffect } from "react";
import apiClient from "../Axios/AxiosService";

import { CssBaseline, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUser, setEditUser] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get("/admin/getAllUser");
      if (!response.data || response.data.body.length === 0) {
        console.log("Không có dữ liệu phù hợp được tìm thấy");
        setUsers([]);
      } else {
        setUsers(response.data.body);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    console.log("Add action");
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user.userID === userId);
    setEditingUserId(userId);
    setEditUser(userToEdit);
  };

  const handleDelete = async (userId) => {
    console.log("Delete action for user", userId);

    try {
      const response = await apiClient.delete("/admin/deleteUser", {
        params: {
          userID: userId,
        },
      });

      if (response.status === 200) {
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user.userID !== userId));
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error(
        `Failed to delete user: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleChange = (e, fieldName) => {
    const { value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [fieldName]: value,
    }));
  };

  const handleSave = async (userId) => {
    try {
      const response = await apiClient.put("/admin/updateUser", editUser);

      if (response.status === 200) {
        toast.success("User updated successfully");
        setEditingUserId(null);
        setEditUser({});
        fetchData();
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error(
        `Failed to update user: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div>
      <CssBaseline />

      <Box component="main" sx={{ p: 3, marginTop: "64px" }}>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            marginBottom: 2,
            backgroundColor: "#2b2828",
            "&:hover": { backgroundColor: "#1c1a1a" },
          }}
        >
          Thêm người dùng
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>UserID</TableCell>
                <TableCell>UserName</TableCell>
                <TableCell>Decentralization</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Mail</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userID}>
                  <TableCell>{user.userID}</TableCell>
                  <TableCell>
                    {editingUserId === user.userID ? (
                      <TextField
                        name="userName"
                        value={editUser.userName}
                        onChange={(e) => handleChange(e, "userName")}
                      />
                    ) : (
                      user.userName
                    )}
                  </TableCell>
                  <TableCell>{user.decentralization}</TableCell>
                  <TableCell>
                    {editingUserId === user.userID ? (
                      <TextField
                        name="status"
                        value={editUser.status}
                        onChange={(e) => handleChange(e, "status")}
                      />
                    ) : user.status ? (
                      "Active"
                    ) : (
                      "Inactive"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.userID ? (
                      <TextField
                        name="mail"
                        value={editUser.mail}
                        onChange={(e) => handleChange(e, "mail")}
                      />
                    ) : (
                      user.mail
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.userID ? (
                      <TextField
                        name="numberPhone"
                        value={editUser.numberPhone}
                        onChange={(e) => handleChange(e, "numberPhone")}
                      />
                    ) : (
                      user.phone
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.userID ? (
                      <TextField
                        name="img"
                        value={editUser.img}
                        onChange={(e) => handleChange(e, "img")}
                      />
                    ) : (
                      user.img
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.userID ? (
                      <Button onClick={() => handleSave(user.userID)}>
                        Save
                      </Button>
                    ) : (
                      <>
                        <IconButton
                          sx={{ color: "#2b2828" }}
                          onClick={() => handleEdit(user.userID)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          sx={{ color: "#2b2828" }}
                          onClick={() => handleDelete(user.userID)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default UserList;
