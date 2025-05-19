import axios from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "@/redux/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom"; // Import navigate

const useRefreshToken = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const refresh = async () => {
    try {
      const response = await axios.get("api/v1/auth/admin/refresh-token", {
        withCredentials: true,
      });
      dispatch(setAccessToken(response.data.accessToken));
      return response.data.accessToken;
    } catch (error) {
      // Handle refresh token expiration
      if (error.response?.status === 403) {
        console.error("Refresh Token expired or invalid");
        navigate("/sign-in", { state: { from: location }, replace: true });
      }
      throw error; // Re-throw the error for potential error handling in caller
    }
  };

  return refresh;
};

export default useRefreshToken;
