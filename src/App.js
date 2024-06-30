import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import Footter from "./components/Footer/Footter";
import AppDownload from "./components/AppDownload/AppDownload";
import PlaceOrder from "./components/PlaceOrder/PlaceOrder";
import FoodCategory from "./components/FoodCategory/FoodCategory";
import FoodDetail from "./components/FoodDetail/FoodDetail";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import ConfirmSignUp from "./components/LoginPopup/ConfirmSignUp";
import Dashboard from "./components/Admin/Dashboard";
import { useLocation } from "react-router-dom";
import FoodListAdmin from "./components/Admin/FoodListAdmin/FoodListAdmin";

import FoodContainer from "./components/Admin/FoodDetailContainer/FoodDetailContainer";
import UpdateProfile from "./components/navbar/Profile/UpdateProfile";
import ViewProfile from "./components/navbar/Profile/ViewProfile";
import Payment from "./components/Cart/Payment";
import UserList from "./components/Admin/User/UserList";
import OrderDetailsTable from "./components/navbar/Profile/OrderDetailsTable";
import OrderList from "./components/Admin/Order/OrderList";
import HeaderAdmin from "./components/Admin/Header/HeaderAdmin";
import SidebarAdmin from "./components/Admin/Sidebar/SidebarAdmin";
import UploadFood from "./components/Admin/UploadFoods/UploadFood";
import LoginAdmin from "./components/Admin/Header/LoginAdmin";
import { Navigate } from "react-router-dom";
import UploadFoodProperties from "./components/Admin/UploadFoods/UploadFoodProperties";
import { useEffect } from "react";
import OrderDetailList from "./components/Admin/Order/OrderDetailList";
import SuccessModal from "./components/Cart/PopupSuccess";

import "./App.css";
function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <MainAppContent showLogin={showLogin} setShowLogin={setShowLogin} />
    </Router>
  );
}

function MainAppContent({ showLogin, setShowLogin }) {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginAdmin, setLoginAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setLoginAdmin(loggedIn);
    setIsInitialized(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <div className="App">
        {isDashboardRoute ? (
          <>
            <HeaderAdmin
              openSidebar={toggleSidebar}
              isLoggedIn={loginAdmin}
              setIsLoggedIn={setLoginAdmin}
            />
            <SidebarAdmin open={sidebarOpen} onClose={toggleSidebar} />
            <div className="admin-content">
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    loginAdmin ? (
                      <Dashboard />
                    ) : (
                      <Navigate to="/dashboard/login" />
                    )
                  }
                />
                <Route
                  path="/dashboard/foodlist"
                  element={
                    loginAdmin ? (
                      <FoodListAdmin />
                    ) : (
                      <Navigate to="/dashboard/login" />
                    )
                  }
                />
                <Route
                  path="/dashboard/useList"
                  element={
                    loginAdmin ? (
                      <UserList />
                    ) : (
                      <Navigate to="/dashboard/login" />
                    )
                  }
                />

                <Route
                  path="/dashboard/orderDetailList"
                  element={
                    loginAdmin ? (
                      <OrderDetailList />
                    ) : (
                      <Navigate to="/dashboard/login" />
                    )
                  }
                />

                <Route
                  path="/dashboard/orderList"
                  element={
                    loginAdmin ? (
                      <OrderList />
                    ) : (
                      <Navigate to="/dashboard/login" />
                    )
                  }
                />
                <Route
                  path="/dashboard/login"
                  element={
                    <LoginAdmin
                      loginAdmin={loginAdmin}
                      setIsLoggedIn={setLoginAdmin}
                    />
                  }
                />
                <Route
                  path="/dashboard/uploadProperties"
                  element={
                    loginAdmin ? (
                      <UploadFood />
                    ) : (
                      <Navigate to="/dashboard/login" />
                    )
                  }
                />
                <Route
                  path="/dashboard/uploadFoodProperties"
                  element={
                    loginAdmin ? (
                      <UploadFoodProperties />
                    ) : (
                      <Navigate to="/dashboard/login" />
                    )
                  }
                />
                <Route
                  path="/dashboard/food/:foodId/property-detail"
                  element={
                    loginAdmin ? (
                      <FoodContainer />
                    ) : (
                      <Navigate to="/dashboard/login" />
                    )
                  }
                />
              </Routes>
            </div>
          </>
        ) : (
          <>
            <Navbar setShowLogin={setShowLogin} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/category/:categoryId" element={<FoodCategory />} />
              <Route path="/:categoryId/:foodId" element={<FoodDetail />} />
              <Route path="/confirmSignUp" element={<ConfirmSignUp />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/view-profile" element={<ViewProfile />} />
              <Route path="/purchase-history" element={<OrderDetailsTable />} />
              <Route path="/payment/success" element={<SuccessModal />} />
            </Routes>
            <AppDownload />
            <Footter />
          </>
        )}
      </div>
    </>
  );
}

export default App;
