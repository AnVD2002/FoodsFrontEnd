import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ loginAdmin, element, ...rest }) => {
  return loginAdmin ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/dashboard/login" replace />
  );
};

export default PrivateRoute;
