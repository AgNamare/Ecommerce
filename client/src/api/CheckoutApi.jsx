import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

// Generic error handler function
const handleError = (error) => {
  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }

  // Handle server response errors and return specific message
  return error.response.data?.message || "An unexpected error occurred";
};

export const useGetOrderSummary = () => {
  const axiosPrivate = useAxiosPrivate();

  const getOrderSummary = async (data) => {
    const response = await axiosPrivate.post(`/api/v1/checkout/initiate`, data);
    return response.data;
  };

  const { mutateAsync: getOrderSummaryData, isLoading: isLoadingOrderSummary } =
    useMutation(getOrderSummary, {
      onError: (error) => {
        toast.error(handleError(error)); // Direct error message
      },
    });

  return { getOrderSummaryData, isLoadingOrderSummary };
};

export const usePlaceOrder = () => {
  const axiosPrivate = useAxiosPrivate();

  const placeOrderRequest = async (data) => {
    const response = await axiosPrivate.post(`/api/v1/payment/mpesa`, data);
    return response.data;
  };

  const { mutateAsync: placeOrder, isLoading: isLoadingPlaceOrder } =
    useMutation(placeOrderRequest, {
      onError: (error) => {
        toast.error(handleError(error)); // Direct error message
      },
    });

  return { placeOrder, isLoadingPlaceOrder };
};

export const useCheckOrder = (orderId) => {
  const axiosPrivate = useAxiosPrivate();

  const checkOrderRequest = async () => {
    const response = await axiosPrivate.get(
      `/api/v1/checkout/payment/mpesa/processing/${orderId}`
    );
    return response.data;
  };

  const {
    data: orderStatus,
    isLoading: isLoadingOrderStatus,
    error,
    refetch,
  } = useQuery(["checkOrder", orderId], checkOrderRequest, {
    enabled: !!orderId,
    cacheTime: 0,
  });

  if (error) {
    toast.error(handleError(error)); // Direct error message
  }

  return { orderStatus, isLoadingOrderStatus, refetch };
};
