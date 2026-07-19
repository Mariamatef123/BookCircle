import axios from "axios";
const api = axios.create({
  baseURL: VITE_API_URL,
  headers: { "Content-Type": "application/json" }
});

export default api;
