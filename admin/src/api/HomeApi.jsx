import { useQuery } from "react-query";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; // Import your custom axios hook

export const useGetBranches = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchBranchesRequest = async () => {
    const response = await axiosPrivate.get(`/api/v1/branch`); // Use the axios instance
    return response.data; // Return the response data
  };

  const {
    data: branches,
    isLoading,
    isError,
    error,
  } = useQuery("branches", fetchBranchesRequest, {
    onError: () => {
      toast.error("Error fetching branches");
    },
  });

  return { branches, isLoading, isError, error };
};
