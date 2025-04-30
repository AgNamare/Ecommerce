import { useMutation } from "react-query";
import { toast } from "sonner";
import axios from "axios";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; // Import the custom hook

export const useRegisterAdmin = () => {
  const axiosPrivate = useAxiosPrivate(); // Use the axios instance that handles token refresh

  const registerAdminRequest = async (data) => {
    const response = await axiosPrivate.post(
      `http://localhost:3000/api/v1/auth/admin/register`,
      data
    );
    return response.data;
  };

  const { mutateAsync: registerAdmin, isLoading: isRegisteringAdmin } =
    useMutation(registerAdminRequest, {
      onSuccess: () => {
        toast.success("Admin registered successfully!");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      },
    });

  return { registerAdmin, isRegisteringAdmin };
};

export const useLoginAdmin = () => {
  const loginAdminRequest = async (data) => {
    const response = await axios.post(
      `http://localhost:3000/api/v1/auth/admin/login`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  };

  const { mutateAsync: loginAdmin, isLoading: isLoggingIn } = useMutation(
    loginAdminRequest,
    {
      onSuccess: (data) => {
        toast.success("Login successful!");
        // Optionally save the access token to local storage or state management
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
    }
  );

  return { loginAdmin, isLoggingIn };
};
