import { useCheckOrder } from "@/api/CheckoutApi";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CheckingSkeleton from "@/components/skeletons/CheckingSkeleton"; // Adjust the import path as needed

const CheckingPaymentPage = () => {
  const { id } = useParams();
  const { orderStatus, isLoadingOrderStatus, refetch } = useCheckOrder(id);
  const [statusMessage, setStatusMessage] = useState("");
  const [isPolling, setIsPolling] = useState(true); // Control polling state
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10; // Set maximum retries

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (isPolling && retryCount < maxRetries) {
        await refetch();
        setRetryCount((prev) => prev + 1);
      }
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [isPolling, retryCount, refetch]);

  useEffect(() => {
    // Update status message and check if we should stop polling
    if (!isLoadingOrderStatus && orderStatus) {
      setStatusMessage(orderStatus.message);

      // Notify user of the response status
      if (retryCount < maxRetries) {
        if (orderStatus.message === "Payment pending") {
          setStatusMessage(
            (prev) => `${prev} (Attempt ${retryCount + 1} of ${maxRetries})`
          );
        } else {
          setIsPolling(false); // Stop polling if payment status changes
        }
      }
    }
  }, [isLoadingOrderStatus, orderStatus, retryCount]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Checking Payment Status
        </h1>
        {isLoadingOrderStatus ? (
          <CheckingSkeleton /> // Show skeleton while loading
        ) : (
          <p className="text-gray-800 mb-4">{statusMessage}</p>
        )}
        {retryCount >= maxRetries && (
          <p className="text-red-500">
            Max Check Retries reached. Once you successfully paid, we will send
            an email.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckingPaymentPage;
