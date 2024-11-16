import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Use the environment variable for the backend URL
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      console.error('API Error:', error.response.data.message || error.message);
      return Promise.reject(error.response.data); // Reject the error for custom handling
    } else {
      console.error('Unexpected Error:', error.message);
      return Promise.reject(error); // Reject for unexpected errors
    }
  }
);

export default API;
