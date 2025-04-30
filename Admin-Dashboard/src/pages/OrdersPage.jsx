import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetOrders } from "@/api/OrdersApi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar from "@/components/SearchBar";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { CirclePlus, File } from "lucide-react";
import Loader from "@/components/Loader";

const deliverySlots = [
  { value: "06:00", label: "9 AM" },
  { value: "09:00", label: "12 PM" },
  { value: "12:00", label: "3 PM" },
  { value: "14:00", label: "5 PM" },
  { value: "16:00", label: "7 PM" },
];

const OrdersPage = () => {
  const [ordersData, setOrdersData] = useState({
    metadata: {
      page: 1,
      limit: 10,
      totalCount: 0,
      totalPages: 1,
    },
    results: [],
  });

  const [searchState, setSearchState] = useState({
    searchQuery: "",
    page: 1,
    sortOption: "createdAt",
    startDate: "",
    endDate: "",
  });

  const [deliverySlot, setDeliverySlot] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState(""); // Updated field name

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { orders, isLoading: isLoadingOrders } = useGetOrders({
    ...searchState,
    deliverySlot,
    status,
    method, // Updated field name
    startDate,
    endDate,
  });

  useEffect(() => {
    if (!isLoadingOrders && orders) {
      setOrdersData({
        ...orders,
      });
    }
  }, [
    isLoadingOrders,
    orders,
    deliverySlot,
    status,
    method,
    startDate,
    endDate,
  ]);

  const setSearchQuery = (searchFormData) => {
    setSearchState((prev) => ({
      ...prev,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  };

  const setSortOption = (sortOption) => {
    setSearchState((prevState) => ({
      ...prevState,
      sortOption,
      page: 1,
    }));
  };

  const setPage = (page) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
    setSearchState((prevState) => ({
      ...prevState,
      [name]: value,
      page: 1,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "deliverySlot") {
      setDeliverySlot(value);
    } else if (name === "status") {
      setStatus(value);
    } else if (name === "method") {
      setMethod(value);
    }
  };

  console.log(ordersData);
  return (
    <div>
      <div className="flex items-center w-full justify-between mb-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <p className="text-lg">Dashboard</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <p className="text-lg">Orders</p>
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <SearchBar
            placeholder={"Search Orders"}
            searchQuery={searchState.searchQuery}
            onSubmit={setSearchQuery}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2">
            <div className="w-fit flex items-center border rounded-sm px-3 py-1 gap-2 cursor-pointer">
              <File size={25} />
              Export
            </div>
            <SortOptionDropdown
              onChange={(value) => setSortOption(value)}
              sortOption={searchState.sortOption}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              className="border p-1 rounded "
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              className="border p-1 rounded "
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Order ID</span>
                </div>
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Customer Name</span>
                </div>
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Time Placed</span>
                </div>
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Delivery Slot</span>
                  <select
                    name="deliverySlot"
                    value={deliverySlot}
                    onChange={handleFilterChange}
                    className="border w-[60%] p-1 rounded mt-1 text-black"
                  >
                    <option value="">All</option>
                    {deliverySlots.map((slot) => (
                      <option
                        key={slot.value}
                        value={slot.value}
                        className="text-black"
                      >
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Fulfillment Type</span>
                  <select
                    name="method"
                    value={method}
                    onChange={handleFilterChange}
                    className="border w-[70%] p-1 rounded mt-1 text-black"
                  >
                    <option value="">All</option>
                    <option value="express">Express</option>
                    <option value="pick-up">Store Pickup</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </th>
              <th className="px-2 py- text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Status</span>
                  <select
                    name="status"
                    value={status}
                    onChange={handleFilterChange}
                    className="border w-[60%] p-1 rounded mt-1 text-black "
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="onRoute">On Route</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="readyForPickup">Ready For Pickup</option>
                  </select>
                </div>
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {isLoadingOrders ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <Loader />
                </td>
              </tr>
            ) : ordersData.results.length > 0 ? (
              ordersData.results.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100 text-sm">
                  <td className="px-4 py-2 whitespace-nowrap uppercase">
                    {order.orderId}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {order.user?.fName} {order.user?.lName}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {new Date(order.delivery.deliverySlot).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </td>

                  <td className="px-2 capitalize py-4 whitespace-nowrap">
                    {order.delivery.method}
                  </td>
                  <td className="px-2 capitalize py-4 whitespace-nowrap">
                    {order.status}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Link to={`/orders/${order._id}`} className="text-primary">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {ordersData.results.length > 0 && (
        <PaginationSelector
          page={ordersData.metadata.page}
          pages={ordersData.metadata.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default OrdersPage;
