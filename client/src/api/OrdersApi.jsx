import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery } from "react-query";
import { toast } from "sonner";

// Centralized error handling function for consistent error messages
const handleError = (error) => {
  if (error.response && error.response.data) {
    // If there is a response from the server
    return error.response.data.message || "An error occurred";
  }
  return "Network error. Please check your internet connection."; // Generic message if no response
};

export const useGetOrders = (userId, method) => {
  const axiosPrivate = useAxiosPrivate();

  const getOrdersRequest = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/orders/user/orders`, {
        params: { userId, method },
      });
      return response.data; // Return data from response directly
    } catch (error) {
      const errorMessage = handleError(error); // Extract error message
      toast.error(errorMessage); // Display error message as a toast
      throw new Error(errorMessage); // Rethrow the error with the message
    }
  };

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery(["orders", userId, method], getOrdersRequest, {
    enabled: !!userId, // Ensure the query runs only if userId is provided
  });

  return { orders, isLoading, refetch };
};
