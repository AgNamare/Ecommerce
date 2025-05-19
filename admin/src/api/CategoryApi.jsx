import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; // Import your custom axios hook

export const useGetCategories = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchCategoriesRequest = async () => {
    const response = await axiosPrivate.get(`/api/v1/admin/category/`);
    return response.data; // Return the response data
  };

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery("categories", fetchCategoriesRequest);

  return { categories, isLoading, isError };
};

export const useCreateCategory = () => {
  const axiosPrivate = useAxiosPrivate();

  const createCategoryRequest = async (data) => {
    const response = await axiosPrivate.post(`/api/v1/admin/category`, data);
    return response.data; // Return the response data
  };

  const { mutateAsync: createCategory, isLoading: isCreatingCategory } =
    useMutation(createCategoryRequest, {
      onSuccess: () => {
        toast.success("Category created");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Error creating category");
      },
    });

  return { createCategory, isCreatingCategory };
};

export const useDeleteCategory = () => {
  const axiosPrivate = useAxiosPrivate();

  const deleteCategoryRequest = async (id) => {
    const response = await axiosPrivate.delete(`/api/v1/admin/category/${id}`);
    return response.data; // Return the response data
  };

  const { mutateAsync: deleteCategory, isLoading: isDeletingCategory } =
    useMutation(deleteCategoryRequest, {
      onSuccess: () => {
        toast.success("Category deleted");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Error deleting category");
      },
    });

  return { deleteCategory, isDeletingCategory };
};

export const useUpdateCategory = () => {
  const axiosPrivate = useAxiosPrivate();

  const updateCategoryRequest = async ({ id, data }) => {
    const response = await axiosPrivate.put(
      `/api/v1/admin/category/${id}`,
      data
    );
    return response.data; // Return the response data
  };

  const { mutateAsync: updateCategory, isLoading: isUpdatingCategory } =
    useMutation(updateCategoryRequest, {
      onSuccess: () => {
        toast.success("Category updated");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Error updating category");
      },
    });

  return { updateCategory, isUpdatingCategory };
};

export const useGetCategoryById = (id) => {
  const axiosPrivate = useAxiosPrivate(); // Ensure axiosPrivate is here

  const fetchCategoryById = async (id) => {
    const response = await axiosPrivate.get(`/api/v1/admin/category/${id}`);
    return response.data; // Return the response data
  };

  const {
    data: category,
    isLoading: isLoadingCategory,
    refetch,
  } = useQuery(["category", id], () => fetchCategoryById(id), {
    enabled: !!id, // Only run the query if `id` is defined
  });

  return { category, isLoadingCategory, refetch };
};

export const useGetPaginatedCategories = (searchState) => {
  const axiosPrivate = useAxiosPrivate();

  const getCategoriesRequest = async () => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("sortOption", searchState.sortOption);
    params.set("limit", "10"); // Set limit to 10 items per page

    const response = await axiosPrivate.get(
      `/api/v1/admin/category/paginated?${params.toString()}`
    );
    return response.data; // Return the response data
  };

  const { data, isLoading, isError, error } = useQuery(
    ["getCategories", searchState],
    getCategoriesRequest
  );

  // Determine if a 404 error occurred
  const is404Error = isError && error.response?.status === 404;

  return {
    categories: data?.results || [],
    metadata: data?.metadata || { page: 1, totalPages: 1 },
    isLoading,
    is404Error,
  };
};
