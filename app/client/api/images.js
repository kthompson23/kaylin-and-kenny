import axios from 'axios';
import config from './apiConfig';

/**
 * Returns a promise for a paged list of images
 * @param {axios cancelToken} cancelToken
 * @param {object} params
 *  event - (required) name of the event
 *  page - (optional) result page (zero based)
 *  limit - (optional) - number of results per page
 * @returns Promise
 */
const getImages = (cancelToken, params) => {
  const requestInstance = axios.create(config);
  return requestInstance.get('/images', {
    params,
  });
};

module.exports = {
  getImages,
};
