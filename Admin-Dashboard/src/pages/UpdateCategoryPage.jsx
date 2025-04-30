import React, { useState, useEffect } from "react";
import { useGetCategoryById, useUpdateCategory } from "@/api/CategoryApi";
import AddCategoryForm from "@/forms/AddCategoryForm";
import { useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const UpdateCategoryPage = () => {
  const { id } = useParams();
  const {
    category,
    isLoadingCategory: isGettingCategory,
    refetch,
  } = useGetCategoryById(id);
  const { updateCategory, isUpdatingCategory } = useUpdateCategory();

  // State to store category data
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    if (category && !isGettingCategory) {
      setCategoryData(category);
    }
  }, [category, isGettingCategory]);

  // Define defaultValues based on categoryData, matching the form schema
  const defaultValues = categoryData
    ? {
        name: categoryData.name || "",
        description: categoryData.description || "",
        parent: categoryData.parent ? categoryData.parent._id : "",
        imageUrl: categoryData.imageUrl || "",
        // Add any other fields based on your category schema
      }
    : {};

  const handleUpdateSubmit = async (data) => {
    try {
      console.log(data);
      // Perform the update
      const updatedCategory = await updateCategory({ id, data });
      // Update category data with the response
      setCategoryData(updatedCategory);
      refetch(); // Refetch the category data to ensure it's up-to-date
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  if (isGettingCategory) return <p>Loading....</p>;

  return (
    <div>
      <div className="p-2 m-2 border rounded-md">
        <h1 className="text-lg font-medium">Update Category</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <p className="text-sm font-medium text-primary">Dashboard</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">
                <p className="text-sm font-medium text-primary">
                  Category List
                </p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <p className="text-sm">Update Category</p>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {categoryData && (
        <AddCategoryForm
          bannerImg={categoryData.bannerImageUrl}
          onSubmit={handleUpdateSubmit}
          defaultValues={defaultValues}
          isLoading={isUpdatingCategory}
          img={categoryData.imageUrl} // Ensure this is updated after an update
          categoryPath={categoryData.path}
          action="Update"
        />
      )}
    </div>
  );
};

export default UpdateCategoryPage;
