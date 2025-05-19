// src/pages/AdminLoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginAdmin } from "@/api/AuthApi"; // Assume you have a hook for admin login
import AdminLoginForm from "@/forms/AdminLoginForm";
import { setAccessToken } from "@/redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { setAdminDetails } from "@/redux/admin/adminSlice";

const AdminLoginPage = () => {
  const { loginAdmin, isLoggingIn } = useLoginAdmin();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (data) => {
    console.log("Admin login attempt with data:", data);
    try {
      const { admin, accessToken } = await loginAdmin(data);
      dispatch(setAccessToken(accessToken));
      dispatch(setAdminDetails(admin));
      navigate("/"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login failed:", error);
      console.error("Error response:", error.response);
      // Handle error (e.g., show notification)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AdminLoginForm onSave={handleLogin} isLoading={isLoggingIn} />
    </div>
  );
};

export default AdminLoginPage;
