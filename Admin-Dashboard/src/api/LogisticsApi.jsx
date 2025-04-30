import { useQuery, useMutation } from "react-query";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; // Import your custom axios hook

export const useGetLogistics = (searchState) => {
  const axiosPrivate = useAxiosPrivate(); // Use axiosPrivate for API calls

  // Define the fetch function
  const getLogisticsRequest = async () => {
    const searchQuery = searchState?.searchQuery || "";
    const response = await axiosPrivate.get(`/api/v1/admin/logistics`, {
      params: { searchQuery }, // Use params for query strings
    });
    return response.data; // Return the response data directly
  };

  // Use the useQuery hook from React Query
  const {
    data: logistics,
    isLoading,
    isError,
    error,
  } = useQuery(["logistics", searchState], getLogisticsRequest, {
    onError: () => {
      toast.error("Error fetching logistics");
    },
  });

  return { logistics, isLoading, isError, error };
};

export const useCreateLogistics = () => {
  const axiosPrivate = useAxiosPrivate();

  const createLogisticsRequest = async (data) => {
    const response = await axiosPrivate.post(`/api/v1/admin/logistics`, data);
    return response.data; // Return the response data
  };

  const { mutateAsync: createLogistics, isLoading: isCreatingLogistics } =
    useMutation(createLogisticsRequest, {
      onSuccess: () => {
        toast.success("Logistics created");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Error creating logistics"
        );
      },
    });

  return { createLogistics, isCreatingLogistics };
};

export const useDeleteLogistics = () => {
  const axiosPrivate = useAxiosPrivate();

  const deleteLogisticsRequest = async (id) => {
    const response = await axiosPrivate.delete(`/api/v1/admin/logistics/${id}`);
    return response.data; // Return the response data
  };

  const { mutateAsync: deleteLogistics, isLoading: isDeletingLogistics } =
    useMutation(deleteLogisticsRequest, {
      onSuccess: () => {
        toast.success("Logistics deleted");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Error deleting logistics"
        );
      },
    });

  return { deleteLogistics, isDeletingLogistics };
};

export const useUpdateLogistics = () => {
  const axiosPrivate = useAxiosPrivate();

  const updateLogisticsRequest = async ({ id, data }) => {
    const response = await axiosPrivate.put(
      `/api/v1/admin/logistics/${id}`,
      data
    );
    return response.data; // Return the response data
  };

  const { mutateAsync: updateLogistics, isLoading: isUpdatingLogistics } =
    useMutation(updateLogisticsRequest, {
      onSuccess: () => {
        toast.success("Logistics updated");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Error updating logistics"
        );
      },
    });

  return { updateLogistics, isUpdatingLogistics };
};

export const useGetLogisticById = (id) => {
  const axiosPrivate = useAxiosPrivate(); // Now here

  const fetchLogisticById = async (id) => {
    const response = await axiosPrivate.get(`/api/v1/admin/logistics/${id}`);
    return response.data; // Return the response data
  };

  const {
    data: logistic,
    isLoading: isLoadingLogistic,
    isError,
    error,
    refetch,
  } = useQuery(["logistic", id], () => fetchLogisticById(id), {
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error fetching logistics");
    },
    enabled: !!id, // Only run the query if `id` is defined
  });

  return { logistic, isLoadingLogistic, isError, error, refetch };
};
