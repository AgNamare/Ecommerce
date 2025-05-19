import { toast } from "sonner";
import { useMutation, useQuery } from "react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; // Import your custom axios hook

export const useCreateProduct = () => {
  const axiosPrivate = useAxiosPrivate();

  const createProductRequest = async (data) => {
    const response = await axiosPrivate.post("api/v1/admin/products", data);
    return response.data; // Return response data directly
  };

  const { mutateAsync: createProduct, isLoading: isCreatingProduct } =
    useMutation(createProductRequest, {
      onSuccess: () => {
        toast.success("Product created");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || error.message);
      },
    });

  return { createProduct, isCreatingProduct };
};

export const useSearchProducts = () => {
  const axiosPrivate = useAxiosPrivate();

  const searchProductsRequest = async (searchQuery) => {
    const response = await axiosPrivate.get(`api/v1/admin/products`, {
      params: { searchQuery }, // Use params for query string
    });
    return response.data; // Return data directly
  };

  const { mutateAsync: searchProducts, isLoading: isLoadingSearchProducts } =
    useMutation(searchProductsRequest);

  return { searchProducts, isLoadingSearchProducts };
};

export const useGetAllProducts = (searchState, branch) => {
  const axiosPrivate = useAxiosPrivate();

  const getProductsRequest = async () => {
    const response = await axiosPrivate.get("api/v1/admin/products", {
      params: {
        searchQuery: searchState.searchQuery,
        page: searchState.page,
        sortOption: searchState.sortOption,
        branch: branch
      },
    });
    return response.data; // Return data directly
  };

  const { data: products, isLoading: isLoadingProducts } = useQuery(
    ["getProducts", searchState],
    getProductsRequest
  );

  return { products, isLoadingProducts };
};

export const useUpdateProduct = () => {
  const axiosPrivate = useAxiosPrivate();

  const updateProductRequest = async ({ id, formData, branchName }) => {
    console.log("Updating product with branchName:", branchName);
    const response = await axiosPrivate.put(
      `api/v1/admin/products/${id}`,
      formData,
      {
        params: { branchName }, // Pass branchName as query param
      }
    );
    return response.data; // Return data directly
  };

  const { mutateAsync: updateProduct, isLoading: isUpdatingProduct } =
    useMutation(updateProductRequest, {
      onSuccess: () => {
        toast.success("Product updated");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || error.message);
      },
    });

  return { updateProduct, isUpdatingProduct };
};

export const useGetProduct = (id, branchName) => {
  const axiosPrivate = useAxiosPrivate();

  const getProductsRequest = async () => {
    const response = await axiosPrivate.get(`api/v1/admin/products/${id}`, {
      params: { branchName }, // Pass branchName as query param
    });
    return response.data; // Return data directly
  };

  const {
    data: product,
    isLoading: isGettingProduct,
    error,
    refetch,
  } = useQuery(["getProduct", id, branchName], getProductsRequest);

  return { product, isGettingProduct, error, refetch };
};
