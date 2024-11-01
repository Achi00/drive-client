import axios from "axios";

const api = axios.create({
  baseURL: "https://driveapi.wordcrafter.io",
  // baseURL: "http://localhost:8080",
  withCredentials: true, // important for sending cookies with requests
});

export default api;
