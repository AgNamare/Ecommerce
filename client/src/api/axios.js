import axios from "axios";

const BASEURL = "http://localhost:3000"; // Added '//' after 'http:'

export default axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASEURL, // Ensure this matches your server's URL
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Include credentials (cookies) with requests
});
