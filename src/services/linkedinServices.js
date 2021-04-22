import http from '../config/axiosLinkedin'

const createGoo = data => {
  return http.post("/scraper/runFromGoogle", {body: data});
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