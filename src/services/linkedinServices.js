import axios from 'axios';
import { LINKEDIN } from '../config/api-constants';

const http = axios.create({
  baseURL: LINKEDIN,
  headers: {
    "Content-type": "application/json"
  }
});

const createGoo = data => {
  return http.post("/scraper/runFromGoogle", { body: data });
};

const create = data => {
  return http.post("/scraper/run", data);
};

const get = id => {
  return http.get(`/scraper/people/list/${id}`);
}

export default {
  create,
  createGoo,
  get
};
