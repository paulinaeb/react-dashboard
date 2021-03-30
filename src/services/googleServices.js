import http from '../config/axios'

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