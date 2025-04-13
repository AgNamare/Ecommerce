import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

// Generic error handler function
const handleError = (error) => {
  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }
  if (error.response && error.response.data) {
    return error.response.data.message || "An unexpected error occurred";
  }
  return "An unexpected error occurred";
};

export const useCreateAddress = (userId) => {
  const axiosPrivate = useAxiosPrivate();
  const createAddress = async (data) => {
    try {
      const response = await axiosPrivate.post(`/api/v1/addresses`, {
        address: data,
        userId: userId,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error)); // Throw error with the appropriate message
    }
  };

  const { mutateAsync: createAddressRequest, isLoading: isCreatingAddress } =
    useMutation(createAddress, {
      onSuccess: () => {
        toast.success("Address created successfully!");
      },
      onError: (error) => {
        toast.error(error.message); // Display error message
      },
    });

  return { createAddressRequest, isCreatingAddress };
};

export const useUpdateAddress = () => {
  const axiosPrivate = useAxiosPrivate();
  const updateAddress = async (data) => {
    try {
      const response = await axiosPrivate.put(`/api/v1/addresses`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleError(error)); // Throw error with the appropriate message
    }
  };

  const { mutateAsync: updateAddressRequest, isLoading: isUpdatingAddress } =
    useMutation(updateAddress, {
      onSuccess: () => {
        toast.success("Address updated successfully!");
      },
      onError: (error) => {
        toast.error(error.message); // Display error message
      },
    });

  return { updateAddressRequest, isUpdatingAddress };
};

export const useGetAddress = (id) => {
  const axiosPrivate = useAxiosPrivate();
  const getAddress = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleError(error)); // Throw error with the appropriate message
    }
  };

  const { data: address, isLoading: isAddressLoading } = useQuery({
    queryKey: ["address", id],
    queryFn: getAddress,
    enabled: !!id,
    onError: (error) => {
      toast.error(error.message); // Display error message
    },
  });

  return { address, isAddressLoading };
};

export const useGetAddresses = (userId) => {
  const axiosPrivate = useAxiosPrivate();

  const getAddresses = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/addresses/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleError(error)); // Throw error with the appropriate message
    }
  };

  const {
    data: addresses,
    isLoading: isAddressesLoading,
    error,
  } = useQuery(["addresses", userId], getAddresses, {
    enabled: !!userId,
    cacheTime: 0,
    staleTime: 0,
    onError: (error) => {
      toast.error(error.message); // Display error message
    },
  });

  if (error) {
    console.error("Error in useGetAddresses:", error);
  }

  return { addresses, isAddressesLoading };
};

export const useDeleteAddress = (userId) => {
  const axiosPrivate = useAxiosPrivate();
  const deleteAddress = async (id) => {
    try {
      const response = await axiosPrivate.delete(
        `/api/v1/addresses/${userId}/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error)); // Throw error with the appropriate message
    }
  };

  const { mutateAsync: deleteAddressRequest, isLoading: isDeletingAddress } =
    useMutation(deleteAddress, {
      onSuccess: () => {
        toast.success("Address deleted successfully!");
      },
      onError: (error) => {
        toast.error(error.message); // Display error message
      },
    });

  return { deleteAddressRequest, isDeletingAddress };
};

export const useLogin = () => {
  const loginRequest = async (credentials) => {
    try {
      const response = await axios.post("/api/v1/auth/sign-in", credentials);
      return response.data; // Directly return the data
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  const { mutateAsync: login, isLoading: isLoggingIn } = useMutation(
    loginRequest,
    {
      onSuccess: () => {
        toast.success("Login Successful");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { login, isLoggingIn };
};

export const useVerifyRegisteredUser = () => {
  const verificationRequest = async (credentials) => {
    try {
      const response = await axios.post(
        "/api/v1/auth/verify-registered",
        credentials
      );
      return response.data; // Directly return the data
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  const { mutateAsync: verifyRegisteredEmail, isLoading: isVerifying } =
    useMutation(verificationRequest, {
      onSuccess: () => {
        toast.success("Verification Successful");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { verifyRegisteredEmail, isVerifying };
};

export const useVerification = () => {
  const verificationRequest = async (credentials) => {
    try {
      const response = await axios.post(
        "/api/v1/auth/verify-user",
        credentials,
        { withCredentials: true }
      );
      return response.data; // Directly return the data
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  const { mutateAsync: verifyEmail, isLoading: isVerifying } = useMutation(
    verificationRequest,
    {
      onSuccess: () => {
        toast.success("Verification Successful");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { verifyEmail, isVerifying };
};

export const useCheckEmail = () => {
  const verificationRequest = async (credentials) => {
    try {
      const response = await axios.post(
        "/api/v1/auth/reset-password",
        credentials
      );
      return response.data; // Directly return the data
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  const { mutateAsync: checkEmail, isLoading: isChecking } = useMutation(
    verificationRequest,
    {
      onSuccess: () => {
        toast.success("OTP Sent");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { checkEmail, isChecking };
};

export const useUpdatePassword = () => {
  const updatePasswordRequest = async (userFormData) => {
    try {
      const response = await axios.put(
        "/api/v1/auth/update-password",
        userFormData
      );
      return response.data; // Directly return the data
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  const { mutateAsync: updatePassword, isLoading: isUpdatingPassword } =
    useMutation(updatePasswordRequest, {
      onSuccess: () => {
        toast.success("Password updated successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { updatePassword, isUpdatingPassword };
};

export const useResendOtp = () => {
  const resendOtpRequest = async (phoneNumber) => {
    try {
      const response = await axios.post("/api/v1/auth/resend-otp", phoneNumber);
      return response.data; // Directly return the data
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  const { mutateAsync: resendOtp, isLoading: isResendingOtp } = useMutation(
    resendOtpRequest,
    {
      onSuccess: () => {
        toast.success("OTP resent successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { resendOtp, isResendingOtp };
};

export const useLogOut = () => {
  const axiosPrivate = useAxiosPrivate();
  const logoutRequest = async () => {
    try {
      const response = await axiosPrivate.post(
        "/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  const { mutateAsync: logOut, isLoading: isLoggingOut } = useMutation(
    logoutRequest,
    {
      onSuccess: () => {
        toast.success("Logout Successful");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { logOut, isLoggingOut };
};

// Example of using Axios with useQuery
export const useGetBranches = () => {
  const getBranchesRequest = async () => {
    try {
      const response = await axios.get("/api/v1/branches");
      return response.data; // Directly return the data
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  const { data: branches, isLoading: isLoadingBranches } = useQuery(
    "branches",
    getBranchesRequest,
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { branches, isLoadingBranches };
};
