import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetLogisticById } from "@/api/LogisticsApi";
import { useGetOrders } from "@/api/OrdersApi"; // Assuming useGetOrders is from OrdersApi
import { Truck } from "lucide-react"; // Use the appropriate icon

const LogisticsInfoPage = () => {
  const { id } = useParams();
  const [logisticId, setLogisticId] = useState(null);

  // State to manage the selected section and status
  const [selectedSection, setSelectedSection] = useState("logistics");
  const [status, setStatus] = useState("onRoute"); // Default status filter

  // Fetch logistic data based on the selected section
  const { logistic, isLoadingLogistic } = useGetLogisticById(id);

  // Using useGetOrders hook to fetch order data based on logistic ID and status
  const {
    orders,
    isLoading: isLoadingOrders,
    isError,
    refetch,
  } = useGetOrders({
    logistic: id, // Pass the logistic ID as a filter
    status, // Filter by status (onRoute or delivered)
    page: 1, // Adjust if pagination is needed
    sortOption: "createdAt", // Default sorting option
    deliverySlot: "", // Optional filter
    searchQuery: "", // Optional filter
    method: "", // Optional filter
    startDate: "", // Optional filter
    endDate: "", // Optional filter
  });

  useEffect(() => {
    if (id) setLogisticId(id);
  }, [id]);

  // Local states to manage logistic details
  const [driverName, setDriverName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [driverPhoto, setDriverPhoto] = useState("");

  useEffect(() => {
    if (logistic && !isLoadingLogistic) {
      setDriverName(logistic.driver_name);
      setVehicleType(logistic.vehicle_type);
      setVehicleRegistration(logistic.vehicle_registration_number);
      setDriverPhoto(logistic.driver_photo);
    }
  }, [logistic, isLoadingLogistic]);

  useEffect(() => {
    refetch(); // Refetch orders whenever the status or logistic ID changes
  }, [status, id, refetch]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar w-1/4 p-4">
        <div className="flex flex-col mb-4">
          <img
            src={driverPhoto}
            alt="Driver"
            className="h-28 w-28 object-cover rounded-full"
          />
          <div className="mt-2">
            <h2 className="text-lg font-medium">{driverName}</h2>
            <p className="text-md text-gray-600">{vehicleType}</p>
          </div>
        </div>

        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedSection("logistics")}
              className={`w-full text-lg text-left py-2 ${
                selectedSection === "logistics"
                  ? "text-primary font-bold"
                  : "text-gray-700"
              }`}
            >
              Logistics Information
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSection("orders")}
              className={`w-full text-lg text-left py-2 ${
                selectedSection === "orders"
                  ? "text-primary font-bold"
                  : "text-gray-700"
              }`}
            >
              Order History
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content w-3/4 p-4">
        {selectedSection === "logistics" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Logistics Information
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Driver Name */}
              <div className="shadow-md p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Driver Name</h3>
                <p className="text-gray-700">{driverName}</p>
              </div>
              {/* Vehicle Registration */}
              <div className="shadow-md p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Vehicle Registration
                </h3>
                <p className="text-gray-700">{vehicleRegistration}</p>
              </div>
              {/* Vehicle Type */}
              <div className="shadow-md p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Vehicle Type</h3>
                <p className="text-gray-700">{vehicleType}</p>
              </div>
            </div>
          </div>
        )}

        {selectedSection === "orders" && (
          <div>
            {/* Tabs for Changing Status */}
            <div className="flex border-b border-gray-300 mb-4">
              <button
                onClick={() => setStatus("onRoute")}
                className={`px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-tl-lg rounded-tr-lg ${
                  status === "onRoute"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                On Route
              </button>
              <button
                onClick={() => setStatus("delivered")}
                className={`px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-tl-lg rounded-tr-lg ${
                  status === "delivered"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Delivered
              </button>
            </div>

            {/* Orders List */}
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            {isLoadingOrders && <div>Loading...</div>}
            {isError && <div>Error fetching orders.</div>}
            {orders && orders.results.length > 0 ? (
              <ul className="space-y-2">
                {orders.results.map((order) => (
                  <li
                    key={order.id}
                    className="shadow-md p-4 rounded-lg text-gray-700"
                  >
                    <Link to={`/orders/${order._id}`}>
                      <p className="uppercase">Order ID: {order.orderId}</p>
                    </Link>
                    <p>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="capitalize">Status: {order.status}</p>
                    {/* Add more order details here */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found for this logistic.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsInfoPage;
