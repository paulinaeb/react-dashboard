import axios from 'axios';
import { INSTAGRAM } from '../config/api-constants';

const client = axios.create({
  baseURL: INSTAGRAM,
  responseType: 'json',
});

const instagramService = {
  getScrapedProfiles: (page, size) => client.get('scraped-profiles'),
  startScraper: (username, email) => client.post('scrape', { username, email }),
  getScrapeDetails: (userId, timestamp) =>
    client.get('scrape-info', { params: { userId, timestamp } }),
  getUserDetails: (username, profileId, timestamp) =>
    client.get('scrape-info/liked-posts', {
      params: { username, profileId, timestamp },
    }),
};

export default instagramService;
