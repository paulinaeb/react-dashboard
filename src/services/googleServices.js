import axios from 'axios';
import { GOOGLE } from '../config/api-constants';

const http = axios.create({
  baseURL: GOOGLE,
  headers: {
    "Content-type": "application/json"
  }
});

const create = data => {
  return http.post("/scraper/run", data);
};

const get = id => {
  return http.get(`/scraper/location/list/${id}`);
};

export default {
  create,
  get
};
