import { useQuery } from "react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; // Adjust the import path as needed

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetAllUsers = (searchState) => {
  const axiosPrivate = useAxiosPrivate();

  const getUsersRequest = async () => {
    const { searchQuery, page, sortOption } = searchState;
    const response = await axiosPrivate.get("/api/v1/admin/users", {
      params: { searchQuery, page, sortOption },
    });
    return response.data; // Return response data directly
  };

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(["getUsers", searchState], getUsersRequest);

  // Determine if a 404 error occurred
  const is404Error = isError && error.response?.status === 404;

  return { users, isLoading, is404Error };
};

export const useGetAUser = (id) => {
  const axiosPrivate = useAxiosPrivate();

  const getAUserRequest = async () => {
    const response = await axiosPrivate.get(`/api/v1/admin/users/${id}`);
    return response.data; // Return response data directly
  };

  const { data: user, isLoading: isLoadingUser } = useQuery(
    ["getAUser", id],
    getAUserRequest
  );

  return { user, isLoadingUser };
};

export const useGetOrderHistory = (id) => {
  const axiosPrivate = useAxiosPrivate();

  const getOrderHistoryRequest = async () => {
    const response = await axiosPrivate.get(`api/v1/admin/users/${id}/orders`);
    return response.data; // Return response data directly
  };

  const { data: orderHistory, isLoading: isLoadingOrders } = useQuery(
    ["getOrderHistory", id],
    getOrderHistoryRequest
  );

  return { orderHistory, isLoadingOrders };
};

export const useGetBillingInfo = (id) => {
  const axiosPrivate = useAxiosPrivate();

  const getBillingInfoRequest = async () => {
    const response = await axiosPrivate.get(`/users/${id}/billing`);
    return response.data; // Return response data directly
  };

  const { data: billingInfo, isLoading: isLoadingBilling } = useQuery(
    ["getBillingInfo", id],
    getBillingInfoRequest
  );

  return { billingInfo, isLoadingBilling };
};
