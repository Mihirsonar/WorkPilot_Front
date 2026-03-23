import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8000/api/v1",
  // baseURL:"https://workpilotbackend.vercel.app/api/v1",
  baseURL : import.meta.env.VITE_API_KEY,
  withCredentials: true
  
});
console.log()
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

export { api };