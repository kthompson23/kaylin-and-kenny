/* eslint arrow-body-style: */
import api from 'api';
import {
  IS_FETCHING,
  FETCH_ERROR,
  RECEIVE_IMAGES,
} from './constants';

/**
 * Clear any saved fetch errors
 */
const clearFetchError = () => ({
  type: FETCH_ERROR,
  fetchError: undefined,
});

/**
 * Save fetched images.
 * @param {string} event name of the event
 * @param {array} images
 * @param {object} resultHeader
 */
const receiveImages = (event, images, resultHeader) => ({
  type: RECEIVE_IMAGES,
  event,
  images,
  resultHeader,
});

/**
 * Save an error returned from the fetch
 * @param {error} fetchError
 */
const updateFetchError = fetchError => ({
  type: FETCH_ERROR,
  fetchError,
});

/**
 * Indicate whether a fetch is in progress or not.
 * @param {bool} isFetching
 */
const updateFetchStatus = isFetching => ({
  type: IS_FETCHING,
  isFetching,
});

// Thunks
const getImages = (cancelToken, event, page, limit) => {
  return (dispatch) => {
    return api.getImages(cancelToken, event, page, limit)
      .then((response) => {
        dispatch(receiveImages(response.data.images, response.data.resultHeader));
      })
      .catch((error) => {
        if (api.isCancel(error)) {
          // request was cancelled.
          return;
        }

        console.log(error);
      });
  };
};

export {
  clearFetchError,
  getImages,
  receiveImages,
  updateFetchError,
  updateFetchStatus,
};
