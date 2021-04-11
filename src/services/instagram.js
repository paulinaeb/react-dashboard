import axios from 'axios';
import { INSTAGRAM } from '../config/api-constants';

const client = axios.create({
  baseURL: INSTAGRAM,
  responseType: 'json',
});

const instagramService = {
  getScrapedProfiles: (page, size) =>
    client.get('scraped-profiles', { params: { page, size } }),

  startScraper: (username, email, scrapingUser, scrapingPass) =>
    client.post('scrape', { username, email, scrapingUser, scrapingPass }),

  getScrapeDetails: (userId, timestamp) =>
    client.get('scrape-info', { params: { userId, timestamp } }),

  getScrapeDetails2: (userId, timestamp, page, pageSize, sortBy, order) =>
    client.get('scrape-info', {
      params: { userId, timestamp, page, pageSize, sortBy, order },
    }),

  getUserDetails: (username, profileId, timestamp) =>
    client.get('scrape-info/liked-posts', {
      params: { username, profileId, timestamp },
    }),

  getUserDetails2: (
    username,
    profileId,
    timestamp,
    page,
    pageSize,
    sortBy,
    order
  ) =>
    client.get('scrape-info/liked-posts', {
      params: { username, profileId, timestamp, page, pageSize, sortBy, order },
    }),

  exportScrapesToCsv: () =>
    client.get('export-csv-scrapes', { responseType: 'blob' }),

  exportEngagementsToCsv: (userId, timestamp) =>
    client.get('export-csv-engagements', {
      params: { userId, timestamp },
      responseType: 'blob',
    }),

  exportInteractedPostsToCsv: (username, profileId, timestamp) =>
    client.get('export-csv-posts', {
      params: { username, profileId, timestamp },
      responseType: 'blob',
    }),
};

export default instagramService;
