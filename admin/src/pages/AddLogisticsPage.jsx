import React, { useState } from "react";
import AddLogisticsForm from "@/forms/AddLogisticsForm";
import { useCreateLogistics } from "@/api/LogisticsApi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AddLogisticsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { createLogistics, isCreatingLogistics } = useCreateLogistics();

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await createLogistics(formData);
      alert("Logistics added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add logistics");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="p-2 m-2 border rounded-md">
        <h1 className="text-lg font-medium">Add Logistics</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <p className="text-sm font-medium text-primary">Dashboard</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/logistics">
                <p className="text-sm font-medium text-primary">
                  Logistics List
                </p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <p className="text-sm">Add Logistics</p>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <AddLogisticsForm
        onSubmit={handleFormSubmit}
        isLoading={isLoading || isCreatingLogistics}
        action="Add Logistics"
      />
    </div>
  );
};

export default AddLogisticsPage;
