import React, { useState, useEffect } from "react";
import {
  useGetLogisticById,
  useUpdateLogistics,
  useDeleteLogistics,
} from "@/api/LogisticsApi";
import AddLogisticsForm from "@/forms/AddLogisticsForm";
import { useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const UpdateLogisticPage = () => {
  const { updateLogistics, isUpdatingLogistics } = useUpdateLogistics();
  const { deleteLogistics, isDeletingLogistics } = useDeleteLogistics();
  console.log(isDeletingLogistics);
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState("6685508b50bbcc94fe606924");
  const { logistic, isLoadingLogistic } = useGetLogisticById(id);

  const [defaultValues, setDefaultValues] = useState({
    driver_name: "",
    driver_photo: "",
    vehicle_type: "",
    vehicle_registration_number: "",
  });

  useEffect(() => {
    if (logistic && !isLoadingLogistic) {
      setDefaultValues({
        driver_name: logistic.driver_name || "",
        driver_photo: logistic.driver_photo || "",
        vehicle_type: logistic.vehicle_type || "",
        vehicle_registration_number: logistic.vehicle_registration_number || "",
      });
    }
  }, [logistic, isLoadingLogistic]);

  const handleUpdateSubmit = async (data) => {
    console.log(data);
    try {
      await updateLogistics({ id, data });
    } catch (error) {
      console.error("Error updating logistic:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLogistics(id);
      navigate("/logistics");
    } catch (error) {
      console.error("Error deleting logistic:", error);
    }
  };

  if (isLoadingLogistic) return <p>Loading....</p>;

  return (
    <div>
      <div className="p-2 m-2 border rounded-md flex justify-between items-center">
        <div>
          <h1 className="text-lg font-medium">Update Logistics</h1>
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
                  <p className="text-sm font-medium text-primary">
                    Logistics List
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <p className="text-sm">Update Logistics</p>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 rounded-lg focus:scale-95 hover:opacity-90"
        >
          {isDeletingLogistics ? "Deleting..." : "Delete"}
        </button>
      </div>
      <AddLogisticsForm
        onSubmit={handleUpdateSubmit}
        defaultValues={defaultValues}
        isLoading={isUpdatingLogistics}
        img={defaultValues.driver_photo}
        action="Update"
      />
    </div>
  );
};

export default UpdateLogisticPage;
