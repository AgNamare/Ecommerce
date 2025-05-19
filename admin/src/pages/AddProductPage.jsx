import React, { useState } from "react";
import AddProductForm from "@/forms/AddProductForm";
import { useCreateProduct } from "@/api/ProductApi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AddProductPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { createProduct, isCreatingProduct } = useCreateProduct();
  const [defaultValues, setDefaultValues] = useState({
    productName: "",
    price: 0,
    SKU: "",
    description: "",
    measurementUnit: "",
    size: 0,
    brand: "",
    category: "",
  });
  const [img, setImg] = useState([]);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      console.log(formData);
      // Perform API call or any other logic to handle form submission
      console.log(formData);
      await createProduct(formData); // Ensure to await the createProduct call
    } catch (error) {
      // Handle error response
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="p-2 m-2 border rounded-md">
        <h1 className="text-lg font-medium">Add Product</h1>
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
                <p className="text-sm">Products</p>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <AddProductForm
        onSubmit={handleFormSubmit} // Updated to use handleFormSubmit
        action="Add Product"
        isLoading={isLoading}
        defaultValues={defaultValues}
        img={img}
      />
    </div>
  );
};

export default AddProductPage;
