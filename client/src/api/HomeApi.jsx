import { useInfiniteQuery, useQuery } from "react-query";
import axios from "./axios"; // Adjust the import path as necessary
import { toast } from "sonner";

// Generic error handler function
const handleError = (error) => {
  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }
  return error.response.data?.message || "An unexpected error occurred";
};

export const useGetBranches = () => {
  const getBranchesRequest = async () => {
    try {
      const response = await axios.get("/api/v1/branch/");
      return response.data;
    } catch (error) {
      toast.error(handleError(error)); // Show error message
      throw new Error(handleError(error));
    }
  };

  const { data: branches, isLoading: isLoadingBranches } = useQuery(
    "branches",
    getBranchesRequest
  );

  return { branches, isLoadingBranches };
};

export const useSearchProducts = (
  query,
  branchId,
  sortBy = "createdAt",
  sortOrder = -1,
  limit = 10
) => {
  const searchProductRequest = async ({ pageParam = 1 }) => {
    const searchParams = new URLSearchParams({
      query,
      branchId,
      sortBy,
      sortOrder,
      page: pageParam, // Use pageParam for pagination
      limit,
    });

    console.log(
      `Fetching products with query: ${query}, branchId: ${branchId}, sortBy: ${sortBy}, sortOrder: ${sortOrder}, page: ${pageParam}, limit: ${limit}`
    );

    try {
      const response = await axios.get(
        `/api/v1/search?${searchParams.toString()}`
      );
      return response.data;
    } catch (error) {
      toast.error(handleError(error)); // Show error message
      throw new Error(handleError(error));
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isProductsLoading,
    error: queryError,
  } = useInfiniteQuery(
    ["SearchProducts", query, branchId, sortBy, sortOrder, limit],
    searchProductRequest,
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = Math.ceil(lastPage.metadata.totalDocuments / limit);
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
      enabled: !!query && !!branchId, // Ensure that both query and branchId are valid
    }
  );

  const products = data?.pages.flatMap((page) => page.products) || [];
  const metadata = data?.pages[0]?.metadata || {};

  if (queryError) {
    toast.error(handleError(queryError)); // Show error message
  }

  return {
    products,
    metadata,
    isProductsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};

export const useGetCategoryProducts = (
  categoryId,
  branchId,
  sortBy = "createdAt",
  sortOrder = -1,
  limit = 10,
  searchQuery = ""
) => {
  const fetchCategoryProducts = async ({ pageParam = 1 }) => {
    const searchParams = new URLSearchParams({
      branch: branchId,
      sortBy,
      sortOrder,
      page: pageParam, // Use pageParam for pagination
      limit,
      category: categoryId,
    });

    if (searchQuery) {
      searchParams.append("query", searchQuery);
    }

    try {
      const response = await axios.get(
        `/api/v1/category?${searchParams.toString()}`
      );
      return response.data;
    } catch (error) {
      toast.error(handleError(error)); // Show error message
      throw new Error(handleError(error));
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isProductsLoading,
    error: queryError,
  } = useInfiniteQuery(
    [
      "CategoryProducts",
      categoryId,
      branchId,
      sortBy,
      sortOrder,
      limit,
      searchQuery,
    ],
    fetchCategoryProducts,
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = Math.ceil(lastPage.metadata.totalDocuments / limit);
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
      enabled: !!categoryId && !!branchId,
    }
  );

  const products = data?.pages.flatMap((page) => page.products) || [];
  const metadata = data?.pages[0]?.metadata || {};

  const error = queryError
    ? queryError.response?.data ||
      "An error occurred while fetching category products."
    : null;

  if (queryError) {
    toast.error(handleError(queryError)); // Show error message
  }

  return {
    products,
    metadata,
    isProductsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  };
};

export const useGetSubcategories = (categoryId) => {
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("/api/v1/category/subcategory", {
        params: { category: categoryId },
      });
      return response.data;
    } catch (error) {
      toast.error(handleError(error)); // Show error message
      console.error(error);
    }
  };

  const { data, isLoading: isSubcategoriesLoading } = useQuery(
    ["Subcategories", categoryId],
    fetchSubcategories
  );

  return { subcategories: data, isSubcategoriesLoading };
};
