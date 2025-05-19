import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetAUser, useGetOrderHistory } from "@/api/UserApi";
import { CircleUser, CircleUserRound } from "lucide-react";

const UserInfoPage = () => {
  const { id } = useParams();

  // State to manage the selected section
  const [selectedSection, setSelectedSection] = useState("personal");

  // Fetch user data based on the selected section
  const { user, isLoadingUser } = useGetAUser(id);
  const { orderHistory, isLoadingOrders } = useGetOrderHistory(id);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user && !isLoadingUser) {
      setFName(user.fName);
      setLName(user.lName);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar w-1/4 p-4">
        <div className="flex flex-col mb-4">
          <CircleUser size={100} color="#D3D3D3" />
          <div className="mt-2">
            <h2 className="text-lg font-medium">
              {fName} {lName}
            </h2>
            <p className="text-md text-gray-600">{email}</p>
          </div>
        </div>

        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedSection("personal")}
              className={`w-full text-lg text-left py-2 ${
                selectedSection === "personal"
                  ? "text-primary font-bold"
                  : "text-gray-700"
              }`}
            >
              Personal Information
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
        {selectedSection === "personal" && (
          <div>
            {isLoadingUser && <div>Loading...</div>}
            {user && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">User Details</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="shadow-md p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Name</h3>
                    <p className="text-gray-700">
                      {user.fName} {user.lName}
                    </p>
                  </div>
                  <div className="shadow-md p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Created On</h3>
                    <p className="text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="shadow-md p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Phone Number</h3>
                    <p className="text-gray-700">{user.phoneNumber}</p>
                  </div>
                  <div className="shadow-md p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Email</h3>
                    <p className="text-gray-700">{user.email}</p>
                  </div>
                  {user.DOB && (
                    <div className="shadow-md p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">
                        Date of Birth
                      </h3>
                      <p className="text-gray-700">
                        {new Date(user.DOB).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {selectedSection === "orders" && (
          <div>
            {isLoadingOrders && <div>Loading...</div>}
            {orderHistory && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                <ul className="space-y-2">
                  {orderHistory.map((order) => (
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoPage;
