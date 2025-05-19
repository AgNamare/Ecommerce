import React, { useState, useEffect } from "react";
import { useGetProduct, useUpdateProduct } from "@/api/ProductApi";
import AddProductForm from "@/forms/AddProductForm";
import { useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSelector } from "react-redux";

const UpdateProductPage = () => {
  const { updateProduct, isUpdatingProduct } = useUpdateProduct();
  const { id } = useParams();
  const { branch } = useSelector((state) => state.admin.admin);
  console.log(branch);
  const { product, isGettingProduct, refetch } = useGetProduct(id, branch._id);

  // State to store product data
  const [productData, setProductData] = useState(null);
  useEffect(() => {
    if (product && !isGettingProduct) {
      setProductData(product);
    }
  }, [product, isGettingProduct]);

  // Define defaultValues based on productData, matching the form schema
  const defaultValues = productData
    ? {
        productName: productData.productName || "",
        price: Number(productData.price) || 0,
        discountPrice: Number(productData.discountPrice) || 0,
        SKU: productData.SKU || "",
        description: productData.description || "",
        measurementUnit: productData.measurementUnit || "",
        size: Number(productData.size) || 0,
        brand: productData.brand || "",
        stockLevel: productData.stockLevel || 0,
        category: productData.category ? productData.category._id : "", // Assuming category is expected as _id
      }
    : {};

  const handleUpdateSubmit = async (data) => {
    try {
      await updateProduct({ id, formData: data, branchName: branch });
      refetch(); // Refetch the product data to ensure it's up-to-date
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (isGettingProduct) return <p>Loading....</p>;

  return (
    <div>
      <div className="p-2 m-2 border rounded-md">
        <h1 className="text-lg font-medium">Update Product</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <p className="text-sm font-medium text-primary">Dashboard</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <p className="text-sm font-medium text-primary">Product List</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <p className="text-sm">Update Product</p>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {productData && (
        <AddProductForm
          onSubmit={handleUpdateSubmit}
          defaultValues={defaultValues}
          isLoading={isUpdatingProduct}
          img={productData.images}
          action="Update"
        />
      )}
    </div>
  );
};

export default UpdateProductPage;
