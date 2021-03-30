import http from '../config/axiosLinkedin'

const create = data => {
  return http.post("/scraper/run", data);
};

const get = id => {
  return http.get(`/scraper/people/list/${id}`);
}

export default {
 
  create,
  get
  
};