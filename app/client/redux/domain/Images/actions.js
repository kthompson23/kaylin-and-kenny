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
/**
 * Fetch a list of event images
 * @param {axios cancel token} cancelToken
 * @param {string} event
 * @param {number} page
 * @param {number} limit
 */
const getImages = (cancelToken, event, page, limit) => {
  return (dispatch) => {
    dispatch(updateFetchStatus(true));

    return api.getImages(cancelToken, event, page, limit)
      .then((response) => {
        dispatch(updateFetchStatus(false));
        dispatch(
          receiveImages(
            event,
            response.data.results.images,
            {
              next: response.data.next,
              page,
              totalImages: response.data.totalImages,
              totalPages: response.data.totalPages,
            },
          ),
        );
      })
      .catch((error) => {
        dispatch(updateFetchStatus(false));
        if (api.isCancel(error)) {
          // request was cancelled.
          return;
        }
        updateFetchError(error);
      });
  };
};

export default {
  clearFetchError,
  getImages,
  receiveImages,
  updateFetchError,
  updateFetchStatus,
};
