// AWS ECS Load Balancers DNS definitions
const GOOGLE_HOST = process.env.NODE_ENV === "production" ? 'GooglePlacesLB-1634052576.us-east-1.elb.amazonaws.com' : 'localhost:5578';
const LINKEDIN_HOST = process.env.NODE_ENV === "production" ? 'LinkedinLB-424603937.us-east-1.elb.amazonaws.com' : 'localhost:5579';
const INSTAGRAM_HOST = process.env.NODE_ENV === "production" ? 'InstagramBotLB-2067657695.us-east-1.elb.amazonaws.com' : 'localhost:5000';

// Base URLs definitions
const INSTAGRAM = `http://${INSTAGRAM_HOST}/`;

const GOOGLE = `http://${GOOGLE_HOST}/api-google-maps`;

const LINKEDIN = `http://${LINKEDIN_HOST}/api-linkedin`;

export {
  INSTAGRAM,
  GOOGLE,
  LINKEDIN
}
