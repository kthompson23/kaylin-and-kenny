// Configuration options for REST api
// Axios syntax
const apiVersion = 'v1.0';
const apiBaseURL = 'http://rhea:5000/api';
const timeout = 5000; // milliseconds
const headers = {
  Accept: 'application/json',
};

const config = {
  baseURL: `${apiBaseURL}/${apiVersion}`,
  timeout,
  headers,
};

export default config;
