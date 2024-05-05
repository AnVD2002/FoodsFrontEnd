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
import "./App.css";
function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="App">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/PlaceOrder" element={<PlaceOrder />} />
          <Route path="/category/:categoryId" element={<FoodCategory />} />
          <Route path="/:categoryId/:foodId" element={<FoodDetail />} />
          <Route path="/confirmSignUp" element={<ConfirmSignUp />} />
        </Routes>
        <AppDownload />
        <Footter />
      </div>
    </Router>
  );
}

export default App;
