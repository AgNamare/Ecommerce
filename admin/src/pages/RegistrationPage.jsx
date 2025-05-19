import React, { useEffect, useState } from "react";
import AdminRegisterForm from "@/forms/AdminRegistrationForm"; // Update with your actual path
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGetBranches } from "@/api/HomeApi";
import { useRegisterAdmin } from "@/api/AuthApi";

const AdminRegistrationPage = () => {
  const [branches, setBranches] = useState([]);
  console.log(branches);
  const { branches: fetchedBranches, isLoading: isBranchesLoading } =
    useGetBranches();
  const { registerAdmin, isRegisteringAdmin } = useRegisterAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isBranchesLoading) {
      setBranches(fetchedBranches);
    }
  }, []);

  const handleSave = async (data) => {
    const newAdmin = await registerAdmin(data);
    console.log(newAdmin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AdminRegisterForm
        onSave={handleSave}
        isLoading={isBranchesLoading || isRegisteringAdmin}
        branches={branches}
      />
    </div>
  );
};

export default AdminRegistrationPage;
