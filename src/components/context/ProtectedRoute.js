import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth, hasRole } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
    return <Navigate to="/login" />;
  }

  if (!hasRole(allowedRoles)) {
    // Nếu không có quyền, chuyển đến trang chính
    return <Navigate to="/" />;
  }

  // Người dùng có quyền
  return children;
};

export default ProtectedRoute;
