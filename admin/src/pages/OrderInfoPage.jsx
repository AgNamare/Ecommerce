import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetUserOrders,
  useUpdateOrderStatus,
  useUpdateLogistics,
} from "@/api/OrdersApi"; // Adjust path as per your project structure
import { Bike, Car, Truck } from "lucide-react";
import { useGetLogistics } from "@/api/LogisticsApi";
import { toast } from "sonner"; // Import toast from Sonner

const iconMap = {
  Truck: <Truck />,
  Van: <Car />,
  Bike: <Bike />,
};

const OrderInfoPage = () => {
  const { orderId } = useParams(); // Fetch orderId from route params

  // Local state for order and its status
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("pending");
  const [selectedLogistic, setSelectedLogistic] = useState("");

  const {
    data: fetchedOrder,
    isLoading: orderLoading,
    isError: orderError,
  } = useGetUserOrders(orderId);

  const { updateOrderStatus, isUpdatingOrderStatus } = useUpdateOrderStatus();
  const {
    logistics,
    isLoading: logisticsLoading,
    isError: logisticsError,
  } = useGetLogistics();
  const { updateLogistics, isUpdatingLogistics } = useUpdateLogistics(); // New hook for updating logistics

  useEffect(() => {
    if (fetchedOrder) {
      setOrder(fetchedOrder);
      setStatus(fetchedOrder.status);
      setSelectedLogistic(fetchedOrder.delivery.method);
    }
  }, [fetchedOrder]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleLogisticChange = (event) => {
    setSelectedLogistic(event.target.value);
  };

  const handleAssignDriver = () => {
    if (status !== "paid") {
      toast.error("Order must be paid to assign a driver!");
      return;
    }

    updateLogistics(
      { orderId, newLogisticId: selectedLogistic },
      {
        onSuccess: (updatedOrder) => {
          setOrder(updatedOrder); // Update the local order state with the new order data
          toast.success("Driver assigned successfully!");
        },
        onError: (error) => {
          toast.error("Error assigning driver.");
        },
      }
    );
  };

  const handleUpdateStatus = () => {
    updateOrderStatus(
      { orderId, newStatus: status },
      {
        onSuccess: (updatedOrder) => {
          setOrder(updatedOrder); // Update the local order state with the new order data
          toast.success("Order status updated!");
        },
        onError: (error) => {
          toast.error("Error updating order status.");
        },
      }
    );
  };

  if (orderLoading)
    return (
      <p className="text-center text-gray-500 text-sm">
        Loading order details...
      </p>
    );
  if (orderError || !order)
    return <p className="text-center text-red-500 text-sm">Order not found</p>;

  return (
    <div className="p-4 mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2">
      {/* Order Details Section */}
      <div className="bg-white shadow-sm rounded-md p-4 mb-4 border border-slate-200 text-sm">
        <h3 className="text-lg font-semibold mb-2">Order Details</h3>
        <div className="flex flex-col gap-2">
          <div className="border border-gray-200 rounded-md p-2">
            <p>
              <span className="font-medium">Order ID:</span>{" "}
              <span className="uppercase">{order.orderId}</span>
            </p>
            <p>
              <span className="font-medium">Time Placed:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Delivery Slot:</span>{" "}
              {new Date(order.delivery.deliverySlot).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className="capitalize">{order.status}</span>
            </p>
            <div className="mt-2">
              <label
                htmlFor="status"
                className="block text-xs font-medium text-gray-700"
              >
                Update Status
              </label>
              <select
                id="status"
                value={status}
                onChange={handleStatusChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-xs"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="onRoute">On Route</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="readyForPickup">Ready For Pickup</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdatingOrderStatus}
                className={`mt-2 px-3 py-1 font-semibold rounded-md shadow-sm text-xs ${
                  isUpdatingOrderStatus
                    ? "bg-gray-400"
                    : "bg-primary hover:opacity-95"
                } text-white`}
              >
                {isUpdatingOrderStatus ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Section */}
      <div className="bg-white shadow-sm rounded-md p-4 mb-4 border border-slate-200 text-sm">
        <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
        <div className="flex flex-col gap-2">
          <div className="border border-gray-200 rounded-md p-2">
            <p>
              <span className="font-medium">Name:</span> {order.user?.fName}{" "}
              {order.user?.lName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {order.user?.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              +254{order.user?.phoneNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white shadow-sm rounded-md p-4 mb-4 border border-slate-200 text-sm">
        <h3 className="text-lg font-semibold mb-2">Payment</h3>
        <div className="flex flex-col gap-2">
          <div className="border border-gray-200 rounded-md p-2">
            <p>
              <span className="font-medium">Transaction ID:</span>{" "}
              {order.payment.transactionID}
            </p>
            <p>
              <span className="font-medium">Payment Amount:</span> $
              {order.payment.paymentAmount.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Payment Status:</span>{" "}
              <span className="capitalize">{order.payment.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Logistics Section */}
      <div className="bg-white shadow-sm rounded-md p-4 mb-4 border border-slate-200 text-sm">
        <h3 className="text-lg font-semibold mb-2">Logistics</h3>
        <div className="flex flex-col gap-2">
          <div className="border border-gray-200 rounded-md p-2">
            <label
              htmlFor="logistics"
              className="block text-xs font-medium text-gray-700"
            >
              Choose Logistics
            </label>
            {logisticsLoading ? (
              <p className="text-center text-xs">Loading logistics...</p>
            ) : logisticsError ? (
              <p className="text-center text-xs">Error loading logistics</p>
            ) : (
              <div>
                <select
                  id="logistics"
                  value={selectedLogistic}
                  onChange={handleLogisticChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-xs"
                >
                  {order.logistics ? (
                    <option value={order.logistics._id}>
                      {order.logistics.driver_name}
                    </option>
                  ) : (
                    <option value="">Select a Driver</option>
                  )}
                  {logistics.map((logistic) => (
                    <option key={logistic._id} value={logistic._id}>
                      {logistic.driver_name} {iconMap[logistic.vehicle_type]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignDriver}
                  disabled={isUpdatingLogistics || status !== "paid"}
                  className={`mt-2 px-3 py-1 font-semibold rounded-md shadow-sm text-xs ${
                    isUpdatingLogistics || status !== "paid"
                      ? "bg-gray-400"
                      : "bg-primary hover:opacity-95"
                  } text-white`}
                >
                  {isUpdatingLogistics ? "Assigning..." : "Assign Driver"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Driver Details Section */}
      {order.logistics && (
        <div className="bg-white shadow-sm rounded-md p-4 mb-4 border border-slate-200 text-sm">
          <h3 className="text-lg font-semibold mb-2">Driver Details</h3>
          <div className="flex items-center gap-3">
            <img
              src={order.logistics.driver_photo}
              alt={order.logistics.driver_name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">
                {order.logistics.driver_name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {iconMap[order.logistics.vehicle_type]}
                <span className="text-xs">{order.logistics.vehicle_type}</span>
              </div>
              <p className="mt-1 text-xs">
                <span className="font-medium">Vehicle Reg:</span>{" "}
                {order.logistics.vehicle_registration_number}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="bg-white shadow-sm rounded-md p-4 mb-4 border border-slate-200 text-sm">
        <h3 className="text-lg font-semibold mb-2">Products</h3>
        <div className="flex flex-col gap-2">
          {order.products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-md p-2"
            >
              <p>
                <span className="font-medium">Product:</span>{" "}
                {product.id.productName}
              </p>
              <p>
                <span className="font-medium">Quantity:</span>{" "}
                {product.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="bg-white shadow-sm rounded-md p-4 mb-4 border border-slate-200 text-sm">
        <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
        <div className="flex flex-col gap-2">
          <div className="border border-gray-200 rounded-md p-2">
            <p>
              <span className="font-medium">Building:</span>{" "}
              {order.delivery.address.address.building}
            </p>
            <p>
              <span className="font-medium">City:</span>{" "}
              {order.delivery.address.address.city}
            </p>
            <p>
              <span className="font-medium">Contact:</span>{" "}
              {order.delivery.address.address.contactNumber}
            </p>
            <p>
              <span className="font-medium">Instructions:</span>{" "}
              {order.delivery.address.address.instructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoPage;
