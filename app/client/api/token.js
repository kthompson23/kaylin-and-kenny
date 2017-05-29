import axios from 'axios';

/**
 * Cancel any ongoing request(s) using the tokenSource that was used
 * to generate the token passed to each request.
 * @param {axios cancel token source} tokenSource
 * @param {string} message - optional cancel message
 */
const cancelRequests = (tokenSource, message = '') => (
  tokenSource.cancel(message)
);

/**
 * Generate a cancel token source. Use this object to generate a cancel token
 * for each request using the method .token. When needing to cancel any ongoing
 * request(s) using the generated token pass the source to the helper method
 * cancelRequests
 * @returns cancel token source
 */
const getCancelTokenSource = () => (
  axios.CancelToken.source()
);

/**
 * Returns whether an error object is an axios cancellation error.
 * If the ongoing request(s) are cancelled then this error is thrown.
 * @param {error object} error
 * @returns bool
 */
const isCancel = error => (
  axios.isCancel(error)
);

export default {
  cancelRequests,
  getCancelTokenSource,
  isCancel,
};
