import axios from "axios";
const axiosInstance = axios.create({
    baseURL: process.env.MY_API_URL,
    // Configure other Axios options if needed
  });
  
export default axiosInstance;