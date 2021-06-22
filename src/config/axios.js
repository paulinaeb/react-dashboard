import axios from "axios";

const HOST = 'GooglePlacesLB-1634052576.us-east-1.elb.amazonaws.com';

export default axios.create({
  baseURL: `http://${HOST}/api-google-maps`,
  headers: {
    "Content-type": "application/json"
  }
});
