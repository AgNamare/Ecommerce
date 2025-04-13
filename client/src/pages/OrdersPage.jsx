import React, { useEffect, useState } from "react";
import { useGetOrders } from "../api/OrdersApi";
import { useSelector } from "react-redux";
import OrderCard from "@/components/OrderCard";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard"; // Import the skeleton component
import DeliveryMethod from "@/components/DeliveryMethod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const OrdersPage = () => {
  const { user } = useSelector((state) => state.user);
  const [method, setMethod] = useState("normal"); // Initialize with default method
  const [orders, setOrders] = useState(null);

  // Fetch orders using custom hook
  const {
    orders: apiOrders,
    isLoading,
    refetch: refetchOrders,
  } = useGetOrders(user._id, method);

  // Handle delivery method change event
  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
  };

  // Effect to update orders when apiOrders changes
  useEffect(() => {
    if (apiOrders) {
      setOrders(apiOrders);
    }
  }, [apiOrders]);

  // Effect to refetch orders when method changes
  useEffect(() => {
    refetchOrders(user._id, method);
  }, [method]);

  // Conditional rendering of loading state
  if (isLoading) {
    return (
      <div className="container mx-auto mt-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DeliveryMethod activeMethod={method} onMethodChange={handleMethodChange} />

        {/* Display skeleton loaders while data is loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
          {[...Array(6)].map((_, index) => (
            <SkeletonOrderCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Render the OrdersPage UI
  return (
    <div className="container mx-auto mt-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DeliveryMethod activeMethod={method} onMethodChange={handleMethodChange} />

      {/* Conditional rendering based on orders state */}
      {orders && orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
