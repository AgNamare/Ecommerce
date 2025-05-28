import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const PrivateRoute = () => {
  const { admin } = useSelector((state) => state.admin);
  const { accessToken } = useSelector((state) => state.auth);
  return admin || accessToken ? <Outlet /> : <Navigate to="/dashboard/sign-in" />;
};

export default PrivateRoute;
