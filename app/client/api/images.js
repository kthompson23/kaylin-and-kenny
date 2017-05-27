import axios from 'axios';
import config from './apiConfig';

/**
 * Returns a promise for a paged list of images
 * @param {axios cancelToken} cancelToken
 * @param {string} event (required) name of the event
 * @param {number} page results page, zero based
 * @param {number} limit number of results per page
 * @returns Promise
 * @throws Error
 */
const getImages = (cancelToken, event, page = 0, limit = 50) => {
  if (!event) {
    throw new Error('Event is required.');
  }

  const requestInstance = axios.create(config);
  return requestInstance.get('/images', {
    params: {
      event,
      page,
      limit,
    },
    cancelToken,
  });
};

module.exports = {
  getImages,
};
