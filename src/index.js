import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import StoreContextProvider from "./components/Context/ShopContext";
import { AuthProvider } from "./components/Context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </AuthProvider>
);
reportWebVitals();
