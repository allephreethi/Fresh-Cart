import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend server
  withCredentials: false,           // set true if using cookies/sessions
});

export default api;
