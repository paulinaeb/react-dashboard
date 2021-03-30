import axiosL from "axios";

export default axiosL.create({
  baseURL: "http://localhost:5579/api-linkedin",
  headers: {
    "Content-type": "application/json"
  }
});