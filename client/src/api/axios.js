import axios from "axios";

export default axios.create({
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
