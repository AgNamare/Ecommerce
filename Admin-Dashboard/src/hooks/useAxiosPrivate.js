import { axiosPrivate } from "@/api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { access_token } = useSelector((state) => state.auth);
  console.log(access_token)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // Access Token Expired (403)
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            // Refresh Token failed (401)
            if (refreshError?.response?.status === 401) {
              console.error("Refresh Token expired or invalid");
              navigate("/sign-in", {
                state: { from: location },
                replace: true,
              });
            } else {
              console.error("Error during token refresh", refreshError);
            }
            return Promise.reject(refreshError); // Propagate the refresh token error
          }
        }

        // Unauthorized (401): When both access and refresh tokens are invalid
        if (error?.response?.status === 401) {
          console.error("Unauthorized, redirecting to sign-in");
          navigate("/sign-in", { state: { from: location }, replace: true });
        }

        return Promise.reject(error); // For other errors
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [access_token, refresh, navigate, location]);

  return axiosPrivate;
};

export default useAxiosPrivate;
