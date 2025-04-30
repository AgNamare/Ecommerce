import { useQuery, useMutation } from "react-query";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; // Import your custom axios hook

export const useGetUserOrders = (orderId) => {
  const axiosPrivate = useAxiosPrivate();

  const fetchUserOrders = async () => {
    const response = await axiosPrivate.get(`/api/v1/orders/${orderId}`);
    return response.data; // Return response data directly
  };

  return useQuery(["userOrders", orderId], fetchUserOrders);
};

export const useGetOrders = ({
  searchQuery,
  page,
  sortOption,
  deliverySlot,
  status,
  method, // Updated field name
  startDate,
  logistic,
  endDate,
}) => {
  const axiosPrivate = useAxiosPrivate();
  console.log(logistic);

  const getOrdersRequest = async () => {
    console.log("getOrdersRequest started");

    // Construct the query parameters conditionally
    const queryParams = new URLSearchParams({
      searchQuery,
      page: String(page),
      sortOption,
      deliverySlot,
      status,
      method,
      startDate,
      endDate,
    });

    // Add logistic to the query parameters only if it's defined
    if (logistic !== undefined) {
      queryParams.append("logistic", logistic);
    }

    const requestUrl = `/api/v1/admin/orders?${queryParams.toString()}`; // Updated URL
    console.log(requestUrl);

    const response = await axiosPrivate.get(requestUrl);
    const orders = response.data; // Return the response data directly
    console.log("Orders fetched:", orders);
    return orders;
  };

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery(
    [
      "orders",
      searchQuery,
      page,
      sortOption,
      deliverySlot,
      status,
      method,
      startDate,
      logistic, // Will be excluded from query if undefined
      endDate,
    ],
    getOrdersRequest
  );

  console.log("useGetOrders result:", { orders, isLoading, isError, refetch });
  return { orders, isLoading, isError, refetch };
};

export const useUpdateOrderStatus = () => {
  const axiosPrivate = useAxiosPrivate();

  const updateOrderStatusRequest = async ({ orderId, newStatus }) => {
    console.log("Updating order status for orderId:", orderId);
    const response = await axiosPrivate.put(
      `/api/v1/orders/update-status/${orderId}`,
      { newStatus }
    );

    return response.data; // Return response data directly
  };

  const { mutateAsync: updateOrderStatus, isLoading: isUpdatingOrderStatus } =
    useMutation({
      mutationFn: updateOrderStatusRequest,
      onSuccess: () => {
        toast.success("Order status updated successfully");
      },
      onError: (error) => {
        toast.error(
          `Failed to update status: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    });

  return { updateOrderStatus, isUpdatingOrderStatus };
};

export const useUpdateLogistics = () => {
  const axiosPrivate = useAxiosPrivate();

  const updateLogisticsRequest = async ({ orderId, newLogisticId }) => {
    console.log("Updating logistics for orderId:", orderId);
    const response = await axiosPrivate.put(
      `/api/v1/orders/update-logistics/${orderId}`,
      { newLogisticId }
    );

    return response.data; // Return response data directly
  };

  const { mutateAsync: updateLogistics, isLoading: isUpdatingLogistics } =
    useMutation({
      mutationFn: updateLogisticsRequest,
      onSuccess: () => {
        toast.success("Logistics updated successfully");
      },
      onError: (error) => {
        toast.error(
          `Failed to update logistics: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    });

  return { updateLogistics, isUpdatingLogistics };
};
