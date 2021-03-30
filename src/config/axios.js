import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5578/api-google-maps",
  headers: {
    "Content-type": "application/json"
  }
});