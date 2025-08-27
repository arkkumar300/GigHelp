import axios from 'axios';
import axiosRetry from 'axios-retry';
import {Alert} from 'react-native';

const baseURL = 'https://server.gighelp.in/1991/app';
// const baseURL = 'http://10.0.2.2:3001/1991/app';

const ApiService = (() => {
  const axiosInstance = axios.create({
    baseURL,
    timeout: 30000, 
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  // Add retry logic (for network errors and 5xx)
  axiosRetry(axiosInstance, {
    retries: 2,
    retryDelay: retryCount => retryCount * 2000, // 2s, 4s
    retryCondition: error => {
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.code === 'ECONNABORTED'
      );
    },
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(config => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('Triggered API URL:', fullUrl);

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  });

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    response => response.data,
    error => {
      console.log('===== AXIOS ERROR =====');
      console.log('Message:', error.message);
      console.log('Code:', error.code);
      console.log('Config:', error.config);
      console.log('Response:', error.response);

      if (error.code === 'ECONNABORTED') {
        Alert.alert('Timeout', 'Request took too long. Please try again.');
      } else if (error.response?.status === 500) {
        Alert.alert('Server Error', 'Something went wrong on the server.');
      } else if (error.response?.status === 404) {
        Alert.alert('Not Found', 'Requested resource was not found.');
      } else if (error.response?.status === 401) {
        Alert.alert('Unauthorized', 'You are not authorized.');
      } else if (error.message === 'Network Error') {
        Alert.alert('Network Error', 'Please check your internet connection.');
      } else {
        Alert.alert('Error', error.message || 'Something went wrong');
      }

      return Promise.reject(error);
    },
  );

  // Internal method to allow custom timeout/headers
  const requestWithOptionalTimeout = (method, url, data, options = {}) => {
    const config = {
      ...options,
      timeout: options.timeout || 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    return axiosInstance[method](url, data, config);
  };

  return {
    get: (url, params, options) => axiosInstance.get(url, {params, ...options}),

    post: (url, data, options) =>
      requestWithOptionalTimeout('post', url, data, options),

    put: (url, data, options) =>
      requestWithOptionalTimeout('put', url, data, options),

    patch: (url, data, options) =>
      requestWithOptionalTimeout('patch', url, data, options),

    delete: (url, options) => axiosInstance.delete(url, {...options}),

    baseURL: baseURL,
  };
})();

export default ApiService;

// import axios from 'axios';~

// const baseURL =
//               'https://server.gighelp.in/1991/app'
//               // 'http://10.0.2.2:3001/1991/app'
//               ;

// const ApiService = (() => {
//   const axiosInstance = axios.create({
//       baseURL,
//     timeout: 10000,
//   });

//   axiosInstance.interceptors.request.use(config => {
//     const fullUrl = `${config.baseURL}${config.url}`;
//     console.log('Triggered API URL:', fullUrl);
//     if (config.data instanceof FormData) {
//       config.headers['Content-Type'] = 'multipart/form-data';
//     } else {
//       config.headers['Content-Type'] = 'application/json';
//     }
//     return config;
//   });

//   axiosInstance.interceptors.response.use(
//     response => response.data,
//     error => {
//       console.log('===== AXIOS ERROR =====');
//       console.log('Message:', error.message);
//       console.log('Config:', error.config);
//       console.log('Code:', error.code);
//       console.log('Response:', error.response);
//       return Promise.reject(error);
//     },
//   );

//   // axiosInstance.interceptors.response.use(
//   //   response => response.data,
//   //   error => {
//   //     console.error(
//   //       'API error:',
//   //       error.response ? error.response.data : error.message,
//   //     );
//   //     return Promise.reject(error.response || error.message);
//   //   },
//   // );

//   return {
//     get: (url, params) => axiosInstance.get(url, {params}),
//     post: (url, data) => axiosInstance.post(url, data),
//     put: (url, data) => axiosInstance.put(url, data),
//     patch: (url, data) => axiosInstance.patch(url, data),
//     delete: url => axiosInstance.delete(url),
//     baseURL: baseURL,
//   };
// })();

// export default ApiService;
