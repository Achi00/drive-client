import axios from "axios";

const api = axios.create({
  baseURL: "https://driveapi.wordcrafter.io",
  // baseURL: "http://localhost:8080",
  withCredentials: true, // important for sending cookies with requests
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export default api;
