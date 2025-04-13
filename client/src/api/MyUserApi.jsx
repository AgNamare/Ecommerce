import { useMutation } from "react-query";
import { toast } from "sonner";
import axios from "./axios"; // Adjust the import path as necessary

// Generic error handler function
const handleError = (error) => {
  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }
  return error.response.data?.message || "An unexpected error occurred";
};

export const useCreateMyUser = () => {
  const createMyUserRequest = async (userFormData) => {
    try {
      const response = await axios.post("/api/v1/auth/sign-up", userFormData);
      return response.data; // Directly return the data
    } catch (error) {
      // Use the handleError function to format and throw the error
      throw new Error(handleError(error));
    }
  };

  const {
    mutateAsync: createUser,
    isLoading,
    isSuccess,
  } = useMutation(createMyUserRequest, {
    onSuccess: () => {
      toast.success("User Created Successfully");
    },
    onError: (error) => {
      toast.error(error.message); // Show error message
    },
  });

  return { createUser, isLoading, isSuccess };
};

export const useUpdateUser = () => {
  const updateUserRequest = async (userFormData) => {
    try {
      const response = await axios.put("/api/v1/user/update", userFormData);
      return response.data; // Directly return the data
    } catch (error) {
      // Use the handleError function to format and throw the error
      throw new Error(handleError(error));
    }
  };

  const { mutateAsync: updateUser, isLoading: isUpdatingLoading } = useMutation(
    updateUserRequest,
    {
      onSuccess: () => {
        toast.success("Update Successful");
      },
      onError: (error) => {
        toast.error(error.message); // Show error message
      },
    }
  );

  return { updateUser, isUpdatingLoading };
};
