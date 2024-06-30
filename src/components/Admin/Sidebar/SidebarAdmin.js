import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Link } from "react-router-dom";

const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#282c34",
          color: "white",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#3f51b5",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.7)",
          minWidth: "40px",
        },
      },
    },
  },
});

function SidebarAdmin({ open, onClose }) {
  const [openSublist, setOpenSublist] = useState({});

  const handleClick = (item) => {
    setOpenSublist((prevState) => ({ ...prevState, [item]: !prevState[item] }));
  };

  const commonListItemTextStyles = {
    fontSize: "0.875rem",
  };

  return (
    <ThemeProvider theme={theme}>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <List sx={{ width: "250px" }}>
          <ListItem button onClick={() => handleClick("dashboard")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
            {openSublist.dashboard ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSublist.dashboard} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/dashboard" sx={{ pl: 4 }}>
                <ListItemText
                  primary="Dashboard"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Subitem 2"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
            </List>
          </Collapse>
          <Divider />
          <ListItem button onClick={() => handleClick("user")}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
            {openSublist.user ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSublist.user} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="/dashboard/useList"
                sx={{ pl: 4 }}
              >
                <ListItemText
                  primary="User List"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Subitem 2"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
            </List>
          </Collapse>
          <Divider />
          <ListItem button onClick={() => handleClick("product")}>
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
            {openSublist.product ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSublist.product} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="/dashboard/foodlist"
                sx={{ pl: 4 }}
              >
                <ListItemText
                  primary="Product List"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/dashboard/uploadFoodProperties"
                sx={{ pl: 4 }}
              >
                <ListItemText
                  primary="Product Upload"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/uploadProperties"
                button
                sx={{ pl: 4 }}
              >
                <ListItemText
                  primary="Properties Upload"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
            </List>
          </Collapse>
          <Divider />
          <ListItem button onClick={() => handleClick("order")}>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
            {openSublist.order ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSublist.order} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="/dashboard/orderList"
                sx={{ pl: 4 }}
              >
                <ListItemText
                  primary="Order List"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/dashboard/orderDetailList"
                sx={{ pl: 4 }}
              >
                <ListItemText
                  primary="Order Detail List"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
            </List>
          </Collapse>
          <Divider />
          <ListItem button onClick={() => handleClick("setting")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Setting" />
            {openSublist.setting ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSublist.setting} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Subitem 1"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Subitem 2"
                  primaryTypographyProps={{
                    sx: commonListItemTextStyles,
                  }}
                />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </ThemeProvider>
  );
}

export default SidebarAdmin;
